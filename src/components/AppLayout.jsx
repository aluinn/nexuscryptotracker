import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import BottomNav from './BottomNav';

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
    <div className="bg-background min-h-screen">
      <div className="max-w-lg mx-auto w-full" style={{ paddingBottom: 'calc(90px + max(env(safe-area-inset-bottom), 16px))' }}>
        <Outlet context={{ user }} />
      </div>
      <BottomNav />
    </div>
  );
}