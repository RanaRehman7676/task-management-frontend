//disable eslint

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react'
import { useGetUser } from '../features/mutations/authMutation'
import { queryClient } from '../lib/queryClient'
export interface User {
  name: string,
  email: string,
  id: string,
  createdAt?: string,
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => void
  refetchUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { mutate: getUser, isPending } = useGetUser()

  const refetchUser = useCallback(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken')
    if (token) {
      // First, try to get user from localStorage (if available)
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setIsLoading(false)
        } catch (error) {
          console.error('Error parsing stored user data:', error)
        }
      }
      
      // Then fetch fresh user data from API
      getUser(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {} as any,
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSuccess: (data: any) => {
            const userData = data?.data?.userObject
            
            if (!userData) {
              // No user data found, logout
              localStorage.removeItem('token')
              localStorage.removeItem('authToken')
              localStorage.removeItem('user')
              setUser(null)
              setIsLoading(false)
              return
            }
            
            setUser(userData)
            setIsLoading(false)
          },
          onError: () => {
            setUser(null)
            setIsLoading(false)
            localStorage.removeItem('token')
            localStorage.removeItem('authToken')
            localStorage.removeItem('user')
          },
        }
      )
    } else {
      setUser(null)
      setIsLoading(false)
    }
  }, [getUser])

  useEffect(() => {
    refetchUser()
  }, [refetchUser])

  const logout = () => {
    // Clear TanStack Query cache
    queryClient.clear()
    
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    
    // Clear user state
    setUser(null)
  }

  const value = {
    user,
    setUser,
    isLoading: isLoading || isPending,
    isAuthenticated: !!user,
    logout,
    refetchUser,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

/* eslint-disable */
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
