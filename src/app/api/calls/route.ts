import { NextRequest, NextResponse } from 'next/server'
import { VapiClient } from '@vapi-ai/server-sdk'

const vapi = new VapiClient({
  token: process.env.VAPI_API_KEY || ''
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber, recipientName, assistantId } = body

    if (!phoneNumber || !recipientName) {
      return NextResponse.json(
        { error: 'Phone number and recipient name are required' },
        { status: 400 }
      )
    }

    if (!process.env.VAPI_API_KEY) {
      return NextResponse.json(
        { error: 'Vapi API key not configured' },
        { status: 500 }
      )
    }

    // Create the call using Vapi server SDK
    const callRequest: Record<string, unknown> = {
      customer: {
        number: phoneNumber,
        name: recipientName
      },
      assistantId: assistantId || process.env.VAPI_ASSISTANT_ID,
      // Override assistant settings with custom first message
      assistantOverrides: {
        firstMessage: "Hi, this is Joyce calling from Alden. I'm following up on your application for our software engineering position. Do you have a few minutes to answer some questions?"
      }
    }

    // Use existing phone number ID if available, otherwise will need to be configured
    if (process.env.VAPI_PHONE_NUMBER_ID) {
      callRequest.phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID
    } else {
      // This will fail without a phone number - user needs to configure one
      throw new Error('VAPI_PHONE_NUMBER_ID environment variable is required. Please add a phone number ID from your Vapi dashboard.')
    }

    const callResponse = await vapi.calls.create(callRequest)

    // Handle single call vs batch response
    let callId = ''
    let callStatus = 'initiated'
    
    if ('id' in callResponse) {
      // Single call response
      callId = callResponse.id
      callStatus = callResponse.status || 'initiated'
    } else if ('results' in callResponse && callResponse.results && callResponse.results.length > 0) {
      // Batch response
      callId = callResponse.results[0]?.id || ''
      callStatus = callResponse.results[0]?.status || 'initiated'
    }

    return NextResponse.json({
      id: callId,
      status: callStatus,
      phoneNumber,
      recipientName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating Vapi call:', error)
    return NextResponse.json(
      { error: `Failed to create call: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    
    if (!process.env.VAPI_API_KEY) {
      return NextResponse.json(
        { error: 'Vapi API key not configured' },
        { status: 500 }
      )
    }

    // Get recent calls from Vapi
    const calls = await vapi.calls.list({ limit })

    return NextResponse.json(calls)

  } catch (error) {
    console.error('Error fetching calls:', error)
    return NextResponse.json(
      { error: `Failed to fetch calls: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}