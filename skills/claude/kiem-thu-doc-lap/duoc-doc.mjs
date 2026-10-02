#!/usr/bin/env node
// Gác cửa "chỉ đọc tài liệu, không đọc code" cho skill kiem-thu-doc-lap.
//
// 1) Hỏi một đường dẫn:   node duoc-doc.mjs <đường dẫn> [--goc <thư mục dự án>]
//    -> in "được" (thoát 0) hoặc "không được: <lý do>" (thoát 1).
// 2) Hook PreToolUse của Claude Code:   node duoc-doc.mjs --hook   (đọc JSON từ stdin)
//    -> Chỉ có hiệu lực khi thư mục dự án có file đánh dấu ".kiem-thu-dang-chay".
//    -> Chặn (thoát 2) khi Read / Grep / Bash định đọc code; còn lại cho qua (thoát 0).
import fs from "node:fs";
import path from "node:path";

export const DANH_DAU = ".kiem-thu-dang-chay";
const DUOI_CODE = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".rules", ".json", ".css", ".env", ".yaml", ".yml", ".sh"]);
const DUOI_ANH = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);

// Trả về null nếu được đọc, hoặc lý do nếu không.
export function lyDoCam(p, goc) {
  const tuyetDoi = path.resolve(goc, p);
  const tuongDoi = path.relative(goc, tuyetDoi).split(path.sep).join("/");
  const trongDuAn = !tuongDoi.startsWith("..") && !path.isAbsolute(tuongDoi);
  const duoi = path.extname(tuyetDoi).toLowerCase();

  if (duoi === ".md" || DUOI_ANH.has(duoi)) return null; // tài liệu, ảnh chụp: luôn được
  if (trongDuAn) {
    if (tuongDoi === "" || tuongDoi === ".") return null; // liệt kê thư mục gốc
    if (tuongDoi === "docs" || tuongDoi.startsWith("docs/")) return null;
    return `"${tuongDoi}" là code / cấu hình của dự án — kiểm thử độc lập chỉ được đọc tài liệu (*.md, docs/).`;
  }
  if (DUOI_CODE.has(duoi)) return `"${p}" là file code — kiểm thử độc lập không đọc code.`;
  return null; // file ngoài dự án không phải code (vd kết quả chạy thử trong thư mục tạm)
}

// Lệnh Bash có định ĐỌC code không (chạy app / chạy test thì được).
export function lyDoCamBash(cmd, goc) {
  const docFile = /(^|[\s|;&(])(cat|head|tail|less|more|bat|nl|sed|awk|grep|rg|ag|strings|xxd|od)\s/;
  const docGit = /\bgit\s+(show|diff|blame|grep|log\s+(-p|--patch))/;
  if (!docFile.test(cmd) && !docGit.test(cmd)) return null;
  const toks = cmd.match(/[^\s'"|;&<>()]+/g) ?? [];
  for (const t of toks) {
    if (t.startsWith("-")) continue;
    if (/(^|\/)(src|tests|scripts|app|components)\//.test(t) || DUOI_CODE.has(path.extname(t).toLowerCase())) {
      const ly = lyDoCam(t, goc);
      if (ly) return `Lệnh đọc code: ${ly}`;
    }
  }
  if (docGit.test(cmd)) return "git show / diff / blame / log -p hiện nội dung code — kiểm thử độc lập không dùng.";
  return null;
}

function hook() {
  let input = "";
  process.stdin.on("data", (d) => (input += d));
  process.stdin.on("end", () => {
    let ev;
    try {
      ev = JSON.parse(input);
    } catch {
      process.exit(0);
    }
    const goc = ev.cwd || process.cwd();
    if (!fs.existsSync(path.join(goc, DANH_DAU))) process.exit(0); // không đang kiểm thử -> không can thiệp
    const t = ev.tool_input ?? {};
    let ly = null;
    if (ev.tool_name === "Read" || ev.tool_name === "NotebookRead") ly = lyDoCam(t.file_path ?? t.notebook_path ?? "", goc);
    else if (ev.tool_name === "Grep") {
      const glob = t.glob ?? "";
      const chiMd = /\.md\}?$/.test(glob) || t.type === "md";
      ly = chiMd ? null : lyDoCam(t.path ?? ".", goc) ?? (t.path ? null : "Grep toàn dự án sẽ đọc cả code — giới hạn vào docs/ hoặc glob *.md.");
    } else if (ev.tool_name === "Bash") ly = lyDoCamBash(t.command ?? "", goc);
    if (ly) {
      console.error(`[kiem-thu-doc-lap] Bị chặn: ${ly} Kiểm thử từ tài liệu và từ app đang chạy.`);
      process.exit(2);
    }
    process.exit(0);
  });
}

if (process.argv[2] === "--hook") hook();
else if (process.argv[2]) {
  const i = process.argv.indexOf("--goc");
  const goc = i >= 0 ? path.resolve(process.argv[i + 1]) : process.cwd();
  const ly = lyDoCam(process.argv[2], goc);
  console.log(ly ? `không được: ${ly}` : "được");
  process.exit(ly ? 1 : 0);
}
