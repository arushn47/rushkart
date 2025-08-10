'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Loader, AlertCircle, Check, Package, X } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useSession, signIn } from 'next-auth/react';

// Import shared components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuroraBackground from '@/components/AuroraBackground';

// --- Review Form Modal ---
const ReviewFormModal = ({ productId, onClose, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        setError('');
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, rating, title, text }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to submit review.');
            }
            onReviewSubmitted(); // Changed to trigger a refetch
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: -20 }} className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Write a Review</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="form-label">Your Rating</label>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={28}
                                        className={`cursor-pointer transition-colors ${ (hoverRating || rating) > i ? 'text-amber-400 fill-current' : 'text-slate-300 dark:text-slate-600'}`}
                                        onMouseEnter={() => setHoverRating(i + 1)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(i + 1)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="title" className="form-label">Review Title</label>
                            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" required />
                        </div>
                        <div>
                            <label htmlFor="text" className="form-label">Your Review</label>
                            <textarea id="text" value={text} onChange={(e) => setText(e.target.value)} rows="4" className="form-input" required />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    <div className="mt-6 flex justify-end">
                        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-indigo-400">
                            {isSubmitting ? <Loader size={16} className="animate-spin" /> : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};


const CustomerReviews = ({ reviews, onWriteReview, canWriteReview }) => {
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;
    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
        const count = reviews.filter(r => r.rating === stars).length;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        return { stars, count, percentage };
    });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-16 sm:mt-24">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">Customer Reviews</h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4">
                    <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg">
                        <div className="flex items-center gap-2">
                            <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
                            <div className="flex flex-col">
                                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={20} className={i < Math.round(averageRating) ? 'text-amber-400 fill-current' : 'text-slate-300 dark:text-slate-600'} />)}</div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{totalReviews} global ratings</p>
                            </div>
                        </div>
                        <div className="mt-6 space-y-2">{ratingDistribution.map(item => ( <div key={item.stars} className="flex items-center gap-2 text-sm"><span className="w-12">{item.stars} star</span><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden"><div className="bg-amber-400 h-2 rounded-full" style={{ width: `${item.percentage}%` }} /></div><span className="w-10 text-right text-slate-500 dark:text-slate-400">{Math.round(item.percentage)}%</span></div>))}</div>
                        {canWriteReview && (
                            <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                                <h3 className="font-semibold">Review this product</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Share your thoughts with other customers</p>
                                <button onClick={onWriteReview} className="mt-4 w-full text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Write a product review</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="lg:col-span-8 space-y-6">
                    {reviews.length > 0 ? reviews.map(review => (
                        <div key={review._id} className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg">
                            <div className="flex items-center gap-3">
                                <img src={review.user.image || `https://i.pravatar.cc/40?u=${review.user.name}`} alt={review.user.name} className="h-10 w-10 rounded-full" />
                                <span className="font-semibold text-slate-800 dark:text-slate-100">{review.user.name}</span>
                            </div>
                            <div className="mt-3 flex items-center gap-2"><div className="flex items-center">{[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < review.rating ? 'text-amber-400 fill-current' : 'text-slate-300 dark:text-slate-600'} />)}</div><h4 className="font-bold text-slate-900 dark:text-white">{review.title}</h4></div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Reviewed on {new Date(review.createdAt).toLocaleDateString()}</p>
                            {review.verifiedPurchase && <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">Verified Purchase</p>}
                            <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">{review.text}</p>
                        </div>
                    )) : <p className="text-center text-slate-500 py-10">No reviews yet. Be the first to share your thoughts!</p>}
                </div>
            </div>
        </motion.div>
    );
};


export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    
    const { data: session, status } = useSession();
    const { addToCart, openCart, cartItems, addToCartWithoutOpening } = useCart();

    const [product, setProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [canWriteReview, setCanWriteReview] = useState(false);

    // --- FIX: Create a reusable function to fetch reviews ---
    const fetchReviews = useCallback(async () => {
        if (!id) return;
        try {
            const res = await fetch(`/api/reviews/${id}`);
            const data = await res.json();
            if (data.success) {
                setReviews(data.data);
            }
        } catch (e) {
            console.error("Failed to fetch reviews");
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            Promise.all([
                fetch(`/api/products/${id}`).then(res => res.json()),
                fetchReviews() // Use the new fetch function
            ]).then(([productData]) => {
                if (productData.success) {
                    setProduct(productData.data);
                } else {
                    setError(productData.error);
                }
            }).catch(err => setError('Failed to fetch product data.'))
              .finally(() => setIsLoading(false));
            
            fetch('/api/products').then(res => res.json()).then(data => data.success && setAllProducts(data.data));
        }
    }, [id, fetchReviews]);

    // Check if the user has purchased this item
    useEffect(() => {
        if (status === 'authenticated' && product) {
            fetch('/api/orders')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        const hasPurchased = data.data.some(order => 
                            order.status === 'Placed' && order.items.some(item => item.product === product._id)
                        );
                        setCanWriteReview(hasPurchased);
                    }
                });
        }
    }, [status, product]);

    const uniqueCategories = useMemo(() => {
        if (!allProducts.length) return [];
        const categories = new Set(allProducts.map(p => p.category));
        return Array.from(categories);
    }, [allProducts]);

    const handleAddToCart = () => {
        if (status !== 'authenticated') { signIn('google', { callbackUrl: `/products/${id}` }); return; }
        if (!product) return;
        addToCart(product, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleBuyNow = () => {
        if (status !== 'authenticated') { signIn('google', { callbackUrl: `/products/${id}` }); return; }
        if (!product) return;
        addToCartWithoutOpening(product, quantity);
        router.push('/checkout');
    };
    
    // --- FIX: Trigger a refetch after submitting a review ---
    const handleReviewSubmitted = () => {
        fetchReviews(); // Re-fetch the reviews from the server
        setCanWriteReview(false); // User can only review once
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900"><Loader className="animate-spin" size={32} /></div>;
    if (error || !product) return <div className="flex flex-col justify-center items-center h-screen text-center bg-slate-50 dark:bg-slate-900"><AlertCircle size={48} className="text-red-500 mb-4" /><h1 className="text-2xl font-bold">Product Not Found</h1><p className="text-slate-500">{error}</p></div>;

    return (
        <div className="relative bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans antialiased">
            <AnimatePresence>{showReviewForm && <ReviewFormModal productId={product._id} onClose={() => setShowReviewForm(false)} onReviewSubmitted={handleReviewSubmitted} />}</AnimatePresence>
            <AuroraBackground />
            <Header onCartClick={openCart} onSearchClick={() => {}} cartItemCount={cartItems.length} onMenuClick={() => {}} categories={uniqueCategories} />
            <main className="min-h-screen py-5 sm:py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        <div className="lg:col-span-5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg p-4"><img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-xl aspect-square" /></div>
                        <div className="lg:col-span-7 space-y-6">
                            <span className="text-indigo-500 dark:text-indigo-400 font-semibold text-sm uppercase">{product.category}</span>
                            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">{product.name}</h1>
                            <div className="flex items-center"><div className="flex items-center">{[...Array(5)].map((_, i) => <Star key={i} size={20} className={i < Math.round(product.rating || 0) ? 'text-amber-400 fill-current' : 'text-slate-300 dark:text-slate-600'} />)}</div><a href="#reviews" className="ml-3 text-sm text-slate-500 dark:text-slate-400 hover:underline">({reviews.length} reviews)</a></div>
                            <p className="text-lg text-slate-600 dark:text-slate-300">{product.description}</p>
                            <p className="text-4xl font-bold text-slate-900 dark:text-white">₹{product.price.toFixed(2)}</p>
                            <div className={`p-4 rounded-lg text-sm ${product.stock > 0 ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}><div className={`flex items-center gap-3 font-semibold ${product.stock > 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}><Package size={20} />{product.stock > 0 ? `${product.stock} in Stock` : 'Out of Stock'}</div></div>
                            <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-full"><button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 rounded-l-full hover:bg-slate-100 dark:hover:bg-slate-700">-</button><div className="relative w-8 text-center"><AnimatePresence mode="wait"><motion.span key={quantity} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ duration: 0.15 }} className="absolute inset-0 flex items-center justify-center font-semibold">{quantity}</motion.span></AnimatePresence></div><button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-4 py-2 rounded-r-full hover:bg-slate-100 dark:hover:bg-slate-700">+</button></div>
                                <motion.button whileHover={{ scale: product.stock > 0 ? 1.05 : 1 }} whileTap={{ scale: product.stock > 0 ? 0.95 : 1 }} onClick={handleAddToCart} disabled={product.stock === 0} className={`w-1/2 inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold text-white shadow-lg transition-colors ${addedToCart ? 'bg-green-500' : 'bg-indigo-600 hover:bg-indigo-700'} disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:cursor-not-allowed`}><AnimatePresence mode="wait">{addedToCart ? <motion.span key="added" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="flex items-center gap-2"><Check size={20} /> Added!</motion.span> : <motion.span key="add" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="flex items-center gap-2"><ShoppingCart size={20} /> Add</motion.span>}</AnimatePresence></motion.button>
                                <motion.button whileHover={{ scale: product.stock > 0 ? 1.05 : 1 }} whileTap={{ scale: product.stock > 0 ? 0.95 : 1 }} onClick={handleBuyNow} disabled={product.stock === 0} className="w-1/2 inline-flex items-center justify-center rounded-full bg-slate-800 dark:bg-slate-200 px-6 py-3 text-base font-semibold text-white dark:text-slate-900 shadow-lg transition-colors hover:bg-slate-700 dark:hover:bg-slate-300 disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:cursor-not-allowed">Buy Now</motion.button>
                            </div>
                        </div>
                    </motion.div>
                    <div id="reviews"><CustomerReviews reviews={reviews} onWriteReview={() => setShowReviewForm(true)} canWriteReview={canWriteReview} /></div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
