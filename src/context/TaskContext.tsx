import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { TaskMapped } from '../types/task.ts';
import { useAllTasks } from '../features/queries/taskQueries';
import { useCreateTask, useUpdateTask, useDeleteTask } from '../features/mutations/taskMutation';
import { mapTaskToBackend, mapTasksToFrontend, flattenTasksByStatus } from '../utils/taskMapper';

interface TaskContextType {
  tasks: TaskMapped[];
  isLoading: boolean;
  error: Error | null;
  addTask: (task: Omit<TaskMapped, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<TaskMapped>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  editingTask: TaskMapped | null;
  setEditingTask: (task: TaskMapped | null) => void;
  refetchTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  // API hooks
  const { data: tasksData, isLoading, error, refetch: refetchTasks } = useAllTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  // Local state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskMapped | null>(null);

  // Map backend tasks to frontend format
  const tasks = tasksData?.data ? mapTasksToFrontend(flattenTasksByStatus(tasksData.data)) : [];
  const addTask = async (taskData: Omit<TaskMapped, 'id' | 'createdAt' | 'updatedAt'>) => {
    const backendTask = mapTaskToBackend(taskData);
    await createTaskMutation.mutateAsync({
      title: backendTask.title!,
      description: backendTask.description!,
      due_date: backendTask.due_date!,
      status: backendTask.status || 'Pending'
    });
  };

  const updateTask = async (id: string, updates: Partial<TaskMapped>) => {
    const backendUpdates = mapTaskToBackend(updates);
    await updateTaskMutation.mutateAsync({
      id: id,
      ...backendUpdates
    });
  };

  const deleteTask = async (id: string) => {
    await deleteTaskMutation.mutateAsync({ id: id });
  };

  const value: TaskContextType = {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    isModalVisible,
    setIsModalVisible,
    editingTask,
    setEditingTask,
    refetchTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
