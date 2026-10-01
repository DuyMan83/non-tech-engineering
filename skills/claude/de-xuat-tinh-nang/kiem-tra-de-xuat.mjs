#!/usr/bin/env node
// Kiểm tra một bản đề xuất có đủ các mục bắt buộc và không còn chỗ trống của mẫu.
// node kiem-tra-de-xuat.mjs <file đề xuất.md>
// Thoát 0 = đạt; 1 = thiếu (in danh sách cần bổ sung).
import fs from "node:fs";

const BAT_BUOC = [
  { muc: "Hiện trạng (Problem)", heading: /^## Hiện trạng/m, ngay: true },
  { muc: "Mục tiêu (Objective)", heading: /^## Mục tiêu/m },
  { muc: "Khoảng cách (Gap)", heading: /^## Khoảng cách/m, ngay: true },
  { muc: "Giải pháp (Solution)", heading: /^## Giải pháp/m },
  { muc: "Người dùng sẽ thấy gì", heading: /^### Người dùng sẽ thấy gì/m },
  { muc: "Thay đổi ở đâu — Thành phần / Dữ liệu / Luồng", heading: /^### Thay đổi ở đâu/m, chua: [/\*\*Thành phần\*\*/, /\*\*Dữ liệu\*\*/, /\*\*Luồng\*\*/] },
  { muc: "Quyết định sản phẩm", heading: /^### Quyết định sản phẩm/m },
  { muc: "Cách kiểm chứng (Acceptance)", heading: /^### Cách kiểm chứng/m },
  { muc: "Kiểm chứng — Người dùng tự thử", heading: /^#### Người dùng tự thử/m, chua: [/^- \[ \]/m] },
  { muc: "Kiểm chứng — Kiểm tra tự động", heading: /^#### Kiểm tra tự động/m },
  { muc: "Rủi ro & chi phí", heading: /^## Rủi ro/m },
  { muc: "Trong phạm vi", heading: /^## Trong phạm vi/m },
  { muc: "Ngoài phạm vi", heading: /^## Ngoài phạm vi/m },
  { muc: "Phụ lục — Nguồn từng mục", heading: /^### Nguồn từng mục/m },
];

const file = process.argv[2];
if (!file || !fs.existsSync(file)) {
  console.error("Cách dùng: node kiem-tra-de-xuat.mjs <file đề xuất.md>");
  process.exit(1);
}
const text = fs.readFileSync(file, "utf8");

// Nội dung của một mục = từ heading tới heading cùng cấp hoặc cao hơn tiếp theo.
function noiDung(re) {
  const m = re.exec(text);
  if (!m) return null;
  const level = m[0].match(/^#+/)[0].length;
  const rest = text.slice(m.index + m[0].length);
  const next = rest.search(new RegExp(`^#{1,${level}} `, "m"));
  return (next === -1 ? rest : rest.slice(0, next)).replace(/^.*\n/, "");
}

const loi = [];
for (const r of BAT_BUOC) {
  const body = noiDung(r.heading);
  if (body === null) {
    loi.push(`Thiếu mục: ${r.muc}`);
    continue;
  }
  if (body.replace(/[#\s|-]/g, "").length < 10) loi.push(`Mục trống: ${r.muc}`);
  if (r.ngay && !/\d{4}-\d{2}-\d{2}/.test(body)) loi.push(`${r.muc}: thiếu ngày khảo sát (YYYY-MM-DD)`);
  for (const c of r.chua ?? []) if (!c.test(body)) loi.push(`${r.muc}: thiếu ${c.source.replace(/\\/g, "")}`);
}
if (!/^# \S/m.test(text)) loi.push("Thiếu tiêu đề (dòng '# ...')");
const conMau = text.match(/\{\{[^}]*\}\}/g);
if (conMau) loi.push(`Còn ${conMau.length} chỗ trống của mẫu chưa điền, vd ${conMau[0]}`);

if (loi.length > 0) {
  console.log(`✖ Đề xuất chưa đủ (${loi.length}):\n${loi.map((l) => `  - ${l}`).join("\n")}`);
  process.exit(1);
}
console.log("✔ Đề xuất đủ các mục bắt buộc.");
