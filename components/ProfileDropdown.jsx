'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, LogOut, Store, ShoppingBag, ChevronDown, ArrowRight, Loader, PlusCircle } from 'lucide-react';

const ProfileDropdown = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!session) return null;

  const user = session.user;

  const dropdownVariants = {
    enter: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: 'easeIn' } }
  };

  const handleBecomeSeller = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/user/upgrade-to-seller', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to upgrade to seller.');
      }
      
      await update();
      router.push('/seller');

    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setIsOpen(true)}
      onHoverEnd={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <img className="h-8 w-8 rounded-full" src={user.image || `https://i.pravatar.cc/48?u=${user.email}`} alt="User profile" />
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronDown size={16} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="exit"
            animate="enter"
            exit="exit"
            className="absolute top-full right-0 mt-2 w-64 origin-top-right rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-xl ring-1 ring-black ring-opacity-5"
          >
            <div className="p-2">
              <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              </div>
              <ul className="mt-2">
                <li><Link href="/account" className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-500 hover:text-white"><User size={16} /> My Account</Link></li>
                <li><Link href="/orders" className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-500 hover:text-white"><ShoppingBag size={16} /> My Orders</Link></li>
                
                {user.role === 'customer' && (
                  <li className="p-2">
                    <button 
                      onClick={handleBecomeSeller} 
                      disabled={isUpdating}
                      className="w-full group rounded-lg p-3 text-left text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 disabled:opacity-70"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold flex items-center gap-2">
                          {isUpdating ? <Loader size={16} className="animate-spin" /> : <Store size={16} />}
                          <span>Become a Seller</span>
                        </div>
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </button>
                  </li>
                )}

                {user.role === 'seller' && (
                   <li>
                     <Link href="/seller" className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-500 hover:text-white">
                       <PlusCircle size={16} /> 
                       Sell an Item
                     </Link>
                   </li>
                )}

                <li className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
                    {/* --- UPDATED: Added callbackUrl to signOut --- */}
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-500 hover:text-white">
                        <LogOut size={16} /> Logout
                    </button>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfileDropdown;
