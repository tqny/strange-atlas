import { useMemo } from 'react'
import { Area, AreaChart, XAxis } from 'recharts'
import { MapPin, Layers, ArrowRight } from 'lucide-react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { DashboardStats } from '@/data/types'
import worldMapPoints from '@/data/world-map.json'

// Continent accent dots (approximate SVG coordinates in 0-119 x 0-59 space)
const ACCENT_DOTS = [
  { x: 24, y: 18, color: '#0EAEBE', r: 1.2 },   // N. America — UFO Sightings
  { x: 33, y: 38, color: '#E8632B', r: 0.9 },    // S. America — Volcanoes
  { x: 58, y: 16, color: '#A855E8', r: 0.9 },    // Europe — Haunted Places
  { x: 60, y: 30, color: '#4A6FA5', r: 0.9 },    // Africa — Meteorites
  { x: 85, y: 20, color: '#D4920B', r: 1.0 },    // Asia — Earthquakes
  { x: 98, y: 42, color: '#2DA67A', r: 0.9 },    // Oceania — Thermal Springs
]

interface FeaturedBentoProps {
  stats: DashboardStats
}

export function FeaturedBento({ stats }: FeaturedBentoProps) {
  return (
    <div className="rounded-xl ring-1 ring-foreground/10 bg-card overflow-hidden grid grid-cols-1 md:grid-cols-2 mb-6">
      {/* Top-left: World Map */}
      <div className="relative border-b md:border-r border-border min-h-[300px] md:min-h-[340px] overflow-hidden">
        <BentoWorldMap totalCount={stats.totalCount} />
      </div>

      {/* Top-right: Category Feed */}
      <div className="relative border-b border-border min-h-[300px] md:min-h-[340px] overflow-hidden">
        <BentoCategoryFeed categories={stats.categories} />
      </div>

      {/* Bottom-left: Timeline Chart */}
      <div className="relative md:border-r border-border min-h-[240px]">
        <BentoTimelineChart timeline={stats.timeline} />
      </div>

      {/* Bottom-right: Quick Stats */}
      <div className="relative min-h-[240px]">
        <BentoQuickStats usCount={stats.usCount} categoryCount={stats.categories.length} />
      </div>
    </div>
  )
}

// ─── Cell 1: Dotted World Map ──────────────────────────────

function BentoWorldMap({ totalCount }: { totalCount: number }) {
  return (
    <div className="h-full flex flex-col p-6">
      {/* Badge */}
      <div className="flex justify-end mb-2">
        <span className="text-[10px] text-muted-foreground bg-foreground/[0.04] rounded-full px-3 py-1">
          10 categories · 6 continents
        </span>
      </div>

      {/* Map — inline SVG for full control */}
      <div className="flex-1 flex items-center justify-center -mx-2">
        <svg
          viewBox="0 0 120 60"
          className="w-full h-auto max-h-[200px]"
          aria-label="World map with phenomena distribution"
        >
          {/* Base dots */}
          {(worldMapPoints as Array<{ x: number; y: number }>).map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={0.22}
              fill="currentColor"
              className="text-foreground/15"
            />
          ))}
          {/* Accent dots at continent centroids */}
          {ACCENT_DOTS.map((dot, i) => (
            <g key={`accent-${i}`}>
              <circle cx={dot.x} cy={dot.y} r={dot.r * 3} fill={dot.color} opacity={0.12} />
              <circle cx={dot.x} cy={dot.y} r={dot.r} fill={dot.color} opacity={0.9} />
            </g>
          ))}
        </svg>
      </div>

      {/* Overlay stats */}
      <div className="mt-auto">
        <p className="text-3xl font-semibold text-foreground tabular-nums tracking-tight">
          {totalCount.toLocaleString()}
        </p>
        <p className="text-sm text-foreground/80 font-medium">
          phenomena mapped worldwide
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          From volcanoes to ghost towns — spanning every continent
        </p>
      </div>
    </div>
  )
}

// ─── Cell 2: Category Feed ─────────────────────────────────

function BentoCategoryFeed({ categories }: { categories: DashboardStats['categories'] }) {
  // Sort by count descending, take top 6
  const topCats = useMemo(
    () => [...categories].sort((a, b) => b.count - a.count).slice(0, 6),
    [categories]
  )

  return (
    <div className="h-full flex flex-col p-6">
      <p className="text-sm font-medium text-foreground mb-3">Top Categories</p>

      <div className="space-y-2 relative flex-1">
        {topCats.map((cat, i) => {
          const usPct = cat.count > 0 ? Math.round((cat.usCount / cat.count) * 100) : 0
          return (
            <div
              key={cat.id}
              className="flex items-center gap-3 rounded-lg bg-background/60 p-3 ring-1 ring-foreground/[0.04] animate-bento-fade-in"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Color avatar */}
              <div
                className="w-8 h-8 rounded-full shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${cat.color}, ${cat.color}88)`,
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {cat.display}
                </p>
                <p className="text-xs text-muted-foreground">
                  {cat.count.toLocaleString()} reports
                  {usPct > 0 ? ` · ${usPct}% in the US` : ''}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Fade gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent pointer-events-none" />
    </div>
  )
}

// ─── Cell 3: Timeline Chart with Gradients ─────────────────

const timelineChartConfig = {
  'ufo-sightings': { label: 'UFO Sightings', color: '#0EAEBE' },
  meteorites: { label: 'Meteorites', color: '#4A6FA5' },
} satisfies ChartConfig

function BentoTimelineChart({ timeline }: { timeline: DashboardStats['timeline'] }) {
  const data = useMemo(
    () => timeline.filter((t) => t.year >= 1970 && t.year <= 2024),
    [timeline]
  )

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header with inline legend */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-foreground">Reporting Trends</p>
        <div className="flex gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="w-2 h-2 rounded-full" style={{ background: '#0EAEBE' }} />
            UFO Sightings
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="w-2 h-2 rounded-full" style={{ background: '#4A6FA5' }} />
            Meteorites
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ChartContainer config={timelineChartConfig} className="h-full w-full">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
            <defs>
              <linearGradient id="gradUfo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0EAEBE" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#0EAEBE" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradMeteorites" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4A6FA5" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#4A6FA5" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
              tickFormatter={(v) => String(v)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => `Year ${label}`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="ufo-sightings"
              stroke="#0EAEBE"
              fill="url(#gradUfo)"
              strokeWidth={1.5}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="meteorites"
              stroke="#4A6FA5"
              fill="url(#gradMeteorites)"
              strokeWidth={1.5}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}

// ─── Cell 4: Quick Stats ───────────────────────────────────

function BentoQuickStats({ usCount, categoryCount }: { usCount: number; categoryCount: number }) {
  return (
    <div className="h-full flex flex-col p-6">
      <p className="text-sm font-medium text-foreground mb-3">At a Glance</p>
      <div className="grid grid-cols-2 gap-3 flex-1">
        <StatCard
          icon={MapPin}
          label="US Reports"
          value={usCount.toLocaleString()}
          color="#1B6B8A"
        />
        <StatCard
          icon={Layers}
          label="Categories"
          value={String(categoryCount)}
          color="#A855E8"
        />
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof MapPin
  label: string
  value: string
  color: string
}) {
  return (
    <div className="group relative flex flex-col justify-between rounded-lg bg-background/60 p-4 ring-1 ring-foreground/[0.04] hover:ring-foreground/10 transition-all cursor-default">
      <div>
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center mb-3"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <p className="text-2xl font-semibold text-foreground tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
      <div className="flex justify-end mt-2">
        <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-foreground/50 transition-colors" />
      </div>
    </div>
  )
}
