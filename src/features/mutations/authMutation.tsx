import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { API_AUTH_ENDPOINTS } from '../../endpoints/endPoints'
import { api } from '../../instance/apiInstance'
import { useUser } from '../../context/AuthContext'
import { AxiosError } from 'axios'
interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  email: string
  name: string
}
interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword?: string
  retype_password?: string
}

interface RegisterResponse {
  id: string
  email: string
  name: string
}

export const useLogin = (): UseMutationResult<LoginResponse, Error, LoginCredentials> => {
  const { refetchUser } = useUser()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post(API_AUTH_ENDPOINTS.AUTH.LOGIN, credentials)
      return data
    },
    onSuccess: (data) => {
      const token = data.data?.token
      const user = data.data?.user || data.data?.userObject
      console.log(user, "user")
      
      if (token) {
        localStorage.setItem('token', token)
        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
        }
      } else {
        toast.error('Login failed: No token received')
        return
      }
      
      toast.success('Login successful')
      refetchUser()
      navigate('/task-management')
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error?.response?.data as unknown as { message: string })?.message || error?.message || 'Login failed'
      toast.error(errorMessage)
    },
  })
}
export const useRegister = (): UseMutationResult<RegisterResponse, Error, RegisterCredentials> => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const { data } = await api.post(API_AUTH_ENDPOINTS.AUTH.REGISTER, credentials)
      return data
    },
    onSuccess: () => {
      toast.success('Registration completed successfully.')
      navigate('/auth/login')
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error?.response?.data as unknown as { message: string })?.message || error?.message || 'Registration failed'
      toast.error(errorMessage)
    },
  })
}
interface GetUserResponse {
  code: number
  data: {
    userObject: {
      id: string
      name: string
      email: string
      createdAt: string
    }
  }
  message: string
  notify: boolean
}

export const useGetUser = (): UseMutationResult<GetUserResponse, Error, void> => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get(API_AUTH_ENDPOINTS.AUTH.GET_USER)
      return data
    },
  })
}