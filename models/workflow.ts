export enum WorkflowRunningStatus {
  Running = 'running',
  Completed = 'completed',
  Failed = 'failed',
}

export type NodeTracing = {
  nodeId: string
  nodeType: string
  nodeLabel: string
  nodeMessage: string
  status: WorkflowRunningStatus
  inputs: Record<string, any>
  outputs: Record<string, any>
  id: string
  index: number
  predecessorNodeId: string
  title: string
  processData: any
  error?: string
  elapsedTime: number
  executionMetadata: {
    totalTokens: number
    totalPrice: number
    currency: string
  }
  createdAt: number
  createdBy: {
    id: string
    name: string
    email: string
  }
  finishedAt: number
  extras?: any
  expand?: boolean // for UI
}


export type WorkflowProcess = {
  status: WorkflowRunningStatus
  tracing: NodeTracing[]
}