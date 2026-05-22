import { useLocation, Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { Newspaper, PieChart, BookOpen, Bookmark, Bell } from 'lucide-react';

const tabs = [
  { path: '/', label: 'For You', icon: Newspaper },
  { path: '/portfolio', label: 'Portfolio', icon: PieChart },
  { path: '/journal', label: 'Journal', icon: BookOpen },
  { path: '/saved', label: 'Saved', icon: Bookmark },
  { path: '/alerts', label: 'Alerts', icon: Bell },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="glass border-t border-white/5 w-full flex-shrink-0">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-1">
        <Link to="/pricing" className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all">
          <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30">
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-semibold text-primary">Pro</span>
          </div>
          <span className="text-[10px] font-medium text-primary">Upgrade</span>
        </Link>
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground/70'
              }`}
            >
              <div className={`relative ${isActive ? 'glow-purple-sm rounded-full' : ''}`}>
                <Icon className={`w-5 h-5 transition-all duration-200 ${isActive ? 'scale-110' : ''}`} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : ''}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
}