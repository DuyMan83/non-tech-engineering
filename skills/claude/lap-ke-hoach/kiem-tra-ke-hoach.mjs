#!/usr/bin/env node
// Kiểm tra một bản kế hoạch: đủ mục, mọi dòng nghiệm thu của đề xuất đều được phủ, mọi rủi ro có cách kiểm.
// node kiem-tra-ke-hoach.mjs <ke-hoach.md> [--de-xuat <de-xuat.md>]
// Thoát 0 = đạt; 1 = chưa đạt (in danh sách cần sửa).
import fs from "node:fs";

const MUC = [
  /^## Nguồn/m,
  /^## Đánh số nghiệm thu/m,
  /^## Các chặng/m,
  /^## Thứ tự và điểm dừng/m,
  /^## Rủi ro và đường lùi/m,
  /^## Chiến lược kiểm thử/m,
  /^### Ai kiểm cái gì/m,
  /^### Danh sách test/m,
  /^### Ma trận phủ nghiệm thu/m,
  /^## Bước kỹ thuật/m,
  /^## Ghi chép trong lúc làm/m,
  /^## Nguồn từng mục/m,
];
const LOAI_TEST = ["tích hợp", "luật", "unit", "giao diện"];

const args = process.argv.slice(2);
const file = args[0];
const deXuatIdx = args.indexOf("--de-xuat");
const deXuatFile = deXuatIdx >= 0 ? args[deXuatIdx + 1] : null;
if (!file || !fs.existsSync(file)) {
  console.error("Cách dùng: node kiem-tra-ke-hoach.mjs <ke-hoach.md> [--de-xuat <de-xuat.md>]");
  process.exit(1);
}
const text = fs.readFileSync(file, "utf8");
const loi = [];

