'use client';

import React from 'react';
import { X, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const OrdersFilter = ({ filters, setFilters, defaultFilters }) => {
    const handleStatusChange = (status) => {
        setFilters(prev => {
            const newStatus = prev.status.includes(status)
                ? prev.status.filter(s => s !== status)
                : [...prev.status, status];
            return { ...prev, status: newStatus };
        });
    };

    const handleTimeChange = (time) => {
        setFilters(prev => ({ ...prev, time }));
    };

    const clearFilters = () => {
        setFilters(defaultFilters);
    };

    const hasActiveFilters = filters.status.length > 0 || filters.time !== defaultFilters.time;

    const orderStatuses = ['Placed', 'Cancelled'];
    const orderTimes = ['Last 30 days', '2025', '2024', '2023', '2022', 'Older'];

    return (
        <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-3">
                <h3 className="text-lg font-semibold">Filters</h3>
                {hasActiveFilters && (
                    <button 
                        onClick={clearFilters} 
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 transition-opacity"
                    >
                        <X size={12} /> Clear
                    </button>
                )}
            </div>
            
            {/* Order Status Filter */}
            <div>
                <h4 className="font-semibold text-sm uppercase text-slate-600 dark:text-slate-400 mb-3">Order Status</h4>
                <div className="flex flex-wrap gap-2">
                    {orderStatuses.map(status => {
                        const isActive = filters.status.includes(status);
                        return (
                            <button
                                key={status}
                                onClick={() => handleStatusChange(status)}
                                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                                    isActive 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-slate-200/50 dark:bg-slate-700/50 hover:bg-slate-300 dark:hover:bg-slate-600'
                                }`}
                            >
                                {isActive && <Check size={16} />}
                                {status}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Order Time Filter */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-sm uppercase text-slate-600 dark:text-slate-400 mb-3">Order Time</h4>
                <div className="flex flex-col space-y-1 p-1 bg-slate-200/50 dark:bg-slate-900/50 rounded-xl">
                    {orderTimes.map(time => (
                        <button
                            key={time}
                            onClick={() => handleTimeChange(time)}
                            className={`w-full relative px-3 py-2 text-sm font-semibold rounded-lg transition-colors text-left ${
                                filters.time === time 
                                ? 'text-slate-900 dark:text-white' 
                                : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            {filters.time === time && (
                                <motion.div
                                    layoutId="active-time-filter"
                                    className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm"
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                />
                            )}
                            <span className="relative z-10">{time}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrdersFilter;
