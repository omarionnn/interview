"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, Phone, Clock, User, Calendar } from "lucide-react"
import { Call } from "@/types"

interface CallLogsTableProps {
  onViewCall?: (call: Call) => void
}

interface CallDetails {
  id: string
  status: string
  phoneNumber?: string
  recipientName?: string
  startedAt?: string
  endedAt?: string
  duration?: number
  transcript?: string
  summary?: string
  cost?: number
  error?: string
}

export function CallLogsTable({ }: CallLogsTableProps) {
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCall, setSelectedCall] = useState<Call | null>(null)
  const [callDetails, setCallDetails] = useState<CallDetails | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  useEffect(() => {
    loadCalls()
  }, [])

  const loadCalls = () => {
    try {
      const existingCalls = JSON.parse(localStorage.getItem('calls') || '[]')
      setCalls(existingCalls.reverse()) // Show most recent first
    } catch (error) {
      console.error('Error loading calls:', error)
      setCalls([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewCall = async (call: Call) => {
    setSelectedCall(call)
    setDetailsLoading(true)
    setCallDetails(null)

    try {
      // Fetch call details with transcript from API
      const response = await fetch(`/api/calls/${call.vapiCallId || call.id}`)
      if (response.ok) {
        const details = await response.json()
        setCallDetails(details)
      } else {
        console.error('Failed to fetch call details')
        setCallDetails({ error: 'Failed to load call details' })
      }
    } catch (error) {
      console.error('Error fetching call details:', error)
      setCallDetails({ error: 'Failed to load call details' })
    } finally {
      setDetailsLoading(false)
    }
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'initiated': 'outline',
      'ringing': 'secondary', 
      'in-progress': 'default',
      'completed': 'secondary',
      'failed': 'destructive',
      'cancelled': 'outline'
    }

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
          <CardDescription>Loading call history...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (calls.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
          <CardDescription>View transcripts and details from previous screening calls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Phone className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No calls yet</h3>
            <p className="text-gray-500 mb-4">Start your first phone screening call to see it here.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Calls</CardTitle>
        <CardDescription>View transcripts and details from previous screening calls</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {calls.map((call) => (
            <div 
              key={call.id} 
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleViewCall(call)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{call.recipientName}</span>
                    </div>
                    <span className="text-gray-500 font-mono text-sm">{call.phoneNumber}</span>
                    {getStatusBadge(call.status)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(call.startedAt)}</span>
                    </div>
                    {call.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(call.duration)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewCall(call)
                    }}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {calls.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              Load More
            </Button>
          </div>
        )}
      </CardContent>

      {/* Call Details Dialog */}
      <Dialog open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Call Details - {selectedCall?.recipientName}
            </DialogTitle>
            <DialogDescription>
              {selectedCall?.phoneNumber} • {selectedCall ? formatDate(selectedCall.startedAt) : ''}
            </DialogDescription>
          </DialogHeader>

          {detailsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : callDetails ? (
            <div className="space-y-6">
              {/* Call Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(callDetails.status)}`}>
                    {callDetails.status?.charAt(0).toUpperCase() + callDetails.status?.slice(1)}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <span>{formatDuration(callDetails.duration)}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Started At</p>
                  <span>{callDetails.startedAt ? formatDate(callDetails.startedAt) : 'N/A'}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Ended At</p>
                  <span>{callDetails.endedAt ? formatDate(callDetails.endedAt) : 'N/A'}</span>
                </div>
                {callDetails.cost && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Cost</p>
                    <span>${callDetails.cost.toFixed(4)}</span>
                  </div>
                )}
              </div>

              {/* Transcript Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Call Transcript</h3>
                {callDetails.transcript ? (
                  <div className="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {callDetails.transcript}
                    </pre>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-muted-foreground text-sm">
                      {callDetails.status === 'completed' || callDetails.status === 'ended' 
                        ? 'Transcript not available for this call.' 
                        : 'Transcript will be available after the call is completed.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Summary Section */}
              {callDetails.summary && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Call Summary</h3>
                  <div className="bg-blue-50 p-4 rounded-md">
                    <p className="text-sm">{callDetails.summary}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Failed to load call details
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}