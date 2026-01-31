"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Custom hook for scroll-triggered animations
function useScrollAnimation(options = { threshold: 0.15, rootMargin: '0px 0px -100px 0px' }) {
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const optionsRef = useRef(options);

  // Update options ref when they change
  useEffect(() => {
    optionsRef.current = options;
  }, [options.threshold, options.rootMargin]);

  useEffect(() => {
    // If already animated, don't set up observer again
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      optionsRef.current
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []); // Empty dependency array - only run once

  return [ref, isVisible] as const;
}

// Wrapper component for animated sections
function AnimatedSection({ children }: { children: (isVisible: boolean) => React.ReactNode }) {
  const [ref, isVisible] = useScrollAnimation();
  return <div ref={ref}>{children(isVisible)}</div>;
}

export default function Home() {
  const [sectionRef, isVisible] = useScrollAnimation();
  const [heroAnimated, setHeroAnimated] = useState(false);

  useEffect(() => {
    // Trigger hero animation once on mount
    setHeroAnimated(true);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#050816] via-[#0f172a] via-[#0f1f4a] to-[#0a0e27]">
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Column - Text Content */}
            <div className={`text-center lg:text-left ${heroAnimated ? 'animate-fade-in' : 'opacity-0'}`}>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Unlock 10+ Proven Trading Strategies for{" "}
                <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
                  MetaTrader 5
                </span>
              </h1>
              
              <p className="mt-6 text-lg leading-8 text-gray-300 sm:text-xl max-w-2xl mx-auto lg:mx-0">
                Automate your trading with the most impactful, battle-tested strategies trusted by traders worldwide.
              </p>

              <div className="mt-10 flex justify-center lg:justify-start">
                <Link
                  href="/bundle"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:from-blue-600 hover:to-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-105 border border-blue-600/30"
                >
                  <span className="relative z-10">Buy for $159</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </Link>
              </div>
            </div>

            {/* Right Column - Advanced Trading Dashboard */}
            <div className={`relative flex items-center justify-center ${heroAnimated ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: heroAnimated ? "0.2s" : "0s" }}>
              <div className="relative w-full max-w-2xl">
                {/* Background Glow Effect */}
                <div className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-blue-800/30 via-blue-700/25 to-blue-800/30 blur-3xl"></div>
                
                {/* Professional Trading Dashboard */}
                <div className="relative rounded-2xl bg-gradient-to-br from-slate-950/95 via-[#0a0e27]/95 to-slate-950/95 p-6 backdrop-blur-sm border border-blue-600/40 overflow-hidden shadow-2xl">
                  <div className="relative w-full aspect-[4/3]">
                    {/* Dashboard Grid Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-black/80">
                      {/* Fine Grid Pattern */}
                      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300" preserveAspectRatio="none">
                        <defs>
                          <pattern id="fineGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="0.3"/>
                          </pattern>
                          <linearGradient id="chartAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                            <stop offset="50%" stopColor="#1e40af" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.05" />
                          </linearGradient>
                          <linearGradient id="candleUp" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#059669" stopOpacity="0.6" />
                          </linearGradient>
                          <linearGradient id="candleDown" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.6" />
                          </linearGradient>
                        </defs>
                        <rect width="400" height="300" fill="url(#fineGrid)" />
                      </svg>

                      {/* Main Candlestick Chart Panel */}
                      <div className="absolute top-2 left-2 right-2 h-[45%] border border-blue-600/30 rounded bg-black/40 backdrop-blur-sm">
                        <div className="absolute inset-0 p-2">
                          {/* Chart Header */}
                          <div className="flex justify-between items-center mb-1 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                              <span className="text-[8px] font-mono text-blue-300">EUR/USD</span>
                              <span className="text-[7px] text-gray-400">M15</span>
                            </div>
                            <div className="text-[8px] font-mono text-green-400">1.08452</div>
                          </div>
                          
                          {/* Candlestick Chart */}
                          <svg className="w-full h-[calc(100%-20px)]" viewBox="0 0 360 120" preserveAspectRatio="none">
                            {/* Grid Lines */}
                            {[0, 1, 2, 3, 4].map(i => (
                              <line key={i} x1="0" y1={24 + i * 24} x2="360" y2={24 + i * 24} stroke="rgba(59, 130, 246, 0.1)" strokeWidth="0.5"/>
                            ))}
                            
                            {/* Candlesticks */}
                            {[
                              {x: 20, open: 80, high: 75, low: 85, close: 82, isUp: true},
                              {x: 50, open: 82, high: 78, low: 88, close: 85, isUp: true},
                              {x: 80, open: 85, high: 90, low: 83, close: 88, isUp: true},
                              {x: 110, open: 88, high: 92, low: 86, close: 90, isUp: true},
                              {x: 140, open: 90, high: 95, low: 88, close: 93, isUp: true},
                              {x: 170, open: 93, high: 98, low: 91, close: 96, isUp: true},
                              {x: 200, open: 96, high: 94, low: 99, close: 97, isUp: false},
                              {x: 230, open: 97, high: 95, low: 100, close: 98, isUp: false},
                              {x: 260, open: 98, high: 96, low: 101, close: 99, isUp: false},
                              {x: 290, open: 99, high: 97, low: 102, close: 100, isUp: false},
                              {x: 320, open: 100, high: 98, low: 103, close: 101, isUp: false},
                              {x: 350, open: 101, high: 99, low: 104, close: 102, isUp: false},
                            ].map((candle, i) => (
                              <g key={i}>
                                {/* Wick */}
                                <line 
                                  x1={candle.x} 
                                  y1={candle.high} 
                                  x2={candle.x} 
                                  y2={candle.low} 
                                  stroke={candle.isUp ? "#10b981" : "#ef4444"} 
                                  strokeWidth="1.5"
                                />
                                {/* Body */}
                                <rect 
                                  x={candle.x - 6} 
                                  y={Math.min(candle.open, candle.close)} 
                                  width="12" 
                                  height={Math.abs(candle.close - candle.open)} 
                                  fill={candle.isUp ? "url(#candleUp)" : "url(#candleDown)"}
                                  stroke={candle.isUp ? "#10b981" : "#ef4444"}
                                  strokeWidth="0.5"
                                />
                              </g>
                            ))}
                            
                            {/* Moving Averages */}
                            <path
                              d="M 20,82 Q 50,85 80,88 T 140,93 T 200,97 T 260,99 T 320,101 T 350,102"
                              stroke="#3b82f6"
                              strokeWidth="1.5"
                              fill="none"
                              opacity="0.8"
                            />
                            <path
                              d="M 20,85 Q 50,87 80,90 T 140,95 T 200,98 T 260,100 T 320,101.5 T 350,102.5"
                              stroke="#8b5cf6"
                              strokeWidth="1.5"
                              fill="none"
                              opacity="0.7"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Technical Indicators Panel - Bottom Left */}
                      <div className="absolute bottom-2 left-2 w-[48%] h-[50%] border border-blue-600/30 rounded bg-black/40 backdrop-blur-sm">
                        <div className="absolute inset-0 p-2">
                          <div className="text-[7px] text-blue-300 mb-1 px-1 font-mono">RSI (14)</div>
                          <svg className="w-full h-[calc(100%-16px)]" viewBox="0 0 180 80" preserveAspectRatio="none">
                            {/* RSI Scale Lines */}
                            <line x1="0" y1="20" x2="180" y2="20" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="0.5" strokeDasharray="2,2"/>
                            <line x1="0" y1="40" x2="180" y2="40" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="0.5"/>
                            <line x1="0" y1="60" x2="180" y2="60" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="0.5" strokeDasharray="2,2"/>
                            
                            {/* RSI Line */}
                            <path
                              d="M 0,45 Q 30,42 60,38 T 120,32 T 180,28"
                              stroke="#8b5cf6"
                              strokeWidth="1.5"
                              fill="none"
                            />
                            <path
                              d="M 0,45 Q 30,42 60,38 T 120,32 T 180,28 L 180,80 L 0,80 Z"
                              fill="url(#chartAreaGrad)"
                              opacity="0.3"
                            />
                            
                            {/* Labels */}
                            <text x="2" y="18" fill="#ef4444" fontSize="6" fontFamily="monospace">70</text>
                            <text x="2" y="62" fill="#10b981" fontSize="6" fontFamily="monospace">30</text>
                            <text x="165" y="26" fill="#8b5cf6" fontSize="6" fontFamily="monospace">45.2</text>
                          </svg>
                        </div>
                      </div>

                      {/* MACD Indicator Panel - Bottom Right */}
                      <div className="absolute bottom-2 right-2 w-[48%] h-[50%] border border-blue-600/30 rounded bg-black/40 backdrop-blur-sm">
                        <div className="absolute inset-0 p-2">
                          <div className="text-[7px] text-blue-300 mb-1 px-1 font-mono">MACD</div>
                          <svg className="w-full h-[calc(100%-16px)]" viewBox="0 0 180 80" preserveAspectRatio="none">
                            {/* Zero Line */}
                            <line x1="0" y1="40" x2="180" y2="40" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.5"/>
                            
                            {/* MACD Line */}
                            <path
                              d="M 0,50 Q 30,48 60,45 T 120,38 T 180,35"
                              stroke="#3b82f6"
                              strokeWidth="1.5"
                              fill="none"
                            />
                            
                            {/* Signal Line */}
                            <path
                              d="M 0,52 Q 30,50 60,47 T 120,40 T 180,37"
                              stroke="#f59e0b"
                              strokeWidth="1.5"
                              fill="none"
                              strokeDasharray="3,2"
                            />
                            
                            {/* Histogram */}
                            {[
                              {x: 10, h: 3}, {x: 25, h: 4}, {x: 40, h: 5}, {x: 55, h: 6},
                              {x: 70, h: 7}, {x: 85, h: 8}, {x: 100, h: 7}, {x: 115, h: 6},
                              {x: 130, h: 5}, {x: 145, h: 4}, {x: 160, h: 3}, {x: 175, h: 2}
                            ].map((bar, i) => (
                              <rect
                                key={i}
                                x={bar.x - 4}
                                y={40 - bar.h}
                                width="8"
                                height={bar.h}
                                fill={bar.h > 5 ? "#10b981" : "#ef4444"}
                                opacity="0.6"
                              />
                            ))}
                          </svg>
                        </div>
                      </div>

                      {/* Performance Metrics - Top Right Corner */}
                      <div className="absolute top-2 right-2 w-[35%] border border-blue-600/20 rounded bg-black/60 backdrop-blur-sm p-2">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[7px] text-gray-400 font-mono">Win Rate</span>
                            <span className="text-[8px] font-mono text-green-400">68.5%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[7px] text-gray-400 font-mono">Profit Factor</span>
                            <span className="text-[8px] font-mono text-blue-300">2.34</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[7px] text-gray-400 font-mono">Sharpe</span>
                            <span className="text-[8px] font-mono text-blue-300">1.87</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[7px] text-gray-400 font-mono">Max DD</span>
                            <span className="text-[8px] font-mono text-red-400">-4.2%</span>
                          </div>
                        </div>
                      </div>

                      {/* Algorithm Status Indicators */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                        <div className="px-2 py-1 rounded bg-green-500/20 border border-green-500/30">
                          <span className="text-[7px] font-mono text-green-400">EA ACTIVE</span>
                        </div>
                        <div className="px-2 py-1 rounded bg-blue-500/20 border border-blue-500/30">
                          <span className="text-[7px] font-mono text-blue-400">AUTO</span>
                        </div>
                      </div>

                      {/* Subtle Data Stream Effect */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements - Darker blue with dark purple */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-800/12 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-800/10 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-blue-800/12 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>
      </section>

      {/* Transition Divider - Hero to Manual vs Automated */}
      <div className="relative h-8 -mt-8 bg-gradient-to-b from-[#050816] via-[#0f172a] to-[#0f1f4a]">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,transparent_30%,rgba(59,130,246,0.01)_50%,transparent_70%)]"></div>
      </div>

      {/* Manual vs Automated Trading Section */}
      <section 
        ref={sectionRef}
        className="relative bg-gradient-to-b from-[#0f1f4a] via-[#0f172a] to-[#050816] py-24 border-t border-blue-400/10"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Manual vs Automated Trading
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              See the difference between traditional manual trading and modern automated solutions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Manual Trading - Left Column */}
            <div 
              className={`${isVisible ? "animate-slide-in-left" : "opacity-0"} transition-all duration-300 hover:scale-[1.02]`}
              style={{ animationDelay: isVisible ? "0.2s" : "0s" }}
            >
              <div className="rounded-xl border-2 border-red-500/30 bg-gradient-to-br from-red-900/10 to-slate-900/40 p-8 backdrop-blur-sm h-full transition-all duration-300 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-red-500/20">
                    <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Manual Trading</h3>
                </div>
                <p className="text-xl font-semibold text-red-400 mb-8">Is Holding You Back</p>
                
                <div className="space-y-6">
                  {[
                    {
                      icon: (
                        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      ),
                      title: "Hard to Backtest",
                      description: "Testing strategies manually requires extensive time and resources, making it difficult to validate trading ideas."
                    },
                    {
                      icon: (
                        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                      title: "Time-Consuming",
                      description: "Requires constant monitoring of markets, charts, and news, leaving little time for other activities."
                    },
                    {
                      icon: (
                        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      ),
                      title: "Emotion-Driven Trades",
                      description: "Human emotions like fear and greed can lead to irrational decisions and poor trading outcomes."
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4 group">
                      <div className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Automated Trading - Right Column */}
            <div 
              className={`${isVisible ? "animate-slide-in-right" : "opacity-0"} transition-all duration-300 hover:scale-[1.02]`}
              style={{ animationDelay: isVisible ? "0.4s" : "0s" }}
            >
              <div className="rounded-xl border-2 border-blue-600/30 bg-gradient-to-br from-blue-950/30 via-[#0f1f4a]/25 to-blue-900/20 p-8 backdrop-blur-sm h-full transition-all duration-300 hover:border-blue-800/50 hover:shadow-lg hover:shadow-blue-600/25 hover:shadow-blue-800/25">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600/25 to-blue-800/25">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Automated Trading</h3>
                </div>
                <p className="text-xl font-semibold text-blue-400 mb-8">Does the Work for You</p>
                
                <div className="space-y-6">
                  {[
                    {
                      icon: (
                        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      ),
                      title: "Easy Backtesting",
                      description: "Test strategies against historical data in minutes, allowing you to validate and optimize your approach quickly."
                    },
                    {
                      icon: (
                        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                      title: "Trades 24/7",
                      description: "Never miss an opportunity. Automated systems monitor markets continuously and execute trades at optimal times."
                    },
                    {
                      icon: (
                        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      ),
                      title: "Emotion-Free Logic",
                      description: "Trading decisions are based purely on predefined rules and algorithms, eliminating emotional biases."
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4 group">
                      <div className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transition Divider - Manual vs Automated to No One-Size-Fits-All */}
      <div className="relative h-6 bg-gradient-to-b from-[#050816] via-[#0f1f4a]/20 to-[#050816]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600/10 to-transparent"></div>
      </div>

      {/* No One-Size-Fits-All Strategy Section */}
      <AnimatedSection>
        {(isVisible) => (
          <section className="relative bg-gradient-to-br from-[#050816] via-[#0b1026] to-[#050816] py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl mb-4">
                  There's No One-Size-Fits-All Strategy
                </h2>
                <p className="text-xl sm:text-2xl text-blue-400 font-semibold">
                  And That's the Point
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mb-12">
                {/* Markets Evolving */}
                <div className={`group rounded-xl border border-blue-600/30 bg-gradient-to-br from-blue-950/30 via-[#0f1f4a]/20 to-blue-900/20 p-6 backdrop-blur-sm transition-all duration-700 hover:border-blue-800/50 hover:shadow-lg hover:shadow-blue-600/25 hover:shadow-blue-800/25 hover:scale-[1.02] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                     style={{ transitionDelay: isVisible ? '100ms' : '0ms' }}>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-blue-600/25 to-blue-800/25">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Markets are constantly evolving</h3>
              </div>
            </div>

                {/* Robotic Trading Bots */}
                <div className={`group rounded-xl border border-blue-600/30 bg-gradient-to-br from-blue-950/30 via-[#0f1f4a]/20 to-blue-900/20 p-6 backdrop-blur-sm transition-all duration-700 hover:border-blue-800/50 hover:shadow-lg hover:shadow-blue-600/25 hover:shadow-blue-800/25 hover:scale-[1.02] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                     style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-blue-600/25 to-blue-800/25">
                      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      Many trading bots work in the market
                    </h3>
                  </div>
                </div>

                {/* Strategic Planning */}
                <div className={`group rounded-xl border border-blue-600/30 bg-gradient-to-br from-blue-950/30 via-[#0f1f4a]/20 to-blue-900/20 p-6 backdrop-blur-sm transition-all duration-700 hover:border-blue-800/50 hover:shadow-lg hover:shadow-blue-600/25 hover:shadow-blue-800/25 hover:scale-[1.02] md:col-span-2 lg:col-span-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                     style={{ transitionDelay: isVisible ? '300ms' : '0ms' }}>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-blue-600/25 to-blue-800/25">
                      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      Some strategies have higher risk but higher reward
                    </h3>
                  </div>
                </div>
          </div>

              {/* Final Message */}
              <div className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                   style={{ transitionDelay: isVisible ? '400ms' : '0ms' }}>
                <p className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
                  The best strategy is the one you pick
                </p>
              </div>
            </div>
          </section>
        )}
      </AnimatedSection>

      {/* Transition Divider - No One-Size-Fits-All to Full Strategy Arsenal */}
      <div className="relative h-6 bg-gradient-to-b from-[#050816] via-[#0a0e27] to-[#0b1b40]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"></div>
      </div>

      {/* Full Strategy Arsenal Section */}
      <AnimatedSection>
        {(isVisible) => (
          <section className="relative bg-gradient-to-t from-[#050816] via-[#0f172a] to-[#0b1b40] py-24 border-t border-blue-400/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Main Heading */}
              <div className={`text-center mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl mb-4">
              That's Why You Need a Full Strategy Arsenal
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              With 10+ expert-designed bots, you're never stuck with just one approach…
            </p>
          </div>

            <div className="max-w-5xl mx-auto">
              {/* Secondary Heading */}
              <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                   style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  What's Inside the Bundle?
                </h3>
                <p className="text-gray-300 text-lg">
                  Explore 10+ expertly designed strategies that cover every market condition…
                </p>
              </div>

              {/* Strategy List */}
              <div className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "EMA Crossover Strategy",
                    "RSI Overbought/Oversold",
                    "RSI Divergence",
                    "London Breakout",
                    "New York Session Breakout",
                  ].map((strategy, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-4 rounded-lg border border-blue-600/20 bg-gradient-to-br from-blue-950/20 via-[#0f1f4a]/15 to-blue-900/20 backdrop-blur-sm transition-all duration-700 hover:border-blue-800/40 hover:bg-gradient-to-br hover:from-blue-950/30 hover:via-[#0f1f4a]/25 hover:to-blue-900/30 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                      style={{ transitionDelay: isVisible ? `${100 + index * 50}ms` : '0ms' }}
                    >
                    <svg
                      className="h-6 w-6 flex-shrink-0 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-white font-medium">{strategy}</span>
                  </div>
                ))}
              </div>
            </div>

              {/* Call-to-Action Button */}
              <div className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                   style={{ transitionDelay: isVisible ? '400ms' : '0ms' }}>
                <Link
                  href="/bundle"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:from-blue-600 hover:to-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-105 border border-blue-600/30"
                >
                  <span className="relative z-10">Get Full Strategy Arsenal</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </Link>
              </div>
            </div>
          </div>
        </section>
        )}
      </AnimatedSection>

      {/* Transition Divider - Full Strategy Arsenal to Are They Good */}
      <div className="relative h-6 bg-gradient-to-b from-[#0b1b40] via-[#0a0e27] to-[#050816]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.02)_0%,transparent_50%,rgba(59,130,246,0.02)_100%)]"></div>
      </div>

      {/* Are They Good Section */}
      <AnimatedSection>
        {(isVisible) => (
          <section className="relative bg-gradient-to-b from-[#050816] via-[#0a0e27] to-[#050816] py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              {/* Main Heading */}
              <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl mb-4">
              Are they good?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              In order to make them as robust as possible, we implemented the following features for every strategy:
            </p>
          </div>

              {/* Features List - Different Card Design */}
              <div className="max-w-4xl mx-auto space-y-4">
                {/* Trailing Stop Losses */}
                <div className={`group relative overflow-hidden rounded-lg border-l-4 border-blue-500 bg-gradient-to-r from-blue-950/40 to-[#0f1f4a]/30 p-6 transition-all duration-700 hover:border-blue-800 hover:shadow-lg hover:shadow-blue-800/20 hover:-translate-x-1 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                     style={{ transitionDelay: isVisible ? '100ms' : '0ms' }}>
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600/30 to-blue-800/30 flex items-center justify-center border border-blue-500/30">
                        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white flex-1">Trailing Stop Losses</h3>
                  </div>
                </div>

                {/* Daily Trade Limits */}
                <div className={`group relative overflow-hidden rounded-lg border-l-4 border-blue-500 bg-gradient-to-r from-blue-950/40 to-[#0f1f4a]/30 p-6 transition-all duration-700 hover:border-blue-800 hover:shadow-lg hover:shadow-blue-800/20 hover:-translate-x-1 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                     style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}>
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600/30 to-blue-800/30 flex items-center justify-center border border-blue-500/30">
                        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white flex-1">Daily Trade Limits</h3>
                  </div>
                </div>

                {/* Gain / Loss Filters */}
                <div className={`group relative overflow-hidden rounded-lg border-l-4 border-blue-500 bg-gradient-to-r from-blue-950/40 to-[#0f1f4a]/30 p-6 transition-all duration-700 hover:border-blue-800 hover:shadow-lg hover:shadow-blue-800/20 hover:-translate-x-1 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                     style={{ transitionDelay: isVisible ? '300ms' : '0ms' }}>
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600/30 to-blue-800/30 flex items-center justify-center border border-blue-500/30">
                        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white flex-1">Gain / Loss Filters</h3>
                  </div>
                </div>

                {/* Hour Filters */}
                <div className={`group relative overflow-hidden rounded-lg border-l-4 border-blue-500 bg-gradient-to-r from-blue-950/40 to-[#0f1f4a]/30 p-6 transition-all duration-700 hover:border-blue-800 hover:shadow-lg hover:shadow-blue-800/20 hover:-translate-x-1 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                     style={{ transitionDelay: isVisible ? '400ms' : '0ms' }}>
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600/30 to-blue-800/30 flex items-center justify-center border border-blue-500/30">
                        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white flex-1">Hour Filters</h3>
                  </div>
                </div>

                {/* Overtrading Protection */}
                <div className={`group relative overflow-hidden rounded-lg border-l-4 border-blue-500 bg-gradient-to-r from-blue-950/40 to-[#0f1f4a]/30 p-6 transition-all duration-700 hover:border-blue-800 hover:shadow-lg hover:shadow-blue-800/20 hover:-translate-x-1 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                     style={{ transitionDelay: isVisible ? '500ms' : '0ms' }}>
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600/30 to-blue-800/30 flex items-center justify-center border border-blue-500/30">
                        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white flex-1">Overtrading Protection</h3>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </AnimatedSection>

      {/* Transition Divider - Are They Good to Test Everything */}
      <div className="relative h-6 bg-gradient-to-b from-[#050816] to-[#0f1f4a]">
      </div>

      {/* Test Everything Yourself Section */}
      <AnimatedSection>
        {(isVisible) => (
          <section className="relative bg-gradient-to-br from-[#0f1f4a] via-[#0f172a] to-[#050816] py-24 border-t border-blue-400/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                {/* Main Heading */}
                <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl mb-4">
                Test Everything Yourself
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                Once you download the bundle, you can backtest in MT5 using any historical data. No guesswork — just clear results.
              </p>
            </div>

                {/* Call-to-Action Button */}
                <div className={`mt-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                     style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}>
                  <Link
                    href="/bundle"
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:from-blue-600 hover:to-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-105 border border-blue-600/30"
                  >
                    <span className="relative z-10">Get the Bundle Now</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </AnimatedSection>

      {/* Transition Divider - Test Everything to Reviews */}
      <div className="relative h-8 bg-gradient-to-b from-[#050816] via-[#0a0e27] to-[#050816]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(59,130,246,0.03),transparent)]"></div>
      </div>

      {/* Reviews Section */}
      <AnimatedSection>
        {(isVisible) => (
          <section className="relative bg-gradient-to-b from-[#0a0e27] via-[#050816] to-[#050816] py-24 overflow-hidden border-t border-blue-900/20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Main Heading */}
              <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl mb-4">
              Excellent 4.9 of 5 Stars Rating
            </h2>
            <p className="text-lg sm:text-xl text-gray-300">
              Based on 5,000+ real user reviews
            </p>
          </div>

              {/* Auto-Rotating Carousel */}
              <div className={`relative overflow-hidden carousel-container-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                   style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}>
                <div className="carousel-track-auto">
                  {/* First Set of Cards */}
                  {[
                {
                  text: "What I like is that the bundle isn't just one type of bot. There are scalpers, trend-followers, and some grid logic too. I'm still forward-testing on demo, but so far execution is smooth and no crazy spread sensitivity. Would be nice to see some set files shared from the community.",
                  author: "Trader Marko P"
                },
                {
                  text: "The strategies are well-designed and easy to backtest. The interface in MT5 is intuitive, and I've seen consistent results on demo. Highly recommended.",
                  author: "Trader Ana L"
                },
                {
                  text: "I appreciate the variety in the bundle. Each bot feels unique and adaptable to different market conditions. Customer support is quick and helpful as well.",
                  author: "Trader John D"
                },
                {
                  text: "Excellent execution and minimal latency. I was worried about slippage, but it's been very stable so far. Great for both scalping and trend-following strategies.",
                  author: "Trader Sofia K"
                },
                {
                  text: "Backtesting was straightforward, and results were clear. The bundle really saves time and gives a comprehensive approach to trading multiple strategies.",
                  author: "Trader Luka S"
                },
              ].map((review, index) => (
                <div key={`first-${index}`} className="carousel-card-auto">
                  <div className="rounded-xl border border-blue-600/30 bg-gradient-to-br from-blue-950/40 via-[#0f1f4a]/30 to-blue-900/40 p-8 backdrop-blur-sm h-full">
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      "{review.text}"
                    </p>
                    <p className="text-blue-400 font-semibold">— {review.author}</p>
                  </div>
                </div>
              ))}
              
              {/* Duplicate Set for Seamless Loop */}
              {[
                {
                  text: "What I like is that the bundle isn't just one type of bot. There are scalpers, trend-followers, and some grid logic too. I'm still forward-testing on demo, but so far execution is smooth and no crazy spread sensitivity. Would be nice to see some set files shared from the community.",
                  author: "Trader Marko P"
                },
                {
                  text: "The strategies are well-designed and easy to backtest. The interface in MT5 is intuitive, and I've seen consistent results on demo. Highly recommended.",
                  author: "Trader Ana L"
                },
                {
                  text: "I appreciate the variety in the bundle. Each bot feels unique and adaptable to different market conditions. Customer support is quick and helpful as well.",
                  author: "Trader John D"
                },
                {
                  text: "Excellent execution and minimal latency. I was worried about slippage, but it's been very stable so far. Great for both scalping and trend-following strategies.",
                  author: "Trader Sofia K"
                },
                {
                  text: "Backtesting was straightforward, and results were clear. The bundle really saves time and gives a comprehensive approach to trading multiple strategies.",
                  author: "Trader Luka S"
                },
              ].map((review, index) => (
                <div key={`second-${index}`} className="carousel-card-auto">
                  <div className="rounded-xl border border-blue-600/30 bg-gradient-to-br from-blue-950/40 via-[#0f1f4a]/30 to-blue-900/40 p-8 backdrop-blur-sm h-full">
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      "{review.text}"
                    </p>
                    <p className="text-blue-400 font-semibold">— {review.author}</p>
                  </div>
                </div>
              ))}
              </div>
            </div>
            </div>
          </section>
        )}
      </AnimatedSection>

      {/* Email Subscription Section */}
      <EmailSubscriptionSection />
    </main>
  );
}

function EmailSubscriptionSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [ref, isVisible] = useScrollAnimation();

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue.trim() || !emailRegex.test(emailValue)) {
      setEmailError("Enter a valid email address.");
      return false;
    }
    
    setEmailError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // Clear error when user starts typing
    if (emailError) {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-pdf-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setEmailError(data.error || 'Failed to send email. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
      setIsSubmitting(false);
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
        setEmailError("");
      }, 5000);
    } catch (error) {
      console.error('Error submitting email:', error);
      setEmailError('An error occurred. Please try again later.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Transition Divider - Reviews to Email Subscription */}
      <div className="relative h-8 bg-gradient-to-b from-[#050816] to-[#0f1f4a]">
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(59,130,246,0.02)_0%,transparent_100%)]"></div>
      </div>
      <section ref={ref} className="relative bg-gradient-to-b from-[#0f1f4a] via-[#0f172a] to-[#050816] py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl mb-4">
            Get Your Copy of "Top 5 Trading Bots for MT5" PDF!
          </h2>
          <p className="text-lg sm:text-xl text-gray-300">
            Enter your email and we'll send it right over.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email"
                      className={`flex-1 w-full rounded-lg border ${
                        emailError 
                          ? "border-red-500/60 bg-[#050816]" 
                          : "border-blue-600/40 bg-[#050816]"
                      } px-6 py-4 text-white placeholder-gray-500 focus:border-[#1e40af] focus:outline-none transition-colors`}
                    />
                    {emailError && (
                      <p className="mt-2 text-sm text-red-400 animate-fade-in">
                        {emailError}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:from-blue-600 hover:to-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-105 border border-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <span className="relative z-10">{isSubmitting ? "Sending..." : "Send Me the Guide"}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center p-8 rounded-xl border border-green-500/50 bg-green-500/10 backdrop-blur-sm animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-2">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-xl font-semibold text-green-400">
                  Successfully sent to your email!
                </p>
              </div>
            </div>
          )}
          </div>
        </div>
      </section>
    </>
  );
}

