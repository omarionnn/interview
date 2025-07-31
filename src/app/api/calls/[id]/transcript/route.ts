import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const transcriptsDir = path.join(process.cwd(), 'transcripts')

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: callId } = await params
    const transcriptPath = path.join(transcriptsDir, `${callId}.json`)

    // Check if transcript file exists and delete it
    if (fs.existsSync(transcriptPath)) {
      fs.unlinkSync(transcriptPath)
      return NextResponse.json({ success: true, message: 'Transcript deleted successfully' })
    } else {
      return NextResponse.json({ success: true, message: 'No transcript file found' })
    }

  } catch (error) {
    console.error('Error deleting transcript:', error)
    return NextResponse.json(
      { error: `Failed to delete transcript: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}