import {
  KeywordInjectionConfig,
  getRelevantKeywords,
  generateKeywordRichContent,
} from "@/lib/keyword-injection";

interface KeywordRichContentProps {
  baseContent: string;
  config: KeywordInjectionConfig;
  className?: string;
}

export function KeywordRichContent({
  baseContent,
  config,
  className = "",
}: KeywordRichContentProps) {
  const keywords = getRelevantKeywords(config);
  const enrichedContent = generateKeywordRichContent(baseContent, keywords);

  return (
    <div className={className}>
      {enrichedContent.split("\n").map((paragraph, index) => (
        <p key={index} className="mb-4 text-gray-300">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

interface NigerianSEOSectionProps {
  title: string;
  content: string;
  keywords: string[];
  className?: string;
}

export function NigerianSEOSection({
  title,
  content,
  keywords,
  className = "",
}: NigerianSEOSectionProps) {
  return (
    <section className={`py-12 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-6">{title}</h2>
        <div className="prose prose-invert max-w-none">
          {content.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-300">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Hidden keyword section for SEO */}
        <div className="hidden">
          {keywords.map((keyword, index) => (
            <span key={index} className="text-transparent">
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

interface LocalSEOContentProps {
  city: string;
  industry: string;
  keywords: string[];
}

export function LocalSEOContent({
  city,
  industry,
  keywords,
}: LocalSEOContentProps) {
  const cityKeywords = keywords.filter((keyword) =>
    keyword.toLowerCase().includes(city.toLowerCase())
  );

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">
        Perfect for {city} {industry} Professionals
      </h3>
      <p className="text-gray-300 mb-4">
        Join thousands of {city} professionals who are already learning,
        connecting, and growing on Dealo. Our platform is designed specifically
        for the Nigerian market with local payment methods, Naira pricing, and
        culturally relevant content.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {cityKeywords.slice(0, 5).map((keyword, index) => (
          <span
            key={index}
            className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30"
          >
            {keyword}
          </span>
        ))}
      </div>

      <div className="text-sm text-gray-400">
        Popular searches in {city}: {cityKeywords.slice(0, 3).join(", ")}
      </div>
    </div>
  );
}

interface CompetitorComparisonProps {
  competitor: string;
  advantages: string[];
  keywords: string[];
}

export function CompetitorComparison({
  competitor,
  advantages,
  keywords,
}: CompetitorComparisonProps) {
  return (
    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
      <h3 className="text-xl font-bold text-white mb-4">
        Why Choose Dealo Over {competitor}?
      </h3>

      <div className="space-y-3 mb-6">
        {advantages.map((advantage, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-300">{advantage}</p>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-400">
        Better than {competitor} for Nigerian professionals. Designed
        specifically for the Nigerian market.
      </div>

      {/* Hidden competitor keywords for SEO */}
      <div className="hidden">
        {keywords.map((keyword, index) => (
          <span key={index} className="text-transparent">
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}

interface IntentBasedCTAProps {
  intent: "learn" | "earn" | "network" | "hire" | "sell";
  keywords: string[];
}

export function IntentBasedCTA({ intent, keywords }: IntentBasedCTAProps) {
  const getCTAContent = () => {
    switch (intent) {
      case "learn":
        return {
          title: "Start Your Learning Journey Today",
          description:
            "Join thousands of Nigerian professionals learning in-demand skills",
          buttonText: "Browse Courses",
          buttonLink: "/courses",
        };
      case "earn":
        return {
          title: "Start Earning Money Online",
          description:
            "Monetize your skills and find freelance opportunities in Nigeria",
          buttonText: "Start Earning",
          buttonLink: "/earn",
        };
      case "network":
        return {
          title: "Build Your Professional Network",
          description: "Connect with like-minded professionals across Nigeria",
          buttonText: "Join Network",
          buttonLink: "/network",
        };
      case "hire":
        return {
          title: "Find Skilled Nigerian Professionals",
          description:
            "Hire talented freelancers and professionals for your projects",
          buttonText: "Find Talent",
          buttonLink: "/hire",
        };
      case "sell":
        return {
          title: "Sell Your Courses and Services",
          description: "Reach thousands of Nigerian learners and professionals",
          buttonText: "Start Selling",
          buttonLink: "/sell",
        };
    }
  };

  const ctaContent = getCTAContent();

  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-8 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">{ctaContent.title}</h2>
      <p className="text-white/90 mb-6 max-w-2xl mx-auto">
        {ctaContent.description}
      </p>
      <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
        {ctaContent.buttonText}
      </button>

      {/* Hidden intent keywords for SEO */}
      <div className="hidden">
        {keywords.map((keyword, index) => (
          <span key={index} className="text-transparent">
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}
