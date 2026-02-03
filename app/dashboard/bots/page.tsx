"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Bot {
  id: string;
  name: string;
  description: string;
  secretInfo: {
    apiKey: string;
    downloadLink: string;
    configuration: string;
    backtestResults: string;
  };
  status: 'active' | 'inactive';
}

const demoBots: Bot[] = [
  {
    id: '1',
    name: 'EMA Crossover Pro',
    description: 'Advanced EMA crossover strategy with price action confirmation',
    secretInfo: {
      apiKey: 'TM-EMA-2024-X7K9M2P4L',
      downloadLink: 'https://tradersmarket.io/download/ema-crossover-pro-v2.1.ex5',
      configuration: 'Fast EMA: 12, Slow EMA: 26, Confirmation: Price Action Required',
      backtestResults: 'Win Rate: 68.5%, Profit Factor: 2.3, Max Drawdown: 3.2%'
    },
    status: 'active'
  },
  {
    id: '2',
    name: 'Grid',
    description: 'Anchored grid trading strategy with dynamic lot sizing and profit-targeted cycle management',
    secretInfo: {
      apiKey: 'TM-GRID-2024-N8L3Q5R6S',
      downloadLink: 'https://tradersmarket.io/download/grid-master-v1.8.ex5',
      configuration: 'Grid Step: 20 pips, Anchor: Dynamic, Lot Sizing: Balance-Based, Profit Target: Basket Pips',
      backtestResults: 'Win Rate: 71.2%, Profit Factor: 2.8, Max Drawdown: 2.8%'
    },
    status: 'active'
  },
  {
    id: '3',
    name: 'MACD Momentum Trader',
    description: 'MACD-based momentum trading with trend confirmation',
    secretInfo: {
      apiKey: 'TM-MACD-2024-P9M4R7T8U',
      downloadLink: 'https://tradersmarket.io/download/macd-momentum-trader-v2.3.ex5',
      configuration: 'Fast EMA: 12, Slow EMA: 26, Signal: 9, Trend Filter: Enabled',
      backtestResults: 'Win Rate: 65.8%, Profit Factor: 2.1, Max Drawdown: 4.1%'
    },
    status: 'active'
  },
  {
    id: '4',
    name: 'Heiken Ashi Trend Follower',
    description: 'Heiken Ashi candle analysis with trend following logic',
    secretInfo: {
      apiKey: 'TM-HA-2024-Q0N5S9V1W',
      downloadLink: 'https://tradersmarket.io/download/heiken-ashi-trend-v1.5.ex5',
      configuration: 'Trend Detection: 3 Candles, Confirmation: Standard Candles',
      backtestResults: 'Win Rate: 63.4%, Profit Factor: 1.9, Max Drawdown: 5.2%'
    },
    status: 'active'
  },
  {
    id: '5',
    name: 'Inside Bar Breakout Pro',
    description: 'Inside bar pattern detection with breakout confirmation',
    secretInfo: {
      apiKey: 'TM-IB-2024-R1O6T0X2Y',
      downloadLink: 'https://tradersmarket.io/download/inside-bar-breakout-pro-v2.0.ex5',
      configuration: 'Breakout Multiplier: 1.5x ATR, Confirmation: Volume Required',
      backtestResults: 'Win Rate: 69.1%, Profit Factor: 2.4, Max Drawdown: 3.8%'
    },
    status: 'active'
  },
  {
    id: '6',
    name: 'Stochastics Reversal Expert',
    description: 'Stochastic oscillator reversal trading system',
    secretInfo: {
      apiKey: 'TM-STOCH-2024-S2P7U1Y3Z',
      downloadLink: 'https://tradersmarket.io/download/stochastics-reversal-v1.7.ex5',
      configuration: 'K Period: 14, D Period: 3, Overbought: 80, Oversold: 20',
      backtestResults: 'Win Rate: 66.7%, Profit Factor: 2.0, Max Drawdown: 4.5%'
    },
    status: 'active'
  },
  {
    id: '7',
    name: 'Bollinger Bands Scalper',
    description: 'Bollinger Bands mean reversion and breakout strategy',
    secretInfo: {
      apiKey: 'TM-BB-2024-T3Q8V2Z4A',
      downloadLink: 'https://tradersmarket.io/download/bollinger-bands-scalper-v1.9.ex5',
      configuration: 'Period: 20, Deviation: 2.0, Mean Reversion: Enabled',
      backtestResults: 'Win Rate: 64.2%, Profit Factor: 1.8, Max Drawdown: 5.8%'
    },
    status: 'active'
  },
  {
    id: '8',
    name: 'Fibonacci Retracement Pro',
    description: 'Fibonacci retracement level trading with impulse detection',
    secretInfo: {
      apiKey: 'TM-FIB-2024-U4R9W3A5B',
      downloadLink: 'https://tradersmarket.io/download/fibonacci-retracement-pro-v2.2.ex5',
      configuration: 'Retracement Levels: 38.2%, 50%, 61.8%, Impulse Filter: ATR x 2',
      backtestResults: 'Win Rate: 67.3%, Profit Factor: 2.2, Max Drawdown: 4.0%'
    },
    status: 'active'
  },
  {
    id: '9',
    name: 'Daily Range Breakout',
    description: 'Daily range breakout strategy with ATR-based stops',
    secretInfo: {
      apiKey: 'TM-DRB-2024-V5S0X4B6C',
      downloadLink: 'https://tradersmarket.io/download/daily-range-breakout-v1.6.ex5',
      configuration: 'Range Period: Daily, Breakout Confirmation: ATR x 1.5',
      backtestResults: 'Win Rate: 70.5%, Profit Factor: 2.5, Max Drawdown: 3.5%'
    },
    status: 'active'
  },
  {
    id: '10',
    name: 'NewYork-London Breakout Premium',
    description: 'Session-based breakout with institutional-grade logic',
    secretInfo: {
      apiKey: 'TM-NYLD-2024-PREMIUM-W6T1Y5C7D',
      downloadLink: 'https://tradersmarket.io/download/ny-london-breakout-premium-v3.0.ex5',
      configuration: 'Session Range: Pre-NY & Pre-London, ATR Stop: 2.0x, R:R: 1:3',
      backtestResults: 'Win Rate: 68.5%, Profit Factor: 2.3, Max Drawdown: 3.2%'
    },
    status: 'active'
  }
];

