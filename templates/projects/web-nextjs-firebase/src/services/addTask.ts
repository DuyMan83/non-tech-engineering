import { createTaskDraft, type Task } from "@/domain/task";
import type { AppDeps } from "@/services/ports";

export async function addTask(deps: AppDeps, title: string): Promise<Task> {
  const ownerId = await deps.auth.getCurrentUserId();
  const draft = createTaskDraft(ownerId, title, deps.now());
  return deps.tasks.add(draft);
}
