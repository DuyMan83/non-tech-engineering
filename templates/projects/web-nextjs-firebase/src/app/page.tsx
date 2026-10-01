import { TaskList } from "@/ui/TaskList";

// Trang mỏng: chỉ ghép component từ ui/.
export default function HomePage() {
  return (
    <main>
      <h1>Việc cần làm</h1>
      <TaskList />
    </main>
  );
}
