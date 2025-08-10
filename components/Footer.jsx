import React from 'react';
import { ChevronRight, Instagram, Facebook, Twitter, Github } from 'lucide-react';
import Link from 'next/link'; // Import Link for client-side navigation

const socials = [
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "GitHub", icon: Github, href: "#" }
];

const Footer = () => (
    // Add id="footer" to allow the Header's contact button to scroll to it
    <footer id="footer" className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                {/* Brand & Mission */}
                <div className="lg:col-span-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">RushKart</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Where great finds get delivered fast.</p>
                    <div className="flex mt-4 space-x-3">
                        {socials.map((social) => (
                            <a key={social.name} href={social.href} aria-label={social.name}
                                className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition">
                                <social.icon size={20} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Shop */}
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Shop</h4>
                    <ul className="space-y-2 text-sm mt-3">
                        <li><Link href="/products" className="hover:text-indigo-600">Categories</Link></li>
                        <li><Link href="/deals" className="hover:text-indigo-600">Deals</Link></li>
                        <li><a href="#" className="hover:text-indigo-600">New Arrivals</a></li>
                        <li><a href="#" className="hover:text-indigo-600">Best Sellers</a></li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Company</h4>
                    <ul className="space-y-2 text-sm mt-3">
                        <li><a href="#" className="hover:text-indigo-600">About</a></li>
                        <li><a href="#" className="hover:text-indigo-600">Press</a></li>
                        <li><a href="#" className="hover:text-indigo-600">Careers</a></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Support</h4>
                    <ul className="space-y-2 text-sm mt-3">
                        <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
                        <li><a href="#" className="hover:text-indigo-600">FAQ</a></li>
                        <li><a href="#" className="hover:text-indigo-600">Shipping & Returns</a></li>
                        <li><a href="#" className="hover:text-indigo-600">Order Tracking</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="lg:col-span-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Stay Updated</h4>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-medium text-indigo-600">Join our newsletter</span> for deals, new products & more.
                    </p>
                    <form className="mt-3 flex" autoComplete="off" aria-label="Newsletter signup">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="w-full rounded-l-md border border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-sm px-3 py-2"
                            aria-label="Email address"
                            required
                        />
                        <button
                            type="submit"
                            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-md flex items-center transition"
                            aria-label="Subscribe"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Legal & Links */}
            <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                <p>&copy; {new Date().getFullYear()} RushKart Inc. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 sm:mt-0">
                    <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
                    <a href="#" className="hover:text-indigo-600">Terms of Service</a>
                    <a href="#" className="hover:text-indigo-600">Accessibility</a>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