export default function BotsDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [expandedBot, setExpandedBot] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    const loadSubscriptionStatus = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            const paid = data.hasPaid === true;
            setHasPaid(paid);
            
            // Redirect to checkout if not paid
            if (!paid && user?.email) {
              const checkoutUrl = `http://localhost:3001/checkout?email=${encodeURIComponent(user.email)}`;
              window.location.href = checkoutUrl;
              return;
            } else if (!paid) {
              router.push('/dashboard');
            }
          } else {
            // Redirect to checkout if user doc doesn't exist
            if (user?.email) {
              const checkoutUrl = `http://localhost:3001/checkout?email=${encodeURIComponent(user.email)}`;
              window.location.href = checkoutUrl;
              return;
            }
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Error loading subscription status:', error);
          router.push('/dashboard');
        } finally {
          setIsLoadingStatus(false);
        }
      }
    };

    loadSubscriptionStatus();
  }, [user, loading, router]);

  if (loading || isLoadingStatus) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </main>
    );
  }

  if (!user || !hasPaid) {
    return null;
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-white mb-2">
              Premium Trading Bots
            </h1>
            <p className="text-gray-400 text-lg">
              Access your exclusive trading bots with secret configuration details
            </p>
          </div>
          
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-600/20 border-2 border-green-500/40">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm font-bold text-green-300 uppercase tracking-wider">Premium Access Active</span>
          </div>
        </div>

        {/* Bots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoBots.map((bot) => {
            const isExpanded = expandedBot === bot.id;
            return (
              <div
                key={bot.id}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isExpanded
                    ? 'border-blue-500/60 bg-gradient-to-br from-blue-950/55 via-[#0f1f4a]/45 to-blue-900/40 shadow-2xl shadow-blue-900/25'
                    : 'border-blue-600/25 bg-gradient-to-br from-blue-950/30 via-[#0f1f4a]/20 to-blue-900/20 hover:border-blue-500/45 hover:shadow-xl hover:shadow-blue-900/15'
                }`}
              >
                {/* Ambient glow */}
                <div
                  className={`pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 opacity-0 blur-xl transition-opacity duration-300 ${
                    isExpanded ? 'opacity-20' : 'group-hover:opacity-10'
                  }`}
                />

                <div className="relative p-6">
                  {/* Bot Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{bot.name}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        bot.status === 'active'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {bot.status === 'active' ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{bot.description}</p>
                  </div>

                  {/* Secret Info - Only visible when expanded */}
                  {isExpanded && (
                    <div className="mt-4 space-y-3 animate-fade-in">
                      <div className="rounded-xl border border-blue-600/15 bg-black/30 px-4 py-3">
                        <p className="text-[11px] uppercase tracking-wider text-blue-300/80 mb-1">API Key</p>
                        <p className="text-gray-200 text-sm font-mono break-all">{bot.secretInfo.apiKey}</p>
                      </div>

                      <div className="rounded-xl border border-blue-600/15 bg-black/30 px-4 py-3">
                        <p className="text-[11px] uppercase tracking-wider text-blue-300/80 mb-1">Download Link</p>
                        <a
                          href={bot.secretInfo.downloadLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm break-all underline"
                        >
                          {bot.secretInfo.downloadLink}
                        </a>
                      </div>

                      <div className="rounded-xl border border-blue-600/15 bg-black/30 px-4 py-3">
                        <p className="text-[11px] uppercase tracking-wider text-blue-300/80 mb-1">Configuration</p>
                        <p className="text-gray-200 text-sm">{bot.secretInfo.configuration}</p>
                      </div>

                      <div className="rounded-xl border border-green-600/15 bg-green-500/10 px-4 py-3">
                        <p className="text-[11px] uppercase tracking-wider text-green-300/80 mb-1">Backtest Results</p>
                        <p className="text-gray-200 text-sm">{bot.secretInfo.backtestResults}</p>
                      </div>
                    </div>
                  )}

                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => setExpandedBot(isExpanded ? null : bot.id)}
                    className={`mt-4 w-full rounded-xl border border-blue-600/15 bg-black/10 px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                      isExpanded
                        ? 'text-blue-200 hover:text-white hover:border-blue-500/30'
                        : 'text-blue-300 hover:text-white hover:border-blue-500/30'
                    } hover:bg-black/20 hover:shadow-[0_0_18px_rgba(59,130,246,0.35)]`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>{isExpanded ? 'Hide Secret Info' : 'Show Secret Info'}</span>
                      <svg
                        className={`h-4 w-4 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Banner */}
        <div className="mt-8 rounded-xl border border-blue-600/30 bg-gradient-to-br from-blue-950/40 to-blue-900/30 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Demo Mode</h3>
              <p className="text-gray-300 text-sm">
                This is a demo page for payment implementation. The API keys, download links, and configuration details shown here are placeholder data. 
                Once payment is integrated, these will be replaced with real bot access credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
