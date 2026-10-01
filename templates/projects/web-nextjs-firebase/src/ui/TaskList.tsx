"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getDeps } from "@/composition";
import { InvalidTaskError, type Task } from "@/domain/task";
import { addTask } from "@/services/addTask";
import { listMyTasks } from "@/services/listMyTasks";
import { toggleTask } from "@/services/toggleTask";

// Giao diện chỉ gọi services/ — không gọi Firebase, không chứa quy tắc nghiệp vụ.
export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyTasks(getDeps())
      .then(setTasks)
      .catch(() => setError("Không tải được danh sách. Thử tải lại trang."))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      const task = await addTask(getDeps(), title);
      setTasks((current) => [task, ...current]);
      setTitle("");
    } catch (e) {
      setError(e instanceof InvalidTaskError ? e.message : "Không lưu được. Thử lại sau.");
    }
  }

  async function handleToggle(task: Task) {
    setError(null);
    try {
      const updated = await toggleTask(getDeps(), task);
      setTasks((current) => current.map((t) => (t.id === updated.id ? updated : t)));
    } catch {
      setError("Không cập nhật được. Thử lại sau.");
    }
  }

  return (
    <section className="card">
      <form onSubmit={handleAdd} className="row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Thêm việc cần làm..."
          aria-label="Tên việc"
        />
        <button type="submit">Thêm</button>
      </form>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Đang tải...</p>
      ) : tasks.length === 0 ? (
        <p className="muted">Chưa có việc nào.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <label className={task.done ? "done" : undefined}>
                <input type="checkbox" checked={task.done} onChange={() => handleToggle(task)} />
                {task.title}
              </label>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
