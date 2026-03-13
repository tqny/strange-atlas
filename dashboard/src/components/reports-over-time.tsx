import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
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
import { CATEGORIES, TIMELINE_CATEGORIES } from '@/data/categories'
import type { TimelineEntry } from '@/data/types'

interface Props {
  timeline: TimelineEntry[]
}

export function ReportsOverTime({ timeline }: Props) {
  const timelineCats = CATEGORIES.filter((c) =>
    (TIMELINE_CATEGORIES as readonly string[]).includes(c.id)
  )

  const chartConfig = Object.fromEntries(
    timelineCats.map((c) => [c.id, { label: c.display, color: c.color }])
  ) satisfies ChartConfig

  // Filter to recent decades with meaningful data (1950+)
  const data = useMemo(
    () => timeline.filter((t) => t.year >= 1950 && t.year <= 2024),
    [timeline]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports Over Time</CardTitle>
        <CardDescription>Year-by-year reporting trends (1950–2024)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-video max-h-[280px]">
          <AreaChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => String(v)}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
              width={40}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => `Year ${label}`}
                />
              }
            />
            {timelineCats.map((cat) => (
              <Area
                key={cat.id}
                type="monotone"
                dataKey={cat.id}
                stroke={cat.color}
                fill={cat.color}
                fillOpacity={0.08}
                strokeWidth={1.5}
                dot={false}
              />
            ))}
          </AreaChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4">
          {timelineCats.map((c) => (
            <div key={c.id} className="flex items-center gap-1.5">
              <span
                className="shrink-0 rounded-full"
                style={{ backgroundColor: c.color, width: 6, height: 6 }}
              />
              <span className="text-xs text-muted-foreground">{c.display}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          6 categories with date records shown
        </p>
      </CardFooter>
    </Card>
  )
}
