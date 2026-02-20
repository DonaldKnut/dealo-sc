import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getRelevantKeywords } from "@/lib/keyword-injection";
import { StructuredData } from "@/components/SEO/StructuredData";

export async function generateMetadata(): Promise<Metadata> {
  const keywords = getRelevantKeywords({
    pageType: "freelance",
    userIntent: "earn",
  });

  return generateSEOMetadata({
    title:
      "Earn Money Online in Nigeria | Freelance Jobs & Opportunities | Dealo",
    description:
      "Find freelance jobs, sell your skills, and earn money online in Nigeria. Join thousands of Nigerian freelancers making ₦500K+ monthly. Start earning today!",
    keywords: keywords.slice(0, 20),
    url: "/earn",
    type: "website",
    image: "/earn-nigeria.jpg",
  });
}

export default function EarnPage() {
  const keywords = getRelevantKeywords({
    pageType: "freelance",
    userIntent: "earn",
  });

  const organizationData = {
    name: "Dealo",
    description:
      "Nigeria&apos;s premier freelance marketplace and earning platform",
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
                Earn{" "}
                <span className="bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] bg-clip-text text-transparent">
                  ₦500K+ Monthly
                </span>{" "}
                as a Nigerian Freelancer
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Join Nigeria&apos;s largest freelance marketplace. Find
                high-paying gigs, sell your skills, and build a successful
                online business. Perfect for Nigerian professionals looking to
                earn extra income.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                  Start Earning Today
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-colors">
                  Browse Jobs
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Nigerian Freelancers Earning Big on Dealo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Adebayo",
                  location: "Lagos",
                  skill: "Web Development",
                  earnings: "₦850,000",
                  period: "per month",
                  story:
                    "Started as a beginner developer, now earning ₦850K monthly with consistent clients",
                },
                {
                  name: "Michael Okafor",
                  location: "Abuja",
                  skill: "Digital Marketing",
                  earnings: "₦650,000",
                  period: "per month",
                  story:
                    "Helps Nigerian businesses grow online, earning ₦650K monthly through Dealo",
                },
                {
                  name: "Fatima Ibrahim",
                  location: "Kano",
                  skill: "Content Writing",
                  earnings: "₦420,000",
                  period: "per month",
                  story:
                    "Writes for Nigerian brands, earning ₦420K monthly while working from home",
                },
                {
                  name: "David Okonkwo",
                  location: "Port Harcourt",
                  skill: "Graphic Design",
                  earnings: "₦580,000",
                  period: "per month",
                  story:
                    "Creates stunning designs for Nigerian companies, earning ₦580K monthly",
                },
                {
                  name: "Grace Nwosu",
                  location: "Ibadan",
                  skill: "Data Analysis",
                  earnings: "₦720,000",
                  period: "per month",
                  story:
                    "Helps Nigerian businesses make data-driven decisions, earning ₦720K monthly",
                },
                {
                  name: "Emmanuel Bello",
                  location: "Lagos",
                  skill: "Mobile App Development",
                  earnings: "₦950,000",
                  period: "per month",
                  story:
                    "Builds mobile apps for Nigerian startups, earning ₦950K monthly",
                },
              ].map((freelancer, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-500/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-green-400 text-xl font-bold">
                        {freelancer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {freelancer.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {freelancer.location} • {freelancer.skill}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-green-400">
                      {freelancer.earnings}
                    </div>
                    <div className="text-sm text-gray-400">
                      {freelancer.period}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{freelancer.story}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Earning Opportunities */}
        <section className="py-16 bg-gray-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              How to Earn Money on Dealo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "💼",
                  title: "Freelance Jobs",
                  description:
                    "Find high-paying freelance gigs in programming, design, writing, and more",
                  earnings: "₦50K - ₦500K+ per project",
                },
                {
                  icon: "📚",
                  title: "Sell Courses",
                  description:
                    "Create and sell online courses to thousands of Nigerian learners",
                  earnings: "₦100K - ₦1M+ per month",
                },
                {
                  icon: "🤝",
                  title: "Consulting",
                  description:
                    "Offer expert consulting services to Nigerian businesses",
                  earnings: "₦200K - ₦800K+ per month",
                },
                {
                  icon: "🎯",
                  title: "Affiliate Marketing",
                  description:
                    "Earn commissions by promoting courses and services",
                  earnings: "₦50K - ₦300K+ per month",
                },
              ].map((opportunity, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">{opportunity.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {opportunity.title}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {opportunity.description}
                  </p>
                  <div className="text-green-400 font-semibold">
                    {opportunity.earnings}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Skills */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              High-Demand Skills in Nigeria
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                {
                  skill: "Web Development",
                  demand: "Very High",
                  rate: "₦100K-₦500K",
                },
                {
                  skill: "Mobile App Development",
                  demand: "Very High",
                  rate: "₦150K-₦800K",
                },
                {
                  skill: "Digital Marketing",
                  demand: "High",
                  rate: "₦80K-₦400K",
                },
                { skill: "Data Analysis", demand: "High", rate: "₦120K-₦600K" },
                { skill: "Graphic Design", demand: "High", rate: "₦60K-₦300K" },
                {
                  skill: "Content Writing",
                  demand: "High",
                  rate: "₦40K-₦200K",
                },
                {
                  skill: "AI & Machine Learning",
                  demand: "Very High",
                  rate: "₦200K-₦1M",
                },
                {
                  skill: "Cybersecurity",
                  demand: "Very High",
                  rate: "₦150K-₦700K",
                },
                { skill: "UI/UX Design", demand: "High", rate: "₦100K-₦500K" },
                {
                  skill: "Project Management",
                  demand: "High",
                  rate: "₦80K-₦400K",
                },
                {
                  skill: "Business Analysis",
                  demand: "High",
                  rate: "₦90K-₦450K",
                },
                {
                  skill: "Video Editing",
                  demand: "Medium",
                  rate: "₦50K-₦250K",
                },
              ].map((skill, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center"
                >
                  <h3 className="text-white font-semibold mb-2">
                    {skill.skill}
                  </h3>
                  <div className="text-green-400 text-sm mb-1">
                    {skill.demand}
                  </div>
                  <div className="text-gray-400 text-xs">{skill.rate}</div>
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
                Ready to Start Earning?
              </h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of Nigerian freelancers who are already earning
                big on Dealo
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                  Create Profile
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-colors">
                  Browse Jobs
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
