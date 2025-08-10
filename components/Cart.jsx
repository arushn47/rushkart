'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Cart = ({ items, onClose, onRemove, total }) => {
    const router = useRouter();

    const listVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } };
    
    const handleCheckout = () => {
        onClose();
        router.push('/checkout');
    };

    return (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
            <motion.div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your Cart</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"><X size={24} /></button>
                </div>
                {items.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                        <ShoppingCart size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Your cart is empty</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Looks like you haven't added anything yet.</p>
                        <button onClick={onClose} className="mt-6 rounded-full bg-slate-900 dark:bg-white px-6 py-2 text-sm font-semibold text-white dark:text-slate-900 shadow-lg transition-colors hover:bg-slate-700 dark:hover:bg-slate-200">Start Shopping</button>
                    </div>
                ) : (
                    <>
                        <div className="flex-grow overflow-y-auto p-6">
                            <motion.ul variants={listVariants} initial="hidden" animate="visible" className="divide-y divide-slate-200 dark:divide-slate-800">
                                {items.map(item => (
                                    <motion.li key={item._id} variants={itemVariants} className="flex py-6">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-200 dark:border-slate-700"><img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover object-center" /></div>
                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-slate-900 dark:text-white"><h3>{item.name}</h3><p className="ml-4">₹{(item.price * item.quantity).toFixed(2)}</p></div>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="flex flex-1 items-end justify-between text-sm"><button type="button" onClick={() => onRemove(item._id)} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Remove</button></div>
                                        </div>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </div>
                        <div className="border-t border-slate-200 dark:border-slate-800 p-6">
                            <div className="flex justify-between text-base font-medium text-slate-900 dark:text-white"><p>Subtotal</p><p>₹{total.toFixed(2)}</p></div>
                            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Shipping and taxes calculated at checkout.</p>
                            <div className="mt-6">
                                <button
                                  onClick={handleCheckout}
                                  className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                >
                                  Checkout
                                </button>
                            </div>
                            <div className="mt-6 flex justify-center text-center text-sm text-slate-500 dark:text-slate-400"><p>or <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500" onClick={onClose}>Continue Shopping<span aria-hidden="true"> &rarr;</span></button></p></div>
                        </div>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};

export default Cart;
