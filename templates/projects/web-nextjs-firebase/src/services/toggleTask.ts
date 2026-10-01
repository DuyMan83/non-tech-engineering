import { toggleDone, type Task } from "@/domain/task";
import type { AppDeps } from "@/services/ports";

export async function toggleTask(deps: AppDeps, task: Task): Promise<Task> {
  const updated = toggleDone(task);
  await deps.tasks.setDone(updated.id, updated.done);
  return updated;
}
