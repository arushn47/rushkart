'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function AccessDeniedPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center bg-slate-50 dark:bg-slate-900 px-4">
      <AlertTriangle size={64} className="text-amber-500 mb-6" />
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Access Denied</h1>
      <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
        You do not have permission to view this page.
      </p>
      <p className="text-slate-500 dark:text-slate-500">
        Please contact support if you believe this is an error.
      </p>
      <Link href="/" className="mt-8 inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-indigo-700">
          Go back to Homepage
      </Link>
    </div>
  );
}
