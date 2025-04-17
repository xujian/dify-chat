'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { fetchAppParams } from '@/service'
import { ServerConfig } from '@/models'

export interface ServerContextType {
  config: ServerConfig
  fetched: boolean
  error: string | null
}

const initialContext: ServerContextType = {
  config: {
    openingStatement: '',
    upload: { enabled: true },
    variables: [],
  },
  fetched: false,
  error: null,
}

const ServerContext = createContext<ServerContextType | undefined>(void 0)

export function ServerProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ServerConfig>(initialContext.config)
  const [fetched, setFetched] = useState<boolean>(initialContext.fetched)
  const [error, setError] = useState<string | null>(initialContext.error)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const serverConfig = await fetchAppParams()
        setConfig(serverConfig)
      } catch (err) {
        console.error('Failed to load app params', err)
        setError('Failed to load configuration')
        setConfig(initialContext.config)
      } finally {
        setFetched(true)
      }
    }
    loadConfig()
  }, [])

  return (
    <ServerContext.Provider value={{ config, fetched, error }}>
      {children}
    </ServerContext.Provider>
  )
}

export const useServer = () => {
  const context = useContext(ServerContext)
  if (!context) {
    throw new Error('useServer must be used within a ServerProvider')
  }
  return context
}