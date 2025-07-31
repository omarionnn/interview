import { NextRequest, NextResponse } from 'next/server'
import { VapiClient } from '@vapi-ai/server-sdk'

const vapi = new VapiClient({
  token: process.env.VAPI_API_KEY || ''
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: callId } = await params

    if (!process.env.VAPI_API_KEY) {
      return NextResponse.json(
        { error: 'Vapi API key not configured' },
        { status: 500 }
      )
    }

    // Get call details from Vapi for debugging
    const call = await vapi.calls.get(callId)

    return NextResponse.json({
      callId: call.id,
      status: call.status,
      messages: call.messages,
      messageCount: call.messages?.length || 0,
      messageStructure: call.messages?.map(msg => {
        const msgObj = msg as unknown as Record<string, unknown>
        return {
          keys: Object.keys(msgObj),
          type: msgObj.type,
          role: msgObj.role,
          hasContent: !!msgObj.content,
          hasMessage: !!msgObj.message,
          hasText: !!msgObj.text
        }
      }) || []
    })

  } catch (error) {
    console.error('Error debugging call:', error)
    return NextResponse.json(
      { error: `Failed to debug call: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}