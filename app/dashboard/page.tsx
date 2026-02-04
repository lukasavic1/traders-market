"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

function DashboardContent() {
  const { user, loading, hasActiveSubscription } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    // Paid users: redirect straight to bots (no intermediate dashboard view)
    if (user && hasActiveSubscription === true) {
      router.replace('/dashboard/bots');
    }
  }, [user, loading, hasActiveSubscription, router]);

  // After payment success, webhook may have updated Firestore; refetch and redirect to bots
  useEffect(() => {
    const paymentSuccess = searchParams?.get('payment_success');
    if (paymentSuccess !== 'true' || !user) return;
    const t = setTimeout(async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().hasPaid === true) {
          router.replace('/dashboard/bots');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 2000);
    return () => clearTimeout(t);
  }, [searchParams, user, router]);

  const hasPaid = hasActiveSubscription === true;

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  // Paid users are redirected to /dashboard/bots; show loader until redirect happens
  if (hasActiveSubscription === true) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Redirecting...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-blue-600/25 bg-gradient-to-br from-blue-950/30 via-[#0f1f4a]/25 to-blue-900/20 p-8 shadow-2xl backdrop-blur-sm">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600/20 via-blue-700/20 to-blue-600/20 blur-xl" />
          
          <div className="relative">
            <h1 className="text-4xl font-bold text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Welcome back, {user.displayName || user.email}!
            </p>

            {/* Access Status Section - Centered & Emphasized */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent mb-8">
                Access Status
              </h2>

              <div className="max-w-3xl mx-auto">
                {/* Loading State - subscription status from AuthContext */}
                {hasActiveSubscription === undefined ? (
                  <div className="relative rounded-2xl border-[3px] border-blue-500/50 bg-gradient-to-br from-blue-950/40 via-[#0f172a]/95 to-blue-900/30 p-12 backdrop-blur-sm shadow-2xl">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-400 text-lg">Loading access status...</p>
                    </div>
                  </div>
                ) : (
                  /* Unified Access Card - Blue Accent */
                  <div className="group relative transition-all duration-300">
                    {/* Enhanced outer glow - Always Blue */}
                    <div className="absolute -inset-2 rounded-2xl blur-xl transition duration-500 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 opacity-50"></div>
                  
                  <div className="relative rounded-2xl border-[3px] p-8 backdrop-blur-sm transition-all duration-300 shadow-2xl border-blue-500/50 bg-gradient-to-br from-blue-950/40 via-[#0f172a]/95 to-blue-900/30 hover:border-blue-500/70 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.01]">
                    {/* Decorative top accent line - Always Blue */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 rounded-b-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

                    {/* Status Badge - Changes Color Based on Payment Status */}
                    <div className="absolute top-6 right-6">
                      {hasPaid ? (
                        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500/40 to-emerald-600/40 border-2 border-green-500/60 flex items-center gap-2 shadow-lg shadow-green-500/20">
                          <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
                          <span className="text-sm font-bold text-green-300 uppercase tracking-wider">Paid</span>
                        </div>
                      ) : (
                        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/30 to-blue-700/30 border-2 border-blue-600/50 flex items-center gap-2 shadow-lg shadow-blue-600/20">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                          <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">Unpaid</span>
                        </div>
                      )}
                    </div>

                    {/* Icon - Always Blue */}
                    <div className="mb-6 inline-flex p-4 rounded-xl shadow-lg bg-blue-600/30 shadow-blue-500/20">
                      <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>

                    {/* Content - Always Same */}
                    <h3 className="text-3xl font-bold text-white mb-3">
                      Premium Access
                    </h3>
                    <p className="text-base mb-8 text-blue-400/90">
                      Full access to all trading bots and premium features
                    </p>

                    {/* Features List - Always Blue */}
                    <div className="space-y-4 mb-8">
                      {[
                        'Access to 10+ Trading Bots',
                        'Premium Strategy Arsenal',
                        'Priority Support',
                        'Regular Updates & New Bots',
                        'Advanced Risk Management'
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-blue-500/20 border border-blue-500/40">
                            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-base text-gray-200 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer with Button */}
                    <div className="pt-6 border-t-2 border-blue-500/30">
                      {hasPaid ? (
                        <>
                          <Link
                            href="/dashboard/bots"
                            onClick={(e) => {
                              // Double-check payment status before navigating
                              if (!hasPaid && user?.email) {
                                e.preventDefault();
                                const checkoutUrl = `https://www.momentumdigital.online/checkout?email=${encodeURIComponent(user.email)}`;
                                window.location.href = checkoutUrl;
                              }
                            }}
                            className="w-full py-4 px-8 rounded-xl text-white text-lg font-bold transition-all duration-300 flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-500 hover:via-emerald-500 hover:to-green-500 hover:shadow-2xl hover:shadow-green-600/50 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Access Your Bots</span>
                          </Link>
                          <p className="text-center text-green-400/80 text-sm mt-4 font-medium">
                            Click to view all premium trading bots
                          </p>
                        </>
                      ) : (
                        <>
                          <a
                            href={user?.email ? `https://www.momentumdigital.online/checkout?email=${encodeURIComponent(user.email)}` : 'https://www.momentumdigital.online/checkout'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-4 px-8 rounded-xl text-white text-lg font-bold transition-all duration-300 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 hover:from-blue-500 hover:via-blue-600 hover:to-blue-500 hover:shadow-2xl hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <span>Pay Now</span>
                          </a>
                          <p className="text-center text-blue-400/80 text-sm mt-4 font-medium">
                            Complete payment to unlock all premium features
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="mt-8 rounded-xl border border-blue-600/30 bg-gradient-to-br from-blue-950/40 to-blue-900/30 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Account Information</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-blue-600/20">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white font-medium">{user.email}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-blue-600/20">
                  <span className="text-gray-400">Payment Status</span>
                  <span className={`font-medium flex items-center gap-2 ${
                    hasPaid ? 'text-green-400' : 'text-blue-500'
                  }`}>
                    {hasPaid ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
                        <span>Paid</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                        <span>Unpaid</span>
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-400">Account Created</span>
                  <span className="text-white font-medium">
                    {user.metadata.creationTime 
                      ? new Date(user.metadata.creationTime).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
