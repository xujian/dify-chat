import { createSlice } from '@reduxjs/toolkit'
import { Conversation } from '@/models'

const localStorageKey = 'conversation'

const hasLocalStorage = () => !!globalThis.localStorage.getItem(localStorageKey)

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
  currentConversation: Conversation,
  chatStarted: boolean,
  responding: boolean,
  inputs: Record<string, string>, // 输入变量
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
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload
      globalThis.localStorage.setItem(localStorageKey, action.payload)
    },
    startChat: (state) => {
      /**
       * 1. local storage 写入 conversation
       * 2. create a new conversation
       */
      globalThis.localStorage.setItem(localStorageKey, JSON.stringify(state.currentConversation))
      state.chatStarted = true
    },
    setResponding: (state, action) => {
      state.responding = action.payload
    },
  }
})



export const { setCurrentConversation, startChat, setResponding } = sessionSlice.actions

export default sessionSlice.reducer