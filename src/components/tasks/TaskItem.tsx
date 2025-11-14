import { useEffect, useState } from "react";
import TaskModal from "@/components/tasks/TaskModal";
import type { Task } from "@/types/task";

type Props = {
  task: Task;
  isMutating: boolean;
  onToggleState: (taskId: number, nextState: boolean) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
  onEdit: (
    taskId: number,
    payload: { title: string; detail: string | null },
  ) => Promise<void>;
};

const TaskItem = ({ task, isMutating, onToggleState, onDelete, onEdit }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [detail, setDetail] = useState(task.detail ?? "");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTitle(task.title);
    setDetail(task.detail ?? "");
  }, [task.title, task.detail]);

  const statusClasses = task.state
    ? "border-emerald-400/40 text-emerald-200 bg-emerald-500/10"
    : "border-amber-400/40 text-amber-200 bg-amber-500/10";

  const handleSave = async () => {
    if (!title.trim()) {
      setLocalError("タイトルを入力してください");
      return;
    }

    try {
      setLocalError(null);
      await onEdit(task.id, {
        title: title.trim(),
        detail: detail.trim() ? detail.trim() : null,
      });
      setIsEditing(false);
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "更新に失敗しました",
      );
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLocalError(null);
    setTitle(task.title);
    setDetail(task.detail ?? "");
  };

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition hover:-translate-y-1 hover:border-white/30">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-400">
              タイトル
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-2 text-white outline-none focus:border-white/40"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={isMutating}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-400">
              詳細
            </label>
            <textarea
              className="mt-1 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-2 text-white outline-none focus:border-white/40"
              rows={3}
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
              disabled={isMutating}
            />
          </div>
          {localError && (
            <p className="text-sm text-rose-300" role="alert">
              {localError}
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 disabled:opacity-60 sm:flex-1"
              disabled={isMutating}
            >
              保存
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex w-full items-center justify-center rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-white/30 disabled:opacity-60 sm:flex-1"
              disabled={isMutating}
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="min-w-0 flex-1 space-y-3 text-left"
          >
            <p
              className="text-lg font-semibold leading-tight text-white"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}
            >
              {task.title}
            </p>
            {task.detail && (
              <p
                className="text-sm text-slate-400"
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                {task.detail}
              </p>
            )}
            <p className="text-xs uppercase tracking-wide text-slate-500">
              追加: {new Date(task.createdAt).toLocaleString()}
            </p>
          </button>
          <div className="flex flex-col items-end gap-3">
            <button
              type="button"
              onClick={() => onToggleState(task.id, !task.state)}
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition ${statusClasses} ${
                isMutating ? "opacity-60" : ""
              }`}
              disabled={isMutating}
            >
              {task.state ? "Mark Todo" : "Mark Done"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs text-slate-300 transition hover:text-white disabled:opacity-60"
              disabled={isMutating}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(task.id)}
              className="text-xs text-rose-300 transition hover:text-rose-200 disabled:opacity-60"
              disabled={isMutating}
            >
              Delete
            </button>
          </div>
        </div>
      )}
      {isModalOpen && (
        <TaskModal
          task={task}
          onClose={() => setIsModalOpen(false)}
          onEditClick={() => {
            setIsModalOpen(false);
            setIsEditing(true);
          }}
        />
      )}
    </li>
  );
};

export default TaskItem;