function section(src, re) {
  const m = re.exec(src);
  if (!m) return null;
  const level = m[0].match(/^#+/)[0].length;
  const rest = src.slice(m.index + m[0].length);
  const next = rest.search(new RegExp(`^#{1,${level}} `, "m"));
  return next === -1 ? rest : rest.slice(0, next);
}
function tableRows(body) {
  return (body ?? "")
    .split("\n")
    .filter((l) => l.trim().startsWith("|") && !/^\|\s*-/.test(l.trim()))
    .slice(1) // bỏ dòng tiêu đề
    .map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
}

// 1. Đủ mục
for (const re of MUC) if (!re.test(text)) loi.push(`Thiếu mục: ${re.source.replace(/\^|#+ |\/m/g, "")}`);
if (!/^# Kế hoạch/m.test(text)) loi.push("Tiêu đề phải bắt đầu bằng '# Kế hoạch'");
const conMau = text.match(/\{\{[^}]*\}\}/g);
if (conMau) loi.push(`Còn ${conMau.length} chỗ trống của mẫu chưa điền, vd ${conMau[0]}`);

// 2. Các chặng: mỗi chặng có đủ 4 dòng
const chang = section(text, /^## Các chặng/m) ?? "";
const soChang = (chang.match(/^Chặng \d+/gm) ?? []).length;
if (soChang === 0) loi.push("Các chặng: chưa có chặng nào ('Chặng 1 — ...')");
for (const nhan of ["Làm được:", "Chưa có:", "Bạn tự thử:", "Máy tự kiểm:"]) {
  const n = (chang.match(new RegExp(`^\\s+${nhan}`, "gm")) ?? []).length;
  if (n < soChang) loi.push(`Các chặng: ${soChang - n} chặng thiếu dòng "${nhan}"`);
}

// 3. Rủi ro: mỗi rủi ro có "Kiểm bằng:" và "Lùi về:"
const ruiRo = section(text, /^## Rủi ro và đường lùi/m) ?? "";
const soRuiRo = (ruiRo.match(/^- Rủi ro/gm) ?? []).length;
if (soRuiRo === 0) loi.push("Rủi ro: chưa có rủi ro nào (luôn có ít nhất 1)");
for (const nhan of ["Kiểm bằng:", "Lùi về:"]) {
  const n = (ruiRo.match(new RegExp(`^\\s+${nhan}`, "gm")) ?? []).length;
  if (n < soRuiRo) loi.push(`Rủi ro: ${soRuiRo - n} rủi ro thiếu dòng "${nhan}"`);
}

// 4. Danh sách test: loại hợp lệ, có tích hợp
const tests = tableRows(section(text, /^### Danh sách test/m));
if (tests.length === 0) loi.push("Danh sách test: trống");
for (const r of tests) if (!LOAI_TEST.includes(r[1])) loi.push(`Danh sách test #${r[0]}: loại "${r[1]}" không hợp lệ (${LOAI_TEST.join(" / ")})`);
if (tests.length > 0 && !tests.some((r) => r[1] === "tích hợp")) {
  loi.push("Danh sách test: không có test tích hợp nào — tích hợp phải được ưu tiên");
}

// 4b. Bước kỹ thuật: mỗi chặng có "Test đích: #N" — test tự động của đúng chặng đó (vòng ngoài của TDD)
const buocKyThuat = section(text, /^## Bước kỹ thuật/m) ?? "";
const changKT = [...buocKyThuat.matchAll(/^### Chặng (\d+)[^\n]*\n([\s\S]*?)(?=^### |(?![\s\S]))/gm)];
if (soChang > 0 && changKT.length < soChang) loi.push(`Bước kỹ thuật: có ${soChang} chặng nhưng chỉ ${changKT.length} mục "### Chặng N"`);
for (const [, n, body] of changKT) {
  const so = body.match(/^Test đích:\s*#(\d+)/m)?.[1];
  if (!so) {
    loi.push(`Bước kỹ thuật chặng ${n}: thiếu dòng "Test đích: #N — ..."`);
    continue;
  }
  const t = tests.find((r) => r[0] === so);
  if (!t) loi.push(`Bước kỹ thuật chặng ${n}: test đích #${so} không có trong danh sách test`);
  else if (t[1] === "giao diện") loi.push(`Bước kỹ thuật chặng ${n}: test đích #${so} là "giao diện" — phải là test tự động (tích hợp / luật / unit)`);
  else if (t[5] !== n) loi.push(`Bước kỹ thuật chặng ${n}: test đích #${so} thuộc chặng ${t[5]}, không phải chặng ${n}`);
}

// 5. Ma trận phủ: mọi mã nghiệm thu đều có test tự động (hoặc lý do "chỉ thử tay")
const ma = tableRows(section(text, /^## Đánh số nghiệm thu/m)).map((r) => r[0]);
const maTran = new Map(tableRows(section(text, /^### Ma trận phủ nghiệm thu/m)).map((r) => [r[0], r[1] ?? ""]));
for (const m of ma) {
  const phu = maTran.get(m);
  if (phu === undefined) loi.push(`Ma trận phủ: thiếu dòng ${m}`);
  else if (!/#\d|chỉ thử tay|test hiện có|các test/.test(phu)) loi.push(`Ma trận phủ: ${m} chưa có test tự động (hoặc lý do "chỉ thử tay: ...")`);
}

// 6. Đối chiếu số dòng nghiệm thu với đề xuất
if (deXuatFile) {
  const dx = fs.readFileSync(deXuatFile, "utf8");
  const nt = (section(dx, /^#### Người dùng tự thử/m)?.match(/^- \[[ x]\]/gm) ?? []).length;
  const td = (section(dx, /^#### Kiểm tra tự động/m)?.match(/^- /gm) ?? []).length;
  const coNT = ma.filter((m) => /^NT\d+$/.test(m)).length;
  const coTD = ma.filter((m) => /^TD\d+$/.test(m)).length;
  if (coNT !== nt) loi.push(`Đánh số nghiệm thu: đề xuất có ${nt} dòng "Người dùng tự thử" nhưng kế hoạch có ${coNT} mã NT`);
  if (coTD !== td) loi.push(`Đánh số nghiệm thu: đề xuất có ${td} dòng "Kiểm tra tự động" nhưng kế hoạch có ${coTD} mã TD`);
}

if (loi.length > 0) {
  console.log(`✖ Kế hoạch chưa đạt (${loi.length}):\n${loi.map((l) => `  - ${l}`).join("\n")}`);
  process.exit(1);
}
console.log(`✔ Kế hoạch đạt: ${soChang} chặng, ${soRuiRo} rủi ro, ${tests.length} test, ${ma.length} dòng nghiệm thu đều được phủ.`);
