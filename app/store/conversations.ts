import { ConversationItem } from '@/types/app'
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { fetchConversationsApi } from '@/service'
import Toast from '@/app/components/base/toast'

export interface ConversationsState {
  value: ConversationItem[]
  loading: boolean
  error: string | null
}

const initialState: ConversationsState = {
  value: [],
  loading: false,
  error: null,
}

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<ConversationItem>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value.unshift(action.payload)
    },
    remove: (state, action: PayloadAction<string>) => {
      state.value = state.value.filter(item => item.id !== action.payload)
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
        state.value = action.payload
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch conversations'
        Toast.notify({ type: 'error', message: state.error })
      })
  },
})

// Action creators are generated for each case reducer function
export const { add, remove, clearError } = conversationsSlice.actions

export const fetchConversations = createAsyncThunk(
  'conversations/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchConversationsApi()
      const { data, error } = response as { data: ConversationItem[]; error?: string }

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

export default conversationsSlice.reducer
