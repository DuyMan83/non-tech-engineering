// Khởi tạo Firebase MỘT lần. Chỉ thư mục data/ được import Firebase.
import AsyncStorage from "@react-native-async-storage/async-storage";
// Lấy initializeAuth / getReactNativePersistence từ "@firebase/auth" vì kiểu dữ liệu bản React Native nằm ở đó
// (cùng một module với "firebase/auth" khi chạy).
import { connectAuthEmulator, getReactNativePersistence, initializeAuth, type Auth } from "@firebase/auth";
import Constants from "expo-constants";
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";

type FirebaseServices = { app: FirebaseApp; auth: Auth; db: Firestore };
type AppExtra = {
  appEnv: string;
  useEmulators: boolean;
  firebase: { projectId: string; apiKey: string; authDomain: string; appId: string };
};

let services: FirebaseServices | null = null;

// Điện thoại thật không hiểu "127.0.0.1" là máy tính — dùng địa chỉ máy tính mà Expo đang chạy.
function emulatorHost(): string {
  const hostUri = Constants.expoConfig?.hostUri; // vd "192.168.1.5:8081"
  return hostUri ? hostUri.split(":")[0] : "127.0.0.1";
}

export function getFirebase(): FirebaseServices {
  if (services) return services;

  const extra = Constants.expoConfig?.extra as AppExtra;
  const app = getApps().length > 0 ? getApp() : initializeApp(extra.firebase);
  // Lưu phiên đăng nhập trên máy, để mở lại app không bị đăng xuất.
  const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  const db = getFirestore(app);

  if (extra.useEmulators) {
    const host = emulatorHost();
    connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
    connectFirestoreEmulator(db, host, 8080);
  }

  services = { app, auth, db };
  return services;
}
