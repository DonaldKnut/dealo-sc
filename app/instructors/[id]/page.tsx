"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Clock,
  Star,
  Users,
  Award,
  BookOpen,
  Globe,
  Mail,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Instructor {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  location?: string;
  specialization?: string[];
  experience?: number;
  totalStudents?: number;
  totalCourses?: number;
  averageRating?: number;
  totalReviews?: number;
}

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  price: {
    amount: number;
    currency: string;
    isFree: boolean;
  };
  category: string;
  sections: Array<{
    title: string;
    lectures: Array<{
      title: string;
      duration: number;
    }>;
  }>;
  totalStudents?: number;
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
}

interface InstructorPageProps {
  params: {
    id: string;
  };
}

const InstructorPage = ({ params }: InstructorPageProps) => {
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInstructorData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch instructor details
      const instructorRes = await fetch(`/api/users/${params.id}`);
      if (instructorRes.ok) {
        const instructorData = await instructorRes.json();
        setInstructor(instructorData.user);
      }

      // Fetch instructor's courses
      const coursesRes = await fetch(
        `/api/courses?instructor=${params.id}&pageSize=100`
      );
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData.courses || []);
      }
    } catch (error) {
      console.error("Error fetching instructor data:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchInstructorData();
  }, [fetchInstructorData]);

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
        <div className="text-gray-400">Loading instructor profile...</div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-4">Instructor not found</div>
          <Link href="/courses">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black">
      {/* Instructor Header */}
      <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Instructor Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                {instructor.specialization?.map((spec, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-green-400 border-green-500/30 mr-2 mb-2"
                  >
                    {spec}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {instructor.name}
              </h1>

              <p className="text-gray-300 text-lg mb-6">
                {instructor.bio ||
                  "Passionate instructor dedicated to helping students achieve their learning goals."}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-6">
                {instructor.location && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>{instructor.location}</span>
                  </div>
                )}
                {instructor.experience && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>{instructor.experience}+ years experience</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{instructor.totalStudents || 0} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {instructor.totalCourses || courses.length} courses
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  Follow Instructor
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>

            {/* Instructor Stats */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 rounded-lg p-6 border border-white/20">
                <div className="text-center mb-6">
                  <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    {instructor.avatar ? (
                      <Image
                        src={instructor.avatar}
                        alt={instructor.name}
                        width={128}
                        height={128}
                        className="w-32 h-32 rounded-full"
                      />
                    ) : (
                      <span className="text-green-400 text-4xl font-bold">
                        {instructor.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="text-white font-semibold">
                      {instructor.averageRating || 4.8}
                    </span>
                    <span className="text-gray-400">
                      ({instructor.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Students</span>
                    <span className="text-white font-semibold">
                      {instructor.totalStudents || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Courses</span>
                    <span className="text-white font-semibold">
                      {instructor.totalCourses || courses.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Experience</span>
                    <span className="text-white">
                      {instructor.experience || 0}+ years
                    </span>
                  </div>
                </div>

                {/* Social Links */}
                {(instructor.website ||
                  instructor.linkedin ||
                  instructor.twitter ||
                  instructor.youtube) && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="text-sm text-gray-400 mb-3">Follow on</div>
                    <div className="flex gap-3">
                      {instructor.website && (
                        <Link
                          href={instructor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-10 h-10 p-0 border-white/20 text-white hover:bg-white/10"
                          >
                            <Globe className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      {instructor.linkedin && (
                        <Link
                          href={instructor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-10 h-10 p-0 border-white/20 text-white hover:bg-white/10"
                          >
                            <Linkedin className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      {instructor.twitter && (
                        <Link
                          href={instructor.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-10 h-10 p-0 border-white/20 text-white hover:bg-white/10"
                          >
                            <Twitter className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      {instructor.youtube && (
                        <Link
                          href={instructor.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-10 h-10 p-0 border-white/20 text-white hover:bg-white/10"
                          >
                            <Youtube className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructor Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/20">
            <TabsTrigger
              value="courses"
              className="text-white data-[state=active]:bg-green-500/20"
            >
              Courses ({courses.length})
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="text-white data-[state=active]:bg-green-500/20"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="text-white data-[state=active]:bg-green-500/20"
            >
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            {courses.length === 0 ? (
              <Card className="bg-white/5 border-white/20">
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">
                    No courses published yet
                  </div>
                  <p className="text-gray-500">
                    This instructor hasn&apos;t published any courses yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Link key={course._id} href={`/courses/${course.slug}`}>
                    <Card className="bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer group">
                      <CardHeader className="p-0">
                        <div className="relative">
                          <div className="aspect-video bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-t-lg flex items-center justify-center">
                            {course.thumbnail ? (
                              <Image
                                src={course.thumbnail}
                                alt={course.title}
                                width={400}
                                height={225}
                                className="w-full h-full object-cover rounded-t-lg"
                              />
                            ) : (
                              <Play className="w-16 h-16 text-green-400 opacity-50" />
                            )}
                          </div>
                          <div className="absolute top-3 right-3">
                            <Badge
                              variant="secondary"
                              className="bg-green-500/20 text-green-400 border-green-500/30"
                            >
                              {course.price.isFree
                                ? "Free"
                                : `${course.price.currency} ${course.price.amount}`}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4">
                        <div className="mb-3">
                          <Badge
                            variant="outline"
                            className="text-xs text-gray-400 border-gray-600"
                          >
                            {course.category}
                          </Badge>
                        </div>

                        <CardTitle className="text-lg text-white mb-2 group-hover:text-green-400 transition-colors">
                          {course.title}
                        </CardTitle>

                        <CardDescription className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {course.shortDescription || course.description}
                        </CardDescription>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatDuration(
                                  getTotalDuration(course.sections)
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Play className="w-4 h-4" />
                              <span>
                                {getTotalLectures(course.sections)} lectures
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{course.averageRating || 4.8}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">
                              Students enrolled
                            </span>
                            <span className="text-white">
                              {course.totalStudents || 0}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card className="bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">
                  About {instructor.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    {instructor.bio ||
                      `${instructor.name} is a passionate and experienced instructor dedicated to helping students achieve their learning goals. With expertise in their field and a commitment to quality education, they create engaging and comprehensive courses that empower learners to succeed.`}
                  </p>

                  {instructor.specialization &&
                    instructor.specialization.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-white mb-3">
                          Areas of Expertise
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {instructor.specialization.map((spec, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-green-400 border-green-500/30"
                            >
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {instructor.experience && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Experience
                      </h3>
                      <p className="text-gray-300">
                        {instructor.name} has over {instructor.experience} years
                        of experience in their field, bringing real-world
                        knowledge and practical insights to their courses.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card className="bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Student Reviews</CardTitle>
                <CardDescription className="text-gray-400">
                  Based on {instructor.totalReviews || 0} reviews
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
  );
};

export default InstructorPage;
