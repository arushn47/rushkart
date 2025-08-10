import React from 'react';
import StaggeredGrid from './StaggeredGrid';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const FeaturedProducts = ({ products, onAddToCart }) => (
  <section className="relative py-20 sm:py-28 overflow-hidden" aria-label="Featured Products">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/50 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-50 -z-10 animate-blob"></div>
    <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-indigo-200/50 dark:bg-indigo-900/30 rounded-full filter blur-3xl opacity-50 -z-10 animate-blob animation-delay-2000"></div>

    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Trending Now
          </h2>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
            Top picks this week, just for you.
          </p>
        </div>
        <motion.a 
          href="/products" 
          whileHover={{ x: 5 }}
          className="inline-flex items-center font-semibold text-indigo-600 dark:text-indigo-400 flex-shrink-0"
        >
          View All Products
          <ArrowRight size={20} className="ml-1" />
        </motion.a>
      </div>
      
      <div className="mt-12">
        {products && products.length > 0 ? (
          // --- FIX: Added more columns for a denser grid layout ---
          <StaggeredGrid className="md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={onAddToCart} />
            ))}
          </StaggeredGrid>
        ) : (
          <div className="text-center py-12 text-lg text-slate-400 dark:text-slate-500">
            No trending products right now. Check back later!
          </div>
        )}
      </div>
    </div>
  </section>
);

export default FeaturedProducts;
