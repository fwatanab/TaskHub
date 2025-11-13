import { useState } from "react";
import TaskForm from "@/components/tasks/TaskForm";
import TaskList from "@/components/tasks/TaskList";
import InlineCreateButton from "@/components/tasks/InlineCreateButton";
import { useTasks } from "@/hooks/useTasks";

const TaskBoard = () => {
  const {
    tasks,
    isLoading,
    error,
    isCreating,
    mutatingId,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleToggleState = (taskId: number, nextState: boolean) =>
    updateTask(taskId, { state: nextState });
  const handleEdit = (
    taskId: number,
    payload: { title: string; detail: string | null },
  ) => updateTask(taskId, payload);
  const handleFormSubmit = async (payload: { title: string; detail?: string }) => {
    await createTask(payload);
    setIsFormOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <InlineCreateButton onClick={() => setIsFormOpen(true)} />
      </div>
      {isFormOpen && (
        <TaskForm
          onSubmit={handleFormSubmit}
          isSubmitting={isCreating}
          onClose={() => setIsFormOpen(false)}
        />
      )}
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        error={error}
        mutatingId={mutatingId}
        onToggleState={handleToggleState}
        onDelete={deleteTask}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default TaskBoard;
