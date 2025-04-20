'use client'
import { Action, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

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

export interface SessionState {
  currentConversation: string,
  chatStarted: boolean,
  responding: boolean,
  variables: Record<string, string>,
}

const initialState: SessionState = {
  currentConversation: '',
  chatStarted: false,
  responding: false,
  variables: {},
}
// move getInitialState thunk
export const initSession = createAsyncThunk(
  'session/getInitialState',
  async () => {
    let savedConversation = ''
    if (typeof window !== 'undefined') {
      savedConversation = globalThis.localStorage.getItem(localStorageKey) || ''
    }
    return Promise.resolve({
      currentConversation: savedConversation,
      // if conversationSavedLocalStorage has value then start chat
      // display chat interface immediately
      chatStarted: savedConversation !== ''
        && savedConversation !== '-1',
      variables: {},
    })
  }
)

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setCurrentConversation: (state, action: PayloadAction<string>) => {
      console.log('session.ts oooooooooo---setCurrentConversation', action.payload)
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
    closeChat: (state) => {
      state.chatStarted = false
    },
    setResponding: (state, action) => {
      state.responding = action.payload
    },
    setVariable: (state, action: PayloadAction<{ name: string, value: string }>) => {
      state.variables = {
        ...state.variables,
        [action.payload.name]: action.payload.value,
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initSession.fulfilled, (state, action) => {
      state.currentConversation = action.payload.currentConversation
      state.chatStarted = action.payload.chatStarted
    })
  }
})



export const { setCurrentConversation, startChat, closeChat, setResponding, setVariable } = sessionSlice.actions

export default sessionSlice.reducer