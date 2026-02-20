"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PACKAGES } from "@/constant";
import { Search, DollarSign, Package as PackageIcon, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./page.css";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mb-6">
            <PackageIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Packages</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect package for your needs. Each package is designed to help you achieve your goals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PACKAGES.map((card, index) => (
            <PackageItem
              title={card.title}
              key={card.title}
              path={card.path}
              price={card.price}
              desc={card.desc}
              wantedJobs={card.wantedJobs}
              index={index}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

type PackageItemProps = {
  path: string;
  title: string;
  price?: string;
  desc?: string;
  wantedJobs?: string[];
  index: number;
};

const PackageItem: React.FC<PackageItemProps> = ({
  title,
  path,
  price,
  desc,
  wantedJobs,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, shadow: "xl" }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-green-300 transition-all group cursor-pointer"
    >
      <div className="relative overflow-hidden h-48">
        <Image
          src={path}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <PackageIcon className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        
        {price && (
          <div className="flex items-center gap-2 mb-4 text-green-600">
            <DollarSign className="w-5 h-5" />
            <span className="text-xl font-semibold">Price: {price}</span>
          </div>
        )}
        
        {desc && (
          <p className="text-gray-600 mb-4 line-clamp-3">{desc}</p>
        )}
        
        {wantedJobs && wantedJobs.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Available Jobs:</p>
            <ul className="space-y-1">
              {wantedJobs.slice(0, 3).map((job, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  {job}
                </li>
              ))}
              {wantedJobs.length > 3 && (
                <li className="text-sm text-gray-500">+{wantedJobs.length - 3} more</li>
              )}
            </ul>
          </div>
        )}
        
        <Link
          href="/explore"
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 group/btn"
        >
          <span>Apply Now</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default Page;
