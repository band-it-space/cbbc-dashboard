"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full max-w-screen-2xl mx-auto py-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-blue-700">CBBC Dashboard</h1>
        <nav className="space-x-4">
          <Link
            href="/dashboard"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Dashboard
          </Link>
          {/* <Link
            href="/search"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Search
          </Link> */}
        </nav>
      </div>
    </header>
  );
}
