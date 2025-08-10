import React from 'react';
import { motion } from 'framer-motion';

const StaggeredGrid = ({ children, className }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className={`grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default StaggeredGrid;
