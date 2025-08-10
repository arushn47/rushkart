'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, PlusCircle, Trash2, AlertTriangle, Loader } from 'lucide-react';
import AddressForm from '@/components/AddressForm';

// Reusable Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <AnimatePresence>
            <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30"><AlertTriangle className="text-red-500" /></div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
                    </div>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{message}</p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                        <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors">Delete</button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const AddressesSection = () => {
    const [addresses, setAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [modalState, setModalState] = useState({ isOpen: false, addressId: null });

    useEffect(() => {
        fetch('/api/addresses')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setAddresses(data.data);
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    const handleAddressSaved = (newAddress) => {
        setAddresses(prev => [...prev, newAddress]);
        setShowAddressForm(false);
    };

    const openDeleteModal = (addressId) => {
        setModalState({ isOpen: true, addressId });
    };

    const handleConfirmDelete = async () => {
        const { addressId } = modalState;
        if (!addressId) return;

        try {
            await fetch(`/api/addresses/${addressId}`, { method: 'DELETE' });
            setAddresses(prev => prev.filter(addr => addr._id !== addressId));
        } catch (error) {
            console.error(error);
        } finally {
            setModalState({ isOpen: false, addressId: null });
        }
    };

    return (
        <>
            <ConfirmationModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ isOpen: false, addressId: null })}
                onConfirm={handleConfirmDelete}
                title="Delete Address"
                message="Are you sure you want to delete this address? This action cannot be undone."
            />
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold flex items-center gap-3"><MapPin size={24} /> Saved Addresses</h2>
                <div className="mt-6 space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center py-8"><Loader className="animate-spin" /></div>
                    ) : addresses.length > 0 ? (
                        addresses.map(address => (
                            <div key={address._id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{address.name}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{address.firstName} {address.lastName}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{address.address}, {address.city}, {address.state} {address.zip}</p>
                                </div>
                                <button onClick={() => openDeleteModal(address._id)} className="text-slate-400 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                            <p className="text-slate-500">You haven't saved any addresses yet.</p>
                        </div>
                    )}
                    {!showAddressForm && (
                        <button onClick={() => setShowAddressForm(true)} className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 mt-4">
                            <PlusCircle size={16} /> Add a new address
                        </button>
                    )}
                    <AnimatePresence>
                        {showAddressForm && <AddressForm onSave={handleAddressSaved} onCancel={() => setShowAddressForm(false)} />}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
};

export default AddressesSection;