// npm run build              -> build bản dev (bộ giả lập)
// npm run build production   -> build bản production (Firebase thật)
import { loadConfig, parseArgs, run } from "./lib.mjs";

const { envName } = parseArgs("dev");
const config = loadConfig(envName);

console.log(`Build môi trường: ${envName} (${config.usesEmulators ? "bộ giả lập" : `Firebase thật: ${config.projectId}`})`);
run("next build", config.vars);
console.log(`\n✔ Build xong (${envName}). Kết quả nằm trong thư mục out/.`);
