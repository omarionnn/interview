import { VapiCallRequest, VapiCallResponse } from '@/types'

class VapiService {
  async initiateCall(request: VapiCallRequest): Promise<VapiCallResponse> {
    try {
      const response = await fetch('/api/calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: request.phoneNumber,
          recipientName: request.name,
          assistantId: request.assistantId,
          metadata: request.metadata
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      return {
        id: data.id,
        status: data.status,
        phoneNumber: data.phoneNumber,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }
    } catch (error) {
      console.error('Error initiating Vapi call:', error)
      throw new Error(`Failed to initiate call: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getCallStatus(callId: string): Promise<{ id: string; status: string }> {
    try {
      const response = await fetch(`/api/calls/${callId}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      return { id: data.id, status: data.status }
    } catch (error) {
      console.error('Error getting call status:', error)
      throw error
    }
  }

  async getCalls(limit = 10) {
    try {
      const response = await fetch(`/api/calls?limit=${limit}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching calls:', error)
      throw error
    }
  }
}

export const vapiService = new VapiService()
export default VapiService