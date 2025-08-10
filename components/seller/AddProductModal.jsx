'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Plus, X, Loader, AlertCircle, Image as ImageIcon } from 'lucide-react';

const AddProductModal = ({ onClose, onProductAdd }) => {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', imageUrl: '', category: '', stock: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session) {
            setError("You must be logged in to add a product.");
            return;
        }
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock, 10),
                    seller: session.user.id,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Something went wrong');
            }

            const newProduct = await res.json();
            onProductAdd(newProduct.data);
            onClose();

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-4xl border border-slate-200 dark:border-slate-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-t-2xl">
                    <h2 className="text-xl font-semibold">Add a New Product</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto">
                        {/* Left side: Form fields */}
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label htmlFor="name" className="form-label">Product Name</label>
                                <input type="text" name="name" id="name" className="form-input" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div>
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea name="description" id="description" rows="4" className="form-input" value={formData.description} onChange={handleChange} required></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="price" className="form-label">Price</label>
                                    <input type="number" name="price" id="price" step="0.01" className="form-input" value={formData.price} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label htmlFor="stock" className="form-label">Stock Quantity</label>
                                    <input type="number" name="stock" id="stock" className="form-input" value={formData.stock} onChange={handleChange} required />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="category" className="form-label">Category</label>
                                <input type="text" name="category" id="category" className="form-input" value={formData.category} onChange={handleChange} required />
                            </div>
                        </div>
                        {/* Right side: Image URL and Preview */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="imageUrl" className="form-label">Image URL</label>
                                <input type="url" name="imageUrl" id="imageUrl" className="form-input mb-2" value={formData.imageUrl} onChange={handleChange} required />
                            </div>
                            <div className="aspect-square w-full bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                                {formData.imageUrl ? (
                                    <img src={formData.imageUrl} alt="Product preview" className="h-full w-full object-cover" onError={(e) => e.target.style.display = 'none'} onLoad={(e) => e.target.style.display = 'block'} />
                                ) : (
                                    <div className="text-slate-400 flex flex-col items-center">
                                        <ImageIcon size={48} />
                                        <p className="mt-2 text-sm">Image Preview</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center rounded-b-2xl">
                        {error && <div className="text-sm text-red-500 flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
                        <div className="flex-grow"></div>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:bg-indigo-400">
                            {isSubmitting ? <Loader size={16} className="animate-spin" /> : <><Plus size={16} className="mr-2" /> Add Product</>}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default AddProductModal;
