'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

/**
 * store the current conversation id to LocalStorage
 * just save the ID, not the whole conversation
 */
const localStorageKey = 'conversation'

const hasLocalStorage = () => {
  if (typeof window === 'undefined') {
    return false
  }
  return !!localStorage.getItem(localStorageKey)
}

const getCurrentConversationFromLocalStorage = () => {
  try {
    const c = globalThis.localStorage.getItem(localStorageKey) || ''
    return JSON.parse(c)
  } catch (error) {
    return {
      id: '-1',
      name: '新对话',
      introduction: '',
      inputs: {},
    }
  }
}

export interface SessionState {
  currentConversation: string,
  chatStarted: boolean,
  responding: boolean,
}

const getInitialState: () => SessionState = () => ({
  currentConversation: getCurrentConversationFromLocalStorage(),
  chatStarted: hasLocalStorage(),
  responding: false,
  inputs: {},
})

export const sessionSlice = createSlice({
  name: 'session',
  initialState: getInitialState(),
  reducers: {
    setCurrentConversation: (state, action: PayloadAction<string>) => {
      state.currentConversation = action.payload
      globalThis.localStorage.setItem(localStorageKey, action.payload)
      // enters a conversation just created (id === '-1')
      // display welcome and input
      if (action.payload === '-1') {
        state.chatStarted = false
      }
    },
    startChat: (state) => {
      /**
       * 1. local storage 写入 conversation
       * 2. create a new conversation
       */
      globalThis.localStorage.setItem(localStorageKey, state.currentConversation)
      state.chatStarted = true
    },
    setResponding: (state, action) => {
      state.responding = action.payload
    },
  }
})



export const { setCurrentConversation, startChat, setResponding } = sessionSlice.actions

export default sessionSlice.reducer