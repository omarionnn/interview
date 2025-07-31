
export interface Call {
  id: string
  recipientName: string
  phoneNumber: string
  status: 'initiated' | 'ringing' | 'in-progress' | 'completed' | 'failed' | 'cancelled'
  startedAt: string
  endedAt?: string
  duration?: number
  transcript?: string
  summary?: string
  vapiCallId?: string
  cost?: number
}

export interface CallLog {
  id: string
  call: Call
  createdAt: string
  updatedAt: string
}

export interface VapiCallRequest {
  phoneNumber: string
  name?: string
  assistantId?: string
  metadata?: Record<string, unknown>
}

export interface VapiCallResponse {
  id: string
  status: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
}

export interface CallFormData {
  recipientName: string
  phoneNumber: string
}
