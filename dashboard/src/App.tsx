import { useEffect, useState } from 'react'
import type { DashboardStats } from '@/data/types'
import { NavBar } from '@/components/nav-bar'
import { SummaryHeader } from '@/components/summary-header'
import { CategoryBreakdown } from '@/components/category-breakdown'
import { ReportsOverTime } from '@/components/reports-over-time'
import { USChoropleth } from '@/components/us-choropleth'
import { TopStatesBar } from '@/components/top-states-bar'
import { CategoryTable } from '@/components/category-table'
import { FeaturedBento } from '@/components/featured-bento'

function App() {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'dashboard-stats.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setData)
      .catch((err) => setError(err.message))
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-destructive">Failed to load data: {error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading dashboard data…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-[1080px] mx-auto px-4 md:px-6 pt-20 md:pt-28 pb-16">
        <SummaryHeader totalCount={data.totalCount} usCount={data.usCount} />

        <FeaturedBento stats={data} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryBreakdown categories={data.categories} />
          <ReportsOverTime timeline={data.timeline} />
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6">
          <USChoropleth states={data.states} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <TopStatesBar states={data.states} />
          <CategoryTable categories={data.categories} />
        </div>
      </main>

      <footer className="max-w-[1080px] mx-auto px-6 pb-12">
        <div className="border-t pt-6">
          <p className="text-xs text-muted-foreground">
            Data: Strange Places Dataset v5.2 (CC BY 4.0). Visualization by Strange Atlas.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
