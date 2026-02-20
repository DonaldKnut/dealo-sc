"use client";

import { motion } from "framer-motion";
import { Settings, User, Bell, Lock, Shield, CreditCard, Globe, Palette, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSafeSession } from "@/hooks/use-safe-session";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const session = useSafeSession();
  const { data: sessionData } = session || {};

  const settingsCategories = [
    {
      icon: <User className="w-5 h-5" />,
      title: "Profile Settings",
      description: "Manage your personal information",
      href: "/profile",
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Notifications",
      description: "Control how you receive notifications",
      href: "#",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Privacy & Security",
      description: "Manage your privacy and security settings",
      href: "#",
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Billing",
      description: "Manage subscriptions and payments",
      href: "/pricing",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Language & Region",
      description: "Set your language and region preferences",
      href: "#",
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Appearance",
      description: "Customize your theme and display",
      href: "#",
    },
  ];

  if (!sessionData?.user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to access settings</p>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account preferences</p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, shadow: "lg" }}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-300 transition-all cursor-pointer group"
              onClick={() => category.href !== "#" && router.push(category.href)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white rounded-xl p-8 border border-gray-200"
        >
          <div className="flex items-center gap-4 mb-6">
            <Mail className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Need Help?</h2>
          </div>
          <p className="text-gray-600 mb-4">
            If you need assistance with your settings, our support team is here to help.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
          >
            Contact Support →
          </Link>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}


