import { Pie, PieChart } from 'recharts'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { CategoryStat } from '@/data/types'

interface Props {
  categories: CategoryStat[]
}

export function CategoryBreakdown({ categories }: Props) {
  const total = categories.reduce((sum, c) => sum + c.count, 0)

  const chartConfig = Object.fromEntries(
    categories.map((c) => [c.id, { label: c.display, color: c.color }])
  ) satisfies ChartConfig

  const data = categories.map((c) => ({
    name: c.id,
    value: c.count,
    fill: `var(--color-${c.id})`,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Distribution across 10 phenomenon types</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[280px]">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const cat = categories.find((c) => c.id === name)
                    const pct = ((Number(value) / total) * 100).toFixed(1)
                    return (
                      <span>
                        {cat?.display}: {Number(value).toLocaleString()} ({pct}%)
                      </span>
                    )
                  }}
                />
              }
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={110}
              strokeWidth={1}
              stroke="rgba(255,255,255,0.5)"
            />
          </PieChart>
        </ChartContainer>

        {/* Custom legend */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-2">
              <span
                className="shrink-0 rounded-sm"
                style={{ backgroundColor: c.color, width: 8, height: 8 }}
              />
              <span className="text-xs text-muted-foreground truncate">
                {c.display}
              </span>
              <span className="text-xs text-foreground ml-auto tabular-nums">
                {c.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          {total.toLocaleString()} total phenomena
        </p>
      </CardFooter>
    </Card>
  )
}
