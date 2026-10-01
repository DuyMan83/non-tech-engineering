import { sortForDisplay, type Task } from "@/domain/task";
import type { AppDeps } from "@/services/ports";

export async function listMyTasks(deps: AppDeps): Promise<Task[]> {
  const ownerId = await deps.auth.getCurrentUserId();
  return sortForDisplay(await deps.tasks.listByOwner(ownerId));
}
