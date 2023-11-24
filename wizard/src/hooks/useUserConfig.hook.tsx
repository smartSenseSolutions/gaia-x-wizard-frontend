import { useContext } from 'react'
import { UserConfig } from '@wizard/models/check-config.model'
import { AuthContext } from '@wizard/contexts/AuthContext'

export const useUserConfig = (): UserConfig => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useUserConfig used outside AuthContext')
  }

  return context?.userConfig
}
