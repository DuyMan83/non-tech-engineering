// npm start              -> chạy dev: Expo + bộ giả lập (dữ liệu thử). Quét mã QR bằng app Expo Go.
// npm start production   -> chạy trên điện thoại với DỮ LIỆU THẬT (phải xác nhận)
import { confirmDanger, loadConfig, makeRunner, parseArgs } from "./lib.mjs";

const { envName, confirmed, dryRun } = parseArgs("dev");
const config = loadConfig(envName);
const run = makeRunner(dryRun);

if (config.usesEmulators) {
  console.log(`Chạy môi trường ${envName} với bộ giả lập — mở app Expo Go trên điện thoại và quét mã QR.`);
  console.log("Điện thoại và máy tính phải dùng CÙNG một mạng Wi-Fi.");
  run(`firebase emulators:exec --only auth,firestore --project ${config.projectId} "expo start"`, config.appEnv);
} else {
  await confirmDanger(
    [
      `Chạy app trên điện thoại nhưng dùng DỮ LIỆU THẬT của dự án "${config.projectId}".`,
      "Mọi thứ thêm / sửa / xoá khi thử sẽ ghi thẳng vào dữ liệu thật.",
    ],
    config.projectId,
    { confirmed, dryRun },
  );
  run("expo start", config.appEnv);
}
