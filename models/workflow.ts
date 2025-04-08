export enum WorkflowRunningStatus {
  Running = 'running',
  Completed = 'completed',
  Failed = 'failed',
}

export type NodeTracing = {
  node_id: string
  node_type: string
  node_label: string
  node_message: string
  status: WorkflowRunningStatus
  inputs: Record<string, any>
  outputs: Record<string, any>
}



export type WorkflowProcess = {
  status: WorkflowRunningStatus
  tracing: NodeTracing[]
}