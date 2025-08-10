import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const MobileMenu = ({ onClose }) => {
    // Define navigation items for the mobile menu
    const navItems = [
        { name: 'Categories', href: '/products' },
        { name: 'Deals', href: '/deals' },
    ];

    // Function to handle the contact link click
    const handleContactClick = () => {
        onClose(); // Close the mobile menu first
        const footer = document.getElementById('footer');
        if (footer) {
            // Use a timeout to ensure the menu is closed before scrolling
            setTimeout(() => {
                footer.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            className="md:hidden fixed inset-x-0 top-16 z-30 bg-white dark:bg-slate-800 p-6 shadow-lg"
        >
            <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                    <Link 
                        key={item.name} 
                        href={item.href} 
                        onClick={onClose} 
                        className="text-lg font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                        {item.name}
                    </Link>
                ))}
                <button 
                    onClick={handleContactClick} 
                    className="text-lg font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 text-left"
                >
                    Contact
                </button>
            </nav>
        </motion.div>
    );
};

export default MobileMenu;