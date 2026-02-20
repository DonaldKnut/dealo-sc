"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  DollarSign,
  BarChart3,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  PieChart,
  MessageSquare
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function InstructorsPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const stats = [
    { label: "Active Instructors", value: "5,000+" },
    { label: "Courses Published", value: "12,000+" },
    { label: "Total Students", value: "250,000+" },
    { label: "Instructor Earnings", value: "$2M+" },
  ];

  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Earn Revenue",
      description: "Keep up to 90% of your course sales with our transparent revenue sharing model.",
      color: "from-emerald-400 to-emerald-600"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Deep dive into student engagement, drop-off points, and conversion metrics.",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Reach",
      description: "Instant access to a worldwide audience of eager learners across 190 countries.",
      color: "from-teal-400 to-emerald-600"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Personal Branding",
      description: "Create a professional presence with a customized instructor profile and portfolio.",
      color: "from-emerald-300 to-green-500"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI Course Builder",
      description: "Generate course outlines, quizzes, and even draft scripts using our integrated AI tools.",
      color: "from-green-300 to-emerald-400"
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Market Insights",
      description: "Identify high-demand topics and skill gaps with our proprietary market intelligence.",
      color: "from-emerald-500 to-teal-500"
    },
  ];

  const steps = [
    {
      title: "Apply & Plan",
      description: "Sign up as an instructor and plan your course curriculum using our AI roadmap generator.",
      number: "01"
    },
    {
      title: "Create Content",
      description: "Record your lessons and upload them. Use our interactive quiz and project builders.",
      number: "02"
    },
    {
      title: "Launch & Earn",
      description: "Publish your course to the Dealo marketplace and start earning as students enroll.",
      number: "03"
    }
  ];

  const faqs = [
    {
      question: "How do I get paid?",
      answer: "We offer multiple payout options including direct bank transfer, Stripe, and Flutterwave. Payments are processed monthly for all sales above $50."
    },
    {
      question: "Do I own my content?",
      answer: "Yes, you retain 100% ownership of your intellectual property. You simply grant Dealo a license to host and sell your courses."
    },
    {
      question: "What support do you offer?",
      answer: "Every instructor gets access to our premium Support Center, a dedicated Slack community, and personalized course reviews from our quality team."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-900 z-0" />
        <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-white">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Join the Top 1% of Global Educators</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Turn Your Expertise Into <span className="text-emerald-400">Impact.</span>
              </h1>
              <p className="text-xl text-emerald-50/80 mb-8 max-w-xl">
                Dealo provides the world's most advanced tools for instructors to create, market, and sell courses at scale. Join a community of thousands already changing lives.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/dealoforge/create-course"
                  className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-8 py-4 rounded-xl transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20 underline-none"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-4 rounded-xl transition-all"
                >
                  See How It Works
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200"
                  alt="Instructor teaching online"
                  width={1200}
                  height={675}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent" />
              </div>

              {/* Floating UI Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 md:right-0 bg-white p-4 rounded-xl shadow-xl z-20 hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">New Sale</p>
                    <p className="text-sm font-bold text-gray-800">+$129.00</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 md:left-0 bg-emerald-800/90 backdrop-blur-md p-4 rounded-xl shadow-xl z-20 border border-emerald-500/20 hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full border-2 border-emerald-400 overflow-hidden">
                    <Image src="https://i.pravatar.cc/150?u=4" alt="Student" fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-100/60">Success Story</p>
                    <p className="text-sm font-bold text-white">Student Course Completion!</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-emerald-50 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <h3 className="text-3xl lg:text-4xl font-black text-emerald-900 mb-1">{stat.value}</h3>
                <p className="text-emerald-700/70 font-medium text-sm lg:text-base uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-emerald-500 font-bold uppercase tracking-widest text-sm mb-4">Why Instructors Choose Dealo</h2>
            <h3 className="text-4xl lg:text-5xl font-bold text-emerald-950 mb-6">Everything You Need to Succeed</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive suite of tools empowers you to focus on what you do best: sharing your knowledge.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group p-8 rounded-2xl border transition-all duration-300 transform ${hoveredIndex === index
                    ? "bg-emerald-50 border-emerald-200 -translate-y-2"
                    : "bg-white border-gray-100"
                  }`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {benefit.icon}
                </div>
                <h4 className="text-xl font-bold text-emerald-900 mb-3">{benefit.title}</h4>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-emerald-950 text-white relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900/40 skew-x-12 translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/3 text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Your Path to Becoming a <span className="text-emerald-400">Top Instructor</span></h2>
              <p className="text-emerald-50/70 mb-8">
                We've streamlined the journey from expert to educator. Follow these three simple steps to start your venture.
              </p>
              <div className="flex flex-col gap-6">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start text-left bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="text-3xl font-black text-emerald-500/30 shrink-0">{step.number}</div>
                    <div>
                      <h5 className="font-bold text-lg mb-1">{step.title}</h5>
                      <p className="text-sm text-emerald-50/60 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 pb-20 mt-10">
              <div className="bg-emerald-900/50 backdrop-blur border border-emerald-500/20 p-8 rounded-2xl relative">
                <div className="bg-emerald-500 w-10 h-10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6 text-emerald-950" />
                </div>
                <h4 className="text-xl font-bold mb-4">Zero Upfront Cost</h4>
                <p className="text-emerald-50/60">Start teaching for free. We only earn when you do.</p>
              </div>
              <div className="bg-emerald-900/50 backdrop-blur border border-emerald-500/20 p-8 rounded-2xl relative lg:translate-y-12">
                <div className="bg-emerald-500 w-10 h-10 rounded-full flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-emerald-950" />
                </div>
                <h4 className="text-xl font-bold mb-4">Instant Deployment</h4>
                <p className="text-emerald-50/60">Our CDN ensures your content is delivered instantly everywhere.</p>
              </div>
              <div className="bg-emerald-900/50 backdrop-blur border border-emerald-500/20 p-8 rounded-2xl relative">
                <div className="bg-emerald-500 w-10 h-10 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-emerald-950" />
                </div>
                <h4 className="text-xl font-bold mb-4">Instructor Community</h4>
                <p className="text-emerald-50/60">Collaborate with peers and learn best practices in our private group.</p>
              </div>
              <div className="bg-emerald-900/50 backdrop-blur border border-emerald-500/20 p-8 rounded-2xl relative lg:translate-y-12">
                <div className="bg-emerald-500 w-10 h-10 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6 text-emerald-950" />
                </div>
                <h4 className="text-xl font-bold mb-4">Direct Student Chat</h4>
                <p className="text-emerald-50/60">Engage directly with your students via integrated real-time messaging.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-emerald-950">Got Questions? We Have Answers.</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group border border-emerald-100 rounded-xl bg-emerald-50/30 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-bold text-emerald-900 text-lg">{faq.question}</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-emerald-100 group-open:rotate-180 transition-transform">
                    <ArrowRight className="w-4 h-4 text-emerald-600 rotate-90" />
                  </div>
                </summary>
                <div className="p-6 pt-0 text-emerald-700/80 leading-relaxed border-t border-emerald-50">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-24 px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto bg-gradient-to-r from-emerald-500 to-green-500 rounded-3xl p-12 lg:p-20 text-center text-emerald-950 relative overflow-hidden shadow-2xl shadow-emerald-500/30"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-30" />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight">Ready to Master <br />Online Teaching?</h2>
            <p className="text-xl font-medium text-emerald-950/80 mb-10 max-w-2xl mx-auto">
              Join Dealo today and start building your subscription based education empire. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dealoforge/create-course"
                className="bg-emerald-950 text-white font-bold px-10 py-5 rounded-2xl text-lg hover:bg-emerald-900 transition-all flex items-center gap-3 transform hover:scale-105"
              >
                Become an Instructor <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="text-emerald-950 font-bold px-10 py-5 rounded-2xl text-lg hover:bg-white/20 transition-all"
              >
                Talk to Sales
              </Link>
            </div>
            <p className="mt-8 text-emerald-950/60 font-medium">Join 50,000+ others already sharing their knowledge.</p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}


