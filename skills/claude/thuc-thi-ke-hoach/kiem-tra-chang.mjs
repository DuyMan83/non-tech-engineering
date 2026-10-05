#!/usr/bin/env node
// Kiểm tra một chặng trước khi đưa người dùng thử — bắt những lối tắt hay gặp khi cố "làm cho xanh",
// và chứng minh test được viết trước: mỗi ca test mới phải ĐỎ trên code ngay trước lần lưu điểm đưa nó vào.
// Chạy trong thư mục dự án:
//   node kiem-tra-chang.mjs --ke-hoach docs/ke-hoach/<ten>.md --chang <N> [--goc <git ref>]
// --goc: điểm bắt đầu để so (mặc định: chỗ nhánh tách ra từ main).
// Thoát 0 = đạt; 1 = có vấn đề (in danh sách).
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

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

// 6. Test đích không được bỏ quên trong stash; lần "Dọn lại" không được sửa test
const conCat = sh("git stash list").split("\n").filter((l) => /test-dich/.test(l));
for (const l of conCat) loi.push(`Test đích còn cất trong stash — bỏ cất (git stash pop) cho nó chạy: ${l}`);
for (const c of sh(`git rev-list --no-merges ${goc}..HEAD`).split("\n").filter(Boolean)) {
  const tieuDe = sh(`git log -1 --format=%s ${c}`);
  if (!/^Dọn lại/i.test(tieuDe)) continue;
  const suaTest = sh(`git diff --name-only ${c}^ ${c}`).split("\n").filter((f) => /\.test\.tsx?$/.test(f));
  if (suaTest.length) loi.push(`Lần "${tieuDe}" (${c.slice(0, 7)}) sửa file test (${suaTest.join(", ")}) — dọn lại không được đổi test`);
}

// 7. Test viết trước: mỗi ca test mới phải ĐỎ trên code ngay trước lần lưu điểm đưa nó vào
const doTruoc = kiemDoTruoc();

for (const c of canhBao) console.log(`⚠ ${c}`);
if (loi.length > 0) {
  console.log(`✖ Chặng ${chang} chưa đạt (${loi.length}):\n${loi.map((l) => `  - ${l}`).join("\n")}`);
  process.exit(1);
}
console.log(
  `✔ Chặng ${chang} đạt: ${cuaChang.length} test của chặng đã có, số ca test ${caGoc} → ${caNay}, ` +
    `${doTruoc.do} ca mới đỏ trên code cũ${doTruoc.coSan ? `, ${doTruoc.coSan} ca hành vi có sẵn đã ghi chứng minh` : ""}, không có lối tắt.`,
);

