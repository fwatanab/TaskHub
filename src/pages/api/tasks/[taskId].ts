import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { taskService } from "@/lib/taskService";
import type { Task } from "@/types/task";

type Data = Task | { message: string };

const parseTaskId = (value: string | string[] | undefined): number | null => {
  if (!value) return null;
  const id = Array.isArray(value) ? Number(value[0]) : Number(value);
  return Number.isNaN(id) ? null : id;
};

const normalizeDetail = (detail: unknown) => {
  if (detail === null) return null;
  if (typeof detail === "string") return detail;
  return undefined;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = Number(session.user.id);
  const taskId = parseTaskId(req.query.taskId);

  if (Number.isNaN(userId) || !taskId) {
    return res.status(400).json({ message: "Invalid task id" });
  }

  if (req.method === "PATCH") {
    try {
      const { title, detail, state } = req.body ?? {};
      const hasUpdates =
        title !== undefined || detail !== undefined || state !== undefined;

      if (!hasUpdates) {
        return res.status(400).json({ message: "No update fields provided" });
      }

      const task = await taskService.update(userId, taskId, {
        title: typeof title === "string" ? title : undefined,
        detail: normalizeDetail(detail),
        state: typeof state === "boolean" ? state : undefined,
      });

      return res.status(200).json(task);
    } catch (error) {
      if (error instanceof Error && error.message === "Task not found") {
        return res.status(404).json({ message: "Task not found" });
      }
      console.error("[PATCH /api/tasks/:id]", error);
      return res.status(500).json({ message: "Failed to update task" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await taskService.remove(userId, taskId);
      return res.status(204).end();
    } catch (error) {
      if (error instanceof Error && error.message === "Task not found") {
        return res.status(404).json({ message: "Task not found" });
      }
      console.error("[DELETE /api/tasks/:id]", error);
      return res.status(500).json({ message: "Failed to delete task" });
    }
  }

  res.setHeader("Allow", ["PATCH", "DELETE"]);
  return res.status(405).json({ message: "Method Not Allowed" });
}

