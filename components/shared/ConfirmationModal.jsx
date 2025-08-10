'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, isDestructive }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                            {isDestructive ? <AlertTriangle className="text-red-500" /> : <CheckCircle className="text-blue-500" />}
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
                    </div>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{message}</p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors ${isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ConfirmationModal;