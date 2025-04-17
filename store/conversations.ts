import { Conversation } from '@/models'
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { getConversations, removeConversation } from '@/service'
import { toast } from '@/components'

export interface ConversationsState {
  value: Conversation[]
  loading: boolean
  fufilled: boolean
  error: string | null
}

const initialState: ConversationsState = {
  value: [],
  loading: false,
  fufilled: false,
  error: null,
}

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    newConversation: (state) => {
      // create a new conversation
      // and startChat
      const newConversation = {
        id: '-1',
        name: '新对话',
        introduction: '',
        inputs: {},
      }
      state.value.unshift(newConversation)
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value.unshift(action.payload)
    },
    updateConversation: (state, action: PayloadAction<Conversation>) => {
      const index = state.value.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.value[index] = {
          ...state.value[index],
          ...action.payload
        }
      }
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false
        state.fufilled = true
        state.value = action.payload
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch conversations'
        toast({ type: 'error', message: state.error })
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.value = state.value.filter(item => item.id !== action.payload.conversationId)
      })
  },
})

// Action creators are generated for each case reducer function
export const { addConversation, clearError, newConversation, updateConversation } = conversationsSlice.actions

export const fetchConversations = createAsyncThunk(
  'conversations/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getConversations()
      const { data, error } = response as { data: Conversation[]; error?: string }

      if (error) {
        Toast.notify({ type: 'error', message: error })
        return rejectWithValue(error)
      }

      return data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch conversations')
    }
  }
)

export const deleteConversation = createAsyncThunk(
  'conversations/deleteConversation',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await removeConversation(conversationId)
      return {
        conversationId,
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete conversation')
    }
  }
)

export default conversationsSlice.reducer
