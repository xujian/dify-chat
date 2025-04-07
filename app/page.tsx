import type { FC } from 'react'
import React from 'react'

import type { AppProps } from './app'
import App from './app'
import { StoreProvider } from './store/index'
const Page: FC<AppProps> = ({
  params,
}: any) => {
  return (
    <StoreProvider>
      <App params={params} />
    </StoreProvider>
  )
}

export default React.memo(Page)
