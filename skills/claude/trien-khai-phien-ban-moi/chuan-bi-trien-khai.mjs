#!/usr/bin/env node
// Soạn "phiếu triển khai": những gì người dùng cần thấy trước khi quyết định đưa phiên bản mới lên.
// Chạy trong thư mục dự án:  node chuan-bi-trien-khai.mjs [--json]
// Thoát 0 = sẵn sàng; 1 = chưa sẵn sàng (lý do nằm trong "chuaSanSang").
import { execSync } from "node:child_process";
import fs from "node:fs";

const sh = (cmd) => {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
};
const docEnv = (file) => {
  if (!fs.existsSync(file)) return null;
  const vars = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) vars[m[1]] = m[2];
  }
  return vars;
};

const kienTruc = fs.existsSync("app.config.ts") ? "mobile" : "web";
const chuaSanSang = [];

// 1. Nhánh và trạng thái
const nhanh = sh("git branch --show-current");
if (nhanh !== "main") chuaSanSang.push(`Đang ở nhánh "${nhanh}" — chỉ triển khai từ main (bản đã nghiệm thu).`);
if (sh("git status --porcelain")) chuaSanSang.push("Có thay đổi chưa lưu điểm.");

// 2. Phiên bản đang chạy = tag phien-ban-* mới nhất
const tagTruoc = sh("git tag --list 'phien-ban-*' --sort=-creatordate").split("\n").filter(Boolean)[0] ?? null;
const tu = tagTruoc ? `${tagTruoc}..HEAD` : "HEAD";

// 3. Có gì mới: các lần gộp + các đề xuất chuyển sang "Đã xong" từ lần trước
const lanGop = sh(`git log ${tu} --first-parent --format=%s`).split("\n").filter(Boolean);
const deXuatDoi = sh(`git diff --name-only ${tagTruoc ?? sh("git rev-list --max-parents=0 HEAD")} HEAD -- docs/de-xuat`)
  .split("\n")
  .filter((f) => f.endsWith(".md") && fs.existsSync(f));
const tinhNangMoi = deXuatDoi
  .map((f) => fs.readFileSync(f, "utf8"))
  .filter((s) => /Trạng thái:\s*Đã xong/.test(s))
  .map((s) => s.match(/^# (.+)$/m)?.[1] ?? "(không tên)");
if (tagTruoc && lanGop.length === 0) chuaSanSang.push(`Không có gì mới kể từ ${tagTruoc}.`);

// 4. Luật bảo mật dữ liệu có đổi không
const luatDoi = tagTruoc ? sh(`git diff ${tagTruoc} HEAD -- firestore.rules`) !== "" : true;

// 5. Cấu hình bản thật
const env = docEnv("config/production.env") ?? {};
const canCo =
  kienTruc === "web"
    ? ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", "NEXT_PUBLIC_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "NEXT_PUBLIC_FIREBASE_APP_ID"]
    : ["FIREBASE_PROJECT_ID", "FIREBASE_API_KEY", "FIREBASE_AUTH_DOMAIN", "FIREBASE_APP_ID", "EAS_PROJECT_ID"];
const thieuCauHinh = canCo.filter((k) => !env[k]);
const lanDau = thieuCauHinh.length > 0 || !tagTruoc;
const projectId = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || env.FIREBASE_PROJECT_ID || null;

// 6. Mobile: thay đổi phần native thì không cập nhật nhanh được, phải gửi lại store
let canGuiStore = null;
if (kienTruc === "mobile") {
  const pkgDoi = tagTruoc ? sh(`git diff ${tagTruoc} HEAD -- package.json`) : "";
  const doiThuVien = /^[+-]\s+"[^"]+":\s*"[~^]?\d/m.test(pkgDoi);
  const doiAppConfig = tagTruoc ? sh(`git diff ${tagTruoc} HEAD -- app.config.ts assets`) !== "" : false;
  canGuiStore = !tagTruoc || doiThuVien || doiAppConfig;
}

const ngay = new Date().toISOString().slice(0, 10);
const cungNgay = sh(`git tag --list 'phien-ban-${ngay}*'`).split("\n").filter(Boolean).length;
const tagMoi = `phien-ban-${ngay}${cungNgay ? `-${cungNgay + 1}` : ""}`;

const phieu = {
  kienTruc,
  sanSang: chuaSanSang.length === 0,
  chuaSanSang,
  phienBanDangChay: tagTruoc,
  tagMoi,
  lanDau,
  thieuCauHinh,
  projectId,
  diaChi: kienTruc === "web" && projectId ? `https://${projectId}.web.app` : null,
  tinhNangMoi,
  lanGop,
  luatBaoMatDoi: luatDoi,
  canGuiStore,
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(phieu, null, 2));
} else {
  const d = (b) => (b ? "CÓ" : "không");
  console.log(`Phiếu triển khai (${kienTruc})`);
  console.log(`  Phiên bản đang chạy : ${tagTruoc ?? "chưa triển khai lần nào"}`);
  console.log(`  Phiên bản mới       : ${tagMoi}`);
  console.log(`  Tính năng mới       : ${tinhNangMoi.length ? tinhNangMoi.join("; ") : "(không có đề xuất mới — xem các lần gộp)"}`);
  console.log(`  Các lần gộp         : ${lanGop.length}`);
  console.log(`  Luật dữ liệu đổi    : ${d(luatDoi)}`);
  if (kienTruc === "mobile") console.log(`  Phải gửi lại store  : ${d(canGuiStore)}`);
  console.log(`  Lần đầu / thiếu cấu hình: ${lanDau ? `có${thieuCauHinh.length ? ` (thiếu ${thieuCauHinh.join(", ")})` : ""}` : "không"}`);
  console.log(chuaSanSang.length ? `✖ Chưa sẵn sàng:\n${chuaSanSang.map((l) => `  - ${l}`).join("\n")}` : "✔ Sẵn sàng.");
}
process.exit(chuaSanSang.length ? 1 : 0);
