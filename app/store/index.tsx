'use client'
import { configureStore } from '@reduxjs/toolkit'
import conversationsReducer from './conversations'
import messagesReducer from './messages'
import type { ThunkDispatch } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import type { AnyAction } from '@reduxjs/toolkit'
import { useRef } from 'react'
import sessionReducer from './session'
import serverReducer from './server'

export const store = configureStore({
  reducer: {
    conversations: conversationsReducer,
    messages: messagesReducer,
    session: sessionReducer,
    server: serverReducer,
  },
})

export const makeStore = () => {
  return store
}

export function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }
  return <Provider store={storeRef.current}>{children}</Provider>
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction>
export type AppStore = typeof store 
