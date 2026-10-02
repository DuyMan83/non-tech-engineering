// "Hợp đồng" mà services/ cần từ bên ngoài. data/ sẽ làm theo các interface này.
import type { Task, TaskDraft } from "@/domain/task";

export interface TaskRepository {
  add(draft: TaskDraft): Promise<Task>;
  listByOwner(ownerId: string): Promise<Task[]>;
  setDone(taskId: string, done: boolean): Promise<void>;
}

export interface AuthGateway {
  // Trả về mã người dùng hiện tại; tự đăng nhập nếu chưa.
  getCurrentUserId(): Promise<string>;
}

export type AppDeps = {
  tasks: TaskRepository;
  auth: AuthGateway;
  now: () => number;
};
