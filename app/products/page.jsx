'use client';

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useSearchParams } from 'next/navigation';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuroraBackground from '@/components/AuroraBackground';
import ProductCard from '@/components/ProductCard';
import StaggeredGrid from '@/components/StaggeredGrid';

// --- Filter Bar Component ---
const FilterBar = ({ categories, activeCategory, onSelectCategory }) => (
  <div className="flex flex-wrap items-center gap-2 md:gap-4 my-8">
    <button
      onClick={() => onSelectCategory('All')}
      className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
        activeCategory === 'All'
          ? 'bg-indigo-600 text-white'
          : 'bg-white/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      All
    </button>
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => onSelectCategory(category)}
        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
          activeCategory === category
            ? 'bg-indigo-600 text-white'
            : 'bg-white/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        {category}
      </button>
    ))}
  </div>
);

// Actual products logic—must be wrapped in Suspense!
function ProductsContent() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { addToCart, openCart, cartItems } = useCart();
  const searchParams = useSearchParams();

  // Get the initial category from the URL, or default to 'All'
  const initialCategory = searchParams.get('category') || 'All';
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
        }
        setIsLoading(false);
      });
  }, []);

  // Update active category if URL changes
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  // Memoize the filtered products to avoid re-calculating on every render
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') {
      return products;
    }
    return products.filter((product) => product.category === activeCategory);
  }, [products, activeCategory]);

  // Derive unique categories from the products list
  const uniqueCategories = useMemo(() => {
    const categories = new Set(products.map((p) => p.category));
    return Array.from(categories);
  }, [products]);

  return (
    <div className="relative bg-transparent text-slate-800 dark:text-slate-200 font-sans antialiased">
      <AuroraBackground />
      <Header
        onCartClick={openCart}
        onSearchClick={() => {}}
        cartItemCount={cartItems.length}
        onMenuClick={() => {}}
      />

      <main className="min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {activeCategory === 'All' ? 'All Products' : activeCategory}
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              {activeCategory === 'All'
                ? 'Browse our entire catalog of thoughtfully designed products.'
                : `Discover the best in ${activeCategory.toLowerCase()}.`}
            </p>
          </motion.div>

          <FilterBar
            categories={uniqueCategories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          <div className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader className="animate-spin" size={32} />
              </div>
            ) : (
              <StaggeredGrid className="md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </StaggeredGrid>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// The actual page exported—wrapped in Suspense!
export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader className="animate-spin" size={32} />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
