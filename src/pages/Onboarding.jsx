import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronRight, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { CRYPTO_LIST } from '@/lib/cryptoData';
import CryptoChip from '@/components/CryptoChip';

const notifOptions = [
  { value: 'minimal', label: 'Minimal', desc: 'Only critical updates and major events' },
  { value: 'balanced', label: 'Balanced', desc: 'Important news and portfolio-relevant updates' },
  { value: 'active', label: 'Active', desc: 'All relevant news, ecosystem updates' },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [selectedCryptos, setSelectedCryptos] = useState([]);
  const [notifPref, setNotifPref] = useState('balanced');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const toggleCrypto = (symbol) => {
    setSelectedCryptos(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : prev.length < 5 ? [...prev, symbol] : prev
    );
  };

  const handleComplete = async () => {
    setSaving(true);
    await base44.auth.updateMe({
      selected_cryptos: selectedCryptos,
      notification_preference: notifPref,
      onboarding_completed: true,
    });
    window.location.href = '/';
  };

  const pageVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="welcome" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="text-center max-w-sm space-y-8">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center glow-purple">
                  <span className="text-3xl font-bold text-white">N</span>
                </div>
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                  All the crypto information that matters to <span className="text-gradient">you.</span>
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {"Personalized news, portfolio tracking & trade journaling in one powerful workspace."}
                </p>
              </div>
              <Button onClick={() => setStep(1)} className="w-full py-6 rounded-2xl bg-primary hover:bg-primary/90 text-base font-semibold">
                Get Started <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="cryptos" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="w-full max-w-sm space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Choose your assets</h2>
                <p className="text-sm text-muted-foreground">Select up to 5 cryptocurrencies to personalize your feed</p>
                <p className="text-xs text-primary font-medium">{selectedCryptos.length}/5 selected</p>
              </div>
              <div className="grid grid-cols-4 gap-4 justify-items-center">
                {CRYPTO_LIST.map(crypto => (
                  <CryptoChip
                    key={crypto.symbol}
                    symbol={crypto.symbol}
                    name={crypto.name}
                    selected={selectedCryptos.includes(crypto.symbol)}
                    onClick={() => toggleCrypto(crypto.symbol)}
                    size="lg"
                  />
                ))}
              </div>
              <Button
                onClick={() => setStep(2)}
                disabled={selectedCryptos.length === 0}
                className="w-full py-6 rounded-2xl bg-primary hover:bg-primary/90 text-base font-semibold"
              >
                Continue <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="notif" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="w-full max-w-sm space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Notification style</h2>
                <p className="text-sm text-muted-foreground">How often do you want to hear from us?</p>
              </div>
              <div className="space-y-3">
                {notifOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setNotifPref(opt.value)}
                    className={`w-full p-4 rounded-2xl text-left transition-all duration-200 ${
                      notifPref === opt.value
                        ? 'glass glow-purple-sm border-primary/30'
                        : 'glass hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{opt.label}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                      </div>
                      {notifPref === opt.value && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <Button
                onClick={handleComplete}
                disabled={saving}
                className="w-full py-6 rounded-2xl bg-primary hover:bg-primary/90 text-base font-semibold"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>{"Launch NEXUS"} <Sparkles className="w-5 h-5 ml-1" /></>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 mt-8">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-primary' : i < step ? 'w-4 bg-primary/40' : 'w-4 bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}