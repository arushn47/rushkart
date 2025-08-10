'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartContext';

const ProductCard = ({ product }) => { // The onAddToCart prop is no longer needed
    const router = useRouter();
    const { addToCart, addToCartWithoutOpening } = useCart(); // Get functions from context

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        hover: { y: -8, scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 15 } },
    };

    const handleBuyNow = () => {
        addToCartWithoutOpening(product); // Use the new function that doesn't open the cart
        router.push('/checkout');
    };

    return (
        <motion.div variants={cardVariants} whileHover="hover" className="group relative flex flex-col">
            <div className="relative">
                <Link href={`/products/${product._id}`}>
                    <div className="aspect-square w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700 shadow-lg">
                        <motion.img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="h-full w-full object-cover object-center" 
                            whileHover={{ scale: 1.1 }} 
                            transition={{ duration: 0.3 }} 
                        />
                    </div>
                </Link>
                <div className="absolute bottom-4 left-4 right-4">
                    <motion.div initial={{ opacity: 0, y: 10 }} whileHover={{ opacity: 1, y: 0 }} transition={{ staggerChildren: 0.1 }} className="flex justify-center gap-2">
                        <motion.button 
                            onClick={handleBuyNow}
                            className="flex-grow rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-800 backdrop-blur-sm shadow-md"
                        >
                            Buy Now
                        </motion.button>
                        {/* The regular Add to Cart button still uses the original function */}
                        <motion.button onClick={() => addToCart(product)} className="rounded-full bg-indigo-600 p-2 text-white shadow-md"><ShoppingCart size={18} /></motion.button>
                    </motion.div>
                </div>
            </div>
            <Link href={`/products/${product._id}`}>
                <div className="mt-4 flex justify-between">
                    <div>
                        <h3 className="text-sm text-slate-700 dark:text-slate-200">{product.name}</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{product.category}</p>
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">₹{product.price.toFixed(2)}</p>
                </div>
                <div className="mt-1 flex items-center">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < product.rating ? 'text-amber-400 fill-current' : 'text-slate-300 dark:text-slate-600'} />)}
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
