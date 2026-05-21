import { Check, Zap, Star, Infinity, BookOpen, Bell, Bookmark, Smartphone, Headphones, LayoutDashboard, Download, RefreshCw, PieChart, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const freeFeatures = [
  { icon: Newspaper, label: 'News for You', desc: 'Personalized articles for up to 5 cryptocurrencies', limit: '5 cryptos' },
  { icon: PieChart, label: 'Portfolio Tracker', desc: 'Track 1 portfolio manually', limit: '1 portfolio' },
  { icon: BookOpen, label: 'Trade Journal', desc: 'Log trades, notes and screenshots', limit: 'Unlimited' },
  { icon: Bell, label: 'Notifications', desc: 'Daily digest and essential updates', limit: true },
  { icon: Bookmark, label: 'Saved Articles', desc: 'Save and organize your research', limit: 'Up to 50' },
  { icon: Smartphone, label: 'Access', desc: 'Mobile and web access', limit: true },
  { icon: Headphones, label: 'Support', desc: 'Standard email support', limit: true },
];

const proFeatures = [
  { icon: Infinity, label: 'Unlimited Cryptos', desc: 'Track unlimited cryptocurrencies and topics', limit: 'Unlimited' },
  { icon: PieChart, label: 'Multiple Portfolios', desc: 'Create and manage multiple portfolios', limit: 'Unlimited' },
  { icon: Bell, label: 'Advanced Notifications', desc: 'Real-time alerts, custom filters & high-priority news', limit: true },
  { icon: Bookmark, label: 'Saved Articles & Collections', desc: 'Unlimited saves and custom collections', limit: 'Unlimited' },
  { icon: BookOpen, label: 'Advanced Journal', desc: 'Tags, advanced search, export & full history', limit: true },
  { icon: LayoutDashboard, label: 'Custom Dashboard', desc: 'Personalize your layout and widgets', limit: true },
  { icon: Download, label: 'Export Data', desc: 'Export portfolio and journal data', limit: true },
  { icon: RefreshCw, label: 'Cross-Device Sync', desc: 'Seamless sync across all your devices', limit: true },
  { icon: Headphones, label: 'Priority Support', desc: 'Faster response & priority support', limit: true },
];

const whyPro = [
  { icon: Zap, color: '#F59E0B', title: 'Stay Ahead', desc: 'Get instant updates on what matters most to your portfolio.' },
  { icon: PieChart, color: '#EC4899', title: 'More Control', desc: 'Manage multiple portfolios and track every angle of your strategy.' },
  { icon: Bookmark, color: '#F59E0B', title: 'Better Organization', desc: 'Save more, find faster, and keep your research perfectly organized.' },
  { icon: Star, color: '#8B5CF6', title: 'Built for Serious Investors', desc: 'Powerful tools designed to support your crypto journey.' },
];

function FeatureRow({ icon: Icon, label, desc, limit }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <div className="flex-shrink-0">
        {limit === true ? (
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
            <Check className="w-3 h-3 text-primary" />
          </div>
        ) : (
          <span className="text-xs font-semibold text-muted-foreground">{limit}</span>
        )}
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-10 pb-6">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6 text-xs text-muted-foreground hover:text-foreground transition-colors">← Back to app</Link>
          <h1 className="text-3xl font-bold text-foreground leading-tight">
            Choose the plan that fits your<br />
            <span className="text-gradient">crypto journey</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-sm">Start for free. Upgrade anytime as your portfolio and research grow.</p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
                <Star className="w-4 h-4 text-foreground" />
                <span className="text-sm font-semibold text-foreground">Free</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">£0</p>
                <p className="text-xs text-muted-foreground">Forever</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Everything you need to stay informed and organized. Perfect for getting started.</p>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Includes</p>
            <div>
              {freeFeatures.map((f) => <FeatureRow key={f.label} {...f} />)}
            </div>
            <Link to="/" className="mt-4 block text-center py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-white/5 transition-colors">
              Get started for free
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-5 border border-primary/40 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, hsl(224 40% 12%) 0%, hsl(258 30% 14%) 100%)' }}
          >
            <div className="absolute inset-0 glow-purple opacity-30 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-sm font-semibold text-primary">Pro</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">£7.99<span className="text-sm font-normal text-muted-foreground"> / month</span></p>
                  <p className="text-xs text-muted-foreground">Cancel anytime</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">More power, deeper insights, and full control over your crypto information.</p>
              <p className="text-[10px] font-semibold text-primary uppercase tracking-widest mb-1">Everything in Free, plus</p>
              <div>
                {proFeatures.map((f) => <FeatureRow key={f.label} {...f} />)}
              </div>
              <button className="mt-4 w-full py-3 rounded-xl bg-primary hover:bg-primary/90 transition-colors text-sm font-semibold text-white glow-purple-sm">
                Start Pro Trial – 7 Days Free
              </button>
            </div>
          </motion.div>
        </div>

        {/* Why Pro */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-foreground text-center mb-6">Why go Pro?</h2>
          <div className="grid grid-cols-2 gap-3">
            {whyPro.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass rounded-2xl p-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${item.color}20` }}>
                    <Icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-8 flex items-center justify-center gap-1.5">
          🔒 We never share your data. Your privacy is our priority.
        </p>
      </div>
    </div>
  );
}