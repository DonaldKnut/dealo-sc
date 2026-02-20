"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  BookOpen,
  Briefcase,
  Users,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Award,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Image from "next/image"

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
;

interface SearchResult {
  courses: any[];
  works: any[];
  professionals: any[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface SearchFilters {
  type: "all" | "courses" | "works" | "professionals";
  profession?: string;
}

const SearchResultsPage = () => {
  const params = useParams();
  const router = useRouter();
  const query = decodeURIComponent(params.query as string);

  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({ type: "all" });
  const [searchInput, setSearchInput] = useState(query);
  const [isSearching, setIsSearching] = useState(false);

  // Professions for filtering
  const professions = [
    "Software Engineer",
    "Web Developer",
    "Data Scientist",
    "UX Designer",
    "Product Manager",
    "Digital Marketer",
    "Content Creator",
    "Graphic Designer",
    "Mobile Developer",
    "DevOps Engineer",
    "AI/ML Engineer",
    "Cybersecurity Expert",
  ];

  // Fetch search results
  const fetchResults = async (
    searchQuery: string,
    searchFilters: SearchFilters
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Use the new comprehensive search API
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          type: searchFilters.type,
          profession: searchFilters.profession,
          limit: 20,
          page: 1,
        }),
      });

      if (!response.ok) {
        // Fallback to old work search API for backward compatibility
        if (searchFilters.type === "works" || searchFilters.type === "all") {
          const fallbackResponse = await fetch(
            `/api/work/search/${encodeURIComponent(searchQuery)}`
          );
          if (fallbackResponse.ok) {
            const works = await fallbackResponse.json();
            setResults({
              courses: [],
              works: works,
              professionals: [],
              total: works.length,
              page: 1,
              limit: 20,
              hasMore: false,
            });
            setLoading(false);
            return;
          }
        }
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
      } else {
        throw new Error(data.message || "Search failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setIsSearching(true);
      router.push(`/search/${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchResults(query, updatedFilters);
  };

  // Initial search
  useEffect(() => {
    if (query) {
      fetchResults(query, filters);
    }
  }, [query, filters]);

  // Reset search state when query changes
  useEffect(() => {
    setSearchInput(query);
    setIsSearching(false);
  }, [query]);

  // Skeleton components
  const CourseSkeleton = () => (
    <div className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-700 rounded-lg"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          <div className="h-3 bg-gray-700 rounded w-2/3"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-700 rounded w-16"></div>
            <div className="h-6 bg-gray-700 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const WorkSkeleton = () => (
    <div className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-5 bg-gray-700 rounded w-2/3"></div>
        <div className="h-3 bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-700 rounded w-4/5"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-700 rounded w-20"></div>
          <div className="h-8 bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    </div>
  );

  const ProfessionalSkeleton = () => (
    <div className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
          <div className="flex gap-2">
            <div className="h-5 bg-gray-700 rounded w-16"></div>
            <div className="h-5 bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-4">Search Error</h1>
            <p className="text-gray-400 mb-8">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 bg-[#70f69ae1] text-white px-6 py-3 rounded-lg hover:bg-[#5dd885] transition-colors mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search for courses, skills, or professionals..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#70f69ae1] focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#70f69ae1] text-white p-2 rounded-lg hover:bg-[#5dd885] transition-colors disabled:opacity-50"
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </button>
              </div>
            </form>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <select
                value={filters.type}
                onChange={(e) =>
                  handleFilterChange({ type: e.target.value as any })
                }
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#70f69ae1]"
              >
                <option value="all">All</option>
                <option value="courses">Courses</option>
                <option value="works">Works</option>
                <option value="professionals">Professionals</option>
              </select>

              {filters.type === "professionals" && (
                <select
                  value={filters.profession || ""}
                  onChange={(e) =>
                    handleFilterChange({
                      profession: e.target.value || undefined,
                    })
                  }
                  className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#70f69ae1]"
                >
                  <option value="">All Professions</option>
                  {professions.map((profession) => (
                    <option key={profession} value={profession}>
                      {profession}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CourseSkeleton key={i} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Results Summary */}
              {results && results.total > 0 && (
                <div className="text-center py-8">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Search Results for &ldquo;{query}&rdquo;
                  </h1>
                  <p className="text-gray-400">Found {results.total} results</p>
                </div>
              )}

              {/* Courses */}
              {(filters.type === "all" || filters.type === "courses") &&
                results?.courses &&
                results.courses.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-[#70f69ae1]" />
                      Courses ({results?.courses?.length || 0})
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results?.courses?.map((course) => (
                        <motion.div
                          key={course._id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all cursor-pointer"
                          onClick={() =>
                            router.push(`/dealoforge/courses/${course._id}`)
                          }
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-[#70f69ae1]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <BookOpen className="h-8 w-8 text-[#70f69ae1]" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white mb-2">
                                {course.title}
                              </h3>
                              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                {course.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-400" />
                                  <span>{course.rating || "New"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

              {/* Works */}
              {(filters.type === "all" || filters.type === "works") &&
                results?.works &&
                results.works.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-[#70f69ae1]" />
                      Works ({results?.works?.length || 0})
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results?.works?.map((work) => (
                        <motion.div
                          key={work._id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all cursor-pointer"
                          onClick={() =>
                            router.push(
                              `/marketplace/product-details/${work._id}`
                            )
                          }
                        >
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold text-white mb-2">
                                {work.title}
                              </h3>
                              <p className="text-gray-400 text-sm line-clamp-2">
                                {work.description}
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm">
                                {work.category}
                              </span>
                              <span className="text-[#70f69ae1] font-semibold">
                                ${work.price}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

              {/* Professionals */}
              {(filters.type === "all" || filters.type === "professionals") &&
                results?.professionals &&
                results.professionals.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-[#70f69ae1]" />
                      Professionals ({results?.professionals?.length || 0})
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results?.professionals?.map((professional) => (
                        <motion.div
                          key={professional._id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all cursor-pointer"
                          onClick={() =>
                            router.push(`/profile/${professional._id}`)
                          }
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#70f69ae1]/20 rounded-full flex items-center justify-center">
                              {professional.avatar ? (
                                <Image
                                  src={professional.avatar}
                                  alt={`${professional.firstName} ${professional.lastName}`}
                                  width={48}
                                  height={48}
                                  className="rounded-full"
                                />
                              ) : (
                                <Users className="h-6 w-6 text-[#70f69ae1]" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white mb-1">
                                {professional.firstName} {professional.lastName}
                              </h3>
                              <p className="text-gray-400 text-sm mb-2">
                                {professional.role}
                              </p>
                              <div className="flex items-center gap-2">
                                {professional.isVerified && (
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                )}
                                {professional.isCertified && (
                                  <Award className="h-4 w-4 text-yellow-400" />
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

              {/* No Results */}
              {results?.total === 0 && (
                <div className="text-center py-20">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your search terms or filters
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="bg-[#70f69ae1] text-white px-6 py-3 rounded-lg hover:bg-[#5dd885] transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchResultsPage;
