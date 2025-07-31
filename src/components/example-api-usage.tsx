'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Example component showing how to interact with API endpoints
// This is for demonstration purposes - candidates should create their own components

export function ExampleApiUsage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchExample = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/example?id=123')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const postExample = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/example', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello from the client!',
          timestamp: new Date().toISOString()
        })
      })
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error posting data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Example</CardTitle>
        <CardDescription>
          This shows how to interact with Next.js API routes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={fetchExample} disabled={loading}>
              Test GET Request
            </Button>
            <Button onClick={postExample} disabled={loading}>
              Test POST Request
            </Button>
          </div>

          {data && (
            <pre className="bg-muted p-4 rounded-md overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 