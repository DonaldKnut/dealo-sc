import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getRelevantKeywords } from "@/lib/keyword-injection";
import { StructuredData } from "@/components/SEO/StructuredData";

export async function generateMetadata(): Promise<Metadata> {
  const keywords = getRelevantKeywords({
    pageType: "home",
    userIntent: "learn",
    region: "international",
    includeGlobal: true,
  });

  return generateSEOMetadata({
    title: "Africa&apos;s Premier Learning & Professional Platform | Dealo",
    description:
      "Connect, learn, and grow across Africa with Dealo's AI-powered professional platform. Join thousands of African professionals, bloggers, and entrepreneurs building their careers through expert-led courses, networking, and skill development.",
    keywords: keywords.slice(0, 20),
    url: "/africa",
    type: "website",
    image: "/africa-platform.jpg",
  });
}

export default function AfricaPage() {
  const keywords = getRelevantKeywords({
    pageType: "home",
    userIntent: "learn",
    region: "international",
    includeGlobal: true,
  });

  const organizationData = {
    name: "Dealo",
    description:
      "Africa&apos;s premier learning and professional networking platform",
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
                Africa&apos;s{" "}
                <span className="bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] bg-clip-text text-transparent">
                  Premier Learning Platform
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Connect, learn, and grow across Africa with expert-led courses,
                freelance opportunities, and professional networking. From Lagos
                to Cairo, Nairobi to Cape Town - join thousands of African
                professionals building their careers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                  Start Learning Free
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-colors">
                  Explore Africa
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* African Regions */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Learning Across Africa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  region: "West Africa",
                  countries: "Nigeria, Ghana, Senegal, Ivory Coast",
                  courses: 2500,
                  professionals: "50K+",
                  description:
                    "Leading tech hub with vibrant startup ecosystem",
                  icon: "🌍",
                },
                {
                  region: "East Africa",
                  countries: "Kenya, Tanzania, Uganda, Rwanda",
                  courses: 1800,
                  professionals: "35K+",
                  description: "Innovation center with mobile-first solutions",
                  icon: "🚀",
                },
                {
                  region: "Southern Africa",
                  countries: "South Africa, Zimbabwe, Botswana",
                  courses: 2200,
                  professionals: "40K+",
                  description: "Financial services and enterprise solutions",
                  icon: "💼",
                },
                {
                  region: "North Africa",
                  countries: "Egypt, Morocco, Tunisia, Algeria",
                  courses: 1600,
                  professionals: "30K+",
                  description: "Arabic and French-speaking tech markets",
                  icon: "🏛️",
                },
                {
                  region: "Central Africa",
                  countries: "Cameroon, Congo, Gabon, Chad",
                  courses: 1200,
                  professionals: "25K+",
                  description: "Emerging markets with growing tech adoption",
                  icon: "🌱",
                },
                {
                  region: "Diaspora",
                  countries: "Global African communities",
                  courses: 3000,
                  professionals: "60K+",
                  description: "Connecting Africans worldwide",
                  icon: "🌐",
                },
              ].map((region, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-500/50 transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{region.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {region.region}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {region.countries}
                  </p>
                  <p className="text-gray-300 mb-4 text-sm">
                    {region.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-400 font-semibold">
                      {region.courses} courses
                    </span>
                    <span className="text-gray-400">
                      {region.professionals} professionals
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Courses by Region */}
        <section className="py-16 bg-gray-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Popular Courses Across Africa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Web Development Bootcamp - Africa Edition",
                  description:
                    "Learn HTML, CSS, JavaScript, React with African examples and projects",
                  instructor: "Sarah Johnson",
                  rating: 4.9,
                  students: 5000,
                  price: "₦50,000",
                  category: "Programming",
                  region: "All Africa",
                },
                {
                  title: "AI & Machine Learning for African Businesses",
                  description:
                    "Master AI tools and machine learning concepts for African market applications",
                  instructor: "Dr. Adebayo",
                  rating: 4.8,
                  students: 3200,
                  price: "₦75,000",
                  category: "AI & Data Science",
                  region: "All Africa",
                },
                {
                  title: "Digital Marketing Mastery - African Edition",
                  description:
                    "Learn digital marketing strategies that work for African businesses",
                  instructor: "Mike Chen",
                  rating: 4.7,
                  students: 4500,
                  price: "₦35,000",
                  category: "Marketing",
                  region: "All Africa",
                },
                {
                  title: "Python Programming for African Developers",
                  description:
                    "Master Python with real-world projects relevant to African tech industry",
                  instructor: "Emily Rodriguez",
                  rating: 4.9,
                  students: 3800,
                  price: "₦45,000",
                  category: "Programming",
                  region: "All Africa",
                },
                {
                  title: "Business Strategy & Leadership in Africa",
                  description:
                    "Learn business strategies tailored for African markets and cultures",
                  instructor: "David Kim",
                  rating: 4.6,
                  students: 2800,
                  price: "₦60,000",
                  category: "Business",
                  region: "All Africa",
                },
                {
                  title: "Cybersecurity Fundamentals for African Professionals",
                  description:
                    "Protect your business and career with essential cybersecurity skills",
                  instructor: "Dr. Okafor",
                  rating: 4.8,
                  students: 2100,
                  price: "₦55,000",
                  category: "Cybersecurity",
                  region: "All Africa",
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

        {/* Why Choose Dealo for Africa */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Why African Professionals Choose Dealo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "🌍",
                  title: "Pan-African Focus",
                  description:
                    "Courses designed for all African markets and cultures",
                },
                {
                  icon: "💰",
                  title: "Local Pricing",
                  description:
                    "All courses priced in local currencies with local payment methods",
                },
                {
                  icon: "👥",
                  title: "African Community",
                  description:
                    "Connect with African professionals and instructors",
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
                Ready to Start Your African Learning Journey?
              </h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of African professionals who are already
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
