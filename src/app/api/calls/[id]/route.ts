import { NextRequest, NextResponse } from 'next/server'
import { VapiClient } from '@vapi-ai/server-sdk'
import fs from 'fs'
import path from 'path'

const vapi = new VapiClient({
  token: process.env.VAPI_API_KEY || ''
})

// Ensure transcripts directory exists
const transcriptsDir = path.join(process.cwd(), 'transcripts')
if (!fs.existsSync(transcriptsDir)) {
  fs.mkdirSync(transcriptsDir, { recursive: true })
}

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

    // Get call details from Vapi
    const call = await vapi.calls.get(callId)

    // Calculate duration if both startedAt and endedAt exist
    let duration: number | undefined
    if (call.startedAt && call.endedAt) {
      const start = new Date(call.startedAt).getTime()
      const end = new Date(call.endedAt).getTime()
      duration = Math.floor((end - start) / 1000) // duration in seconds
    }

    // Extract and store transcript if call is completed
    let transcript = ''
    const transcriptPath = path.join(transcriptsDir, `${callId}.json`)
    
    if (call.status && (call.status.includes('ended') || call.status.includes('completed') || call.endedAt)) {
      // Try to get transcript from stored file first
      if (fs.existsSync(transcriptPath)) {
        const storedData = JSON.parse(fs.readFileSync(transcriptPath, 'utf8'))
        transcript = storedData.transcript || ''
      } else {
        // Extract transcript from call messages and store it
        if (call.messages && call.messages.length > 0) {
          const transcriptLines: string[] = []
          
          call.messages.forEach((message: Record<string, unknown>) => {
            if (message.role === 'user') {
              transcriptLines.push(`User: ${message.content || message.message || ''}`)
            } else if (message.role === 'assistant') {
              transcriptLines.push(`Assistant: ${message.content || message.message || ''}`)
            }
          })
          
          transcript = transcriptLines.join('\n')
          
          // Store transcript locally
          const transcriptData = {
            callId: call.id,
            timestamp: new Date().toISOString(),
            transcript,
            callDetails: {
              phoneNumber: call.customer?.number,
              recipientName: call.customer?.name,
              startedAt: call.startedAt,
              endedAt: call.endedAt,
              duration,
              status: call.status,
              cost: call.cost
            }
          }
          
          fs.writeFileSync(transcriptPath, JSON.stringify(transcriptData, null, 2))
        }
      }
    }

    return NextResponse.json({
      id: call.id,
      status: call.status,
      phoneNumber: call.customer?.number,
      recipientName: call.customer?.name,
      startedAt: call.startedAt || call.createdAt,
      endedAt: call.endedAt,
      duration,
      transcript,
      summary: call.analysis?.summary,
      cost: call.cost
    })

  } catch (error) {
    console.error('Error fetching call:', error)
    return NextResponse.json(
      { error: `Failed to fetch call: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}