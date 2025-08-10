'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

// Import shared and new components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuroraBackground from '@/components/AuroraBackground';
import ProfileSection from '@/components/account/ProfileSection';
import AddressesSection from '@/components/account/AddressesSection';
import OrdersSection from '@/components/account/OrdersSection';

// --- Skeleton Loader for the new grid layout ---
const AccountSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-pulse">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-1 p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl">
            <div className="flex justify-between items-center">
                <div className="h-7 w-1/2 rounded bg-slate-300 dark:bg-slate-700"></div>
                <div className="h-6 w-16 rounded bg-slate-300 dark:bg-slate-700"></div>
            </div>
            <div className="mt-6 flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                <div className="space-y-2">
                    <div className="h-8 w-32 rounded bg-slate-300 dark:bg-slate-700"></div>
                    <div className="h-4 w-48 rounded bg-slate-300 dark:bg-slate-700"></div>
                </div>
            </div>
        </div>
        {/* Right Column Skeleton */}
        <div className="lg:col-span-2 space-y-8">
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl">
                <div className="h-7 w-1/3 rounded bg-slate-300 dark:bg-slate-700 mb-6"></div>
                <div className="space-y-4">
                    <div className="h-20 w-full rounded-lg bg-slate-200 dark:bg-slate-700/50"></div>
                    <div className="h-8 w-1/4 rounded-lg bg-slate-200 dark:bg-slate-700/50"></div>
                </div>
            </div>
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl">
                <div className="h-7 w-1/3 rounded bg-slate-300 dark:bg-slate-700 mb-6"></div>
                <div className="h-24 w-full rounded-lg bg-slate-200 dark:bg-slate-700/50"></div>
            </div>
        </div>
    </div>
);

export default function AccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        if (status === 'authenticated') {
            setIsLoading(false);
            fetch('/api/products')
                .then(res => res.json())
                .then(data => data.success && setAllProducts(data.data));
        }
        if (status === 'unauthenticated') {
            router.push('/api/auth/signin');
        }
    }, [status, router]);

    const uniqueCategories = useMemo(() => {
        if (!allProducts.length) return [];
        const categories = new Set(allProducts.map(p => p.category));
        return Array.from(categories);
    }, [allProducts]);

    if (status === 'loading' || isLoading) {
        return (
            <div className="relative bg-slate-50 dark:bg-slate-900">
                <Header />
                <main className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                    <div className="h-10 w-1/3 rounded bg-slate-300 dark:bg-slate-700 mb-12 animate-pulse"></div>
                    <AccountSkeleton />
                </main>
                <Footer />
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="relative bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans antialiased">
            <AuroraBackground />
            <style jsx global>{`
                .form-input { @apply w-full rounded-lg border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 transition; }
                .form-label { @apply block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1; }
            `}</style>
            <Header categories={uniqueCategories} />
            <main className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-10">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-12">My Account</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-1">
                        <ProfileSection />
                    </div>
                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <AddressesSection />
                        <OrdersSection />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
