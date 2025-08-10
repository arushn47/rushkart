import React from 'react';

const AuroraBackground = () => (
    // Use `position: fixed` and a negative z-index to lock it to the background
    <div className="fixed top-0 left-0 w-full h-full -z-10">
        {/* This div provides the solid base color for the entire page */}
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900"></div>
        
        {/* Animated blobs */}
        <div className="absolute top-[-30vh] left-[10vw] w-[50vw] h-[80vh] bg-purple-300/40 dark:bg-purple-900/30 rounded-full filter blur-3xl animate-blob opacity-70"></div>
        <div className="absolute top-[10vh] left-[-20vw] w-[60vw] h-[70vh] bg-indigo-300/40 dark:bg-indigo-900/30 rounded-full filter blur-3xl animate-blob animation-delay-2000 opacity-70"></div>
        <div className="absolute bottom-[-20vh] right-[-10vw] w-[50vw] h-[80vh] bg-pink-300/40 dark:bg-pink-900/30 rounded-full filter blur-3xl animate-blob animation-delay-4000 opacity-70"></div>
        
        {/* Optional grid texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid.png')] opacity-20 dark:opacity-10"></div>
    </div>
);

export default AuroraBackground;
