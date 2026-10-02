// Bản giả (in-memory) của các interface — dùng trong test, không cần Firebase.
import type { Task, TaskDraft } from "@/domain/task";
import type { AppDeps, AuthGateway, TaskRepository } from "@/services/ports";

export class InMemoryTaskRepository implements TaskRepository {
  readonly items = new Map<string, Task>();
  private nextId = 1;

  async add(draft: TaskDraft): Promise<Task> {
    const task = { ...draft, id: `task-${this.nextId++}` };
    this.items.set(task.id, task);
    return task;
  }

  async listByOwner(ownerId: string): Promise<Task[]> {
    return [...this.items.values()].filter((t) => t.ownerId === ownerId);
  }

  async setDone(taskId: string, done: boolean): Promise<void> {
    const task = this.items.get(taskId);
    if (!task) throw new Error(`Không tìm thấy việc ${taskId}`);
    this.items.set(taskId, { ...task, done });
  }
}

export class FakeAuthGateway implements AuthGateway {
  constructor(public userId = "user-1") {}
  async getCurrentUserId(): Promise<string> {
    return this.userId;
  }
}

export function createFakeDeps(now = 1000): AppDeps & { tasks: InMemoryTaskRepository; auth: FakeAuthGateway } {
  return { tasks: new InMemoryTaskRepository(), auth: new FakeAuthGateway(), now: () => now };
}
