interface SummaryHeaderProps {
  totalCount: number
  usCount: number
}

export function SummaryHeader({ totalCount, usCount }: SummaryHeaderProps) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground m-0">
        Dashboard
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        {totalCount.toLocaleString()} reports across 10 categories.{' '}
        {usCount.toLocaleString()} within the United States.
      </p>
    </div>
  )
}
