import type { Task, TaskMapped } from '../types/task'

// Map backend task format to frontend format
export const mapTaskToFrontend = (backendTask: Task): TaskMapped => {
  return {
    id: backendTask._id,
    title: backendTask.title,
    description: backendTask.description,
    status: mapStatusToFrontend(backendTask.status),
    dueDate: backendTask.due_date,
    createdAt: backendTask.createdAt,
    updatedAt: backendTask.updatedAt,
  }
}

// Map frontend task format to backend format
export const mapTaskToBackend = (frontendTask: Partial<TaskMapped>): Partial<Task> => {
  const backendTask: Partial<Task> = {}
  
  if (frontendTask.id) backendTask._id = frontendTask.id
  if (frontendTask.title) backendTask.title = frontendTask.title
  if (frontendTask.description) backendTask.description = frontendTask.description
  if (frontendTask.status) backendTask.status = mapStatusToBackend(frontendTask.status)
  if (frontendTask.dueDate) backendTask.due_date = frontendTask.dueDate
  
  return backendTask
}

// Map backend status to frontend status
export const mapStatusToFrontend = (backendStatus: Task['status']): TaskMapped['status'] => {
  switch (backendStatus) {
    case 'Pending':
      return 'todo'
    case 'In Progress':
      return 'in-progress'
    case 'Completed':
      return 'completed'
    default:
      return 'todo'
  }
}

// Map frontend status to backend status
export const mapStatusToBackend = (frontendStatus: TaskMapped['status']): Task['status'] => {
  switch (frontendStatus) {
    case 'todo':
      return 'Pending'
    case 'in-progress':
      return 'In Progress'
    case 'completed':
      return 'Completed'
    default:
      return 'Pending'
  }
}

// Map array of backend tasks to frontend format
export const mapTasksToFrontend = (backendTasks: Task[]): TaskMapped[] => {
  return backendTasks.map(mapTaskToFrontend)
}

// Helper function to flatten status-organized response into single array
export const flattenTasksByStatus = (statusOrganizedTasks: {
  pending: Task[]
  inProgress: Task[]
  completed: Task[]
  cancelled: Task[]
}): Task[] => {
  return [
    ...statusOrganizedTasks.pending,
    ...statusOrganizedTasks.inProgress,
    ...statusOrganizedTasks.completed,
    ...statusOrganizedTasks.cancelled
  ]
}
