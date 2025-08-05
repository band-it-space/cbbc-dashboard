"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header
      className="shadow-sm"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <div className="w-full max-w-screen-2xl mx-auto py-6 flex items-center justify-between px-6">
        <h1 style={{ color: "#1E40AF" }} className="text-xl font-semibold">
          <Link href="/" className="hover:underline">
            CBBC Dashboard
          </Link>
        </h1>
        <nav className="space-x-4">
          <Link
            href="/dashboard"
            className="font-medium transition hover:underline"
            style={{
              color: "#4B5563",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#2563EB";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "#4B5563";
            }}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/ko-codes"
            className="font-medium transition hover:underline"
            style={{
              color: "#4B5563",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#2563EB";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "#4B5563";
            }}
          >
            KO Codes
          </Link>
        </nav>
      </div>
    </header>
  );
}
