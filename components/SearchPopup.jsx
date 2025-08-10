'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SearchPopup = ({ onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Fetch all products when the component mounts
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setAllProducts(data.data);
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    // Memoize the filtering logic for performance
    const filteredProducts = useMemo(() => {
        if (!searchQuery) {
            return []; // Don't show any results if the query is empty
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return allProducts.filter(product =>
            product.name.toLowerCase().includes(lowercasedQuery) ||
            product.category.toLowerCase().includes(lowercasedQuery) ||
            (product.description && product.description.toLowerCase().includes(lowercasedQuery))
        );
    }, [searchQuery, allProducts]);
    
    const handleResultClick = () => {
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: -20 }}
                transition={{ ease: 'easeOut', duration: 0.2 }}
                className="w-full max-w-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative flex items-center">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="search"
                        placeholder="Search for products..."
                        className="w-full bg-transparent text-lg pl-12 pr-12 py-4 rounded-t-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                         <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                             <X size={20} />
                         </button>
                    )}
                </div>
                
                <div className="border-t border-slate-200 dark:border-slate-700 overflow-y-auto max-h-[60vh]">
                    {isLoading && (
                        <div className="p-6 text-center text-slate-500 flex items-center justify-center gap-2">
                            <Loader size={16} className="animate-spin" /> Loading products...
                        </div>
                    )}
                    {!isLoading && searchQuery && filteredProducts.length === 0 && (
                        <div className="p-6 text-center text-slate-500">
                            <p className="font-semibold">No results found for "{searchQuery}"</p>
                            <p className="text-sm mt-1">Try searching for something else.</p>
                        </div>
                    )}
                    {filteredProducts.length > 0 && (
                        <ul className="p-2">
                            {filteredProducts.map(product => (
                                <li key={product._id}>
                                    <Link 
                                        href={`/products/${product._id}`} 
                                        onClick={handleResultClick}
                                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-indigo-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <img src={product.imageUrl} alt={product.name} className="h-14 w-14 rounded-md object-cover flex-shrink-0" />
                                        <div className="flex-grow">
                                            <p className="font-semibold text-slate-800 dark:text-slate-100">{product.name}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{product.category}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SearchPopup;
