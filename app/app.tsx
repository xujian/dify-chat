/* eslint-disable @typescript-eslint/no-use-before-define */
'use client'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useBoolean } from 'ahooks'
import { Header, Messages, AppSidebar, Welcome, AppUnavailable, Loading } from '@/components'
import { SidebarInset, SidebarProvider } from '@/components/ui'
import { setLocaleOnClient } from '@/i18n/client'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import { API_KEY, APP_ID, APP_INFO } from '@/config'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store/index'
import { initSession, setCurrentConversation } from '../store/session'
import { useServer } from '@/context/server'
import { useHash } from '@/hooks'

export type AppProps = {
  params: any
}

const App: FC<AppProps> = () => {

  const dispatch = useDispatch<AppDispatch>()
  const session = useSelector((state: RootState) => state.session)
  const [hash, setHash] = useHash()
  const server = useServer()
  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile
  const hasSetAppConfig = APP_ID && API_KEY

  const [appUnavailable, setAppUnavailable] = useState<boolean>(false)
  const [isUnknownReason, setIsUnknownReason] = useState<boolean>(false)
  const [inited, setInited] = useState<boolean>(false)
  const [isShowSidebar, { setTrue: showSidebar, setFalse: hideSidebar }] = useBoolean(false)

  useEffect(() => {
    if (hash) {
      console.log('hash', hash)
      dispatch(setCurrentConversation(hash))
    }
    dispatch(initSession())
    if (server.error) {
      setAppUnavailable(true)
      return
    }
    try {
      setLocaleOnClient(APP_INFO.defaultLanguage, true)
      setInited(true)
    }
    catch (e: any) {
      if (e.status === 404) {
        setAppUnavailable(true)
      }
      else {
        setIsUnknownReason(true)
        setAppUnavailable(true)
      }
    }
  }, [hash])

  if (appUnavailable)
    return <AppUnavailable isUnknownReason={isUnknownReason} errMessage={!hasSetAppConfig
      ? 'Please set APP_ID and API_KEY in config/index.tsx'
      : ''} />

  if (!APP_ID || !APP_INFO)
    return <div>APP_ID/APP_INFO not set</div>

  return (
    <SidebarProvider open={APP_INFO.useHistory}>
      <AppSidebar />
      <SidebarInset>
        <div className='home flex flex-col h-screen'>
          <Header
            title={APP_INFO.title}
            isMobile={isMobile}
            onShowSideBar={showSidebar}
          />
          <div className='grow flex flex-col overflow-hidden'>
            {
              server.fetched
                ? session.chatStarted
                  ? (<Messages />)
                  : (<Welcome />)
                : (
                  <div className='flex justify-center items-center h-full'>
                    <Loading />
                  </div>
                )
            }
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default React.memo(App)
