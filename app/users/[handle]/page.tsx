"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Calendar,
  Building,
  GraduationCap,
  Award,
  Users,
  UserPlus,
  UserMinus,
} from "lucide-react";
import Image from "next/image";
import { useSafeSession } from "@/hooks/use-safe-session";
import { useNotification } from "@/components/ui/Notification";

interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

interface Education {
  degree: string;
  field: string;
  school: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

interface Profile {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    role: string;
  };
  handle: string;
  headline: string;
  about: string;
  location: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  interests: string[];
  languages: string[];
  certifications: string[];
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

interface ProfilePageProps {
  params: {
    handle: string;
  };
}

const ProfilePage = ({ params }: ProfilePageProps) => {
  const session = useSafeSession();
  const { addNotification } = useNotification();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/profiles/${params.handle}`);
      if (!res.ok) throw new Error("Profile not found");
      const data = await res.json();
      setProfile(data.profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      addNotification({
        type: "error",
        message: "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  }, [params.handle, addNotification]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFollow = async (action: "follow" | "unfollow") => {
    if (!profile) return;

    try {
      setFollowLoading(true);
      const res = await fetch("/api/profiles/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: profile.userId._id,
          action,
        }),
      });

      if (!res.ok) throw new Error("Failed to process follow action");
      const data = await res.json();

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              followersCount: data.followersCount,
              isFollowing: action === "follow",
            }
          : null
      );

      addNotification({
        type: "success",
        message: `Successfully ${
          action === "follow" ? "followed" : "unfollowed"
        } ${profile.userId.firstName}`,
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: "Failed to process follow action",
      });
    } finally {
      setFollowLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black flex items-center justify-center">
        <div className="text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-4">Profile not found</div>
          <Button
            onClick={() =>
              typeof window !== "undefined" && window.history.back()
            }
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isOwnProfile = session?.data?.user?.id === profile.userId._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-b border-green-500/20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center">
                {profile.userId.avatar ? (
                  <Image
                    src={profile.userId.avatar}
                    alt={`${profile.userId.firstName} ${profile.userId.lastName}`}
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full"
                  />
                ) : (
                  <span className="text-green-400 text-4xl font-bold">
                    {profile.userId.firstName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {profile.userId.firstName} {profile.userId.lastName}
              </h1>
              <p className="text-xl text-gray-300 mb-4">{profile.headline}</p>

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{profile.followersCount} followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <UserPlus className="w-4 h-4" />
                  <span>{profile.followingCount} following</span>
                </div>
              </div>

              {/* Follow Button */}
              {!isOwnProfile && (
                <Button
                  onClick={() =>
                    handleFollow(profile.isFollowing ? "unfollow" : "follow")
                  }
                  disabled={followLoading}
                  className={
                    profile.isFollowing
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-gradient-to-r from-green-500 to-emerald-500"
                  }
                >
                  {followLoading ? (
                    "Processing..."
                  ) : profile.isFollowing ? (
                    <>
                      <UserMinus className="w-4 h-4 mr-2" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
              )}

              {/* Social Links */}
              {(profile.website ||
                profile.linkedin ||
                profile.twitter ||
                profile.github) && (
                <div className="flex gap-3 mt-4">
                  {profile.website && (
                    <a
                      href={profile.website}
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
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
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
                    </a>
                  )}
                  {profile.twitter && (
                    <a
                      href={profile.twitter}
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
                    </a>
                  )}
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-10 h-10 p-0 border-white/20 text-white hover:bg-white/10"
                      >
                        <Github className="w-4 h-4" />
                      </Button>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/20">
            <TabsTrigger
              value="about"
              className="text-white data-[state=active]:bg-green-500/20"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="experience"
              className="text-white data-[state=active]:bg-green-500/20"
            >
              Experience
            </TabsTrigger>
            <TabsTrigger
              value="education"
              className="text-white data-[state=active]:bg-green-500/20"
            >
              Education
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="text-white data-[state=active]:bg-green-500/20"
            >
              Skills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card className="bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  {profile.about || "No about information provided."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            {profile.experiences.length === 0 ? (
              <Card className="bg-white/5 border-white/20">
                <CardContent className="text-center py-8">
                  <div className="text-gray-400">
                    No experience information provided.
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {profile.experiences.map((exp, index) => (
                  <Card key={index} className="bg-white/5 border-white/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {exp.title}
                          </h3>
                          <p className="text-green-400">{exp.company}</p>
                        </div>
                        <div className="text-right text-sm text-gray-400">
                          <div>
                            {formatDate(exp.startDate)} -{" "}
                            {exp.current
                              ? "Present"
                              : exp.endDate
                              ? formatDate(exp.endDate)
                              : "Present"}
                          </div>
                          {exp.location && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {exp.location}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300">{exp.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            {profile.education.length === 0 ? (
              <Card className="bg-white/5 border-white/20">
                <CardContent className="text-center py-8">
                  <div className="text-gray-400">
                    No education information provided.
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {profile.education.map((edu, index) => (
                  <Card key={index} className="bg-white/5 border-white/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {edu.degree} in {edu.field}
                          </h3>
                          <p className="text-green-400">{edu.school}</p>
                        </div>
                        <div className="text-right text-sm text-gray-400">
                          <div>
                            {formatDate(edu.startDate)} -{" "}
                            {edu.current
                              ? "Present"
                              : edu.endDate
                              ? formatDate(edu.endDate)
                              : "Present"}
                          </div>
                          {edu.location && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {edu.location}
                            </div>
                          )}
                        </div>
                      </div>
                      {edu.description && (
                        <p className="text-gray-300">{edu.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Skills */}
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.skills.length === 0 ? (
                    <div className="text-gray-400">No skills listed.</div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-green-400 border-green-500/30"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Languages */}
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.languages.length === 0 ? (
                    <div className="text-gray-400">No languages listed.</div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.languages.map((language, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-blue-400 border-blue-500/30"
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Interests */}
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.interests.length === 0 ? (
                    <div className="text-gray-400">No interests listed.</div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-purple-400 border-purple-500/30"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.certifications.length === 0 ? (
                    <div className="text-gray-400">
                      No certifications listed.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {profile.certifications.map((cert, index) => (
                        <div key={index} className="text-gray-300 text-sm">
                          • {cert}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
