import { useEffect, useMemo, useState } from 'react'
import { geoAlbersUsa, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { CATEGORIES } from '@/data/categories'
import type { StateStat } from '@/data/types'

interface Props {
  states: StateStat[]
}

interface TopoData {
  type: string
  objects: {
    states: {
      geometries: Array<{
        properties: { name: string }
        [key: string]: unknown
      }>
    }
  }
  [key: string]: unknown
}

const STATE_ABBR: Record<string, string> = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA',
  Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA',
  Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA',
  Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD',
  Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS',
  Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH', Oklahoma: 'OK',
  Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT',
  Vermont: 'VT', Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV',
  Wisconsin: 'WI', Wyoming: 'WY', 'District of Columbia': 'DC',
}

const WIDTH = 960
const HEIGHT = 600

export function USChoropleth({ states }: Props) {
  const [topo, setTopo] = useState<TopoData | null>(null)
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'us-states-10m.json')
      .then((r) => r.json())
      .then(setTopo)
  }, [])

  const stateMap = useMemo(() => {
    const map = new Map<string, StateStat>()
    for (const s of states) map.set(s.abbr, s)
    return map
  }, [states])

  const maxCount = useMemo(() => {
    if (!selectedCategory) {
      return Math.max(...states.map((s) => s.total), 1)
    }
    return Math.max(...states.map((s) => s.categories[selectedCategory] || 0), 1)
  }, [states, selectedCategory])

  const projection = useMemo(() => {
    return geoAlbersUsa().scale(1200).translate([WIDTH / 2, HEIGHT / 2])
  }, [])

  const pathGenerator = useMemo(() => geoPath().projection(projection), [projection])

  if (!topo) {
    return (
      <Card className="col-span-full">
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading map…</p>
        </CardContent>
      </Card>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geoFeatures = feature(topo as any, topo.objects.states as any) as any

  const getFill = (stateName: string) => {
    const abbr = STATE_ABBR[stateName]
    if (!abbr) return '#e5e5e5'
    const stat = stateMap.get(abbr)
    if (!stat) return '#e5e5e5'

    const count = selectedCategory
      ? (stat.categories[selectedCategory] || 0)
      : stat.total

    if (count === 0) return '#d4d4d4'
    const intensity = Math.sqrt(count / maxCount)
    const baseColor = selectedCategory
      ? CATEGORIES.find((c) => c.id === selectedCategory)?.color || '#444'
      : '#333333'

    // Parse hex color and interpolate from light base toward saturated color
    const r = parseInt(baseColor.slice(1, 3), 16)
    const g = parseInt(baseColor.slice(3, 5), 16)
    const b = parseInt(baseColor.slice(5, 7), 16)
    const lightR = 200, lightG = 200, lightB = 205
    const mix = (c: number, light: number) => Math.round(light + (c - light) * intensity)
    return `rgb(${mix(r, lightR)}, ${mix(g, lightG)}, ${mix(b, lightB)})`
  }

  const getTooltip = (stateName: string) => {
    const abbr = STATE_ABBR[stateName]
    if (!abbr) return stateName
    const stat = stateMap.get(abbr)
    if (!stat) return `${stateName}: no data`
    const lines = [`${stateName} — ${stat.total.toLocaleString()} total`]
    const sorted = Object.entries(stat.categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
    for (const [catId, count] of sorted) {
      const cat = CATEGORIES.find((c) => c.id === catId)
      if (cat) lines.push(`  ${cat.display}: ${count.toLocaleString()}`)
    }
    return lines.join('\n')
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Reports by US State</CardTitle>
        <CardDescription>
          {selectedCategory
            ? `Showing: ${CATEGORIES.find((c) => c.id === selectedCategory)?.display}`
            : 'All categories combined. Click a category to filter.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Category filter dots */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              !selectedCategory
                ? 'bg-foreground text-background border-foreground'
                : 'bg-transparent text-muted-foreground border-border hover:border-foreground/30'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'border-foreground/40 bg-foreground/5'
                  : 'bg-transparent text-muted-foreground border-border hover:border-foreground/30'
              }`}
            >
              <span
                className="shrink-0 rounded-full"
                style={{ backgroundColor: cat.color, width: 6, height: 6 }}
              />
              {cat.display}
            </button>
          ))}
        </div>

        {/* SVG Map */}
        <div className="relative">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
            {geoFeatures.features?.map((feat: any, i: number) => {
                const name = feat.properties.name as string
                const d = pathGenerator(feat as GeoJSON.Feature)
                if (!d) return null
                const isHovered = hoveredState === name
                return (
                  <path
                    key={i}
                    d={d}
                    fill={getFill(name)}
                    stroke={isHovered ? '#1a1a1a' : 'rgba(255,255,255,0.8)'}
                    strokeWidth={isHovered ? 1.5 : 0.75}
                    className="transition-colors duration-200"
                    onMouseEnter={() => setHoveredState(name)}
                    onMouseLeave={() => setHoveredState(null)}
                  >
                    <title>{getTooltip(name)}</title>
                  </path>
                )
              })}
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
