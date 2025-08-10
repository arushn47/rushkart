'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag } from 'lucide-react';
import Link from 'next/link'; // Import the Link component

const slides = [
    {
        imageUrl: '/modern-tech.jpg',
        title: 'Find Your Next Favorite Thing.',
        subtitle: 'High-quality, curated products delivered to your doorstep. Fast.'
    },
    {
        imageUrl: '/lifestyle-essentials.jpg',
        title: 'Elevate Your Everyday.',
        subtitle: 'Discover products that blend form, function, and style.'
    },
    {
        imageUrl: '/audio.jpg',
        title: 'Immerse Yourself in Sound.',
        subtitle: 'Experience audio like never before with our premium selection.'
    },
    {
        imageUrl: '/sustainable-design.png',
        title: 'Built to Last. Designed for Life.',
        subtitle: 'Sustainable choices for a modern world.'
    },
];

const HeroSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % slides.length);
    }, 7000); // Change slide every 7 seconds
    return () => clearInterval(interval);
  }, []);

  const carouselVariants = {
    enter: {
      opacity: 0,
      scale: 1.05,
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { duration: 1.5, ease: "easeOut" },
        scale: { duration: 10, ease: "easeInOut" } 
      }
    },
    exit: {
      opacity: 0,
      scale: 1,
      transition: {
        opacity: { duration: 1.5, ease: "easeIn" }
      }
    }
  };

  return (
    <section className="relative h-[90vh] min-h-[600px] text-center overflow-hidden">
        <AnimatePresence initial={false}>
            <motion.div
                key={index}
                variants={carouselVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${slides[index].imageUrl})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            />
        </AnimatePresence>
        
        <div className="absolute inset-0 z-10 bg-black/40"></div>

        <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-white">
            <AnimatePresence mode="wait">
                <motion.h1
                    key={`title-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter"
                >
                    {slides[index].title}
                </motion.h1>
            </AnimatePresence>
            <AnimatePresence mode="wait">
                 <motion.p
                    key={`subtitle-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: "easeInOut" }}
                    className="mt-4 max-w-2xl mx-auto text-lg text-white/90"
                >
                    {slides[index].subtitle}
                </motion.p>
            </AnimatePresence>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
                <Link href="/products">
                    <motion.button whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px -5px rgba(0,0,0,0.3)" }} whileTap={{ scale: 0.95 }} className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 shadow-lg transition-colors hover:bg-slate-200">
                        Shop The Collection
                    </motion.button>
                </Link>
                <Link href="/deals">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center justify-center rounded-full bg-white/20 text-white px-8 py-3 text-sm font-semibold shadow-lg backdrop-blur-sm border border-white/30">
                        <Tag size={16} className="mr-2" />
                        Weekly Deals
                    </motion.button>
                </Link>
            </motion.div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
                <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                />
            ))}
        </div>
    </section>
  );
};

export default HeroSection;