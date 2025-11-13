import { prisma } from "@/lib/prisma";
import type { Task } from "@/types/task";

type CreateTaskInput = {
  title: string;
  detail?: string | null;
  state?: boolean;
};

type UpdateTaskInput = {
  title?: string;
  detail?: string | null;
  state?: boolean;
};

const serializeTask = (task: {
  createdAt: Date;
  updatedAt: Date;
  detail: string | null;
} & Omit<Task, "createdAt" | "updatedAt" | "detail">): Task => ({
  ...task,
  detail: task.detail ?? null,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
});

const assertOwnership = async (userId: number, taskId: number) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};

export const taskService = {
  async list(userId: number): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return tasks.map(serializeTask);
  },

  async create(userId: number, data: CreateTaskInput): Promise<Task> {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        detail: data.detail ?? null,
        state: data.state ?? false,
        userId,
      },
    });

    return serializeTask(task);
  },

  async update(
    userId: number,
    taskId: number,
    data: UpdateTaskInput,
  ): Promise<Task> {
    await assertOwnership(userId, taskId);

    const updateData: {
      title?: string;
      detail?: string | null;
      state?: boolean;
    } = {};

    if (data.title !== undefined) {
      updateData.title = data.title;
    }
    if (data.detail !== undefined) {
      updateData.detail = data.detail ?? null;
    }
    if (data.state !== undefined) {
      updateData.state = data.state;
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    return serializeTask(task);
  },

  async remove(userId: number, taskId: number): Promise<void> {
    await assertOwnership(userId, taskId);
    await prisma.task.delete({ where: { id: taskId } });
  },
};
