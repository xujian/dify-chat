// Conversation model
export interface Conversation {
  id: string
  name: string
  inputs?: Record<string, any>
  introduction: string
}