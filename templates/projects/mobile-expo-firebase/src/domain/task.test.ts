import { describe, expect, it } from "vitest";
import { createTaskDraft, InvalidTaskError, sortForDisplay, TITLE_MAX_LENGTH, toggleDone, type Task } from "./task";

const task = (overrides: Partial<Task>): Task => ({
  id: "t1",
  ownerId: "u1",
  title: "Việc",
  done: false,
  createdAt: 0,
  ...overrides,
});

describe("createTaskDraft", () => {
  it("bỏ khoảng trắng thừa và tạo việc chưa xong", () => {
    expect(createTaskDraft("u1", "  Mua sữa  ", 100)).toEqual({
      ownerId: "u1",
      title: "Mua sữa",
      done: false,
      createdAt: 100,
    });
  });

  it("từ chối tên rỗng", () => {
    expect(() => createTaskDraft("u1", "   ", 0)).toThrow(InvalidTaskError);
  });

  it("từ chối tên quá dài", () => {
    expect(() => createTaskDraft("u1", "a".repeat(TITLE_MAX_LENGTH + 1), 0)).toThrow(InvalidTaskError);
  });
});

describe("toggleDone", () => {
  it("đảo trạng thái xong / chưa xong", () => {
    expect(toggleDone(task({ done: false })).done).toBe(true);
    expect(toggleDone(task({ done: true })).done).toBe(false);
  });
});

describe("sortForDisplay", () => {
  it("việc chưa xong trước, việc mới trước", () => {
    const sorted = sortForDisplay([
      task({ id: "old", createdAt: 1 }),
      task({ id: "done", done: true, createdAt: 9 }),
      task({ id: "new", createdAt: 5 }),
    ]);
    expect(sorted.map((t) => t.id)).toEqual(["new", "old", "done"]);
  });
});
