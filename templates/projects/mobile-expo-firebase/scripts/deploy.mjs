// npm run deploy                     -> gửi bản cập nhật (EAS Update) tới người dùng THẬT + ghi đè luật Firestore
// npm run deploy production store    -> build app mới và gửi lên App Store / Google Play
// Thêm "-- --xac-nhan" SAU KHI người dùng đồng ý. Thêm "-- --thu" để chỉ xem các lệnh sẽ chạy.
import { confirmDanger, EAS, fail, loadConfig, makeRunner, nonInteractive, parseArgs } from "./lib.mjs";

const { envName, mode = "update", confirmed, dryRun } = parseArgs("production");
const run = makeRunner(dryRun);

if (!["update", "store"].includes(mode)) fail(`Chế độ "${mode}" không hợp lệ — dùng "update" (mặc định) hoặc "store".`);
if (loadConfig(envName).usesEmulators) fail(`Môi trường "${envName}" chỉ dùng bộ giả lập trên máy — không đưa ra ngoài được.`);
const config = loadConfig(envName, { needEas: true });

const common = [
  `Luật bảo mật dữ liệu (firestore.rules) của dự án "${config.projectId}" sẽ bị GHI ĐÈ.`,
];
const warnings =
  mode === "update"
    ? [
        `Gửi bản cập nhật tới NGƯỜI DÙNG THẬT của app (kênh "${envName}") — GHI ĐÈ bản họ đang dùng.`,
        "Họ sẽ nhận bản mới ở lần mở app tiếp theo.",
        "Chỉ áp dụng cho thay đổi giao diện / logic. Đổi thư viện có code native, quyền máy, icon... → phải dùng: npm run deploy production store",
        ...common,
      ]
    : [
        "Build app mới (android + ios) trên EAS và GỬI LÊN App Store / Google Play.",
        "Tốn lượt build; cần tài khoản Apple Developer (99 USD/năm) và Google Play (25 USD).",
        "Bản mới sẽ qua bước duyệt của store trước khi tới người dùng.",
        ...common,
      ];

await confirmDanger(warnings, config.projectId, { confirmed, dryRun });

run("npm run check");
run(`firebase deploy --only firestore --project ${config.projectId}`);
if (mode === "update") {
  run(`${EAS} update --channel ${envName} --auto${nonInteractive()}`, config.appEnv);
  console.log(dryRun ? "\n(Chỉ xem trước — chưa chạy lệnh nào.)" : "\n✔ Đã gửi bản cập nhật. Người dùng nhận ở lần mở app tiếp theo.");
} else {
  run(`${EAS} build --profile ${envName} --platform all --auto-submit${nonInteractive()}`, config.appEnv);
  console.log(dryRun ? "\n(Chỉ xem trước — chưa chạy lệnh nào.)" : "\n✔ Đã gửi build + nộp lên store. Theo dõi tại https://expo.dev và trên App Store Connect / Google Play Console.");
}
