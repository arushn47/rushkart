"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn } from 'next-auth/react';
import { ShoppingCart, Search, Menu, ChevronDown } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import Link from 'next/link';

const CategoryDropdown = () => {
    const dropdownVariants = {
        enter: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: 'easeIn' } }
    };
    const itemVariants = {
        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
    };
    const categories = ['Tech', 'Lifestyle', 'Audio', 'Furniture'];

    return (
        <motion.div 
            variants={dropdownVariants} 
            initial="exit" 
            animate="enter" 
            exit="exit"
            className="absolute top-full mt-2 w-56 origin-top-right rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg shadow-xl ring-1 ring-black ring-opacity-5"
        >
            <div className="p-2">
                <motion.ul
                    variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
                    initial="initial"
                    animate="animate"
                >
                    {categories.map(category => (
                        <motion.li key={category} variants={itemVariants}>
                            <Link
                                href={`/products?category=${encodeURIComponent(category)}`}
                                className="block rounded-lg px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-500 hover:text-white"
                            >
                                {category}
                            </Link>
                        </motion.li>
                    ))}
                </motion.ul>
            </div>
        </motion.div>
    );
};

const Header = ({ onCartClick, onSearchClick, cartItemCount, onMenuClick }) => {
    const { data: session, status } = useSession();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isCategoryHovered, setIsCategoryHovered] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleContactClick = () => {
        const footer = document.getElementById('footer');
        if (footer) {
            footer.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const chevronVariants = {
        hover: { rotate: 180 },
        rest: { rotate: 0 }
    };

    return (
        <header className={`sticky top-0 left-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-md' : 'bg-transparent'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">RushKart</Link>
                    <nav className="hidden md:flex md:items-center md:space-x-8">
                        <motion.div 
                            className="relative"
                            onHoverStart={() => setIsCategoryHovered(true)}
                            onHoverEnd={() => setIsCategoryHovered(false)}
                        >
                            <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                                Categories
                                <motion.div variants={chevronVariants} animate={isCategoryHovered ? "hover" : "rest"}>
                                    <ChevronDown size={16} />
                                </motion.div>
                            </Link>
                            <AnimatePresence>
                                {isCategoryHovered && <CategoryDropdown />}
                            </AnimatePresence>
                        </motion.div>
                        
                        {/* Updated Navigation Links */}
                        <Link href="/deals" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Deals
                        </Link>
                        <button onClick={handleContactClick} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Contact
                        </button>

                    </nav>
                    <div className="flex items-center space-x-4">
                        <button onClick={onSearchClick} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"><Search size={20} /></button>
                        <button className="relative text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors" onClick={onCartClick}>
                            <ShoppingCart size={20} />
                            {cartItemCount > 0 && (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white">
                                    {cartItemCount}
                                </motion.span>
                            )}
                        </button>

                        <div className="hidden md:block">
                            {status === 'loading' ? (
                                <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                            ) : session ? (
                                <ProfileDropdown />
                            ) : (
                                <button
                                    onClick={() => signIn('google')}
                                    className="inline-flex items-center justify-center rounded-full bg-slate-800 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 dark:hover:bg-slate-600"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>

                        <button className="md:hidden text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white" onClick={onMenuClick}><Menu size={24} /></button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
