import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { API_TASK_ENDPOINTS } from '../../endpoints/endPoints'
import { api } from '../../instance/apiInstance'
import type { Task } from '../../types/task'

// Get All Tasks Query (without pagination)
interface AllTasksResponse {
  data: {
    pending: Task[]
    inProgress: Task[]
    completed: Task[]
    cancelled: Task[]
  }
  message: string
  code: number
  notify: boolean
}

export const useAllTasks = (): UseQueryResult<AllTasksResponse, Error> => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await api.get(API_TASK_ENDPOINTS.TASK.ALL)
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

