import { NextRequest, NextResponse } from 'next/server'

// Example API endpoint showing how to handle different HTTP methods
// This is just a demonstration - candidates should create their own endpoints

export async function GET(request: NextRequest) {
  // Example: Get query parameters
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  return NextResponse.json({
    message: 'This is an example GET endpoint',
    id: id || 'no id provided',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    // Example: Parse JSON body
    const body = await request.json()

    return NextResponse.json({
      message: 'This is an example POST endpoint',
      received: body,
      timestamp: new Date().toISOString()
    }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
} 