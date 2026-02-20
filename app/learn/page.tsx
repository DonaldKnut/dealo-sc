import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getRelevantKeywords } from "@/lib/keyword-injection";
import { StructuredData } from "@/components/SEO/StructuredData";

export async function generateMetadata(): Promise<Metadata> {
  const keywords = getRelevantKeywords({
    pageType: "home",
    userIntent: "learn",
  });

  return generateSEOMetadata({
    title: "Learn Programming, AI, Business & Tech Skills in Nigeria | Dealo",
    description:
      "Master in-demand skills with expert-led courses designed for Nigerian professionals. Learn programming, AI, business, tech skills, and more. Join thousands of Nigerian learners.",
    keywords: keywords.slice(0, 20),
    url: "/learn",
    type: "website",
    image: "/learn-nigeria.jpg",
  });
}

export default function LearnPage() {
  const keywords = getRelevantKeywords({
    pageType: "home",
    userIntent: "learn",
  });

  const organizationData = {
    name: "Dealo",
    description:
      "Nigeria's premier learning platform for programming, AI, business, and tech skills",
    foundingDate: "2024",
    address: {
      addressCountry: "NG",
      addressRegion: "Lagos",
    },
    contactPoint: {
      contactType: "customer service",
      email: "support@dealo.ng",
    },
    sameAs: [
      "https://twitter.com/dealo_ng",
      "https://linkedin.com/company/dealo-ng",
      "https://facebook.com/dealo.ng",
      "https://instagram.com/dealo_ng",
    ],
  };

  return (
    <>
      <StructuredData type="Organization" data={organizationData} />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-green-600 to-green-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Learn{" "}
                <span className="bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] bg-clip-text text-transparent">
                  Programming, AI & Tech Skills
                </span>{" "}
                in Nigeria
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Master in-demand skills with expert-led courses designed
                specifically for Nigerian professionals. Join thousands of
                learners across Lagos, Abuja, Port Harcourt, and beyond.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                  Start Learning Free
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-colors">
                  Browse Courses
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Courses */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Most Popular Courses in Nigeria
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Complete Web Development Bootcamp - Nigeria Edition",
                  description:
                    "Learn HTML, CSS, JavaScript, React, Node.js with Nigerian examples and projects",
                  instructor: "Sarah Johnson",
                  rating: 4.9,
                  students: 2500,
                  price: "₦50,000",
                  category: "Programming",
                },
                {
                  title: "AI & Machine Learning for Nigerian Businesses",
                  description:
                    "Master AI tools and machine learning concepts for Nigerian market applications",
                  instructor: "Dr. Adebayo",
                  rating: 4.8,
                  students: 1800,
                  price: "₦75,000",
                  category: "AI & Data Science",
                },
                {
                  title: "Digital Marketing Mastery - Lagos Edition",
                  description:
                    "Learn digital marketing strategies that work for Nigerian businesses",
                  instructor: "Mike Chen",
                  rating: 4.7,
                  students: 3200,
                  price: "₦35,000",
                  category: "Marketing",
                },
                {
                  title: "Python Programming for Nigerian Developers",
                  description:
                    "Master Python with real-world projects relevant to Nigerian tech industry",
                  instructor: "Emily Rodriguez",
                  rating: 4.9,
                  students: 2100,
                  price: "₦45,000",
                  category: "Programming",
                },
                {
                  title: "Business Strategy & Leadership in Nigeria",
                  description:
                    "Learn business strategies tailored for Nigerian market and culture",
                  instructor: "David Kim",
                  rating: 4.6,
                  students: 1500,
                  price: "₦60,000",
                  category: "Business",
                },
                {
                  title:
                    "Cybersecurity Fundamentals for Nigerian Professionals",
                  description:
                    "Protect your business and career with essential cybersecurity skills",
                  instructor: "Dr. Okafor",
                  rating: 4.8,
                  students: 1200,
                  price: "₦55,000",
                  category: "Cybersecurity",
                },
              ].map((course, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-500/50 transition-all duration-300"
                >
                  <div className="mb-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30">
                      {course.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {course.title}
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span>by {course.instructor}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-400">
                      {course.price}
                    </span>
                    <span className="text-sm text-gray-400">
                      {course.students.toLocaleString()} students
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Dealo */}
        <section className="py-16 bg-gray-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Why Nigerian Professionals Choose Dealo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "🇳🇬",
                  title: "Nigerian Focus",
                  description:
                    "Courses designed specifically for Nigerian market and culture",
                },
                {
                  icon: "💰",
                  title: "Naira Pricing",
                  description:
                    "All courses priced in Nigerian Naira with local payment methods",
                },
                {
                  icon: "👥",
                  title: "Local Community",
                  description:
                    "Connect with Nigerian professionals and instructors",
                },
                {
                  icon: "📱",
                  title: "Mobile Optimized",
                  description:
                    "Learn on-the-go with our mobile-optimized platform",
                },
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of Nigerian professionals who are already
                advancing their careers with Dealo
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                  Get Started Free
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-colors">
                  View All Courses
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
















