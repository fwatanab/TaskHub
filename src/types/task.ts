export type Task = {
  id: number;
  userId: number;
  title: string;
  detail: string | null;
  state: boolean;
  createdAt: string;
  updatedAt: string;
};

