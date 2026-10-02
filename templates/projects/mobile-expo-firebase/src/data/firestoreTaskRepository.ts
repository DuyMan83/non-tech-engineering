import { addDoc, collection, doc, getDocs, query, updateDoc, where, type Firestore } from "firebase/firestore";
import type { Task, TaskDraft } from "@/domain/task";
import type { TaskRepository } from "@/services/ports";

const COLLECTION = "tasks"; // luật bảo mật: firestore.rules, match /tasks/{taskId}

export class FirestoreTaskRepository implements TaskRepository {
  constructor(private readonly db: Firestore) {}

  async add(draft: TaskDraft): Promise<Task> {
    const ref = await addDoc(collection(this.db, COLLECTION), draft);
    return { ...draft, id: ref.id };
  }

  async listByOwner(ownerId: string): Promise<Task[]> {
    const snapshot = await getDocs(query(collection(this.db, COLLECTION), where("ownerId", "==", ownerId)));
    return snapshot.docs.map((d) => ({ ...(d.data() as TaskDraft), id: d.id }));
  }

  async setDone(taskId: string, done: boolean): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, taskId), { done });
  }
}
