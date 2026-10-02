// npm run build                          -> đóng gói thử trên máy (dev, miễn phí) để chắc app build được
// npm run build production [android|ios|all]  -> build app thật trên EAS (TỐN LƯỢT BUILD, phải xác nhận)
import { confirmDanger, EAS, fail, loadConfig, makeRunner, nonInteractive, parseArgs } from "./lib.mjs";

const { envName, mode, confirmed, dryRun } = parseArgs("dev");
const run = makeRunner(dryRun);

const localConfig = loadConfig(envName);
if (localConfig.usesEmulators) {
  const config = localConfig;
  run("expo export --platform android --platform ios --output-dir dist", config.appEnv);
  console.log(dryRun ? "\n(Chỉ xem trước — chưa chạy lệnh nào.)" : "\n✔ Đóng gói thử xong — app build được. (Đây chỉ là kiểm tra, chưa phải file cài lên điện thoại.)");
} else {
  const platform = mode ?? "all";
  if (!["android", "ios", "all"].includes(platform)) fail(`Nền tảng "${platform}" không hợp lệ — dùng android, ios hoặc all.`);
  const config = loadConfig(envName, { needEas: true });
  await confirmDanger(
    [
      `Build app thật (${platform}) cho dự án "${config.projectId}" trên máy chủ EAS.`,
      "Mỗi lần build tốn 1 lượt build của tài khoản Expo (gói miễn phí có giới hạn mỗi tháng).",
      "Build iOS cần tài khoản Apple Developer (99 USD/năm). Mất khoảng 10–30 phút.",
    ],
    config.projectId,
    { confirmed, dryRun },
  );
  run(`${EAS} build --profile ${envName} --platform ${platform}${nonInteractive()}`, config.appEnv);
  console.log(dryRun ? "\n(Chỉ xem trước — chưa chạy lệnh nào.)" : "\n✔ Đã gửi build lên EAS. Xem tiến độ và tải file cài tại https://expo.dev");
}
