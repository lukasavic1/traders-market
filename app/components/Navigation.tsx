"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="sticky top-0 w-full border-b border-blue-900/40 bg-gradient-to-r from-[#050816] via-[#0f172a] to-[#050816] backdrop-blur-sm z-[1000]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/tradersmarket-logo.png"
            alt="TradersMarket.io"
            width={250}
            height={60}
            className="h-7 w-auto sm:h-9 md:h-11"
            priority
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-white transition-colors hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]"
          >
            Home
          </Link>
          <Link
            href="/bundle"
            className="text-sm font-medium text-white transition-colors hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]"
          >
            Bundle Offer
          </Link>
          <Link
            href="/blogs"
            className="text-sm font-medium text-white transition-colors hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]"
          >
            Blogs
          </Link>

          {/* Auth Buttons - Desktop */}
          {!loading && (
            <>
              {!user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-white transition-colors hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:from-blue-600 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 rounded-lg border border-blue-600/30 bg-blue-950/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-950/50 hover:border-blue-500/50"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="max-w-[150px] truncate">
                      {user.displayName || user.email}
                    </span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg border border-blue-600/30 bg-[#0f172a] shadow-xl z-[1001]">
                      <div className="p-4 border-b border-blue-600/20">
                        <p className="text-sm text-gray-400">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-white hover:bg-blue-950/50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-blue-950/50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-white"
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} border-t border-blue-900/30 md:hidden`}>
        <div className="flex flex-col space-y-4 px-4 py-4">
          <Link
            href="/"
            className="text-sm font-medium text-white transition-colors hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/bundle"
            className="text-sm font-medium text-white transition-colors hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Bundle Offer
          </Link>
          <Link
            href="/blogs"
            className="text-sm font-medium text-white transition-colors hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blogs
          </Link>

          {/* Auth Buttons - Mobile */}
          {!loading && (
            <>
              {!user ? (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-white transition-colors hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-block text-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <div className="border-t border-blue-900/30 pt-4">
                    <p className="text-sm text-gray-400 mb-2">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate mb-4">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-white transition-colors hover:text-blue-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-sm font-medium text-red-400 transition-colors hover:text-red-300"
                  >
                    Logout
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
