// get user_id from url and set to session
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setVariable } from '@/store/session'
import { useSearchParams } from 'next/navigation'
import { RootState } from '@/store'
import { useServer } from '@/context/server'
/**
 * get user_id from url and set to session
 * @returns 
 */
export const useVariables = () => {
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const userId = searchParams.get('user_id')
  const server = useServer()
  const [variables, setVariables] = useState<{ name: string, value: string }[]>([])
  const session = useSelector((state: RootState) => state.session)
  const
    /**
     * whether all variables are fulfilled
     */
    [variablesFullfilled, setVariablesFullfilled] = useState(false)

  useEffect(() => {
    if (userId) {
      const v = { name: 'user_id', value: userId }
      setVariables([...variables, v])
      dispatch(setVariable(v))
    }
    const savedVariables = Object.entries(session.variables || {})
      .filter(([_, value]) => !!value)
      .map(([name, value]) => ({ name, value: value as string }))
    setVariablesFullfilled(savedVariables.length === server.config.variables.length)
    setVariables(savedVariables)
  }, [userId])

  return { variables, variablesFullfilled }
}