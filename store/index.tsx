'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import type { UnknownAction, ThunkDispatch } from '@reduxjs/toolkit'
import conversationsReducer from './conversations'
import messagesReducer from './messages'
import sessionReducer from './session'

export const store = configureStore({
  reducer: {
    conversations: conversationsReducer,
    messages: messagesReducer,
    session: sessionReducer,
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
  const storeRef = useRef<AppStore>(makeStore())
  return <Provider store={storeRef.current}>{children}</Provider>
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, undefined, UnknownAction>
export type AppStore = typeof store 
