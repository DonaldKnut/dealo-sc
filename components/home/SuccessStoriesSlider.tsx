"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Users, MessageSquare, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";

const SUCCESS_STORIES = [
    {
        id: 1,
        name: "Samuel Oladipupo",
        role: "Course Creator",
        course: "React Mastery",
        rating: 4.9,
        students: "2.5K+",
        reviews: "450+",
        image: "/assets/Samuel David Potter.jpg",
        quote: "Dealo gave me the tools to share my React expertise with students across Nigeria. The AI features made course creation 10x faster.",
        color: "from-emerald-400 to-cyan-500"
    },
    {
        id: 2,
        name: "Amara Okonkwo",
        role: "Tech Instructor",
        course: "Python for Beginners",
        rating: 4.8,
        students: "3.2K+",
        reviews: "680+",
        image: "/assets/Portrait 🤍 __ Cooperate headshot.jpg",
        quote: "Teaching Python has never been more rewarding. The platform's certification system adds real value to my students' resumes.",
        color: "from-emerald-500 to-green-600"
    },
    {
        id: 3,
        name: "Tejiri Oghenedoro",
        role: "Design Expert",
        course: "UI/UX Design Fundamentals",
        rating: 4.9,
        students: "1.8K+",
        reviews: "320+",
        image: "/assets/One light headshot not bad 😉📸 @trebihammond came….jpg",
        quote: "The design-first approach of Dealo resonates with my UI/UX teaching style. It's the premium experience creators have been waiting for.",
        color: "from-green-400 to-emerald-600"
    }
];

export default function SuccessStoriesSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 8000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => (prevIndex + newDirection + SUCCESS_STORIES.length) % SUCCESS_STORIES.length);
    };

    const currentStory = SUCCESS_STORIES[currentIndex];

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl">
                <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-900/10 blur-[150px] rounded-full delay-1000 animate-pulse" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
                        Creator <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">Success Stories</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Join the elite community of instructors who are transforming careers and building their legacy on Dealo.
                    </p>
                </motion.div>

                <div className="relative min-h-[500px] flex items-center justify-center">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            initial={{ opacity: 0, x: direction > 0 ? 100 : -100, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: direction > 0 ? -100 : 100, scale: 0.9 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute w-full max-w-5xl"
                        >
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                {/* Creator Card */}
                                <div className="relative group">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${currentStory.color} opacity-20 blur-3xl rounded-[40px] transition-all duration-500 group-hover:opacity-30`} />
                                    <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-[40px] bg-gray-900/50 backdrop-blur-3xl border border-white/10 overflow-hidden shadow-2xl">
                                        <Image
                                            src={currentStory.image}
                                            alt={currentStory.name}
                                            fill
                                            className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                        <div className="absolute bottom-8 left-8 right-8">
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className="h-px flex-1 bg-gradient-to-r from-emerald-500 to-transparent" />
                                                <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase italic">Verified Creator</span>
                                            </div>
                                            <h3 className="text-3xl font-black text-white mb-1 tracking-tight">{currentStory.name}</h3>
                                            <p className="text-gray-400 font-medium">{currentStory.role}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content & Stats */}
                                <div className="flex flex-col justify-center text-left">
                                    <Quote className="w-12 h-12 text-emerald-500 opacity-20 mb-6" />
                                    <p className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight tracking-tight italic">
                                        "{currentStory.quote}"
                                    </p>

                                    <div className="grid grid-cols-3 gap-6 mb-12">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-yellow-500 mb-1">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="font-black text-white">{currentStory.rating}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Rating</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-emerald-500 mb-1">
                                                <Users className="w-4 h-4" />
                                                <span className="font-black text-white">{currentStory.students}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Students</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-blue-500 mb-1">
                                                <MessageSquare className="w-4 h-4" />
                                                <span className="font-black text-white">{currentStory.reviews}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Reviews</p>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em] mb-1">Top Performing Course</p>
                                                <h4 className="text-xl font-bold text-white tracking-tight">{currentStory.course}</h4>
                                            </div>
                                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
                                                <ChevronRight className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-4">
                        <button
                            onClick={() => paginate(-1)}
                            className="p-3 bg-white/5 hover:bg-emerald-500 text-white hover:text-black rounded-2xl transition-all border border-white/10 active:scale-90"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div className="flex gap-2">
                            {SUCCESS_STORIES.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setDirection(idx > currentIndex ? 1 : -1);
                                        setCurrentIndex(idx);
                                    }}
                                    className={`h-2 transition-all duration-300 rounded-full ${idx === currentIndex ? "w-8 bg-emerald-500" : "w-2 bg-white/20 hover:bg-white/40"}`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={() => paginate(1)}
                            className="p-3 bg-white/5 hover:bg-emerald-500 text-white hover:text-black rounded-2xl transition-all border border-white/10 active:scale-90"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
