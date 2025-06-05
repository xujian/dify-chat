'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useDispatch } from 'react-redux'
import cookie from 'js-cookie'
import { setVariable, setVariablesFullfilled } from '@/store/session'
import { useSearchParams } from 'next/navigation'
import { useServer } from '@/context/server'
import { Variable } from '@/models'

interface VariablesContextType {
  variables: Variable[]
  setVariables: React.Dispatch<React.SetStateAction<Variable[]>>
}

const VariablesContext = createContext<VariablesContextType | undefined>(undefined)

export const VariablesProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const server = useServer()
  const [variables, setVariables] = useState<Variable[]>([])

  useEffect(() => {
    // merge value from query string to state variables
    if (!server.config.variables) return
    setVariables([...server.config.variables])
    searchParams.forEach((value, name) => {
      const variable = server.config.variables.find(v => v.name === name)
      if (variable) {
        variable.value = `${value}`
        variable.origin = 'url'
        const index = server.config.variables.findIndex(v => v.name === name)
        if (index !== -1) {
          console.log('index', index, variable)
          const newVariables = [
            ...server.config.variables.slice(0, index),
            variable,
            ...server.config.variables.slice(index + 1)
          ]
          console.log('newVariables', newVariables)
          setVariables(newVariables)
        }
      } else {
        // param not in server.config.variables
        cookie.set(name, value)
        setVariables([...server.config.variables, { name, value, type: 'text', origin: 'url' }])
        dispatch(setVariable({ name, value }))
      }
      dispatch(setVariable({ name, value }))
    })
    // all the variables required are filled
    dispatch(setVariablesFullfilled(
      variables.filter(v => v.required)
        .every(v => !!v.value)
    ))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, server.config.variables])

  return (
    <VariablesContext.Provider value={{ variables, setVariables }}>
      {children}
    </VariablesContext.Provider>
  )
}

export const useVariables = () => {
  const ctx = useContext(VariablesContext)
  if (!ctx) throw new Error('useVariablesContext must be used within a VariablesProvider')
  return ctx
}
