import React from 'react';
import StaggeredGrid from './StaggeredGrid';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, onAddToCart }) => (
    <section className="py-16 sm:py-24 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Explore All Products</h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Browse our entire catalog of thoughtfully designed products.</p>
            </div>
            {/* --- FIX: Added more columns for a denser grid layout --- */}
            <StaggeredGrid className="md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} onAddToCart={onAddToCart} />
                ))}
            </StaggeredGrid>
        </div>
    </section>
);

export default ProductGrid;
