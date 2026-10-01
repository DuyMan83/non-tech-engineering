// Dùng chung cho scripts/build.mjs, run.mjs, deploy.mjs. Chạy được trên macOS và Windows.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import readline from "node:readline/promises";

export const REQUIRED_KEYS = [
  "NEXT_PUBLIC_USE_EMULATORS",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

export function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

// Tham số: môi trường (vd "production") + cờ xác nhận ("--xac-nhan" hoặc "xac-nhan").
export function parseArgs(defaultEnv) {
  const args = process.argv.slice(2);
  const confirmed = args.some((a) => a === "--xac-nhan" || a === "xac-nhan");
  const envName = args.find((a) => !a.startsWith("-") && a !== "xac-nhan") ?? defaultEnv;
  return { envName, confirmed };
}

function parseEnvFile(text) {
  const vars = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) vars[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return vars;
}

export function loadConfig(envName) {
  const file = `config/${envName}.env`;
  if (!fs.existsSync(file)) {
    const available = fs.readdirSync("config").filter((f) => f.endsWith(".env")).map((f) => f.replace(/\.env$/, ""));
    fail(`Không có môi trường "${envName}". Các môi trường có sẵn: ${available.join(", ")}.`);
  }
  const vars = parseEnvFile(fs.readFileSync(file, "utf8"));
  const missing = REQUIRED_KEYS.filter((k) => !vars[k]);
  if (missing.length > 0) {
    fail(
      `File ${file} còn thiếu: ${missing.join(", ")}.\n` +
        `  Mở file đó và điền theo hướng dẫn ở đầu file (lấy từ Firebase console).`,
    );
  }
  const usesEmulators = vars.NEXT_PUBLIC_USE_EMULATORS === "true";
  const projectId = vars.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!usesEmulators && projectId.startsWith("demo-")) {
    fail(`File ${file} đang dùng dự án thử "${projectId}". Môi trường thật cần mã dự án Firebase thật.`);
  }
  return { envName, file, vars, projectId, usesEmulators };
}

// Chạy lệnh, in output ra màn hình. Lỗi -> dừng luôn.
export function run(command, extraEnv = {}) {
  console.log(`\n→ ${command}`);
  const result = spawnSync(command, { shell: true, stdio: "inherit", env: { ...process.env, ...extraEnv } });
  if (result.status !== 0) fail(`Lệnh thất bại: ${command}`);
}

// Việc nguy hiểm (dữ liệu thật, ghi đè bản trên mạng) phải được xác nhận.
// - Có cờ --xac-nhan: coi như người dùng đã đồng ý (AI chỉ thêm cờ SAU KHI đã hỏi người dùng).
// - Người dùng tự gõ lệnh trong Terminal: hỏi họ gõ lại mã dự án.
// - Không có cả hai: in cảnh báo và dừng.
export async function confirmDanger(warningLines, projectId, confirmed) {
  console.log(`\n⚠️  CẢNH BÁO\n${warningLines.map((l) => `   ${l}`).join("\n")}\n`);
  if (confirmed) return;
  if (!process.stdin.isTTY) {
    fail("Chưa được xác nhận. Hỏi người dùng trước, nếu họ đồng ý thì chạy lại lệnh và thêm: -- --xac-nhan");
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question(`Gõ mã dự án "${projectId}" để xác nhận (hoặc Enter để huỷ): `)).trim();
  rl.close();
  if (answer !== projectId) fail("Đã huỷ — không có gì thay đổi.");
}
