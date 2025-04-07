import { ConversationItem } from '@/types/app'
import { createSlice } from '@reduxjs/toolkit'


export interface SessionState {
  currentConversation: ConversationItem,
  isNewConversation: boolean
  chatStarted: boolean
  inputs: Record<string, string>, // 输入变量
}

const initialState: SessionState = {
  currentConversation: {
    id: '-1',
    name: '',
    introduction: '',
    inputs: {},
  },
  isNewConversation: true,
  chatStarted: false,
  inputs: {},
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload
    },
    startChat: (state) => {
      state.isNewConversation = false
      state.chatStarted = true
    },
  }
})

export const { setCurrentConversation, startChat } = sessionSlice.actions

export default sessionSlice.reducer