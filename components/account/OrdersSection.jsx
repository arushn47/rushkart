'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Loader, ChevronRight } from 'lucide-react';

const OrdersSection = () => {
    const [recentOrders, setRecentOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/orders')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Show the 3 most recent orders
                    setRecentOrders(data.data.slice(0, 3));
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold flex items-center gap-3"><ShoppingBag size={24} /> Recent Orders</h2>
            <div className="mt-6 space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-8"><Loader className="animate-spin" /></div>
                ) : recentOrders.length > 0 ? (
                    recentOrders.map(order => (
                        <div key={order._id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <div className="flex justify-between items-center text-sm">
                                <p className="font-semibold">Order #{order._id.slice(-6).toUpperCase()}</p>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <div className="flex space-x-2 mt-3">
                                {order.items.slice(0, 4).map(item => (
                                    <img key={item._id} src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-md object-cover" />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                        <p className="text-slate-500">You have no recent orders.</p>
                    </div>
                )}
                <button 
                    onClick={() => router.push('/orders')}
                    className="w-full flex justify-center items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700/50 py-2.5 rounded-lg mt-4"
                >
                    View All Orders <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default OrdersSection;
