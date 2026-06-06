import { NavLink } from 'react-router-dom'
import { Home, List, Zap, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDarkMode } from '@/hooks/useDarkMode'

const navItems = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/browse', label: 'Browse', Icon: List },
  { to: '/drill', label: 'Drill', Icon: Zap },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const { dark, toggle } = useDarkMode()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 md:pl-64">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border md:hidden safe-area-pb">
        <div className="flex">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.5px]')} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex-col p-4">
        <div className="mb-8 px-2">
          <h1 className="text-lg font-semibold">Interview Prep</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Founding Product Designer</p>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>
        <button
          onClick={toggle}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {dark ? 'Light mode' : 'Dark mode'}
        </button>
      </nav>
    </div>
  )
}
