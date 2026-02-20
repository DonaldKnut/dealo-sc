"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Users,
  DollarSign,
  Star,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  Play,
  Search,
  Filter,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Eye,
} from "lucide-react";

const MarketplaceAdvert = () => {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const marketplaceFeatures = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Freelance Services",
      description: "Connect with skilled professionals for any project",
      color: "from-blue-500 to-cyan-500",
      stats: "10K+ Services",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Global Network",
      description: "Access talent from around the world",
      color: "from-green-500 to-emerald-500",
      stats: "50K+ Professionals",
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Secure Payments",
      description: "Safe transactions with escrow protection",
      color: "from-purple-500 to-pink-500",
      stats: "₦500M+ Transacted",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality Assurance",
      description: "Verified professionals and guaranteed work",
      color: "from-orange-500 to-red-500",
      stats: "95% Success Rate",
    },
  ];

  const serviceCategories = [
    { name: "Web Development", icon: "💻", count: "2.5K+" },
    { name: "Graphic Design", icon: "🎨", count: "1.8K+" },
    { name: "Digital Marketing", icon: "📈", count: "1.2K+" },
    { name: "Writing & Translation", icon: "✍️", count: "900+" },
    { name: "Video & Animation", icon: "🎬", count: "750+" },
    { name: "Business Consulting", icon: "💼", count: "600+" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Startup Founder",
      content:
        "Found the perfect developer for my app in just 2 days. The quality was outstanding!",
      rating: 5,
      avatar: "👩‍💼",
    },
    {
      name: "Michael Chen",
      role: "Marketing Director",
      content:
        "The marketplace has everything I need. From designers to marketers, all top-notch.",
      rating: 5,
      avatar: "👨‍💻",
    },
    {
      name: "Emily Rodriguez",
      role: "Freelancer",
      content:
        "Best platform to showcase my work and connect with amazing clients worldwide.",
      rating: 5,
      avatar: "👩‍🎨",
    },
  ];

  const mockServices = [
    {
      title: "Professional Logo Design",
      freelancer: "Alex Design Studio",
      rating: 4.9,
      reviews: 127,
      price: "₦25,000",
      delivery: "3 days",
      image: "🎨",
      tags: ["Logo", "Branding", "Vector"],
    },
    {
      title: "React Native App Development",
      freelancer: "Tech Solutions Pro",
      rating: 4.8,
      reviews: 89,
      price: "₦150,000",
      delivery: "2 weeks",
      image: "📱",
      tags: ["Mobile", "React", "iOS/Android"],
    },
    {
      title: "Social Media Marketing",
      freelancer: "Digital Growth Co",
      rating: 4.9,
      reviews: 203,
      price: "₦45,000",
      delivery: "1 week",
      image: "📊",
      tags: ["Marketing", "Social Media", "Growth"],
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
            The Ultimate{" "}
            <span className="bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] bg-clip-text text-transparent">
              Freelance Marketplace
            </span>
          </h2>
          <p className="text-body-large text-gray-300 max-w-3xl mx-auto font-body mb-8">
            Connect with top professionals, get quality work done, and grow your
            business on Africa&apos;s leading freelance platform
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/marketplace")}
              className="flex items-center gap-3 bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
            >
              <Search className="w-5 h-5" />
              Browse Services
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push("/marketplace/create-work")}
              className="flex items-center gap-3 border-2 border-[#70f69ae1] text-[#70f69ae1] px-8 py-4 rounded-xl font-semibold hover:bg-[#70f69ae1] hover:text-white transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Start Selling
            </button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {marketplaceFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-[#70f69ae1]/50 transition-all duration-300 group cursor-pointer"
              onClick={() => router.push("/marketplace")}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className="text-h4 text-white mb-4 font-ui">
                {feature.title}
              </h3>
              <p className="text-body text-gray-400 font-body mb-4">
                {feature.description}
              </p>
              <div className="text-[#70f69ae1] font-semibold text-sm">
                {feature.stats}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Service Categories */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Popular Service Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {serviceCategories.map((category, index) => (
              <motion.div
                key={category.name}
                className="bg-gray-800/30 rounded-xl p-6 text-center hover:bg-gray-800/50 transition-all duration-300 cursor-pointer group"
                onClick={() =>
                  router.push(
                    `/marketplace?category=${category.name.toLowerCase()}`
                  )
                }
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h4 className="text-white font-semibold mb-1 text-sm">
                  {category.name}
                </h4>
                <p className="text-[#70f69ae1] text-xs">{category.count}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mock Services Preview */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Featured Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockServices.map((service, index) => (
              <motion.div
                key={service.title}
                className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-[#70f69ae1]/50 transition-all duration-300 group cursor-pointer"
                onClick={() => router.push("/marketplace")}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{service.image}</div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-semibold">
                      {service.rating}
                    </span>
                    <span className="text-gray-400 text-sm">
                      ({service.reviews})
                    </span>
                  </div>
                </div>

                <h4 className="text-white font-semibold mb-2 group-hover:text-[#70f69ae1] transition-colors">
                  {service.title}
                </h4>
                <p className="text-gray-400 text-sm mb-3">
                  by {service.freelancer}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#70f69ae1] font-bold text-lg">
                      {service.price}
                    </div>
                    <div className="text-gray-400 text-sm">
                      Delivery: {service.delivery}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                      <Heart className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 bg-[#70f69ae1] hover:bg-green-600 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            What Our Users Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 font-body">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <p className="text-white font-semibold">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="bg-gradient-to-r from-[#70f69ae1]/10 to-[#5dd885]/10 rounded-3xl p-12 border border-[#70f69ae1]/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#70f69ae1] mb-2">
                50K+
              </div>
              <div className="text-gray-300">Active Professionals</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#70f69ae1] mb-2">
                10K+
              </div>
              <div className="text-gray-300">Services Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#70f69ae1] mb-2">
                ₦500M+
              </div>
              <div className="text-gray-300">Total Earnings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#70f69ae1] mb-2">
                95%
              </div>
              <div className="text-gray-300">Success Rate</div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Freelance Journey?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already earning and growing
            on Dealo Marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/marketplace")}
              className="flex items-center gap-3 bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
            >
              <Globe className="w-5 h-5" />
              Explore Marketplace
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push("/marketplace/create-work")}
              className="flex items-center gap-3 border-2 border-[#70f69ae1] text-[#70f69ae1] px-8 py-4 rounded-xl font-semibold hover:bg-[#70f69ae1] hover:text-white transition-all duration-300"
            >
              <TrendingUp className="w-5 h-5" />
              Start Earning Today
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MarketplaceAdvert;
