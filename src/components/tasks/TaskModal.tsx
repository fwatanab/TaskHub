import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Task } from "@/types/task";

type Props = {
  task: Task;
  onClose: () => void;
  onEditClick: () => void;
};

const TaskModal = ({ task, onClose, onEditClick }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, mounted]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div
        ref={ref}
        className="max-h-[90vh] w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl"
      >
        <div className="mb-4">
          <h2 className="max-h-32 overflow-auto text-xl font-semibold text-white break-words">
            {task.title}
          </h2>
        </div>
        <div className="flex max-h-[60vh] flex-col gap-4 overflow-auto pr-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              詳細
            </p>
            <p
              className="text-sm text-slate-200"
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}
            >
              {task.detail || "詳細は未入力です。"}
            </p>
          </div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            追加: {new Date(task.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onEditClick}
            className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
          >
            編集する
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-white/30"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default TaskModal;
