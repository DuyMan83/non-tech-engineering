#!/usr/bin/env node
// Kiểm tra một chặng trước khi đưa người dùng thử — bắt những lối tắt hay gặp khi cố "làm cho xanh".
// Chạy trong thư mục dự án:
//   node kiem-tra-chang.mjs --ke-hoach docs/ke-hoach/<ten>.md --chang <N> [--goc <git ref>]
// --goc: điểm bắt đầu để so (mặc định: chỗ nhánh tách ra từ main).
// Thoát 0 = đạt; 1 = có vấn đề (in danh sách).
import { execSync } from "node:child_process";
import fs from "node:fs";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
}
const sh = (cmd) => execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

const keHoach = arg("ke-hoach");
const chang = arg("chang");
if (!keHoach || !chang || !fs.existsSync(keHoach)) {
  console.error("Cách dùng: node kiem-tra-chang.mjs --ke-hoach <file> --chang <N> [--goc <git ref>]");
  process.exit(1);
}
let goc = arg("goc");
if (!goc) {
  try {
    goc = sh("git merge-base HEAD main");
  } catch {
    console.error("Không tìm được điểm tách nhánh từ main — truyền --goc <commit>.");
    process.exit(1);
  }
}

const loi = [];
const canhBao = [];

// 1. Test kế hoạch giao cho chặng này phải tồn tại
const plan = fs.readFileSync(keHoach, "utf8");
const bang = plan.split(/^### Danh sách test/m)[1]?.split(/^#{2,3} /m)[0] ?? "";
const rows = bang
  .split("\n")
  .filter((l) => l.trim().startsWith("|") && !/^\|\s*-/.test(l.trim()))
  .slice(1)
  .map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
const cuaChang = rows.filter((r) => r[5] === String(chang));
if (cuaChang.length === 0) canhBao.push(`Kế hoạch không giao test nào cho chặng ${chang}`);
for (const r of cuaChang) {
  const file = r[4].match(/`([^`]+\.test\.tsx?)`/)?.[1];
  if (file && !fs.existsSync(file)) loi.push(`Test #${r[0]} (${r[1]}): chưa có file ${file}`);
}

// 2. Số ca test không được giảm so với điểm gốc
const demCa = (src) => (src.match(/^\s*(it|test)(\.each\([^)]*\))?\(/gm) ?? []).length;
const fileTestNay = sh("git ls-files --cached --others --exclude-standard").split("\n").filter((f) => /\.test\.tsx?$/.test(f));
const caNay = fileTestNay.reduce((n, f) => n + (fs.existsSync(f) ? demCa(fs.readFileSync(f, "utf8")) : 0), 0);
const fileTestGoc = sh(`git ls-tree -r --name-only ${goc}`).split("\n").filter((f) => /\.test\.tsx?$/.test(f));
const caGoc = fileTestGoc.reduce((n, f) => n + demCa(sh(`git show ${goc}:${f}`)), 0);
if (caNay < caGoc) loi.push(`Số ca test giảm: ${caGoc} → ${caNay}`);

// 3. Dòng mới thêm vào (so với gốc, gồm cả phần chưa lưu điểm)
const diff = sh(`git diff ${goc} --unified=0 --no-color -- . ':(exclude)package-lock.json'`);
let fileDangXet = "";
for (const line of diff.split("\n")) {
  if (line.startsWith("+++ b/")) fileDangXet = line.slice(6);
  if (!line.startsWith("+") || line.startsWith("+++")) continue;
  const s = line.slice(1);
  const o = `${fileDangXet}: ${s.trim().slice(0, 80)}`;
  if (/\b(it|test|describe)\.(skip|only|todo)\b|\bx(it|describe)\(/.test(s)) loi.push(`Test bị skip/only: ${o}`);
  if (/eslint-disable/.test(s)) loi.push(`Tắt ESLint: ${o}`);
  if (/@ts-(ignore|nocheck|expect-error)/.test(s)) loi.push(`Bỏ qua kiểm tra kiểu: ${o}`);
  if (/(:\s*any\b|\bas any\b|<any>)/.test(s) && /\.tsx?$/.test(fileDangXet)) loi.push(`Dùng "any": ${o}`);
}

// 4. File được bảo vệ không được sửa trong lúc làm theo kế hoạch
const daDoi = sh(`git diff ${goc} --name-only`).split("\n").filter(Boolean);
const chuaTheoDoi = sh("git ls-files --others --exclude-standard").split("\n").filter(Boolean);
const baoVe = [/^eslint\.config\./, /^tsconfig\.json$/, /^vitest.*\.config\./, /^config\/production\.env$/];
for (const f of [...daDoi, ...chuaTheoDoi]) if (baoVe.some((re) => re.test(f))) loi.push(`Sửa file được bảo vệ (phải hỏi người dùng trước): ${f}`);
const pkgDiff = sh(`git diff ${goc} -- package.json`);
if (/^[+-]\s*"(check|test|test:emulator)":/m.test(pkgDiff)) loi.push("Sửa lệnh kiểm tra trong package.json (check / test / test:emulator)");

// 5. Luật bảo mật không được mở toang
if (fs.existsSync("firestore.rules") && /if\s+true\s*;/.test(fs.readFileSync("firestore.rules", "utf8"))) {
  loi.push("firestore.rules có 'if true' — luật bảo mật đang mở");
}

for (const c of canhBao) console.log(`⚠ ${c}`);
if (loi.length > 0) {
  console.log(`✖ Chặng ${chang} chưa đạt (${loi.length}):\n${loi.map((l) => `  - ${l}`).join("\n")}`);
  process.exit(1);
}
console.log(`✔ Chặng ${chang} đạt: ${cuaChang.length} test của chặng đã có, số ca test ${caGoc} → ${caNay}, không có lối tắt.`);
