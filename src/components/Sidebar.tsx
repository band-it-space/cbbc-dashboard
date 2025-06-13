// src/components/Sidebar.tsx
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white shadow-md h-screen p-4">
      <nav className="flex flex-col gap-2">
        <Link href="/dashboard" className="font-medium hover:text-blue-500">
          Dashboard
        </Link>
        <Link href="/search" className="font-medium hover:text-blue-500">
          Search
        </Link>
      </nav>
    </aside>
  );
}
