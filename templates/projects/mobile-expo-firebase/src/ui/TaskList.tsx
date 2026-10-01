import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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
      .catch(() => setError("Không tải được danh sách. Thử mở lại app."))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd() {
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
    <View style={styles.card}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleAdd}
          placeholder="Thêm việc cần làm..."
          accessibilityLabel="Tên việc"
          returnKeyType="done"
        />
        <Pressable style={styles.button} onPress={handleAdd} accessibilityRole="button">
          <Text style={styles.buttonText}>Thêm</Text>
        </Pressable>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {loading ? (
        <ActivityIndicator style={styles.spacer} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(t) => t.id}
          ListEmptyComponent={<Text style={styles.muted}>Chưa có việc nào.</Text>}
          renderItem={({ item }) => (
            <Pressable
              style={styles.item}
              onPress={() => handleToggle(item)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.done }}
            >
              <Text style={styles.check}>{item.done ? "☑" : "☐"}</Text>
              <Text style={[styles.title, item.done && styles.done]}>{item.title}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, padding: 16, gap: 12 },
  row: { flexDirection: "row", gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: "#94a3b8", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  button: { backgroundColor: "#2563eb", borderRadius: 8, paddingHorizontal: 16, justifyContent: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  item: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10 },
  check: { fontSize: 20 },
  title: { fontSize: 16 },
  done: { color: "#64748b", textDecorationLine: "line-through" },
  muted: { color: "#64748b", marginTop: 8 },
  error: { color: "#dc2626" },
  spacer: { marginTop: 16 },
});
