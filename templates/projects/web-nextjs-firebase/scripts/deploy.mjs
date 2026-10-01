// npm run deploy                  -> đưa bản production lên mạng (phải xác nhận)
// npm run deploy -- --xac-nhan    -> đã xác nhận (AI chỉ dùng SAU KHI người dùng đồng ý)
import { confirmDanger, fail, loadConfig, parseArgs, run } from "./lib.mjs";

const { envName, confirmed } = parseArgs("production");
const config = loadConfig(envName);

if (config.usesEmulators) {
  fail(`Môi trường "${envName}" chỉ dùng bộ giả lập trên máy — không đưa lên mạng được.`);
}

await confirmDanger(
  [
    `Đưa app lên mạng: dự án Firebase "${config.projectId}" (${envName}).`,
    `Bản đang chạy tại https://${config.projectId}.web.app sẽ bị GHI ĐÈ bằng bản mới.`,
    "Luật bảo mật dữ liệu (firestore.rules) trên mạng cũng bị GHI ĐÈ.",
    "Người dùng thật sẽ thấy thay đổi ngay.",
  ],
  config.projectId,
  confirmed,
);

run("npm run check");
run("next build", config.vars);
run(`firebase deploy --only hosting,firestore --project ${config.projectId}`);
console.log(`\n✔ Đã đưa lên mạng: https://${config.projectId}.web.app`);
