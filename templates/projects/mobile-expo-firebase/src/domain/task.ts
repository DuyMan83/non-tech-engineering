// Quy tắc nghiệp vụ của "việc cần làm" — TypeScript thuần, không phụ thuộc gì bên ngoài.

export const TITLE_MAX_LENGTH = 200;

export type Task = {
  id: string;
  ownerId: string;
  title: string;
  done: boolean;
  createdAt: number;
};

export type TaskDraft = Omit<Task, "id">;

export class InvalidTaskError extends Error {}

export function createTaskDraft(ownerId: string, rawTitle: string, now: number): TaskDraft {
  const title = rawTitle.trim();
  if (title.length === 0) {
    throw new InvalidTaskError("Tên việc không được để trống.");
  }
  if (title.length > TITLE_MAX_LENGTH) {
    throw new InvalidTaskError(`Tên việc tối đa ${TITLE_MAX_LENGTH} ký tự.`);
  }
  return { ownerId, title, done: false, createdAt: now };
}

export function toggleDone(task: Task): Task {
  return { ...task, done: !task.done };
}

// Việc chưa xong lên trước, rồi việc mới tạo lên trước.
export function sortForDisplay(tasks: readonly Task[]): Task[] {
  return [...tasks].sort((a, b) => Number(a.done) - Number(b.done) || b.createdAt - a.createdAt);
}
