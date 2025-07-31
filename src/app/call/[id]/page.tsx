"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Phone, PhoneOff, Clock, User } from "lucide-react"
import { Call } from "@/types"

export default function CallPage() {
  const router = useRouter()
  const params = useParams()
  const callId = params.id as string
  
  const [call, setCall] = useState<Call | null>(null)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    // Load call data from localStorage (in production, fetch from API)
    const existingCalls = JSON.parse(localStorage.getItem('calls') || '[]')
    const foundCall = existingCalls.find((c: Call) => c.id === callId || c.vapiCallId === callId)
    
    if (foundCall) {
      setCall(foundCall)
    } else {
      // Call not found, redirect back
      router.push('/')
    }
  }, [callId, router])

  useEffect(() => {
    if (!call || call.status === 'completed' || call.status === 'failed') return

    const interval = setInterval(() => {
      const startTime = new Date(call.startedAt).getTime()
      const now = new Date().getTime()
      setDuration(Math.floor((now - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [call])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleEndCall = () => {
    if (call) {
      // Update call status in localStorage
      const existingCalls = JSON.parse(localStorage.getItem('calls') || '[]')
      const updatedCalls = existingCalls.map((c: Call) => 
        c.id === call.id ? { ...c, status: 'completed', endedAt: new Date().toISOString(), duration } : c
      )
      localStorage.setItem('calls', JSON.stringify(updatedCalls))
    }
    
    router.push('/')
  }

  if (!call) {
    return (
      <main className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">Loading call information...</div>
        </div>
      </main>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'initiated': return 'text-blue-600 bg-blue-50'
      case 'ringing': return 'text-yellow-600 bg-yellow-50'
      case 'in-progress': return 'text-green-600 bg-green-50'
      case 'completed': return 'text-gray-600 bg-gray-50'
      case 'failed': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <main className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Console
          </Button>
          <h1 className="text-3xl font-bold">Call in Progress</h1>
        </div>

        <div className="space-y-6">
          {/* Call Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Active Call
              </CardTitle>
              <CardDescription>
                Call with {call.recipientName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Recipient</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{call.recipientName}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                  <span className="font-mono">{call.phoneNumber}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(call.status)}`}>
                    {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-mono">{formatDuration(duration)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleEndCall}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <PhoneOff className="h-4 w-4" />
                  End Call
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Call Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Call Notes</CardTitle>
              <CardDescription>
                Call transcript will be available after the call ends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-md min-h-[100px]">
                <p className="text-muted-foreground text-sm">
                  The call transcript will be saved and viewable in the call logs once the call is completed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}