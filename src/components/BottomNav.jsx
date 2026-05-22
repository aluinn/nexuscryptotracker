import { useLocation, Link } from 'react-router-dom';
import { Newspaper, PieChart, BookOpen, Bookmark, Bell } from 'lucide-react';

const tabs = [
  { path: '/', label: 'For You', icon: Newspaper },
  { path: '/journal', label: 'Journal', icon: BookOpen },
  { path: '/portfolio', label: 'Portfolio', icon: PieChart },
  { path: '/saved', label: 'Saved', icon: Bookmark },
  { path: '/alerts', label: 'Alerts', icon: Bell },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="glass border-t border-white/5 w-full flex-shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="max-w-lg mx-auto flex items-center justify-around py-3.5 px-1">
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
              } ${tab.path === '/portfolio' ? 'scale-110' : ''}`}
            >
              <div className={`relative ${isActive ? 'glow-purple-sm rounded-full' : ''}`}>
                <Icon className={`transition-all duration-200 ${tab.path === '/portfolio' ? 'w-6 h-6' : 'w-5 h-5'} ${isActive ? 'scale-110' : ''}`} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : ''}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>

    </nav>
  );
}