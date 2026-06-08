import { useLocation, Link } from 'react-router-dom';
import { Newspaper, PieChart, BookOpen, Bookmark, Bell, Zap } from 'lucide-react';

const tabs = [
  { path: '/', label: 'For You', icon: Newspaper },
  { path: '/portfolio', label: 'Portfolio', icon: PieChart },
  { path: '/journal', label: 'Journal', icon: BookOpen },
  { path: '/saved', label: 'Saved', icon: Bookmark },
  { path: '/alerts', label: 'Notifications', icon: Bell },
];

export default function DesktopSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 flex-shrink-0 border-r border-white/5 h-full px-4 py-6" style={{ backgroundColor: 'hsl(222 47% 5%)' }}>
      {/* Logo */}
      <div className="px-3 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="text-lg font-bold text-gradient">NEXUS</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 pl-0.5">Crypto Intelligence</p>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-primary/15 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
              {tab.label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade button */}
      <Link
        to="/pricing"
        className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all"
      >
        <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold text-primary">Upgrade to Pro</p>
          <p className="text-[10px] text-muted-foreground">Unlock all features</p>
        </div>
      </Link>
    </aside>
  );
}