import type { Variable } from '@/models'

export function replaceVarWithValues(
  str: string,
  variables: Variable[],
  inputs: Record<string, any>
) {
  return str.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const name = inputs[key]
    if (name)
      return name

    const valueObj: Variable | undefined =
      variables.find(v => v.key === key)
    return valueObj ? `{{${valueObj.key}}}` : match
  })
}
