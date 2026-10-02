// npm run build              -> build bản dev (bộ giả lập)
// npm run build production   -> build bản production (Firebase thật)
import { loadConfig, makeRunner, parseArgs } from "./lib.mjs";

const { envName, dryRun } = parseArgs("dev");
const config = loadConfig(envName);
const run = makeRunner(dryRun);

console.log(`Build môi trường: ${envName} (${config.usesEmulators ? "bộ giả lập" : `Firebase thật: ${config.projectId}`})`);
run("next build", config.vars);
console.log(dryRun ? "\n(Chỉ xem trước — chưa chạy lệnh nào.)" : `\n✔ Build xong (${envName}). Kết quả nằm trong thư mục out/.`);
