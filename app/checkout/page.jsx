'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useCart } from '@/components/CartContext';
import { ChevronLeft, Lock, PlusCircle, CheckCircle, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Import shared components
import AuroraBackground from '@/components/AuroraBackground';
import AddressForm from '@/components/AddressForm';

// Components
const CheckoutHeader = () => (
    <header className="bg-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Adjusted header height for better balance */}
            <div className="flex items-center justify-between h-16">
                <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">RushKart</Link>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Lock size={16} />
                    <span>Secure Checkout</span>
                </div>
            </div>
        </div>
    </header>
);

const OrderSuccessAnimation = () => (
    <motion.div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <motion.div
            className="bg-white dark:bg-slate-800 rounded-full p-6 shadow-2xl"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
        >
            <CheckCircle size={56} className="text-green-500" />
        </motion.div>
    </motion.div>
);


export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const { cartItems, cartTotal, removeFromCart, clearCart } = useCart();
    const router = useRouter();
    
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            setEmail(session.user.email);
            fetch('/api/addresses')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setSavedAddresses(data.data);
                        if (data.data.length > 0) {
                            setSelectedAddressId(data.data[0]._id);
                        }
                    }
                })
                .finally(() => setIsLoading(false));
        }
        if (status === 'unauthenticated') {
            router.push('/api/auth/signin');
        }
    }, [session, status, router]);

    const handleAddressSaved = (newAddress) => {
        setSavedAddresses(prev => [...prev, newAddress]);
        setSelectedAddressId(newAddress._id);
        setShowAddressForm(false);
    };
    
    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            alert("Please select a shipping address.");
            return;
        }

        setIsPlacingOrder(true);
        try {
            // Ensure the description is included when mapping cart items
            const orderItems = cartItems.map(item => ({
                product: item._id,
                name: item.name,
                description: item.description, // This line is crucial
                quantity: item.quantity,
                price: item.price,
                imageUrl: item.imageUrl,
            }));

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: orderItems,
                    totalAmount: total,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to place order.');
            }
            
            setOrderSuccess(true);
            
            setTimeout(() => {
                clearCart();
                router.push('/');
            }, 2000);

        } catch (error) {
            console.error("Error placing order:", error);
            alert(`There was an issue placing your order: ${error.message}`);
            setIsPlacingOrder(false);
        }
    };

    const shipping = 50.00;
    const total = cartTotal + shipping;

    if (status === 'loading' || isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin" size={32}/></div>
    }

    return (
        <div className="relative bg-transparent text-slate-800 dark:text-slate-200 font-sans antialiased min-h-screen flex flex-col">
            <AnimatePresence>
                {orderSuccess && <OrderSuccessAnimation />}
            </AnimatePresence>
            <style jsx global>{`
                @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
                .animate-blob { animation: blob 10s infinite; }
                .animation-delay-2000 { animation-delay: -2s; }
                .animation-delay-4000 { animation-delay: -4s; }
                .form-input { @apply w-full rounded-lg border-slate-300 bg-white/50 dark:bg-slate-800/50 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 transition; }
                .form-label { @apply block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1; }
            `}</style>
            <AuroraBackground />
            <CheckoutHeader />

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="lg:pr-8">
                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Contact information</h2>
                            <div className="mt-4">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input type="email" name="email" id="email" className="form-input" value={email} readOnly />
                            </div>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Shipping address</h2>
                            <div className="mt-4 space-y-4">
                                {savedAddresses.map(address => (
                                    <div key={address._id} onClick={() => setSelectedAddressId(address._id)} className={`rounded-lg p-4 border-2 cursor-pointer transition-all ${selectedAddressId === address._id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-300 dark:border-slate-700'}`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-slate-800 dark:text-slate-100">{address.name}</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{address.address}, {address.city}, {address.state} {address.zip}</p>
                                            </div>
                                            {selectedAddressId === address._id && <CheckCircle className="text-indigo-500" size={20} />}
                                        </div>
                                    </div>
                                ))}
                                {!showAddressForm && (
                                    <button onClick={() => setShowAddressForm(true)} className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                                        <PlusCircle size={16} /> Add a new address
                                    </button>
                                )}
                                <AnimatePresence>{showAddressForm && <AddressForm onSave={handleAddressSaved} onCancel={() => setShowAddressForm(false)} />}</AnimatePresence>
                            </div>
                        </section>
                        
                        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                             <Link href="/products" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 text-sm font-medium flex items-center">
                                 <ChevronLeft size={20} className="mr-1" /> Return to shopping
                             </Link>
                            <motion.button 
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder || cartItems.length === 0 || !selectedAddressId}
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }} 
                                className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:cursor-not-allowed"
                            >
                                {isPlacingOrder ? <Loader size={20} className="animate-spin"/> : 'Place Order'}
                            </motion.button>
                        </div>
                    </div>

                    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 lg:mt-0 h-fit">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Order summary</h2>
                        <div className="mt-6 flow-root">
                            <ul className="-my-6 divide-y divide-slate-200 dark:divide-slate-700">
                                {cartItems.length > 0 ? cartItems.map((item) => (
                                    <li key={item._id} className="flex py-6">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
                                            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover object-center" />
                                        </div>
                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-slate-900 dark:text-white">
                                                    <h3>{item.name}</h3>
                                                    <p className="ml-4">₹{item.price.toFixed(2)}</p>
                                                </div>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="flex flex-1 items-end">
                                                <button type="button" onClick={() => removeFromCart(item._id)} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                )) : <p className="text-center text-slate-500 py-6">Your cart is empty.</p>}
                            </ul>
                        </div>
                        <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <p className="text-slate-600 dark:text-slate-300">Subtotal</p>
                                <p className="font-medium text-slate-900 dark:text-white">₹{cartTotal.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <p className="text-slate-600 dark:text-slate-300">Shipping</p>
                                <p className="font-medium text-slate-900 dark:text-white">₹{shipping.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center justify-between text-base font-semibold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                                <p>Total</p>
                                <p>₹{total.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
