// src/components/Header.tsx
"use client";

import Link from 'next/link';

export function Header() {
  return (
    <header className="absolute top-0 w-full z-30 flex justify-end items-center p-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/login" 
          className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium  hover:bg-gray-100 transition-colors"
        >
          Login
        </Link>
        <Link 
          href="/signup" 
          className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}