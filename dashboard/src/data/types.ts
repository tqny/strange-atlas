export interface CategoryStat {
  id: string
  display: string
  color: string
  count: number
  usCount: number
  topState: string
}

export interface TimelineEntry {
  year: number
  [categoryId: string]: number
}

export interface StateStat {
  name: string
  abbr: string
  total: number
  categories: Record<string, number>
}

export interface DashboardStats {
  totalCount: number
  usCount: number
  categories: CategoryStat[]
  timeline: TimelineEntry[]
  states: StateStat[]
}
