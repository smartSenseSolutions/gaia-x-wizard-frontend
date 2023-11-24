import React, { useEffect, useState } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { ApiStatus, INITIAL_USER_CONFIG } from '@wizard/utils/constants'
import { AppLoader } from '@wizard/components'
import { UserConfig } from '@wizard/models/check-config.model'
import { getConfigAPI } from '@wizard/api/onboard.api'
import { setBrowserSession } from '@wizard/utils/helpers'

export interface AuthContextType {
  isLoggedIn: boolean | undefined
  userConfig: UserConfig
  setConfig: (user: UserConfig) => void
}

const initialContextType: AuthContextType = {
  isLoggedIn: false,
  userConfig: INITIAL_USER_CONFIG,
  setConfig: () => {
    throw console.error('the function is not implemented yet')
  },
}

export const AuthContext =
  React.createContext<AuthContextType>(initialContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { keycloak } = useKeycloak()
  const isLoggedIn = keycloak.authenticated

  const [apiStatus, setApiStatus] = useState<ApiStatus>(ApiStatus.Pending)
  const [userConfig, setUserConfig] = useState<UserConfig>(INITIAL_USER_CONFIG)

  const fetchAndSetUserConfig = () => {
    try {
      getConfigAPI()
        .then((resp) => {
          setUserConfig(resp.payload)
          setApiStatus(ApiStatus.Success)
        })
        .catch(() => {
          // console.log(err)
        })
    } catch (e) {
      setApiStatus(ApiStatus.Failure)
    }
  }
  useEffect(() => {
    if (isLoggedIn && keycloak.token) {
      setApiStatus(ApiStatus.InProgress)
      setBrowserSession(keycloak.token)
      fetchAndSetUserConfig()
    } else {
      setApiStatus(ApiStatus.Success)
    }
  }, [])

  const setConfig = (user: UserConfig): void => {
    setUserConfig(user)
  }

  const defaultValue = {
    isLoggedIn,
    userConfig,
    setConfig,
  }
  return (
    <AuthContext.Provider value={defaultValue}>
      {apiStatus == ApiStatus.Success ? children : <AppLoader />}
    </AuthContext.Provider>
  )
}
