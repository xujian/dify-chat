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
  const session = useSelector((state: RootState) => state.session)
  const [variables, setVariables] = useState<{ name: string, value: string }[]>(
    Object.entries(session.variables || {}).map(([k, v]) => ({ name: k, value: v as string }))
  )
  const
    /**
     * whether all variables are fulfilled
     */
    [variablesFullfilled, setVariablesFullfilled] = useState(false)

  useEffect(() => {
    console.log('===userId', userId, session.variables)
    let mergedVariables: { name: string, value: string }[] = []
    if (userId) {
      const v = { name: 'user_id', value: userId }
      mergedVariables = [...variables, v]
      setVariables(mergedVariables)
      if (!Object.keys(session.variables).includes('user_id')) {
        dispatch(setVariable(v))
      }
    }
    const savedVariables = mergedVariables
      .filter((v) => !!v.value)

    console.log('===savedVariables', savedVariables, server.config.variables, session.variables)
    // When: variables are saved, or not required
    //   变量不需要设置
    // 可以开始对话了
    setVariablesFullfilled(
      savedVariables.length >= server.config.variables
        .filter(v =>
          savedVariables.map(v => v.name).includes(v.name)
          || v.required === false
        ).length)
    setVariables(savedVariables)
  }, [session.variables])

  return { variables, variablesFullfilled }
}