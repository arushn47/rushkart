import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link'; // Import Link for client-side navigation

const ShopByCategory = ({ categories }) => {
    // A fallback for when no categories are provided
    const displayCategories = categories || [];

    return (
        <section className="py-16 sm:py-24 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Shop by Category</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Find what you're looking for, faster.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayCategories.map((cat, index) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Use Next.js Link for better navigation */}
                            <Link 
                                href={`/products?category=${encodeURIComponent(cat.name)}`} 
                                className="group relative block h-96 overflow-hidden rounded-2xl shadow-xl"
                            >
                                <img src={cat.image} alt={cat.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-8">
                                    <h3 className="text-2xl font-bold text-white">{cat.name}</h3>
                                    <p className="text-white/80 flex items-center mt-2">
                                        Shop Now <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShopByCategory;
