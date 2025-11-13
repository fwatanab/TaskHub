import { useCallback, useEffect, useState } from "react";
import type { Task } from "@/types/task";

type CreatePayload = {
  title: string;
  detail?: string;
};

type UpdatePayload = {
  title?: string;
  detail?: string | null;
  state?: boolean;
};

const serializeError = async (res: Response) => {
  try {
    const body = await res.json();
    return body?.message ?? res.statusText;
  } catch {
    return res.statusText;
  }
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [mutatingId, setMutatingId] = useState<number | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/tasks");
      if (!res.ok) {
        throw new Error(await serializeError(res));
      }
      const data = (await res.json()) as Task[];
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(
    async (payload: CreatePayload) => {
      try {
        setIsCreating(true);
        setError(null);
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(await serializeError(res));
        }

        const task = (await res.json()) as Task;
        setTasks((prev) => [task, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create task");
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [],
  );

  const updateTask = useCallback(
    async (taskId: number, payload: UpdatePayload) => {
      try {
        setMutatingId(taskId);
        setError(null);
        const res = await fetch(`/api/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(await serializeError(res));
        }

        const updated = (await res.json()) as Task;
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updated : task)),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update task");
        throw err;
      } finally {
        setMutatingId(null);
      }
    },
    [],
  );

  const deleteTask = useCallback(async (taskId: number) => {
    try {
      setMutatingId(taskId);
      setError(null);
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(await serializeError(res));
      }

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
      throw err;
    } finally {
      setMutatingId(null);
    }
  }, []);

  return {
    tasks,
    isLoading,
    error,
    isCreating,
    mutatingId,
    refresh: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};

