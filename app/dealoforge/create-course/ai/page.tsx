"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SelectCategory from "../../(shared)/SelectCategory";
import TopicDescription from "../../(shared)/TopicDescription";
import SelectOption from "../../(shared)/SelectOption";
import Forge from "@/components/ForgeComponent";
import Notification from "@/components/Notification";
import { generateCourseLayout } from "../../config/AiModel";
import getVideos from "../../config/service";
import { useRouter } from "next/navigation";
import LoadingDialog from "../../_components/LoadingDialog";
import { motion, AnimatePresence } from "framer-motion";
import ForgeAIAdvert from "./_components/ForgeAIAdvert";
import {
    Sparkles,
    Zap,
    CheckCircle,
    ArrowRight,
    Upload,
    Target,
    Star,
    ShieldCheck,
    Layout,
    Info,
    ChevronRight,
    Lightbulb,
    Play,
    ArrowLeft,
    Users,
    Cpu,
    Video as VideoIcon,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface Chapter {
    chapter_name: string;
    content: Array<{
        type: string;
        title: string;
        description: string;
        duration?: string;
    }>;
}

interface FormData {
    category: string;
    topic: string;
    description: string;
    difficultyLevel: string;
    courseDuration: string;
    addVideo: boolean;
    noOfChapters: string;
    chapters?: Chapter[];
    thumbnailImageId?: string;
}

interface VideoItem {
    id: { videoId: string };
    snippet: {
        title: string;
        description: string;
        thumbnails: {
            default: { url: string };
            medium: { url: string };
            high: { url: string };
        };
        channelTitle: string;
    };
}

const SLIDES = [
    {
        image: "/Remote Business_ Black Male Freelancer Worjing With Cellphone And Laptop At Hom.jpg",
    },
    {
        image: "/Download premium image of African student study online computer laptop portrait_ by Ling about african student computer, white background, background, space, and face 12951516.jpg",
    },
    {
        image: "/Handsome young african man using lap.jpg",
    },
];

const normalizeChapters = (chapters: any[], noOfChapters: string): Chapter[] => {
    if (!chapters || chapters.length === 0) {
        const chapterCount = parseInt(noOfChapters, 10) || 0;
        return Array.from({ length: chapterCount }, (_, index) => ({
            chapter_name: `Chapter ${index + 1}`,
            content: [],
        }));
    }

    return chapters.map((chapter, index) => ({
        chapter_name: chapter.chapter_name || chapter.chapterName || `Chapter ${index + 1}`,
        content: (chapter.content || []).map((contentItem: any) => ({
            type: contentItem.type || "Unknown",
            title: contentItem.title || "Untitled",
            description: contentItem.description || "No description available",
            duration: contentItem.duration || "Unknown duration",
        })),
    }));
};

const AICreatePage = () => {
    const [formData, setFormData] = useState<FormData>({
        category: "",
        topic: "",
        description: "",
        difficultyLevel: "",
        courseDuration: "",
        addVideo: false,
        noOfChapters: "",
        chapters: [],
    });

    const [activeIdx, setActiveIdx] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isNextDisabled, setIsNextDisabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const [notificationType, setNotificationType] = useState<"success" | "error">("success");
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedVideoId, setUploadedVideoId] = useState<string | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const stepValidation = () => {
            switch (activeIdx) {
                case 0:
                    return formData.category.trim() !== "";
                case 1:
                    return formData.topic.trim() !== "" && formData.description.trim() !== "";
                case 2:
                    const chapters = parseInt(formData.noOfChapters, 10);
                    return (
                        formData.difficultyLevel.trim() !== "" &&
                        formData.courseDuration.trim() !== "" &&
                        !isNaN(chapters) &&
                        chapters > 0
                    );
                default:
                    return false;
            }
        };

        setIsNextDisabled(!stepValidation());
    }, [formData, activeIdx]);

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData((prevData) => ({ ...prevData, [field]: value }));
    };

    const handleGenerateCourse = async () => {
        setLoading(true);
        setIsSaving(true);

        try {
            const layout = await generateCourseLayout(formData);
            const normalizedChapters = normalizeChapters(layout.chapters, formData.noOfChapters);

            let videoDetails: VideoItem[] = [];
            if (formData.addVideo) {
                videoDetails = await getVideos(formData.topic);
            }

            const videos = videoDetails.map((video) => ({
                title: video.snippet.title,
                description: video.snippet.description || "No description provided",
                channelTitle: video.snippet.channelTitle,
                videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
                thumbnail: video.snippet.thumbnails.high.url,
            }));

            const requestBody = {
                ...formData,
                creationMode: "ai",
                chapters: normalizedChapters,
                videos,
                cloudflareVideoId: uploadedVideoId || undefined,
            };

            const response = await fetch("/api/generate-course", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) throw new Error("Failed to save the course.");
            const { courseId } = await response.json();
            router.push(`/dealoforge/create-course/course?courseId=${courseId}`);
        } catch (error) {
            setNotification("An error occurred while setting up your course.");
            setNotificationType("error");
            console.error(error);
        } finally {
            setLoading(false);
            setIsSaving(false);
        }
    };

    const stepperOpts = [
        { id: 1, name: "Category", icon: <Target className="w-5 h-5" /> },
        { id: 2, name: "Insight", icon: <Layout className="w-5 h-5" /> },
        { id: 3, name: "Logic", icon: <Zap className="w-5 h-5" /> },
    ];

    const handleVideoFile = async (file: File) => {
        try {
            setUploading(true);
            setUploadProgress(0);
            const urlRes = await fetch(`/api/videos/upload-url?size=${file.size}`);
            const { uploadURL } = await urlRes.json();

            const form = new window.FormData();
            form.append("file", file);

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", uploadURL);
                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
                };
                xhr.onload = () => {
                    const json = JSON.parse(xhr.responseText || "{}");
                    const vid = json?.result?.id || json?.result?.uid;
                    if (vid) setUploadedVideoId(String(vid));
                    resolve();
                };
                xhr.onerror = () => reject(new Error("Upload failed"));
                xhr.send(form);
            });
        } catch (err: any) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black selection:bg-emerald-500/30 font-sans relative overflow-x-hidden">

            {/* Cinematic Background Slider */}
            <div className="fixed inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url("${SLIDES[currentSlide].image}")` }}
                        />
                        {/* Dark Premium Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f1a0f]/90 to-black/90" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]" />
                    </motion.div>
                </AnimatePresence>
            </div>

            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between relative z-50"
            >
                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                        <Sparkles className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                    </div>
                    <div>
                        <h1 className="text-white font-black tracking-tighter text-xl uppercase italic">Forge<span className="text-emerald-500">AI</span></h1>
                        <p className="text-[10px] text-white/40 font-black tracking-[0.2em] uppercase">Intelligence Pack v2.0</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    onClick={() => router.push("/dealoforge/create-course")}
                    className="text-emerald-100/60 hover:text-white hover:bg-white/5 backdrop-blur-md border border-white/5 px-6 rounded-xl"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Abort Launch
                </Button>
            </motion.nav>

            <main className="max-w-7xl mx-auto px-6 py-8 lg:py-16 relative z-10">
                <motion.section
                    key="creation-steps"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid lg:grid-cols-12 gap-12 items-start"
                >
                    {/* Stepper Sidebar */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 lg:sticky lg:top-32 shadow-3xl shadow-emerald-950/20">
                            <div className="flex items-center gap-4 mb-12">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                                    <Cpu className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Deployment</h4>
                                    <p className="text-lg font-bold text-emerald-100/40 leading-none">Phase {activeIdx + 1}<span className="text-xs">/3</span></p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {stepperOpts.map((step, idx) => (
                                    <div
                                        key={step.id}
                                        className={`group flex items-center gap-5 transition-all duration-500 ${activeIdx === idx ? 'translate-x-2' : ''}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${activeIdx === idx ? 'bg-emerald-500 border-white/20 text-emerald-950 scale-110 shadow-[0_10px_20px_rgba(16,185,129,0.3)]' :
                                            activeIdx > idx ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' :
                                                'bg-white/5 border-white/10 text-white/20'
                                            }`}>
                                            {activeIdx > idx ? <CheckCircle className="w-6 h-6" /> : step.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`font-black text-[10px] uppercase tracking-widest ${activeIdx === idx ? 'text-emerald-500' : 'text-white/20'}`}>
                                                {step.id < 10 ? `0${step.id}` : step.id}
                                            </span>
                                            <span className={`font-bold text-sm leading-tight ${activeIdx === idx ? 'text-white' : 'text-white/20'}`}>
                                                {step.name}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-6">
                                <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:rotate-12 transition-transform">
                                        <Lightbulb className="w-8 h-8 text-emerald-400" />
                                    </div>
                                    <h5 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Zap className="w-3 h-3" /> System Intel
                                    </h5>
                                    <p className="text-xs text-white/50 font-medium leading-relaxed relative z-10">
                                        {activeIdx === 0 && "Targeting the correct niche ensures your AI context remains razor-sharp for industry-specific terminology."}
                                        {activeIdx === 1 && "Precision in your topic name allows the LLM to pull from the most elite data patterns available."}
                                        {activeIdx === 2 && "Adding a video intro provides a 'human core' to your AI-assisted curriculum."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9">
                        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-8 lg:p-16 shadow-3xl shadow-emerald-950/40 relative min-h-[700px] flex flex-col justify-between">

                            <div className="relative">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeIdx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.4 }}
                                        className="w-full"
                                    >
                                        {activeIdx === 0 && (
                                            <div className="space-y-12">
                                                <div className="space-y-4">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                                        Phase 01: Identification
                                                    </div>
                                                    <h2 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter">
                                                        Select Your <br />
                                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">Specialization</span>
                                                    </h2>
                                                    <p className="text-lg text-white/40 font-medium max-w-xl">
                                                        We use your niche selection to anchor the AI&apos;s educational framework. Choose the domain that best represents your core expertise.
                                                    </p>
                                                </div>
                                                <SelectCategory formData={formData} handleInputChange={handleInputChange} />
                                            </div>
                                        )}

                                        {activeIdx === 1 && (
                                            <div className="space-y-12">
                                                <div className="space-y-4">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                                        Phase 02: Knowledge Extraction
                                                    </div>
                                                    <h2 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter">
                                                        Define Your <br />
                                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">Curriculum Core</span>
                                                    </h2>
                                                    <p className="text-lg text-white/40 font-medium max-w-xl">
                                                        The title and description act as the &apos;Base Prompt&apos; for your course structure. Be as technical or detailed as you wish.
                                                    </p>
                                                </div>
                                                <TopicDescription formData={formData} handleInputChange={handleInputChange} />
                                            </div>
                                        )}

                                        {activeIdx === 2 && (
                                            <div className="space-y-12">
                                                <div className="space-y-4">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                                        Phase 03: Configuration
                                                    </div>
                                                    <h2 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter">
                                                        Final <br />
                                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">Parameters</span>
                                                    </h2>
                                                    <p className="text-lg text-white/40 font-medium max-w-xl">
                                                        Fine-tune the complexity and duration of your course. The AI will scale the content depth based on these settings.
                                                    </p>
                                                </div>

                                                <div className="space-y-12">
                                                    <SelectOption formData={formData} handleInputChange={handleInputChange} />

                                                    {/* Refined Studio Upload Section */}
                                                    <div className="relative p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[2.5rem]">
                                                        <div className="bg-[#050505] rounded-[2.4rem] p-10 space-y-8 border border-white/5">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-5">
                                                                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10">
                                                                        <VideoIcon className="w-8 h-8 text-emerald-500" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-2xl font-black text-white">Elite Intro Video</h3>
                                                                        <p className="text-white/30 text-sm font-medium">Add a professional face to your AI curriculum</p>
                                                                    </div>
                                                                </div>
                                                                <div className="hidden md:flex flex-col items-end">
                                                                    <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest">Premium Feature</span>
                                                                    <div className="flex gap-1 mt-1">
                                                                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />)}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="relative group">
                                                                <input
                                                                    type="file"
                                                                    accept="video/*"
                                                                    onChange={(e) => e.target.files?.[0] && handleVideoFile(e.target.files[0])}
                                                                    className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                                                                />
                                                                <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-14 text-center group-hover:border-emerald-500/50 group-hover:bg-emerald-500/[0.02] transition-all duration-500">
                                                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                                                        <Upload className="w-7 h-7 text-emerald-500" />
                                                                    </div>
                                                                    <p className="text-white text-lg font-bold mb-1">Click to browse studio files</p>
                                                                    <p className="text-white/20 text-sm font-medium">MP4, MOV, or WEBM up to 500MB</p>
                                                                </div>
                                                            </div>

                                                            {uploading && (
                                                                <div className="space-y-3">
                                                                    <div className="flex justify-between items-center px-1">
                                                                        <span className="text-emerald-400 text-xs font-black uppercase tracking-widest animate-pulse">Syncing to Cloud...</span>
                                                                        <span className="text-emerald-400 text-xs font-black">{uploadProgress}%</span>
                                                                    </div>
                                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                                        <motion.div
                                                                            className="h-full bg-gradient-to-r from-emerald-600 to-green-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: `${uploadProgress}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {uploadedVideoId && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4"
                                                                >
                                                                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                                                                        <CheckCircle className="w-5 h-5 text-emerald-950" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-white font-bold block">Video Payload Ready</span>
                                                                        <span className="text-emerald-500/60 text-xs font-medium uppercase tracking-widest italic">Secure link established</span>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* High-End Navigation Controls */}
                            <div className="mt-20 flex items-center justify-between">
                                <Button
                                    disabled={activeIdx === 0}
                                    onClick={() => setActiveIdx(activeIdx - 1)}
                                    className="h-16 px-10 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-all active:scale-95 disabled:opacity-0"
                                >
                                    Previous Step
                                </Button>

                                <div className="flex items-center gap-6">
                                    {activeIdx < 2 ? (
                                        <Button
                                            disabled={isNextDisabled}
                                            onClick={() => setActiveIdx(activeIdx + 1)}
                                            className="h-16 px-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-500/20 group transform transition-all active:scale-95 disabled:grayscale disabled:opacity-50"
                                        >
                                            Continue <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleGenerateCourse}
                                            disabled={isNextDisabled || isSaving}
                                            className="h-16 px-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-500/20 group transform transition-all active:scale-95"
                                        >
                                            {isSaving ? (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-5 h-5 border-3 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                                                    <span>Forging Core...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-4">
                                                    <Sparkles className="w-5 h-5 fill-emerald-950" />
                                                    <span>Create AI Course</span>
                                                </div>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Smooth Advert Component */}
                        <ForgeAIAdvert />
                    </div>
                </motion.section>
            </main>

            <FooterInfo />
            <Forge />

            {notification && (
                <Notification
                    message={notification}
                    type={notificationType}
                    onClose={() => setNotification(null)}
                />
            )}

            <LoadingDialog loading={loading} />
        </div>
    );
};

const FooterInfo: React.FC = () => (
    <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="py-24 text-center relative z-10"
    >
        <div className="flex justify-center items-center gap-8 mb-6">
            <Star className="w-6 h-6 text-emerald-500/20 fill-emerald-500/20" />
            <span className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px]">Dealo Forge Intelligence</span>
            <Star className="w-6 h-6 text-emerald-500/20 fill-emerald-500/20" />
        </div>
        <div className="flex flex-col gap-2">
            <p className="text-white/10 text-[9px] font-black uppercase tracking-[0.2em]">&copy; 2026 DEALO FORGE • QUANTUM CURRICULUM SYSTEMS</p>
            <div className="flex justify-center gap-4">
                <div className="w-8 h-px bg-white/5" />
                <div className="w-px h-px bg-emerald-500" />
                <div className="w-8 h-px bg-white/5" />
            </div>
        </div>
    </motion.footer>
);

export default AICreatePage;
