import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { fetchAppParams } from '@/service'
import { ServerConfig } from '@/models'

export interface ServerState extends ServerConfig {
  isConfigured: boolean
  loading: boolean
  error: string | null
}

const initialState: ServerState = {
  isConfigured: false,
  openingStatement: '',
  upload: { enabled: true },
  systemParameters: { enabled: true },
  variables: [],
  annotationReply: { enabled: true },
  suggests: [],
  loading: false,
  error: null,
}

export const fetchServerConfig = createAsyncThunk(
  'server/fetchServerConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAppParams()
      console.log('fetchServerConfig', response)
      return response as ServerConfig
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch app parameters')
    }
  }
)

export const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    setServerConfig: (state, action) => {
      state.isConfigured = true
    },
    clearServerConfig: (state) => {
      state.isConfigured = false
      localStorage.removeItem('server-state')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServerConfig.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchServerConfig.fulfilled, (state, action: PayloadAction<ServerConfig>) => {
        const s = {
          ...action.payload,
          isConfigured: true,
          loading: false,
          error: null
        }
        return s
      })
      .addCase(fetchServerConfig.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setServerConfig, clearServerConfig } = serverSlice.actions

export default serverSlice.reducer 