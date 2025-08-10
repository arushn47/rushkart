'use client';

import React, { createContext, useContext, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Cart from '@/components/Cart';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const itemExists = prevItems.find(item => item._id === product._id);
            if (itemExists) {
                return prevItems.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prevItems, { ...product, quantity }];
        });
        setIsCartOpen(true);
    };

    const addToCartWithoutOpening = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const itemExists = prevItems.find(item => item._id === product._id);
            if (itemExists) {
                return prevItems.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prevItems, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, openCart, closeCart, cartTotal, addToCartWithoutOpening, clearCart }}>
            {children}
            <AnimatePresence>
                {isCartOpen && (
                    <Cart items={cartItems} onClose={closeCart} onRemove={removeFromCart} total={cartTotal} />
                )}
            </AnimatePresence>
        </CartContext.Provider>
    );
};