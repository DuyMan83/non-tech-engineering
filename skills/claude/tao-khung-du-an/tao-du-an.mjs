#!/usr/bin/env node
// Tạo dự án mới từ khung dự án (templates/projects/<kien-truc>) — chạy được trên macOS và Windows.
//
// node tao-du-an.mjs --repo <thư mục repo non-tech-engineering> --kien-truc web-nextjs-firebase \
//                    --dich <thư mục dự án mới> --ten "Tên dự án" --mo-ta "App làm gì, cho ai"
//
// Chỉ copy + điền thông tin. KHÔNG cài thư viện, KHÔNG git init — skill làm các bước đó sau.
import fs from "node:fs";
import path from "node:path";

const BO_QUA = new Set(["node_modules", ".next", "out", ".firebase", "README.md", "next-env.d.ts", "tsconfig.tsbuildinfo"]);
const DEMO_ID_KHUNG = "demo-khung-du-an";

function loi(message) {
  console.error(`LỖI: ${message}`);
  process.exit(1);
}

function docThamSo(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, "");
    if (!key || argv[i + 1] === undefined) loi(`Thiếu giá trị cho ${argv[i]}`);
    out[key] = argv[i + 1];
  }
  for (const k of ["repo", "kien-truc", "dich", "ten", "mo-ta"]) if (!out[k]) loi(`Thiếu --${k}`);
  return out;
}

// "Đặt lịch Spa Hoa Mai" -> "dat-lich-spa-hoa-mai"
export function taoSlug(ten) {
  return ten
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
}

function thayTrongFile(file, cap) {
  if (!fs.existsSync(file)) return;
  let s = fs.readFileSync(file, "utf8");
  for (const [tu, sang] of cap) s = s.split(tu).join(sang);
  fs.writeFileSync(file, s);
}

function main() {
  const a = docThamSo(process.argv.slice(2));
  const repo = path.resolve(a.repo);
  const nguon = path.join(repo, "templates", "projects", a["kien-truc"]);
  const dich = path.resolve(a.dich);
  const slug = taoSlug(a.ten);
  const demoId = `demo-${slug}`.slice(0, 30).replace(/-+$/g, "");

  if (!slug) loi("Tên dự án phải có ít nhất 1 chữ cái hoặc số.");
  if (!fs.existsSync(nguon)) loi(`Không có khung dự án cho kiến trúc "${a["kien-truc"]}" tại ${nguon}`);
  if (fs.existsSync(dich) && fs.readdirSync(dich).length > 0) loi(`Thư mục ${dich} đã có và không trống — không ghi đè.`);

  // 1. Copy khung (bỏ thư viện đã cài, file build, README của khung)
  fs.cpSync(nguon, dich, {
    recursive: true,
    filter: (src) => !BO_QUA.has(path.basename(src)) && !src.endsWith("-debug.log"),
  });

  // 2. Copy rules kiến trúc vào dự án để AI trong dự án đọc được
  const kienTruc = path.join(dich, "docs", "kien-truc");
  fs.mkdirSync(kienTruc, { recursive: true });
  fs.copyFileSync(path.join(repo, "docs", "architectures", "_chung", "clean-rules.md"), path.join(kienTruc, "clean-rules.md"));
  fs.copyFileSync(path.join(repo, "docs", "architectures", a["kien-truc"], "rules.md"), path.join(kienTruc, "rules.md"));
  thayTrongFile(path.join(kienTruc, "rules.md"), [["../_chung/clean-rules.md", "clean-rules.md"]]);

  // 3. Điền thông tin dự án
  const homNay = new Date().toISOString().slice(0, 10);
  thayTrongFile(path.join(dich, "AGENTS.md"), [
    ["{{TEN_DU_AN}}", a.ten],
    ["{{MO_TA}}", a["mo-ta"]],
    ["{{NGAY_TAO}}", homNay],
  ]);
  const pkgFile = path.join(dich, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"));
  pkg.name = slug;
  fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + "\n");
  for (const f of ["package.json", "config/dev.env", "tests/firestore.rules.test.ts"]) {
    thayTrongFile(path.join(dich, f), [[DEMO_ID_KHUNG, demoId]]);
  }
  for (const f of ["src/app/layout.tsx", "public/manifest.webmanifest"]) {
    thayTrongFile(path.join(dich, f), [["Khung dự án", a.ten]]);
  }
  const lock = path.join(dich, "package-lock.json");
  if (fs.existsSync(lock)) {
    const l = JSON.parse(fs.readFileSync(lock, "utf8"));
    l.name = slug;
    if (l.packages?.[""]) l.packages[""].name = slug;
    fs.writeFileSync(lock, JSON.stringify(l, null, 2) + "\n");
  }

  console.log(JSON.stringify({ ok: true, dich, slug, demoProjectId: demoId }));
}

main();
