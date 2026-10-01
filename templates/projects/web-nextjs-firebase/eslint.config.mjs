import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Ranh giới 4 lớp (xem clean-rules.md, nhóm A). Import sai lớp => `npm run check` báo lỗi.
const parentImports = { group: ["../*"], message: "Import giữa các thư mục dùng '@/...', không dùng '../'." };
const firebase = { group: ["firebase", "firebase/*"], message: "Chỉ src/data/ được dùng Firebase." };
const react = { group: ["react", "react-dom", "next", "next/*"], message: "Lớp này không được phụ thuộc React/Next." };
const layer = (name, why) => ({ group: [`@/${name}`, `@/${name}/*`], message: why });

const restrict = (...patterns) => ({ "no-restricted-imports": ["error", { patterns: [parentImports, ...patterns] }] });

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "node_modules/**", "next-env.d.ts"]),
  {
    files: ["src/domain/**"],
    rules: restrict(
      firebase,
      react,
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
      react,
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
      react,
      layer("app", "data/ không import app/."),
      layer("ui", "data/ không import ui/."),
      layer("composition", "data/ không import composition."),
    ),
  },
]);
