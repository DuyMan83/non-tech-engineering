import { describe, expect, it } from "vitest";
import { InvalidTaskError } from "@/domain/task";
import { addTask } from "@/services/addTask";
import { listMyTasks } from "@/services/listMyTasks";
import { createFakeDeps } from "@/services/testing/fakeDeps";
import { toggleTask } from "@/services/toggleTask";

describe("addTask", () => {
  it("lưu việc cho người dùng hiện tại", async () => {
    const deps = createFakeDeps(500);
    const task = await addTask(deps, " Gọi điện cho mẹ ");
    expect(task).toMatchObject({ ownerId: "user-1", title: "Gọi điện cho mẹ", done: false, createdAt: 500 });
    expect(deps.tasks.items.size).toBe(1);
  });

  it("không lưu việc có tên rỗng", async () => {
    const deps = createFakeDeps();
    await expect(addTask(deps, "  ")).rejects.toThrow(InvalidTaskError);
    expect(deps.tasks.items.size).toBe(0);
  });
});

describe("listMyTasks", () => {
  it("chỉ trả về việc của người dùng hiện tại", async () => {
    const deps = createFakeDeps();
    await addTask(deps, "Của tôi");
    deps.auth.userId = "user-2";
    await addTask(deps, "Của người khác");
    deps.auth.userId = "user-1";
    expect((await listMyTasks(deps)).map((t) => t.title)).toEqual(["Của tôi"]);
  });
});

describe("toggleTask", () => {
  it("đánh dấu xong và lưu lại", async () => {
    const deps = createFakeDeps();
    const task = await addTask(deps, "Tập thể dục");
    const updated = await toggleTask(deps, task);
    expect(updated.done).toBe(true);
    expect(deps.tasks.items.get(task.id)?.done).toBe(true);
  });
});
