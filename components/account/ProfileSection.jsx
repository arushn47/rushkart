'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Edit3, X, Loader, LogOut } from 'lucide-react';

const EditProfileForm = ({ user, onCancel }) => {
    const [name, setName] = useState(user.name);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // NOTE: Add your API call to update the user profile here.
        // For now, we'll just simulate a delay.
        setTimeout(() => {
            setIsSubmitting(false);
            onCancel(); // Close form on successful submission
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6"
        >
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={user.email}
                            className="form-input bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                            readOnly
                        />
                    </div>
                </div>
                <div className="flex gap-4 mt-6">
                    <button type="submit" disabled={isSubmitting} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-400">
                        {isSubmitting ? <Loader size={16} className="animate-spin" /> : 'Save Changes'}
                    </button>
                    <button type="button" onClick={onCancel} className="rounded-lg bg-slate-200 dark:bg-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600">
                        Cancel
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

const ProfileSection = () => {
    const { data: session } = useSession();
    const [isEditing, setIsEditing] = useState(false);

    if (!session) return null;

    return (
        <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-3"><User size={24} /> Profile Information</h2>
                <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                    {isEditing ? <><X size={16} /> Cancel</> : <><Edit3 size={16} /> Edit</>}
                </button>
            </div>
            
            <div className="mt-6 flex items-center gap-4">
                <img src={session.user.image} alt={session.user.name} className="h-20 w-20 rounded-full" />
                <div>
                    <h3 className="text-2xl font-bold">{session.user.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{session.user.email}</p>
                    <span className="mt-2 inline-block text-xs font-semibold uppercase rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-3 py-1">
                        {session.user.role || 'User'}
                    </span>
                </div>
            </div>

            <AnimatePresence>
                {isEditing && <EditProfileForm user={session.user} onCancel={() => setIsEditing(false)} />}
            </AnimatePresence>

            {/* --- Sign Out Button --- */}
            <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
                <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg py-2.5 transition-colors"
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default ProfileSection;
