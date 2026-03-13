import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { CategoryStat } from '@/data/types'

interface Props {
  categories: CategoryStat[]
}

export function CategoryTable({ categories }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Details</CardTitle>
        <CardDescription>Per-category statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">US %</TableHead>
              <TableHead className="text-right">Top State</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => {
              const usPct = c.count > 0 ? ((c.usCount / c.count) * 100).toFixed(0) : '0'
              return (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className="shrink-0 rounded-sm"
                        style={{ backgroundColor: c.color, width: 8, height: 8 }}
                      />
                      <span className="text-sm">{c.display}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm">
                    {c.count.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm">
                    {usPct}%
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {c.topState || '—'}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
