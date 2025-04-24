export enum WorkflowStatus {
  Running = 'running',
  Completed = 'completed',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Stopped = 'stopped',
}

export enum NodeStatus {
  Running = 'running',
  Completed = 'completed',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Stopped = 'stopped',
}

export type Metadata = {
  totalTokens?: number,
  totalPrice?: number,
  currency?: string,
  totalSteps?: number,
}

export type Workflow = {
  id: string,
  status?: WorkflowStatus
  nodes?: WorkflowNode[]
  error?: string,
  time?: number,
  metadata?: Metadata,
  createdAt?: number,
}

export type WorkflowNode = {
  id: string
  type: string
  title: string
  status?: NodeStatus
  error?: string
  time?: number
  metadata?: Metadata
  createdAt?: number
  finishedAt?: number
  extras?: any
  expand?: boolean // for UI
  output?: any
}