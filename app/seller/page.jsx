'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader, AlertCircle, Edit, Trash2 } from 'lucide-react';

// Import shared and new components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuroraBackground from '@/components/AuroraBackground';
import AddProductModal from '@/components/seller/AddProductModal'; // This will now handle both Add and Edit

export default function SellerPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // State to hold the product being edited

    useEffect(() => {
        if (status === 'authenticated') {
            if (session.user.role !== 'seller') {
                router.push('/access-denied'); 
            } else {
                fetch(`/api/products?sellerId=${session.user.id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            setProducts(data.data);
                        }
                        setIsLoading(false);
                    });
            }
        }
        if (status === 'unauthenticated') {
            router.push('/api/auth/signin');
        }
    }, [session, status, router]);

    const handleOpenAddModal = () => {
        setEditingProduct(null); // Ensure we're not editing
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product) => {
        setEditingProduct(product); // Set the product to edit
        setIsModalOpen(true);
    };

    const handleProductAdded = (newProduct) => {
        setProducts(prev => [newProduct, ...prev]);
    };

    const handleProductUpdated = (updatedProduct) => {
        setProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p));
    };

    const handleDeleteProduct = async (productId) => {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }
        try {
            const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete product.');
            setProducts(prev => prev.filter(p => p._id !== productId));
        } catch (error) {
            console.error(error);
            alert('There was an issue deleting the product.');
        }
    };

    if (status === 'loading' || isLoading) {
        return <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900"><Loader className="animate-spin" size={32} /></div>;
    }

    if (!session || session.user.role !== 'seller') {
        return null;
    }
    
    return (
        <div className="relative bg-transparent text-slate-800 dark:text-slate-200 font-sans antialiased">
            <AuroraBackground />
            <style jsx global>{`
                .form-input { @apply w-full rounded-lg border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 transition; }
                .form-label { @apply block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1; }
            `}</style>
            
            <Header onCartClick={() => {}} onSearchClick={() => {}} cartItemCount={0} onMenuClick={() => {}} />
            
            <main className="min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Seller Dashboard</h1>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleOpenAddModal} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
                            <Plus size={16} /> Add New Product
                        </motion.button>
                    </div>

                    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white">Your Products</h2>
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map(product => (
                                    <div key={product._id} className="bg-white/70 dark:bg-slate-900/50 rounded-xl shadow-md overflow-hidden flex flex-col">
                                        <img src={product.imageUrl} alt={product.name} className="h-48 w-full object-cover" />
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="font-semibold text-slate-800 dark:text-slate-100">{product.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex-grow">₹{product.price.toFixed(2)} - {product.stock} in stock</p>
                                            <div className="flex gap-2 mt-4 border-t border-slate-200 dark:border-slate-700 pt-3">
                                                <button onClick={() => handleOpenEditModal(product)} className="w-full text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center justify-center gap-1 bg-indigo-100 dark:bg-indigo-900/50 py-1.5 rounded-md"><Edit size={14}/> Edit</button>
                                                <button onClick={() => handleDeleteProduct(product._id)} className="w-full text-sm font-medium text-red-600 hover:text-red-500 flex items-center justify-center gap-1 bg-red-100 dark:bg-red-900/50 py-1.5 rounded-md"><Trash2 size={14}/> Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                               <p className="text-slate-500">You haven't added any products yet.</p>
                               <button onClick={handleOpenAddModal} className="mt-4 text-indigo-600 font-semibold">Add your first product</button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            
            <Footer />

            <AnimatePresence>
                {isModalOpen && (
                    <AddProductModal 
                        initialData={editingProduct}
                        onClose={() => setIsModalOpen(false)} 
                        onProductAdd={handleProductAdded}
                        onProductUpdate={handleProductUpdated}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
