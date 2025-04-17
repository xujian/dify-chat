import type { FC } from 'react'
import React from 'react'

import type { AppProps } from './app'
import App from './app'
import { StoreProvider } from './store/index'
import { ServerProvider } from '@/context/server'

const Page: FC<AppProps> = ({
  params,
}: any) => {
  return (
    <ServerProvider>
      <StoreProvider>
        <App params={params} />
      </StoreProvider>
    </ServerProvider>
  )
}

export default React.memo(Page)
