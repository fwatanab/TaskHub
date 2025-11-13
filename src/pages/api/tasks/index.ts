import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { taskService } from "@/lib/taskService";
import type { Task } from "@/types/task";

type Data = Task | Task[] | { message: string };

const validateTitle = (title: unknown): title is string =>
  typeof title === "string" && title.trim().length > 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = Number(session.user.id);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (req.method === "GET") {
    try {
      const tasks = await taskService.list(userId);
      return res.status(200).json(tasks);
    } catch (error) {
      console.error("[GET /api/tasks]", error);
      return res.status(500).json({ message: "Failed to fetch tasks" });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, detail, state } = req.body ?? {};

      if (!validateTitle(title)) {
        return res.status(400).json({ message: "Title is required" });
      }

      const task = await taskService.create(userId, {
        title: title.trim(),
        detail: typeof detail === "string" ? detail : undefined,
        state: typeof state === "boolean" ? state : undefined,
      });

      return res.status(201).json(task);
    } catch (error) {
      console.error("[POST /api/tasks]", error);
      return res.status(500).json({ message: "Failed to create task" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: "Method Not Allowed" });
}

