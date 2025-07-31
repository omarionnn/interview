import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExampleApiUsage } from "@/components/example-api-usage"
import { CallLogsTable } from "@/components/call-logs-table"
import Link from "next/link"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI Phone Screen Operator Console</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Start New Call</CardTitle>
              <CardDescription>
                Initiate an automated phone screen with a candidate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Enter candidate information and phone number to begin screening
              </p>
              <Link href="/start-call">
                <Button>Start Call</Button>
              </Link>
            </CardContent>
          </Card>

          <CallLogsTable />

          <ExampleApiUsage />
        </div>
      </div>
    </main>
  )
}
