import { signInAnonymously, type Auth } from "firebase/auth";
import type { AuthGateway } from "@/services/ports";

// Khung dự án dùng đăng nhập ẩn danh cho đơn giản. Đổi sang Google/email: chỉ sửa file này.
export class FirebaseAuthGateway implements AuthGateway {
  // Nhiều chỗ gọi cùng lúc phải dùng chung MỘT lần đăng nhập, nếu không sẽ tạo ra nhiều người dùng khác nhau.
  private signingIn: Promise<string> | null = null;

  constructor(private readonly auth: Auth) {}

  async getCurrentUserId(): Promise<string> {
    await this.auth.authStateReady();
    if (this.auth.currentUser) return this.auth.currentUser.uid;
    this.signingIn ??= signInAnonymously(this.auth)
      .then((credential) => credential.user.uid)
      .finally(() => {
        this.signingIn = null;
      });
    return this.signingIn;
  }
}
