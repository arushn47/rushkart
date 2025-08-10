import React, { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';

// Mock data, as it's only used here
const mockTestimonials = [
    { quote: "RushKart is my go-to for unique tech and lifestyle products. The quality is always top-notch and the delivery is incredibly fast!", name: 'Alex Rivera', handle: 'Loyal Customer' },
    { quote: "The Nebula Sound System is a masterpiece. I was blown away by the sound quality and the sleek design. 10/10 would recommend.", name: 'Samantha Chen', handle: 'Audio Enthusiast' },
    { quote: "Finally, a store that gets it. Beautiful products that actually work well. My Ergo-Flow Chair has been a lifesaver for my back.", name: 'David Lee', handle: 'Happy Customer' },
];

const Testimonials = () => {
    const scrollRef = useRef(null);
    const { scrollXProgress } = useScroll({ container: scrollRef });

    return (
        // The section is now transparent, allowing the main AuroraBackground to show through.
        <section className="relative py-20 sm:py-28 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">What Our Customers Say</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Real stories from real people.</p>
                </div>
                <div className="relative">
                    <div ref={scrollRef} className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
                        {mockTestimonials.map((testimonial, index) => (
                            <div key={index} className="snap-center flex-shrink-0 w-full sm:w-1/2 lg:w-1/3" style={{ perspective: '1000px' }}>
                                <motion.figure 
                                    whileHover={{ scale: 1.05, rotateY: 5, rotateX: -3, boxShadow: "0px 20px 40px -10px rgba(0,0,0,0.2)" }} 
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }} 
                                    className="h-full flex flex-col justify-between rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-8 shadow-lg"
                                >
                                    <blockquote className="text-slate-700 dark:text-slate-300"><p>“{testimonial.quote}”</p></blockquote>
                                    <figcaption className="mt-6 flex items-center gap-4">
                                        <img className="h-12 w-12 rounded-full object-cover" src={`https://i.pravatar.cc/48?u=${testimonial.name}`} alt={testimonial.name} />
                                        <div>
                                            <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                                            <div className="text-slate-500 dark:text-slate-400">{testimonial.handle}</div>
                                        </div>
                                    </figcaption>
                                </motion.figure>
                            </div>
                        ))}
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mt-4">
                        <motion.div className="h-1 bg-indigo-600 rounded-full" style={{ scaleX: scrollXProgress }} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
