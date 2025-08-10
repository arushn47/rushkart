// app/components/BrandSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const BrandSection = () => (
    <section className="py-20 sm:py-28 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6, ease: "easeOut" }} className="order-2 lg:order-1">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">The RushKart Promise</h2>
                    <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">We're not just a store; we're a promise. A promise of quality, speed, and exceptional design. Every product in our catalog is hand-picked and tested to ensure it meets our high standards. Shop with confidence.</p>
                    <motion.a href="#" whileHover={{ x: 5 }} className="mt-8 inline-flex items-center font-semibold text-indigo-600 dark:text-indigo-400">Learn More About Our Mission <ChevronRight size={20} className="ml-1" /></motion.a>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6, ease: "easeOut" }} className="order-1 lg:order-2 h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                    <img src="/rushKart.png" alt="RushKart Workspace" className="w-full h-full object-cover" />
                </motion.div>
            </div>
        </div>
    </section>
);

export default BrandSection;