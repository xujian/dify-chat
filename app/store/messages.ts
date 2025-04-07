import { MessageItem } from '@/types/app'
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { fetchChatList } from '@/service'
import Toast from '@/app/components/base/toast'
import { toJson } from '@/lib/utils'

export interface MessagesState {
  value: MessageItem[]
  loading: boolean
  error: string | null
}

const initialState: MessagesState = {
  value: [],
  loading: false,
  error: null,
}

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<MessageItem>) => {
      state.value.push(action.payload)
    },
    remove: (state, action: PayloadAction<string>) => {
      state.value = state.value.filter(item => item.id !== action.payload)
    },
    clear: (state) => {
      state.value = []
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false
        state.value = action.payload
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch messages'
        Toast.notify({ type: 'error', message: state.error })
      })
  },
})

export const { add, remove, clear, clearError } = messagesSlice.actions

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await fetchChatList(conversationId)
      const { data } = response as { data: any[] }
      const result: MessageItem[] = []

      data.forEach((item: any) => {
        const customContent = toJson(item.answer)
        result.push({
          id: `question-${item.id}`,
          content: item.query,
          isAnswer: false,
          message_files: item.message_files
            ?.filter((file: any) =>
              file.belongs_to === 'assistant')
            || [],
        })
        result.push({
          id: item.id,
          content: item.answer,
          format: customContent ? 'json' : 'text',
          customContent,
          isAnswer: true,
          feedback: item.feedback,
          message_files: item.message_files?.filter((file: any) => file.belongs_to === 'assistant') || [],
        })
      })
      return result
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch messages')
    }
  }
)

export default messagesSlice.reducer 