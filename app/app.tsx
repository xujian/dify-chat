/* eslint-disable @typescript-eslint/no-use-before-define */
'use client'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { setAutoFreeze } from 'immer'
import { useBoolean } from 'ahooks'
import Header from '@/app/components/header'
import type { PromptConfig, VisionSettings } from '@/types/app'
import { Resolution, TransferMethod } from '@/types/app'
import { Messages } from '@/app/components/chat'
import { setLocaleOnClient } from '@/i18n/client'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import Loading from '@/app/components/base/loading'
import AppUnavailable from '@/app/components/app-unavailable'
import { API_KEY, APP_ID, APP_INFO } from '@/config'
import { SidebarInset, SidebarProvider } from './components/ui/sidebar'
import { AppSidebar } from './components/app-sidebar'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store/index'
import { fetchServerConfig } from './store/server'
import Welcome from './components/welcome'
import { fetchConversations } from './store/conversations'

export type AppProps = {
  params: any
}

const App: FC<AppProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { value: conversations, loading: conversationsLoading, error: conversationsError } =
    useSelector((state: RootState) => state.conversations),
    session = useSelector((state: RootState) => state.session)
  const serverConfig = useSelector((state: RootState) => state.server)
  const { t } = useTranslation()
  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile
  const hasSetAppConfig = APP_ID && API_KEY

  const [appUnavailable, setAppUnavailable] = useState<boolean>(false)
  const [isUnknownReason, setIsUnknownReason] = useState<boolean>(false)
  const [promptConfig, setPromptConfig] = useState<PromptConfig | null>(null)
  const [inited, setInited] = useState<boolean>(false)
  // in mobile, show sidebar by click button
  const [isShowSidebar, { setTrue: showSidebar, setFalse: hideSidebar }] = useBoolean(false)
  const [visionConfig, setVisionConfig] = useState<VisionSettings | undefined>({
    enabled: false,
    number_limits: 2,
    detail: Resolution.low,
    transfer_methods: [TransferMethod.local_file],
  })

  useEffect(() => {
    if (APP_INFO?.title)
      document.title = `${APP_INFO.title} - Powered by Dify`
  }, [APP_INFO?.title])

  // onData change thought (the produce obj). https://github.com/immerjs/immer/issues/576
  useEffect(() => {
    setAutoFreeze(false)
    return () => {
      setAutoFreeze(true)
    }
  }, [])

  useEffect(() => {
    console.log('init===serverConfig 1', serverConfig)
    if (!hasSetAppConfig) {
      setAppUnavailable(true)
      return
    }
    try {
      if (!inited) {
        dispatch(fetchServerConfig())
        dispatch(fetchConversations())
      }
      setLocaleOnClient(APP_INFO.default_language, true)
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
    return <Loading type='app' />

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className='home flex flex-col min-h-screen'>
          <Header
            title={APP_INFO.title}
            isMobile={isMobile}
            onShowSideBar={showSidebar}
          />
          <div className="flex rounded-t-2xl bg-white overflow-hidden">
            <div className='flex-grow flex flex-col h-[calc(100vh_-_3rem)] overflow-y-auto'>
              {
                session.chatStarted
                  ? (<Messages />)
                  : (<Welcome />)
              }
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default React.memo(App)
