import type { Task } from "@/types/task";
import TaskItem from "@/components/tasks/TaskItem";

type Props = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  mutatingId: number | null;
  onToggleState: (taskId: number, nextState: boolean) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
  onEdit: (
    taskId: number,
    payload: { title: string; detail: string | null },
  ) => Promise<void>;
};

const TaskList = ({
  tasks,
  isLoading,
  error,
  mutatingId,
  onToggleState,
  onDelete,
  onEdit,
}: Props) => {
  const renderStateMessage = (message: string, role?: "status" | "alert") => (
    <section className="w-full rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-7">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            タスク一覧
          </p>
          <h2 className="text-2xl font-semibold">Task Overview</h2>
        </div>
      </div>
      <div
        className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-center text-sm text-slate-400 sm:px-6 sm:py-8"
        role={role}
      >
        {message}
      </div>
    </section>
  );

  if (isLoading) {
    return renderStateMessage("Loading tasks...", "status");
  }

  if (error) {
    return renderStateMessage(`Failed to load tasks: ${error}`, "alert");
  }

  if (!tasks.length) {
    return renderStateMessage("まだタスクがありません。最初のタスクを追加しましょう。");
  }

  return (
    <section className="w-full rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-7">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            タスク一覧
          </p>
          <h2 className="text-2xl font-semibold">Task Overview</h2>
        </div>
        <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm font-semibold text-slate-300">
          {tasks.length} tasks
        </span>
      </header>
      <ul className="flex flex-col gap-4">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isMutating={mutatingId === task.id}
            onToggleState={onToggleState}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </ul>
    </section>
  );
};

export default TaskList;
