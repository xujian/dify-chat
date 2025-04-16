import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomBlockProps } from '../types'
import { Button } from '@/components/ui/button'

const Ticket: React.FC<CustomBlockProps> = ({ data }) => {
  return (
    <Card className="w-full min-w-lg">
      <CardHeader>
        <CardTitle>工单</CardTitle>
        <CardDescription>#TKT-2024-000001</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <>
            {data.fields.map((field, index) => (
              <div key={index} className="flex flex-col gap-1">
                <span className="text-sm font-medium">{field.label}</span>
                <span className="text-sm text-muted-foreground">
                  {field.default || 'Not specified'}
                </span>
              </div>
            ))}
            <Button variant="outline" className="w-full">跟踪</Button>
          </>
        </div>
      </CardContent>
    </Card>
  )
}

export default Ticket
