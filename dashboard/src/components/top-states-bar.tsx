import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { CATEGORIES } from '@/data/categories'
import type { StateStat } from '@/data/types'

interface Props {
  states: StateStat[]
}

export function TopStatesBar({ states }: Props) {
  const top15 = states.slice(0, 15)

  const chartConfig = Object.fromEntries(
    CATEGORIES.map((c) => [c.id, { label: c.display, color: c.color }])
  ) satisfies ChartConfig

  const data = top15.map((s) => ({
    state: s.abbr,
    ...s.categories,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top States</CardTitle>
        <CardDescription>15 US states with the most reports</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[4/5] max-h-[400px]">
          <BarChart data={data} layout="vertical" margin={{ left: 0 }}>
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="state"
              tickLine={false}
              axisLine={false}
              width={32}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => {
                    const st = top15.find((s) => s.abbr === label)
                    return st ? `${st.name} (${st.abbr})` : String(label)
                  }}
                />
              }
            />
            {CATEGORIES.map((cat) => (
              <Bar
                key={cat.id}
                dataKey={cat.id}
                stackId="a"
                fill={cat.color}
                fillOpacity={0.85}
                radius={0}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
