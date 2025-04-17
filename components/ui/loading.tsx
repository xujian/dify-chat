

// create a loading component
// it should be a full screen component
// it should have a loading spinner

import { FC } from 'react'

interface LoadingProps {
  message?: string
}

const Loading: FC<LoadingProps> = ({ message }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="loader flex items-center justify-center">
        <div className="animate-spin ease-linear rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
      </div>
    </div>
  )
}

export default Loading
