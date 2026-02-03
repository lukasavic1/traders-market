"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Post-login/signup redirect: sends user to the correct dashboard
 * based on hasActiveSubscription (no intermediate /dashboard page for paid users).
 */
export default function AuthRedirectPage() {
  const { user, loading, hasActiveSubscription } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    // Subscription status loaded from Firestore in AuthContext
    if (hasActiveSubscription === undefined) return;
    const path = hasActiveSubscription ? "/dashboard/bots" : "/dashboard";
    router.replace(path);
  }, [user, loading, hasActiveSubscription, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Redirecting...</p>
      </div>
    </main>
  );
}
