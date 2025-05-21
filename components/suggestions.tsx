// create a flex row suggestion list

import { FC } from 'react'
import { useServer } from '@/context/server'
import { Button } from '@/components/ui'

interface SuggestionsProps {
  onPick?: (suggestion: string) => void
}

const Suggestions: FC<SuggestionsProps> = ({ onPick }) => {
  const { config } = useServer()
  return (
    config.suggestions && config.suggestions.length > 0 && (
      <div className='suggestions flex flex-row mb-1 gap-1'>
        {config.suggestions?.map((suggestion) => (
          <Button
            variant='outline'
            key={suggestion.text}
            className='suggestion-button text-xs h-6 font-normal'
            onClick={() => {
              onPick?.(suggestion.text)
            }}>
            {suggestion.text}
          </Button>
        ))}
      </div>
    )
  )
}

export default Suggestions