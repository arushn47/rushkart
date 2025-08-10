'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader, Tag } from 'lucide-react';
import { useCart } from '@/components/CartContext';

// Import shared components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuroraBackground from '@/components/AuroraBackground';
import ProductCard from '@/components/ProductCard';
import StaggeredGrid from '@/components/StaggeredGrid';

export default function DealsPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const { addToCart, openCart, cartItems } = useCart();

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProducts(data.data);
                }
                setIsLoading(false);
            });
    }, []);

    // Filter for products that are on sale
    const dealProducts = useMemo(() => {
        return products.filter(product => product.salePrice && product.salePrice < product.price);
    }, [products]);

    return (
        <div className="relative bg-transparent text-slate-800 dark:text-slate-200 font-sans antialiased">
            <AuroraBackground />
            <Header 
                onCartClick={openCart}
                onSearchClick={() => {}} // Add search functionality if needed
                cartItemCount={cartItems.length}
                onMenuClick={() => {}} // Add mobile menu functionality if needed
            />
            
            <main className="min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Today's Deals</h1>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Don't miss out on these limited-time offers.</p>
                    </motion.div>

                    <div className="mt-12">
                        {isLoading ? (
                            <div className="flex justify-center py-20"><Loader className="animate-spin" size={32} /></div>
                        ) : dealProducts.length > 0 ? (
                            <StaggeredGrid className="md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {dealProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
                                ))}
                            </StaggeredGrid>
                        ) : (
                            <div className="text-center py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg">
                                <Tag size={48} className="mx-auto text-slate-400" />
                                <h2 className="mt-4 text-xl font-semibold">No Deals Right Now</h2>
                                <p className="text-slate-500 mt-2">Check back soon for new offers!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
