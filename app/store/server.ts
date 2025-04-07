import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchAppParams } from '@/service'

export interface AppParams {
  inputs: any
  openingStatement: string
  fileUpload: any
  systemParameters: any
  promptVariables: {},
}

export interface ServerState extends AppParams {
  isConfigured: boolean
  loading: boolean
  error: string | null
}

const initialState: ServerState = {
  isConfigured: false,
  inputs: [],
  openingStatement: '',
  fileUpload: {},
  systemParameters: {},
  promptVariables: {},
  loading: false,
  error: null,
}

export const fetchServerConfig = createAsyncThunk(
  'server/fetchServerConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAppParams()
      return response as AppParams
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServerConfig.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchServerConfig.fulfilled, (state, action) => {
        state.loading = false
        state.systemParameters = action.payload.systemParameters
        state.fileUpload = action.payload.fileUpload
        state.inputs = action.payload.inputs
        state.openingStatement = action.payload.openingStatement
      })
      .addCase(fetchServerConfig.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setServerConfig, clearServerConfig } = serverSlice.actions

export default serverSlice.reducer 