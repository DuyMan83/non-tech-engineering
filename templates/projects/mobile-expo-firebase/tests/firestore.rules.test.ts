// Test luật bảo mật Firestore. Chạy bằng `npm run test:emulator` (tự bật Firebase Emulator).
import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-khung-du-an",
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
  });
});
afterAll(() => env.cleanup());
beforeEach(() => env.clearFirestore());

const validTask = (ownerId: string) => ({ ownerId, title: "Mua sữa", done: false, createdAt: 1 });
const db = (uid: string | null) => (uid ? env.authenticatedContext(uid) : env.unauthenticatedContext()).firestore();

async function seedTask(id: string, ownerId: string) {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), "tasks", id), validTask(ownerId));
  });
}

describe("tasks", () => {
  it("chủ việc tạo được việc hợp lệ", async () => {
    await assertSucceeds(addDoc(collection(db("alice"), "tasks"), validTask("alice")));
  });

  it("không tạo việc đứng tên người khác", async () => {
    await assertFails(addDoc(collection(db("alice"), "tasks"), validTask("bob")));
  });

  it("chưa đăng nhập thì không tạo được", async () => {
    await assertFails(addDoc(collection(db(null), "tasks"), validTask("alice")));
  });

  it("từ chối việc có tên rỗng hoặc thừa trường", async () => {
    await assertFails(addDoc(collection(db("alice"), "tasks"), { ...validTask("alice"), title: "" }));
    await assertFails(addDoc(collection(db("alice"), "tasks"), { ...validTask("alice"), extra: 1 }));
  });

  it("chỉ chủ việc đọc được", async () => {
    await seedTask("t1", "alice");
    await assertSucceeds(getDoc(doc(db("alice"), "tasks", "t1")));
    await assertFails(getDoc(doc(db("bob"), "tasks", "t1")));
  });

  it("lấy danh sách việc của mình được, của người khác thì không", async () => {
    await seedTask("t1", "alice");
    await assertSucceeds(getDocs(query(collection(db("alice"), "tasks"), where("ownerId", "==", "alice"))));
    await assertFails(getDocs(query(collection(db("bob"), "tasks"), where("ownerId", "==", "alice"))));
  });

  it("chủ việc đánh dấu xong được, nhưng không đổi được chủ", async () => {
    await seedTask("t1", "alice");
    await assertSucceeds(updateDoc(doc(db("alice"), "tasks", "t1"), { done: true }));
    await assertFails(updateDoc(doc(db("alice"), "tasks", "t1"), { ownerId: "bob" }));
    await assertFails(updateDoc(doc(db("bob"), "tasks", "t1"), { done: true }));
  });

  it("collection khác bị chặn hết", async () => {
    await assertFails(setDoc(doc(db("alice"), "other", "x"), { a: 1 }));
  });
});
