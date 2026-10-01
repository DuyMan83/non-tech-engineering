// Dùng chung cho scripts/build.mjs, run.mjs, deploy.mjs. Chạy được trên macOS và Windows.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import readline from "node:readline/promises";

export const REQUIRED_KEYS = ["USE_EMULATORS", "FIREBASE_PROJECT_ID", "FIREBASE_API_KEY", "FIREBASE_AUTH_DOMAIN", "FIREBASE_APP_ID"];
export const EAS = "npx eas-cli@latest";

export function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

// Tham số: [môi trường] [chế độ] + cờ "--xac-nhan" (hoặc "xac-nhan") và "--thu" (chỉ in lệnh, không chạy).
export function parseArgs(defaultEnv) {
  const args = process.argv.slice(2);
  const flags = new Set(args.filter((a) => a.startsWith("-") || a === "xac-nhan" || a === "thu").map((a) => a.replace(/^-+/, "")));
  const words = args.filter((a) => !a.startsWith("-") && a !== "xac-nhan" && a !== "thu");
  return { envName: words[0] ?? defaultEnv, mode: words[1], confirmed: flags.has("xac-nhan"), dryRun: flags.has("thu") };
}

function parseEnvFile(text) {
  const vars = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) vars[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return vars;
}

export function loadConfig(envName, { needEas = false } = {}) {
  const file = `config/${envName}.env`;
  if (!fs.existsSync(file)) {
    const available = fs.readdirSync("config").filter((f) => f.endsWith(".env")).map((f) => f.replace(/\.env$/, ""));
    fail(`Không có môi trường "${envName}". Các môi trường có sẵn: ${available.join(", ")}.`);
  }
  const vars = parseEnvFile(fs.readFileSync(file, "utf8"));
  const missing = [...REQUIRED_KEYS, ...(needEas ? ["EAS_PROJECT_ID"] : [])].filter((k) => !vars[k]);
  if (missing.length > 0) {
    fail(
      `File ${file} còn thiếu: ${missing.join(", ")}.\n` +
        `  Mở file đó và điền theo hướng dẫn ở đầu file.` +
        (missing.includes("EAS_PROJECT_ID") ? `\n  EAS_PROJECT_ID: chạy "${EAS} init" một lần (cần tài khoản Expo) rồi chép projectId vào.` : ""),
    );
  }
  const usesEmulators = vars.USE_EMULATORS === "true";
  const projectId = vars.FIREBASE_PROJECT_ID;
  if (!usesEmulators && projectId.startsWith("demo-")) {
    fail(`File ${file} đang dùng dự án thử "${projectId}". Môi trường thật cần mã dự án Firebase thật.`);
  }
  return { envName, file, vars, projectId, usesEmulators, appEnv: { APP_ENV: envName } };
}

export function makeRunner(dryRun) {
  return function run(command, extraEnv = {}) {
    const envText = Object.entries(extraEnv).map(([k, v]) => `${k}=${v} `).join("");
    console.log(`\n→ ${envText}${command}`);
    if (dryRun) return;
    const result = spawnSync(command, { shell: true, stdio: "inherit", env: { ...process.env, ...extraEnv } });
    if (result.status !== 0) fail(`Lệnh thất bại: ${command}`);
  };
}

// Việc nguy hiểm (dữ liệu thật, tốn lượt build, cập nhật tới người dùng thật) phải được xác nhận.
// - Có cờ --xac-nhan: coi như người dùng đã đồng ý (AI chỉ thêm cờ SAU KHI đã hỏi người dùng).
// - Người dùng tự gõ lệnh trong Terminal: hỏi họ gõ lại mã dự án.
// - --thu: chỉ in cảnh báo + lệnh, không hỏi.
export async function confirmDanger(warningLines, projectId, { confirmed, dryRun }) {
  console.log(`\n⚠️  CẢNH BÁO\n${warningLines.map((l) => `   ${l}`).join("\n")}\n`);
  if (confirmed || dryRun) return;
  if (!process.stdin.isTTY) {
    fail("Chưa được xác nhận. Hỏi người dùng trước, nếu họ đồng ý thì chạy lại lệnh và thêm: -- --xac-nhan");
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question(`Gõ mã dự án "${projectId}" để xác nhận (hoặc Enter để huỷ): `)).trim();
  rl.close();
  if (answer !== projectId) fail("Đã huỷ — không có gì thay đổi.");
}

export const nonInteractive = () => (process.stdin.isTTY ? "" : " --non-interactive");
