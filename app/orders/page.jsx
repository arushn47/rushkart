'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader, ShoppingBag, Search } from 'lucide-react';

// Import shared and new components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuroraBackground from '@/components/AuroraBackground';
import OrderCard from '@/components/orders/OrderCard';
import OrdersFilter from '@/components/orders/OrdersFilter';

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [allProducts, setAllProducts] = useState([]);
    
    // Define the default state for the filters
    const defaultFilters = {
        status: [],
        time: 'Last 30 days'
    };
    
    const [filters, setFilters] = useState(defaultFilters);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/orders').then(res => res.json()).then(data => {
                if (data.success) setOrders(data.data);
            }).finally(() => setIsLoading(false));
            
            fetch('/api/products').then(res => res.json()).then(data => data.success && setAllProducts(data.data));
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

    const filteredOrders = useMemo(() => {
        return orders
            .filter(order => {
                // Search filter
                const query = searchQuery.toLowerCase();
                return !query || order.items.some(item => item.name.toLowerCase().includes(query)) || order._id.toLowerCase().includes(query);
            })
            .filter(order => {
                // Status filter
                if (filters.status.length === 0) return true;
                return filters.status.includes(order.status);
            })
            .filter(order => {
                // Time filter
                const orderDate = new Date(order.createdAt);
                const now = new Date();
                if (filters.time === 'Last 30 days') {
                    const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30));
                    return orderDate >= thirtyDaysAgo;
                }
                if (filters.time.match(/^\d{4}$/)) {
                    return orderDate.getFullYear() === parseInt(filters.time);
                }
                if (filters.time === 'Older') {
                     return orderDate.getFullYear() < 2022;
                }
                return true;
            });
    }, [orders, searchQuery, filters]);

    if (status === 'loading' || isLoading) {
        return <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900"><Loader className="animate-spin" size={32} /></div>;
    }

    if (!session) return null;

    return (
        <div className="relative bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans antialiased">
            <AuroraBackground />
            <Header categories={uniqueCategories} />
            <main className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-7">
                {/* Page Title */}
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-12">My Orders</h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 lg:sticky top-24">
                        <OrdersFilter 
                            filters={filters} 
                            setFilters={setFilters} 
                            defaultFilters={defaultFilters} 
                        />
                    </div>

                    {/* Right Content */}
                    <div className="lg:col-span-3">
                        <div className="relative mb-6">
                            <input 
                                type="text"
                                placeholder="Search your orders here"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-4 pr-12 py-3 rounded-lg border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 transition"
                            />
                             <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2">
                                <Search size={16} /> Search Orders
                            </button>
                        </div>

                        <div className="space-y-6">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <OrderCard key={order._id} order={order} />
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg">
                                    <ShoppingBag size={48} className="mx-auto text-slate-400" />
                                    <h2 className="mt-4 text-xl font-semibold">No Orders Found</h2>
                                    <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
