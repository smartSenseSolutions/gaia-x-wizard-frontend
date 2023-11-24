import { AuthContext } from '@wizard/contexts/AuthContext'
import { useContext } from 'react'

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth used outside AuthContext')
  }

  return context
}
