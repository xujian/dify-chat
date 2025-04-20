
import { useCallback, useEffect, useState } from 'react'

export const useHash = () => {
  const [hash, setHash] = useState('')

  const hashChangeHandler = useCallback(() => {
    setHash(window.location.hash.slice(1))
  }, [])

  useEffect(() => {
    if (window.location.hash) {
      setHash(window.location.hash.slice(1))
    }
    window.addEventListener('hashchange', hashChangeHandler)
    return () => {
      window.removeEventListener('hashchange', hashChangeHandler)
    };
  }, [])

  const updateHash = useCallback(
    (newHash: string) => {
      if (newHash !== hash) window.location.hash = `#${newHash}`
    },
    [hash]
  )
  return [hash, updateHash] as const
}
