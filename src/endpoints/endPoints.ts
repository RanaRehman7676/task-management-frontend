export const API_AUTH_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/sign-up',
    GET_USER: '/auth/me',
  },
} as const

export const API_TASK_ENDPOINTS = {
  TASK: {
    CREATE: '/task-management/task/add',
    UPDATE: '/task-management/task/update',
    GET: '/task-management/task/get',
    ALL: '/task-management/task/all',
    DELETE: '/task-management/task/remove',
  },
} as const
