export function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-6 md:px-9 py-4 max-w-[1080px] mx-auto">
        <div>
          <h1 className="text-base md:text-lg font-semibold tracking-tight text-foreground leading-none m-0">
            Strange Atlas
          </h1>
        </div>
        <div className="flex gap-3 md:gap-4 pt-0.5">
          <a
            href="../globe-preview.html"
            className="text-[11px] md:text-xs text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            Globe
          </a>
          <a
            href="./"
            className="text-[11px] md:text-xs font-medium text-foreground no-underline"
          >
            Dashboard
          </a>
          <a
            href="../about.html"
            className="text-[11px] md:text-xs text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            About
          </a>
        </div>
      </div>
    </nav>
  )
}
