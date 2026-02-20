"use client";

import { Metadata } from "next";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Clock,
  Star,
  Users,
  CheckCircle,
  Target,
  BookOpen,
  Award,
  ChevronDown,
  ChevronRight,
  Lock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CourseStructuredData } from "@/components/SEO/StructuredData";

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  previewVideo: {
    url: string;
    duration: number;
    thumbnail: string;
  };
  price: {
    amount: number;
    currency: string;
    isFree: boolean;
  };
  category: string;
  tags: string[];
  instructor: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
  sections: Array<{
    _id: string;
    title: string;
    description?: string;
    lectures: Array<{
      _id: string;
      title: string;
      description?: string;
      duration: number;
      url: string;
      isPreview: boolean;
    }>;
  }>;
  requirements: string[];
  learningOutcomes: string[];
  targetAudience: string[];
  createdAt: string;
  updatedAt: string;
}

interface CoursePageProps {
  params: {
    slug: string;
  };
}

const CoursePage = ({ params }: CoursePageProps) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const fetchCourse = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/courses/${params.slug}`);
      if (!res.ok) throw new Error("Failed to fetch course");
      const data = await res.json();
      setCourse(data.course);

      // Expand first section by default
      if (data.course?.sections?.[0]) {
        setExpandedSections(new Set([data.course.sections[0]._id]));
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  }, [params.slug]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getTotalDuration = (sections: Course["sections"]) => {
    return sections.reduce((total, section) => {
      return (
        total +
        section.lectures.reduce(
          (sectionTotal, lecture) => sectionTotal + lecture.duration,
          0
        )
      );
    }, 0);
  };

  const getTotalLectures = (sections: Course["sections"]) => {
    return sections.reduce(
      (total, section) => total + section.lectures.length,
      0
    );
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black flex items-center justify-center">
        <div className="text-gray-400">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-4">Course not found</div>
          <Link href="/courses">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Course data for structured data
  const courseData = {
    id: course._id,
    title: course.title,
    description: course.shortDescription || course.description,
    instructor: {
      name: course.instructor.name,
      bio: course.instructor.bio || "Expert instructor",
    },
    price: {
      amount: course.price.amount,
      currency: course.price.currency,
    },
    duration: getTotalDuration(course.sections).toString(),
    level: "beginner", // You might want to add this to your Course interface
    rating: {
      average: 4.8,
      count: 2156,
    },
    thumbnail: course.thumbnail,
    category: course.category,
    tags: course.tags,
    whatYouWillLearn: course.learningOutcomes || ["Learn valuable skills"],
    prerequisites: course.requirements || ["Basic computer skills"],
    language: "en",
    lastUpdated: course.updatedAt,
  };

  return (
    <>
      <CourseStructuredData course={courseData} />
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black">
        {/* Course Header */}
        <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-b border-green-500/20">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Course Info */}
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <Badge
                    variant="outline"
                    className="text-green-400 border-green-500/30"
                  >
                    {course.category}
                  </Badge>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {course.title}
                </h1>

                <p className="text-gray-300 text-lg mb-6">
                  {course.shortDescription || course.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatDuration(getTotalDuration(course.sections))}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    <span>{getTotalLectures(course.sections)} lectures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>4.8 (2.1k ratings)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>15.2k students enrolled</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {course.price.isFree
                      ? "Enroll for Free"
                      : `Enroll Now - ${course.price.currency} ${course.price.amount}`}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Preview Course
                  </Button>
                </div>
              </div>

              {/* Course Preview */}
              <div className="lg:col-span-1">
                <div className="bg-white/5 rounded-lg p-4 border border-white/20">
                  <div className="aspect-video bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg mb-4 flex items-center justify-center">
                    {course.thumbnail ? (
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Play className="w-16 h-16 text-green-400 opacity-50" />
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Price</span>
                      <span className="text-white font-semibold">
                        {course.price.isFree
                          ? "Free"
                          : `${course.price.currency} ${course.price.amount}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white">
                        {formatDuration(getTotalDuration(course.sections))}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Lectures</span>
                      <span className="text-white">
                        {getTotalLectures(course.sections)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Level</span>
                      <span className="text-white">All Levels</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Tabs defaultValue="curriculum" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/20">
              <TabsTrigger
                value="curriculum"
                className="text-white data-[state=active]:bg-green-500/20"
              >
                Curriculum
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="text-white data-[state=active]:bg-green-500/20"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="instructor"
                className="text-white data-[state=active]:bg-green-500/20"
              >
                Instructor
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="text-white data-[state=active]:bg-green-500/20"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum" className="space-y-4">
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Course Content</CardTitle>
                  <CardDescription className="text-gray-400">
                    {getTotalLectures(course.sections)} lectures •{" "}
                    {formatDuration(getTotalDuration(course.sections))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {course.sections.map((section, sectionIndex) => (
                      <div
                        key={section._id}
                        className="border border-white/10 rounded-lg"
                      >
                        <button
                          onClick={() => toggleSection(section._id)}
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {expandedSections.has(section._id) ? (
                              <ChevronDown className="w-5 h-5 text-green-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-green-400" />
                            )}
                            <div>
                              <div className="text-white font-medium">
                                Section {sectionIndex + 1}: {section.title}
                              </div>
                              <div className="text-sm text-gray-400">
                                {section.lectures.length} lectures •{" "}
                                {formatDuration(
                                  section.lectures.reduce(
                                    (total, lecture) =>
                                      total + lecture.duration,
                                    0
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </button>

                        {expandedSections.has(section._id) && (
                          <div className="border-t border-white/10 p-4 space-y-3">
                            {section.lectures.map((lecture, lectureIndex) => (
                              <div
                                key={lecture._id}
                                className="flex items-center justify-between py-2"
                              >
                                <div className="flex items-center gap-3">
                                  <Play className="w-4 h-4 text-green-400" />
                                  <div>
                                    <div className="text-white text-sm">
                                      {lectureIndex + 1}. {lecture.title}
                                    </div>
                                    {lecture.description && (
                                      <div className="text-xs text-gray-400">
                                        {lecture.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-gray-400">
                                    {formatDuration(lecture.duration)}
                                  </span>
                                  {lecture.isPreview ? (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs bg-green-500/20 text-green-400"
                                    >
                                      Preview
                                    </Badge>
                                  ) : (
                                    <Lock className="w-4 h-4 text-gray-500" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-400" />
                      What you&apos;ll learn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course.learningOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-green-400" />
                      Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-400" />
                    Who this course is for
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-300">
                    {course.targetAudience.join(", ")}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instructor" className="space-y-6">
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">
                    About the instructor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      {course.instructor.avatar ? (
                        <Image
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-full"
                        />
                      ) : (
                        <span className="text-green-400 text-2xl font-bold">
                          {course.instructor.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {course.instructor.name}
                      </h3>
                      <p className="text-gray-300 mb-4">
                        {course.instructor.bio ||
                          "Experienced instructor passionate about sharing knowledge and helping students succeed."}
                      </p>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-white">
                            4.8
                          </div>
                          <div className="text-sm text-gray-400">
                            Instructor Rating
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">
                            15.2k
                          </div>
                          <div className="text-sm text-gray-400">Students</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">
                            25
                          </div>
                          <div className="text-sm text-gray-400">Courses</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Student Reviews</CardTitle>
                  <CardDescription className="text-gray-400">
                    Based on 2,156 reviews
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-gray-400">Reviews coming soon...</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default CoursePage;
