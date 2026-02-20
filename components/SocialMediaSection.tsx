"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Heart,
  MessageCircle,
  Share2,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  Camera,
  Video,
  Globe,
  Zap,
  Award,
} from "lucide-react";
import Image from "next/image";

const SocialMediaSection = () => {
  const router = useRouter();

  const features = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Share Your Work",
      description: "Showcase projects, designs, and achievements",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Connect & Network",
      description: "Build relationships with industry professionals",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Grow Your Brand",
      description: "Establish yourself as an industry expert",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Get Recognition",
      description: "Earn badges and certifications for your work",
    },
  ];

  const mockPosts = [
    {
      id: 1,
      user: "Sarah Johnson",
      profession: "UI/UX Designer",
      content:
        "Just completed a stunning website redesign for a fintech startup! 🚀",
      image: "/hero-image.png",
      likes: 1247,
      comments: 89,
      isLiked: false,
    },
    {
      id: 2,
      user: "Michael Chen",
      profession: "Full Stack Developer",
      content:
        "Live coding session: Building a real-time chat application with React and Socket.io",
      image: "/marketplace.png",
      likes: 892,
      comments: 156,
      isLiked: true,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-white to-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="w-8 h-8 bg-[#70f69ae1] rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-[#70f69ae1] font-semibold">
              Social Platform
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Share Your Work,{" "}
            <span className="text-[#70f69ae1]">Build Your Network</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Like Instagram and TikTok, but designed for professionals. Share
            your projects, connect with peers, and build your personal brand in
            a community that values expertise.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Professional Social Networking
            </h3>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-[#70f69ae1]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <div className="text-[#70f69ae1]">{feature.icon}</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8">
              <motion.button
                onClick={() => router.push("/social/feed")}
                className="px-8 py-4 bg-[#70f69ae1] text-white rounded-xl font-semibold hover:bg-[#5dd885] transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Feed
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100">
              <div className="space-y-4">
                {mockPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-gray-50 rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#70f69ae1] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {post.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {post.user}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {post.profession}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 text-sm">{post.content}</p>

                    <div className="relative mb-3">
                      <Image
                        src={post.image}
                        alt="Post content"
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          className={`flex items-center gap-1 text-sm ${
                            post.isLiked ? "text-red-500" : "text-gray-500"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              post.isLiked ? "fill-current" : ""
                            }`}
                          />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-1 text-sm text-gray-500">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments}
                        </button>
                      </div>
                      <button className="text-gray-500">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-[#70f69ae1] rounded-full shadow-lg flex items-center justify-center"
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16"
        >
          {[
            { number: "50K+", label: "Active Users" },
            { number: "100K+", label: "Posts Shared" },
            { number: "1M+", label: "Connections Made" },
            { number: "4.9★", label: "User Rating" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-[#70f69ae1] mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Join the Professional Community
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Start sharing your work and connecting with professionals today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => router.push("/social/feed")}
                className="px-8 py-4 bg-white text-[#70f69ae1] rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Feed
              </motion.button>
              <motion.button
                onClick={() => router.push("/sign-in")}
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-[#70f69ae1] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialMediaSection;

