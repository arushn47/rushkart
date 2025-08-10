'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import Link from 'next/link';

const OrderCard = ({ order }) => {
    const router = useRouter();

    const getStatusInfo = () => {
        switch (order.status) {
            case 'Placed':
                return { color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300', text: 'Placed' };
            case 'Cancelled':
                return { color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300', text: 'Order Cancelled' };
            default:
                return { color: 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-300', text: order.status };
        }
    };

    const { color, text } = getStatusInfo();
    
    // Format date to include time
    const orderDateTime = new Date(order.createdAt).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
            {/* Order Header */}
            <div className="p-4 bg-slate-100/80 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm gap-2">
                <div className="flex flex-col sm:flex-row sm:gap-6">
                    <p className="font-semibold">
                        Order ID: <span className="font-normal text-slate-600 dark:text-slate-300">{order._id.slice(-8).toUpperCase()}</span>
                    </p>
                    <p className="font-semibold">
                        Date: <span className="font-normal text-slate-600 dark:text-slate-300">{orderDateTime}</span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <p className="font-semibold">
                        Total: <span className="font-normal text-slate-600 dark:text-slate-300">₹{order.totalAmount.toFixed(2)}</span>
                    </p>
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${color}`}>{text}</span>
                </div>
            </div>

            {/* Items list */}
            <div className="p-6 space-y-6">
                {order.items.map(item => (
                    <div
                        key={item._id}
                        className="flex flex-col md:flex-row items-start border-b border-slate-200 dark:border-slate-700 py-4 last:border-b-0 last:pb-0 gap-4"
                    >
                        {/* Product image */}
                        <div className="flex-shrink-0">
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                        </div>

                        {/* Name & details */}
                        <div className="flex-1 md:pr-2">
                            <h3
                                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                                onClick={() => router.push(`/products/${item.product}`)}
                            >
                                {item.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                {item.description}
                            </p>
                        </div>

                        {/* Price & Rate */}
                        <div className="flex flex-col items-end justify-between min-w-[112px] md:pl-2 gap-2 md:gap-0">
                            <p className="font-semibold text-sm mb-2 md:mb-3">
                                ₹{item.price.toFixed(2)}
                            </p>
                            <Link
                                href={`/products/${item.product}#reviews`}
                                className="flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                <Star size={16} /> Rate & Review
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderCard;