// Với mỗi lần lưu điểm từ gốc (và phần chưa lưu): lấy các file test của lần đó, chạy trên code của lần
// ngay trước. Ca test mới mà XANH trên code cũ = test viết sau code, hoặc test không kiểm điều gì mới.
// Ngoại lệ: hành vi có sẵn — Ghi chép của kế hoạch có dòng "Có sẵn: <tên ca test>" (đã tạm làm hỏng để chứng minh).
function kiemDoTruoc() {
  const ketQua = { do: 0, coSan: 0 };
  const laTest = (f) => /\.test\.tsx?$/.test(f);
  const laHoTroTest = (f) => laTest(f) || f.startsWith("tests/") || f.includes("/testing/");
  const ghiChep = plan.split(/^## Ghi chép trong lúc làm/m)[1]?.split(/^## /m)[0] ?? "";
  const daGhiCoSan = (ten) => ghiChep.split("\n").some((l) => /Có sẵn/i.test(l) && l.includes(ten));

  const buoc = sh(`git rev-list --reverse --no-merges ${goc}..HEAD`)
    .split("\n")
    .filter(Boolean)
    .map((c) => ({
      ten: `${c.slice(0, 7)} "${sh(`git log -1 --format=%s ${c}`)}"`,
      cha: `${c}^`,
      doiFile: sh(`git diff --name-only --diff-filter=AM ${c}^ ${c}`).split("\n").filter(Boolean),
      noiDung: (f) => execSync(`git show ${c}:${f}`, { encoding: "utf8", maxBuffer: 1 << 26 }),
    }));
  const chuaLuu = [
    ...sh("git diff --name-only --diff-filter=AM HEAD").split("\n"),
    ...sh("git ls-files --others --exclude-standard").split("\n"),
  ].filter(Boolean);
  if (chuaLuu.length) buoc.push({ ten: "phần chưa lưu điểm", cha: sh("git rev-parse HEAD"), doiFile: chuaLuu, noiDung: (f) => fs.readFileSync(f, "utf8") });

  const canChay = buoc.filter((b) => b.doiFile.some(laTest));
  if (canChay.length === 0) return ketQua;
  if (!fs.existsSync("node_modules")) {
    loi.push("Chưa cài thư viện (node_modules) — chạy npm install rồi kiểm lại");
    return ketQua;
  }

  // Một bản sao riêng của dự án (git worktree) để đổi qua lại các điểm cũ mà không đụng thư mục đang làm
  const wt = fs.mkdtempSync(path.join(os.tmpdir(), "kiem-tra-chang-"));
  let taoXong = false;
  try {
    sh(`git worktree add --detach "${wt}" HEAD`);
    taoXong = true;
    fs.symlinkSync(path.resolve("node_modules"), path.join(wt, "node_modules"), "junction");
    for (const b of canChay) {
      sh(`git -C "${wt}" checkout -f -q --detach ${b.cha}`);
      sh(`git -C "${wt}" clean -fdq -e node_modules`); // giữ liên kết node_modules
      const fileTest = b.doiFile.filter(laTest);
      // Tên các ca đã có ở điểm cũ (ca trùng tên không tính là ca mới)
      const caCu = new Set();
      for (const nhom of chiaNhom(fileTest.filter((f) => fs.existsSync(path.join(wt, f))))) {
        const ds = chayVitest(wt, nhom, "list");
        if (ds.loi) loi.push(`Lần lưu điểm ${b.ten}: không liệt kê được test cũ — ${ds.loi}`);
        for (const t of ds.data ?? []) caCu.add(`${tuongDoi(wt, t.file)}::${t.name}`);
      }
      // Chép phiên bản test (và file hỗ trợ test) của lần này vào điểm cũ rồi chạy
      for (const f of b.doiFile.filter(laHoTroTest)) {
        fs.mkdirSync(path.dirname(path.join(wt, f)), { recursive: true });
        fs.writeFileSync(path.join(wt, f), b.noiDung(f));
      }
      for (const nhom of chiaNhom(fileTest)) {
        const kq = chayVitest(wt, nhom, "run");
        if (kq.loi) {
          loi.push(`Lần lưu điểm ${b.ten}: không chạy được test trên code cũ — ${kq.loi}`);
          continue;
        }
        for (const file of kq.data.testResults ?? []) {
          const f = tuongDoi(wt, file.name);
          for (const a of file.assertionResults ?? []) {
            const ten = [...(a.ancestorTitles ?? []), a.title].join(" > ");
            if (caCu.has(`${f}::${ten}`)) continue;
            if (a.status === "failed") ketQua.do++;
            else if (a.status === "passed") {
              if (daGhiCoSan(a.title)) ketQua.coSan++;
              else
                loi.push(
                  `Lần lưu điểm ${b.ten}: ca test "${ten}" (${f}) XANH ngay trên code trước nó — test viết sau code, hoặc không kiểm điều gì mới. ` +
                    `Nếu là hành vi có sẵn: tạm làm hỏng để thấy đỏ, trả lại, rồi ghi "Có sẵn: ${a.title}" vào Ghi chép.`,
                );
            }
          }
          // File không chạy nổi trên code cũ (vd gọi hàm chưa có) → mọi ca mới của file đều đỏ
          if ((file.assertionResults ?? []).length === 0 && file.status === "failed") {
            let cu = 0;
            try {
              cu = demCa(execSync(`git show ${b.cha}:${f}`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
            } catch {} // file mới, chưa có ở điểm cũ
            ketQua.do += Math.max(1, demCa(b.noiDung(f)) - cu);
          }
        }
      }
    }
  } catch (e) {
    loi.push(`Không kiểm được "test viết trước": ${String(e.message).split("\n")[0]}`);
  } finally {
    try {
      fs.unlinkSync(path.join(wt, "node_modules"));
    } catch {
      try {
        fs.rmdirSync(path.join(wt, "node_modules"));
      } catch {}
    }
    if (taoXong) sh(`git worktree remove --force "${wt}"`);
    fs.rmSync(wt, { recursive: true, force: true });
  }
  return ketQua;
}

// Test trong tests/ chạy trên bộ giả lập Firebase (lệnh test:emulator), còn lại là unit (lệnh test)
function chiaNhom(files) {
  const gl = files.filter((f) => f.startsWith("tests/"));
  const unit = files.filter((f) => !f.startsWith("tests/"));
  return [...(unit.length ? [Object.assign(unit, { gl: false })] : []), ...(gl.length ? [Object.assign(gl, { gl: true })] : [])];
}

function chayVitest(wt, files, kieu) {
  const pkg = JSON.parse(fs.readFileSync(path.join(wt, "package.json"), "utf8"));
  const out = path.join(wt, `.kq-${Date.now()}.json`);
  const ds = files.map((f) => `"${f}"`).join(" ");
  const lenhGl = pkg.scripts?.["test:emulator"] ?? "";
  const thamSoGl = lenhGl.match(/vitest run([^"]*)"/)?.[1] ?? null;
  if (files.gl && thamSoGl === null) return { loi: 'package.json thiếu lệnh "test:emulator" dạng vitest run' };
  let lenh;
  if (kieu === "list") lenh = `vitest list${files.gl ? thamSoGl : ""} --json="${out}" ${ds}`;
  else if (files.gl) lenh = lenhGl.replace(/vitest run([^"]*)"/, (_, t) => `vitest run${t} --reporter=json --outputFile=${out} ${files.join(" ")}"`);
  else lenh = `vitest run --reporter=json --outputFile="${out}" ${ds}`;

  const khoaPath = Object.keys(process.env).find((k) => k.toUpperCase() === "PATH") ?? "PATH";
  const env = { ...process.env, [khoaPath]: `${path.join(wt, "node_modules", ".bin")}${path.delimiter}${process.env[khoaPath]}` };
  let log = "";
  try {
    execSync(lenh, { cwd: wt, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 26 });
  } catch (e) {
    log = `${e.stdout ?? ""}${e.stderr ?? ""}`; // test đỏ cũng thoát khác 0 — bình thường
  }
  if (!fs.existsSync(out)) {
    const cuoi = log.trim().split("\n").slice(-3).join(" / ").slice(0, 300);
    const goiY = files.gl && kieu === "run" ? " (app đang chạy bằng npm start thì tắt đi, vì bộ giả lập đang chiếm cổng)" : "";
    return { loi: `${cuoi || "không có kết quả"}${goiY}` };
  }
  const data = JSON.parse(fs.readFileSync(out, "utf8"));
  fs.rmSync(out);
  return { data };
}

function tuongDoi(wt, f) {
  return path.relative(fs.realpathSync(wt), safeReal(f)).split(path.sep).join("/");
}
function safeReal(f) {
  try {
    return fs.realpathSync(f);
  } catch {
    return f;
  }
}
