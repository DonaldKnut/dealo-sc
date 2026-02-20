"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Instagram,
  Linkedin,
  Youtube,
  Heart,
  Send,
  ExternalLink,
  X,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Home", href: "/" },
        { name: "Courses", href: "/certifications/explore" },
        { name: "Freelance", href: "/search/freelance" },
        { name: "Network", href: "/search/professionals" },
        { name: "Certifications", href: "/certifications/my-certifications" },
      ],
    },
    {
      title: "Features",
      links: [
        { name: "AI Learning", href: "/features/ai-learning" },
        { name: "Freelance Marketplace", href: "/features/marketplace" },
        { name: "Professional Network", href: "/features/network" },
        { name: "AI Tools", href: "/features/ai-tools" },
        { name: "Messaging", href: "/features/messaging" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Blog", href: "/blog" },
        { name: "Documentation", href: "/docs" },
        { name: "API", href: "/api" },
        { name: "Status", href: "/status" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Partners", href: "/partners" },
        { name: "Contact", href: "/contact" },
      ],
    },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      href: "#",
    },
    {
      name: "X",
      icon: <X className="w-5 h-5" />,
      href: "#",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      href: "#",
    },
    {
      name: "YouTube",
      icon: <Youtube className="w-5 h-5" />,
      href: "#",
    },
  ];

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <footer className="relative border-t border-white/5 bg-black overflow-hidden pt-24 pb-12">
      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-green-500/5 blur-[100px] rounded-full opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* ── TOP SECTION: NEWSLETTER & BRAND ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24 items-start">
          <div className="lg:col-span-5 space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-6"
            >
              <div className="w-16 h-16 relative">
                <Image
                  src="https://res.cloudinary.com/dajpllbyu/image/upload/v1739668836/d9kbtptg7q3migvutnwi.png"
                  alt="Dealo Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Dealo <span className="text-emerald-500">Talent</span></h3>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Build Your Legacy</p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-sm font-medium leading-relaxed max-w-md italic"
            >
              At Dealo, we're architecting the future of African talent. Nigerians' premier ecosystem for online learning, elite networking, and AI-powered professional dominance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative group max-w-md"
            >
              <div className="absolute -inset-1 bg-emerald-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <form onSubmit={handleEmailSubmit} className="relative flex bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] p-1.5 focus-within:border-emerald-500/30 transition-all">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Join the intelligence unit..."
                  className="flex-1 bg-transparent px-6 text-sm text-white focus:outline-none placeholder:text-gray-600 font-medium"
                />
                <button
                  type="submit"
                  className="bg-emerald-500 text-black px-8 py-3.5 rounded-[1.75rem] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2"
                >
                  Join <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-12">
            {footerSections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                <h4 className="text-white text-[11px] font-black uppercase tracking-[0.3em] mb-8">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={() => router.push(link.href)}
                        className="text-gray-500 hover:text-emerald-400 text-[13px] font-medium transition-colors group flex items-center gap-2"
                      >
                        <span className="relative">
                          {link.name}
                          <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-500/50 group-hover:w-full transition-all duration-500" />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── MIDDLE SECTION: CONTACT & SOCIALS ── */}
        <div className="pt-16 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-10"
          >
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-emerald-500/30 transition-all">
                <Mail className="w-4 h-4 text-emerald-500/50" />
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">hello@dealonetwork.com</p>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-emerald-500/30 transition-all">
                <MapPin className="w-4 h-4 text-emerald-500/50" />
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-tight max-w-[200px]">Lekki Phase 1, Lagos</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center md:justify-end gap-3"
          >
            {socialLinks.map((social, idx) => (
              <motion.a
                key={social.name}
                href={social.href}
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-500 group"
              >
                <div className="group-hover:scale-110 transition-transform">
                  {social.icon}
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* ── BOTTOM BAR: LEGAL ── */}
        <div className="mt-16 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2">
            © 2025 Dealo Talent. Made with <Heart className="w-3 h-3 text-emerald-500 animate-pulse" /> in Nigeria
          </p>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Cookies"].map((legal) => (
              <button key={legal} className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-[0.25em] transition-colors">{legal}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
