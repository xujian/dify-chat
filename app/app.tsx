/* eslint-disable @typescript-eslint/no-use-before-define */
'use client'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useBoolean } from 'ahooks'
import Header from '@/components/header'
import { Messages } from '@/components/chat'
import { setLocaleOnClient } from '@/i18n/client'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import AppUnavailable from '@/components/app-unavailable'
import { API_KEY, APP_ID, APP_INFO } from '@/config'
import { SidebarInset, SidebarProvider } from '../components/ui/sidebar'
import { AppSidebar } from '../components/app-sidebar'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store/index'
import { fetchServerConfig } from './store/server'
import Welcome from '../components/welcome'
import { initSession } from './store/session'
export type AppProps = {
  params: any
}

const App: FC<AppProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const session = useSelector((state: RootState) => state.session)
  const serverConfig = useSelector((state: RootState) => state.server)
  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile
  const hasSetAppConfig = APP_ID && API_KEY

  const [appUnavailable, setAppUnavailable] = useState<boolean>(false)
  const [isUnknownReason, setIsUnknownReason] = useState<boolean>(false)
  const [inited, setInited] = useState<boolean>(false)
  const [isShowSidebar, { setTrue: showSidebar, setFalse: hideSidebar }] = useBoolean(false)

  useEffect(() => {
    dispatch(initSession())
    console.log('init===serverConfig 1', serverConfig)
    if (!hasSetAppConfig) {
      setAppUnavailable(true)
      return
    }
    try {
      if (!inited) {
        dispatch(fetchServerConfig())
      }
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
  }, [])

  if (appUnavailable)
    return <AppUnavailable isUnknownReason={isUnknownReason} errMessage={!hasSetAppConfig
      ? 'Please set APP_ID and API_KEY in config/index.tsx'
      : ''} />

  if (!APP_ID || !APP_INFO)
    return <div>APP_ID/APP_INFO not set</div>

  return (
    <SidebarProvider>
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
              session.chatStarted
                ? (<Messages />)
                : (<Welcome />)
            }
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default React.memo(App)
