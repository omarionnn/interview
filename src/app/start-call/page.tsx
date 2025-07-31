"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Phone, AlertCircle } from "lucide-react"
import { vapiService } from "@/lib/vapi"

export default function StartCallPage() {
  const router = useRouter()
  const [recipientName, setRecipientName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValidE164 = (phoneNumber: string) => /^\+?[1-9]\d{1,14}$/.test(phoneNumber);

  const handleStartCall = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!recipientName.trim() || !phoneNumber.trim()) {
      setError("Please fill in both recipient name and phone number")
      return
    }

    if (!isValidE164(phoneNumber.trim())) {
      setError("Phone number must be in E.164 format (e.g., +15555555555)")
      return
    }

    setIsLoading(true)
    
    try {
      const callResponse = await vapiService.initiateCall({
        phoneNumber: phoneNumber.trim(),
        name: recipientName.trim(),
        assistantId: process.env.VAPI_ASSISTANT_ID, // Include assistantId
        metadata: {
          source: 'ai-phone-screen',
          timestamp: new Date().toISOString()
        }
      })

      // Store call information in localStorage for now (in production, use a proper database)
      const callData = {
        id: callResponse.id,
        recipientName: recipientName.trim(),
        phoneNumber: phoneNumber.trim(),
        status: 'initiated',
        startedAt: new Date().toISOString(),
        vapiCallId: callResponse.id
      }
      
      const existingCalls = JSON.parse(localStorage.getItem('calls') || '[]')
      existingCalls.push(callData)
      localStorage.setItem('calls', JSON.stringify(existingCalls))

      // Navigate to call in progress page
      router.push(`/call/${callResponse.id}`)
      
    } catch (error) {
      console.error('Failed to initiate call:', error)
      setError(error instanceof Error ? error.message : 'Failed to initiate call')
    } finally {
      setIsLoading(false)
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
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Start New Call</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Initiate Phone Screen
            </CardTitle>
            <CardDescription>
              Enter the candidate&apos;s information to begin an automated phone screening call
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            <form onSubmit={handleStartCall} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  type="text"
                  placeholder="Enter candidate's full name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number (e.g., +1-555-123-4567)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !recipientName.trim() || !phoneNumber.trim()}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Initiating Call...
                    </>
                  ) : (
                    <>
                      <Phone className="h-4 w-4" />
                      Start Call
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}