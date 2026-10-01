// Test tích hợp: các việc của app (services) chạy qua lớp data/ thật (Firestore)
// trên Firebase Emulator, CÓ bật luật bảo mật — bắt lỗi mà unit test với dữ liệu giả không thấy
// (ghi sai kiểu dữ liệu, luật chặn nhầm, truy vấn sai).
// Chạy bằng `npm run test:emulator`.
import { readFileSync } from "node:fs";
import { initializeTestEnvironment, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import type { Firestore } from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { FirestoreTaskRepository } from "@/data/firestoreTaskRepository";
import { InvalidTaskError } from "@/domain/task";
import { addTask } from "@/services/addTask";
import { listMyTasks } from "@/services/listMyTasks";
import type { AppDeps } from "@/services/ports";
import { FakeAuthGateway } from "@/services/testing/fakeDeps";
import { toggleTask } from "@/services/toggleTask";

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-khung-du-an",
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
  });
});
afterAll(() => env.cleanup());
beforeEach(() => env.clearFirestore());

// Deps thật cho một người dùng: repository Firestore thật, đăng nhập giả với đúng uid đó.
function depsFor(uid: string, now = 1000): AppDeps {
  const db = env.authenticatedContext(uid).firestore() as unknown as Firestore;
  return { tasks: new FirestoreTaskRepository(db), auth: new FakeAuthGateway(uid), now: () => now };
}

describe("việc cần làm — qua Firestore thật", () => {
  it("thêm việc rồi lấy lại được, đúng nội dung", async () => {
    const alice = depsFor("alice", 500);
    const added = await addTask(alice, "  Mua sữa ");
    const tasks = await listMyTasks(alice);
    expect(tasks).toEqual([{ id: added.id, ownerId: "alice", title: "Mua sữa", done: false, createdAt: 500 }]);
  });

  it("đánh dấu xong được lưu lại", async () => {
    const alice = depsFor("alice");
    const task = await addTask(alice, "Tập thể dục");
    await toggleTask(alice, task);
    expect((await listMyTasks(alice))[0].done).toBe(true);
  });

  it("mỗi người chỉ thấy việc của mình", async () => {
    await addTask(depsFor("alice"), "Của Alice");
    await addTask(depsFor("bob"), "Của Bob");
    expect((await listMyTasks(depsFor("bob"))).map((t) => t.title)).toEqual(["Của Bob"]);
  });

  it("không đánh dấu được việc của người khác", async () => {
    const task = await addTask(depsFor("alice"), "Của Alice");
    await expect(toggleTask(depsFor("bob"), task)).rejects.toThrow();
    expect((await listMyTasks(depsFor("alice")))[0].done).toBe(false);
  });

  it("tên rỗng thì không ghi gì vào kho dữ liệu", async () => {
    const alice = depsFor("alice");
    await expect(addTask(alice, "   ")).rejects.toThrow(InvalidTaskError);
    expect(await listMyTasks(alice)).toEqual([]);
  });
});
