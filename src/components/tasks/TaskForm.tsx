import { useState } from "react";

type Props = {
  onSubmit: (payload: { title: string; detail?: string }) => Promise<void>;
  isSubmitting: boolean;
  onClose: () => void;
};

const TaskForm = ({ onSubmit, isSubmitting, onClose }: Props) => {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setLocalError("タイトルを入力してください");
      return;
    }

    try {
      setLocalError(null);
      await onSubmit({
        title: title.trim(),
        detail: detail.trim() ? detail.trim() : undefined,
      });
      setTitle("");
      setDetail("");
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "タスクの作成に失敗しました",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-slate-900/60 p-7 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
    >
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          新規タスク
        </p>
        <h2 className="text-2xl font-semibold">Add Task</h2>
        <p className="text-sm text-slate-400">
          目標を細分化して一歩ずつ進行を積み重ねましょう。
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-left">
          <label className="block text-sm text-slate-300">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none transition focus:border-white/40"
            placeholder="例: 仕様書レビュー"
            disabled={isSubmitting}
          />
        </div>
        <div className="text-left">
          <label className="block text-sm text-slate-300">詳細</label>
          <textarea
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none transition focus:border-white/40"
            placeholder="補足情報や気づきをメモ"
            rows={3}
            disabled={isSubmitting}
          />
        </div>
        {localError && (
          <p className="text-sm text-red-400" role="alert">
            {localError}
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            className="inline-flex flex-1 items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-3 font-semibold text-white transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "タスクを追加"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:border-white/40"
            disabled={isSubmitting}
          >
            キャンセル
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
