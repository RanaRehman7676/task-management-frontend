import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'
import { API_TASK_ENDPOINTS } from '../../endpoints/endPoints'
import { api } from '../../instance/apiInstance'
import { AxiosError } from 'axios'
import type { 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  DeleteTaskRequest,
  Task
} from '../../types/task'

// Create Task Mutation
interface CreateTaskResponse {
  data: {
    task: Task
  }
  message: string
  code: number
  notify: boolean
}

export const useCreateTask = (): UseMutationResult<CreateTaskResponse, Error, CreateTaskRequest> => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (taskData: CreateTaskRequest) => {
      const { data } = await api.post(API_TASK_ENDPOINTS.TASK.CREATE, taskData)
      return data
    },
    onSuccess: () => {
      toast.success('Task created successfully')
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['taskListing'] })
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error?.response?.data as unknown as { message: string })?.message || error?.message || 'Failed to create task'
      toast.error(errorMessage)
    },
  })
}

// Update Task Mutation
interface UpdateTaskResponse {
  data: {
    task: Task
  }
  message: string
  code: number
  notify: boolean
}

export const useUpdateTask = (): UseMutationResult<UpdateTaskResponse, Error, UpdateTaskRequest> => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (taskData: UpdateTaskRequest) => {
      const { data } = await api.patch(API_TASK_ENDPOINTS.TASK.UPDATE, taskData)
      return data
    },
    onSuccess: () => {
      toast.success('Task updated successfully')
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['taskListing'] })
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error?.response?.data as unknown as { message: string })?.message || error?.message || 'Failed to update task'
      toast.error(errorMessage)
    },
  })
}

// Delete Task Mutation
interface DeleteTaskResponse {
  message: string
  code: number
  notify: boolean
}

export const useDeleteTask = (): UseMutationResult<DeleteTaskResponse, Error, DeleteTaskRequest> => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (taskData: DeleteTaskRequest) => {
      const { data } = await api.delete(API_TASK_ENDPOINTS.TASK.DELETE, { data: taskData })
      return data
    },
    onSuccess: () => {
      toast.success('Task deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['taskListing'] })
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error?.response?.data as unknown as { message: string })?.message || error?.message || 'Failed to delete task'
      toast.error(errorMessage)
    },
  })
}

// Get Single Task Mutation
interface GetTaskResponse {
  data: {
    task: Task
  }
  message: string
  code: number
  notify: boolean
}

interface GetTaskRequest {
  _id: string
}

export const useGetTask = (): UseMutationResult<GetTaskResponse, Error, GetTaskRequest> => {
  return useMutation({
    mutationFn: async (taskData: GetTaskRequest) => {
      const { data } = await api.get(API_TASK_ENDPOINTS.TASK.GET, { params: taskData })
      return data
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error?.response?.data as unknown as { message: string })?.message || error?.message || 'Failed to get task'
      toast.error(errorMessage)
    },
  })
}
