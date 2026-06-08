import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import BottomNav from './BottomNav';
import DesktopSidebar from './DesktopSidebar';

export default function AppLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const me = await base44.auth.me();
      if (!me.onboarding_completed) {
        navigate('/onboarding', { replace: true });
        return;
      }
      setUser(me);
      setLoading(false);
    };
    load();
  }, [navigate]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background flex" style={{ height: '100dvh' }}>
      {/* Desktop sidebar — hidden on mobile */}
      <DesktopSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* On mobile: constrain to phone width. On desktop: use full width with a generous max */}
          <div className="w-full max-w-sm mx-auto md:max-w-3xl md:mx-0 md:px-8 md:py-2">
            <Outlet context={{ user }} />
          </div>
        </div>

        {/* Bottom nav — mobile only */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}