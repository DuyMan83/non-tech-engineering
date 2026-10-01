// Cấu hình app (tên, icon, mã định danh trên store...) + cấu hình môi trường từ config/<APP_ENV>.env.
// APP_ENV do scripts/*.mjs (khi chạy trên máy) hoặc eas.json (khi build trên EAS) đặt; mặc định "dev".
import fs from "node:fs";
import path from "node:path";
import type { ConfigContext, ExpoConfig } from "expo/config";

const APP_NAME = "Khung dự án";
const APP_SLUG = "khung-du-an-mobile";
// Mã định danh trên App Store / Google Play — phải là duy nhất, đặt một lần rồi KHÔNG đổi.
const APP_ID = "com.example.khungduanmobile";

function readEnvFile(appEnv: string): Record<string, string> {
  const file = path.join(__dirname, "config", `${appEnv}.env`);
  if (!fs.existsSync(file)) throw new Error(`Không có file cấu hình ${file}`);
  const vars: Record<string, string> = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) vars[m[1]] = m[2];
  }
  return vars;
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const appEnv = process.env.APP_ENV ?? "dev";
  const env = readEnvFile(appEnv);
  const easProjectId = env.EAS_PROJECT_ID || undefined;

  return {
    ...config,
    name: APP_NAME,
    slug: APP_SLUG,
    scheme: APP_SLUG,
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    ios: { supportsTablet: true, bundleIdentifier: APP_ID },
    android: {
      package: APP_ID,
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/android-icon-foreground.png",
        backgroundImage: "./assets/android-icon-background.png",
        monochromeImage: "./assets/android-icon-monochrome.png",
      },
    },
    plugins: ["expo-router"],
    runtimeVersion: { policy: "appVersion" },
    updates: easProjectId ? { url: `https://u.expo.dev/${easProjectId}` } : undefined,
    extra: {
      appEnv,
      useEmulators: env.USE_EMULATORS === "true",
      firebase: {
        projectId: env.FIREBASE_PROJECT_ID,
        apiKey: env.FIREBASE_API_KEY,
        authDomain: env.FIREBASE_AUTH_DOMAIN,
        appId: env.FIREBASE_APP_ID,
      },
      eas: easProjectId ? { projectId: easProjectId } : undefined,
    },
  };
};
