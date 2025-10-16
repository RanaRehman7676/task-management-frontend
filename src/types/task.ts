export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  due_date: string;
  user_id: string;
  createdAt: string;
  updatedAt: string;
}

// For frontend compatibility, we'll also have a mapped version
export interface TaskMapped {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskColumn {
  id: string;
  title: string;
  status: TaskMapped['status'];
  tasks: TaskMapped[];
}

export type TaskStatus = TaskMapped['status'];

// API Request/Response interfaces
export interface CreateTaskRequest {
  title: string;
  description: string;
  due_date: string;
  status?: 'Pending' | 'In Progress' | 'Completed';
}

export interface UpdateTaskRequest {
  id: string;
  title?: string;
  description?: string;
  due_date?: string;
  status?: 'Pending' | 'In Progress' | 'Completed';
}

export interface GetTaskRequest {
  _id: string;
}

export interface DeleteTaskRequest {
  id: string;
}

export interface TaskListingRequest {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface TaskListingResponse {
  data: {
    pending: Task[];
    inProgress: Task[];
    completed: Task[];
    cancelled: Task[];
  };
  message: string;
  code: number;
  notify: boolean;
}