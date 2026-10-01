import { defineConfig, globalIgnores } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";

// Ranh giới 4 lớp (xem docs/kien-truc/clean-rules.md, nhóm A). Import sai lớp => `npm run check` báo lỗi.
const parentImports = { group: ["../*"], message: "Import giữa các thư mục dùng '@/...', không dùng '../'." };
const firebase = {
  group: ["firebase", "firebase/*", "@firebase/*", "@react-native-async-storage/*"],
  message: "Chỉ src/data/ được dùng Firebase / bộ nhớ máy.",
};
const ui = { group: ["react", "react-native", "react-native-*", "expo", "expo-*"], message: "Lớp này không được phụ thuộc React Native / Expo." };
const layer = (name, why) => ({ group: [`@/${name}`, `@/${name}/*`], message: why });

const restrict = (...patterns) => ({ "no-restricted-imports": ["error", { patterns: [parentImports, ...patterns] }] });

export default defineConfig([
  ...expoConfig,
  globalIgnores([".expo/**", "dist/**", "node_modules/**", "expo-env.d.ts"]),
  {
    files: ["src/domain/**"],
    rules: restrict(
      firebase,
      ui,
      layer("app", "domain/ không import app/."),
      layer("ui", "domain/ không import ui/."),
      layer("services", "domain/ không import services/."),
      layer("data", "domain/ không import data/."),
      layer("composition", "domain/ không import composition."),
    ),
  },
  {
    files: ["src/services/**"],
    rules: restrict(
      firebase,
      ui,
      layer("app", "services/ không import app/."),
      layer("ui", "services/ không import ui/."),
      layer("data", "services/ không import data/ — định nghĩa interface rồi để data/ implement."),
      layer("composition", "services/ không import composition."),
    ),
  },
  {
    files: ["src/ui/**", "src/app/**"],
    rules: restrict(firebase, layer("data", "Giao diện không gọi data/ trực tiếp — đi qua services/ và composition.")),
  },
  {
    files: ["src/data/**"],
    rules: restrict(
      { group: ["react", "react-native"], message: "data/ không phụ thuộc giao diện." },
      layer("app", "data/ không import app/."),
      layer("ui", "data/ không import ui/."),
      layer("composition", "data/ không import composition."),
    ),
  },
]);
