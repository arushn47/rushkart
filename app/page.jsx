'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useCart } from '@/components/CartContext';

// Import Components
import AuroraBackground from '@/components/AuroraBackground';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileMenu from '@/components/MobileMenu';
import SearchPopup from '@/components/SearchPopup';
import HeroSection from '@/components/HeroSection';
import ShopByCategory from '@/components/ShopByCategory';
import FeaturedProducts from '@/components/FeaturedProducts';
import Testimonials from '@/components/Testimonials';
import BrandSection from '@/components/BrandSection';
import { Loader } from 'lucide-react';

export default function HomePage() {
    const { addToCart, openCart, cartItems } = useCart();
    const [searchOpen, setSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const mainCategories = [
        { name: 'Tech', image: '/modern-tech.jpg' },
        { name: 'Lifestyle', image: '/lifestyle-essentials.jpg' },
        { name: 'Audio', image: '/audio.jpg' },
    ];

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProducts(data.data);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch products:", err);
                setIsLoading(false);
            });
    }, []);

    return (
        // The main container no longer has overflow-x-hidden.
        <div className="relative bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans antialiased">
            <Header 
                onCartClick={openCart}
                onSearchClick={() => setSearchOpen(true)}
                cartItemCount={cartItems.length}
                onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
            <AnimatePresence>
                {mobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}
                {searchOpen && <SearchPopup onClose={() => setSearchOpen(false)} />}
            </AnimatePresence>
            
            {/* This new wrapper contains the overflow, isolating it from the Header. */}
            <div className="relative overflow-x-hidden z-10">
                <AuroraBackground />
                <main>
                    <HeroSection />
                    <ShopByCategory categories={mainCategories} />
                    {isLoading ? (
                        <div className="flex justify-center py-20"><Loader className="animate-spin" /></div>
                    ) : (
                        <FeaturedProducts products={products.slice(0, 4)} onAddToCart={addToCart} />
                    )}
                    <Testimonials />
                    <BrandSection />
                </main>
                <Footer />
            </div>
        </div>
    );
}
