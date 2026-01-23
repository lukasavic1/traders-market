"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <nav className="w-full border-b border-blue-900/40 bg-gradient-to-r from-[#050816] via-[#0f172a] to-[#050816] backdrop-blur-sm">
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

        {/* Navigation Links */}
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
        </div>
      </div>
    </nav>
  );
}
