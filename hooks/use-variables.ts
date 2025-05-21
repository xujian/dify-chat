// get user_id from url and set to session
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setVariable, setVariablesFullfilled } from '@/store/session'
import { useSearchParams } from 'next/navigation'
import { RootState } from '@/store'
import { useServer } from '@/context/server'
import { Variable } from '@/models'


/**
 * get user_id from url and set to session
 * @returns 
 */
export const useVariables = () => {
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const server = useServer()
  const session = useSelector((state: RootState) => state.session)
  const [variables, setVariables] = useState<Variable[]>(
    [...server.config.variables]
  )

  useEffect(() => {
    searchParams.forEach((value, name) => {
      const variable = variables.find(v => v.name === name)
      if (variable) {
        variable.value = value
        variable.origin = 'url'
        const index = variables.findIndex(v => v.name === name)
        if (index !== -1) {
          variables.splice(index, 1, variable)
          setVariables(variables)
        }
      }
      dispatch(setVariable({ name, value }))
    })
    // When: variables are saved, or not required
    //   变量不需要设置
    // 可以开始对话了
    dispatch(setVariablesFullfilled(
      variables.filter(v => v.required)
        .every(v => !!v.value)
    ))
  }, [searchParams])

  return { variables }
}