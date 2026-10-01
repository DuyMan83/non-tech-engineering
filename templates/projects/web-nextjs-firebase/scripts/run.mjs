// npm start              -> chạy dev trên máy với bộ giả lập (dữ liệu thử)
// npm start production   -> build production rồi chạy trên máy, dùng DỮ LIỆU THẬT (phải xác nhận)
import { confirmDanger, loadConfig, makeRunner, parseArgs } from "./lib.mjs";

const { envName, confirmed, dryRun } = parseArgs("dev");
const config = loadConfig(envName);
const run = makeRunner(dryRun);

if (config.usesEmulators) {
  console.log(`Chạy môi trường ${envName} với bộ giả lập — mở http://localhost:3000`);
  run(`firebase emulators:exec --only auth,firestore --project ${config.projectId} "next dev"`, config.vars);
} else {
  await confirmDanger(
    [
      `Chạy app trên máy nhưng dùng DỮ LIỆU THẬT của dự án "${config.projectId}".`,
      "Mọi thứ thêm / sửa / xoá khi thử sẽ ghi thẳng vào dữ liệu thật.",
    ],
    config.projectId,
    { confirmed, dryRun },
  );
  run("next build", config.vars);
  console.log(`Chạy bản ${envName} — mở http://localhost:5002`);
  run(`firebase emulators:start --only hosting --project ${config.projectId}`);
}
