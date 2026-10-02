// Nơi DUY NHẤT nối data/ (Firebase) với services/. Giao diện lấy deps từ đây.
import { getFirebase } from "@/data/firebase";
import { FirebaseAuthGateway } from "@/data/firebaseAuthGateway";
import { FirestoreTaskRepository } from "@/data/firestoreTaskRepository";
import type { AppDeps } from "@/services/ports";

let deps: AppDeps | null = null;

// Gọi khi app đang chạy (useEffect / sự kiện).
export function getDeps(): AppDeps {
  if (!deps) {
    const { auth, db } = getFirebase();
    deps = {
      tasks: new FirestoreTaskRepository(db),
      auth: new FirebaseAuthGateway(auth),
      now: () => Date.now(),
    };
  }
  return deps;
}
