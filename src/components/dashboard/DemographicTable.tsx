'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'

type DemographicsItem = {
  id: string
  count: number
  gender: string
  age: string
  emotion: string
  ethnicity: string
  created_at: string
}

export const DemographicsTable = ({ items }: { items: DemographicsItem[] }) => {
  return (
    <Card className="mt-8">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Grouped Demographic Results</h3>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Count</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Age Group</TableHead>
                <TableHead>Emotion</TableHead>
                <TableHead>Ethnicity</TableHead>
                <TableHead>Captured At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.count}</TableCell>
                    <TableCell>{item.gender}</TableCell>
                    <TableCell>{item.age}</TableCell>
                    <TableCell>{item.emotion}</TableCell>
                    <TableCell>{item.ethnicity}</TableCell>
                    <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No demographics data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
