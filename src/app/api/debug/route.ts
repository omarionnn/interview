import { NextResponse } from 'next/server'
import { VapiClient } from '@vapi-ai/server-sdk'

const vapi = new VapiClient({
  token: process.env.VAPI_API_KEY || ''
})

export async function GET() {
  try {
    if (!process.env.VAPI_API_KEY) {
      return NextResponse.json({ error: 'VAPI_API_KEY not configured' }, { status: 500 })
    }

    // Try to list phone numbers to verify the API connection and see what's available
    const phoneNumbers = await vapi.phoneNumbers.list()
    
    return NextResponse.json({
      success: true,
      phoneNumbers: phoneNumbers,
      configuredPhoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
      configuredAssistantId: process.env.VAPI_ASSISTANT_ID
    })

  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({
      error: `Debug failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      configuredPhoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
      configuredAssistantId: process.env.VAPI_ASSISTANT_ID
    }, { status: 500 })
  }
}