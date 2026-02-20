"use client";

import { motion } from "framer-motion";
import Skeleton from "./ui/skeleton";

const HomePageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black">
      {/* Hero Section Skeleton */}
      <section className="relative overflow-hidden">
        <div className="container-consistent py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Skeleton height="h-12" width="w-3/4" />
                <Skeleton height="h-6" width="w-full" />
                <Skeleton height="h-6" width="w-5/6" />
                <Skeleton height="h-6" width="w-4/5" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton height="h-14" width="w-48" rounded="xl" />
                <Skeleton height="h-14" width="w-48" rounded="xl" />
              </div>

              <div className="flex items-center gap-8">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton
                      key={i}
                      height="h-10"
                      width="w-10"
                      rounded="full"
                    />
                  ))}
                </div>
                <div className="space-y-1">
                  <Skeleton height="h-4" width="w-24" />
                  <Skeleton height="h-3" width="w-32" />
                </div>
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <Skeleton
                height="h-96"
                width="w-full"
                rounded="xl"
                variant="light"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="py-20">
        <div className="container-consistent">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <Skeleton height="h-8" width="w-64" className="mx-auto mb-4" />
            <Skeleton height="h-6" width="w-96" className="mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10"
              >
                <Skeleton
                  height="h-12"
                  width="w-12"
                  rounded="xl"
                  className="mb-4"
                />
                <Skeleton height="h-6" width="w-3/4" className="mb-3" />
                <Skeleton height="h-4" width="w-full" className="mb-2" />
                <Skeleton height="h-4" width="w-5/6" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section Skeleton */}
      <section className="py-20">
        <div className="container-consistent">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <Skeleton
                  height="h-8"
                  width="w-16"
                  className="mx-auto mb-2"
                />
                <Skeleton height="h-6" width="w-24" className="mx-auto mb-2" />
                <Skeleton height="h-4" width="w-32" className="mx-auto" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section Skeleton */}
      <section className="py-20">
        <div className="container-consistent">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center mb-16"
          >
            <Skeleton height="h-8" width="w-64" className="mx-auto mb-4" />
            <Skeleton height="h-6" width="w-96" className="mx-auto" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.05 }}
                className="bg-white/5 rounded-xl p-6 border border-white/10"
              >
                <Skeleton
                  height="h-10"
                  width="w-10"
                  rounded="lg"
                  className="mb-4"
                />
                <Skeleton height="h-5" width="w-3/4" className="mb-2" />
                <Skeleton height="h-4" width="w-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section Skeleton */}
      <section className="py-20">
        <div className="container-consistent">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Skeleton height="h-8" width="w-64" className="mx-auto mb-4" />
            <Skeleton height="h-6" width="w-96" className="mx-auto mb-8" />

            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="flex items-center space-x-1 mb-6 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    height="h-6"
                    width="w-6"
                    variant="light"
                  />
                ))}
              </div>

              <Skeleton height="h-6" width="w-full" className="mb-4" />
              <Skeleton height="h-6" width="w-5/6" className="mx-auto mb-6" />

              <div className="flex items-center justify-center space-x-4">
                <Skeleton height="h-12" width="w-12" rounded="full" />
                <div className="text-left">
                  <Skeleton height="h-5" width="w-32" />
                  <Skeleton height="h-4" width="w-48" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-20">
        <div className="container-consistent text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="max-w-3xl mx-auto"
          >
            <Skeleton height="h-10" width="w-96" className="mx-auto mb-6" />
            <Skeleton height="h-6" width="w-full" className="mb-8" />
            <Skeleton
              height="h-14"
              width="w-64"
              rounded="xl"
              className="mx-auto"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePageSkeleton;
