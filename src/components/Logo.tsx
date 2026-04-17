"use client";

import React from 'react';

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect width="100" height="100" rx="24" fill="currentColor" fillOpacity="0.1" />
        <path
          d="M30 70V30L50 50L70 30V70"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50 50L75 75"
          stroke="var(--accent)"
          strokeWidth="12"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
