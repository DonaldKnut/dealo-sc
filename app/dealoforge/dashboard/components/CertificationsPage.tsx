"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Clock,
  Users,
  Star,
  CheckCircle,
  Play,
  Download,
} from "lucide-react";

type QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
};

const CertificationsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [aiTopic, setAiTopic] = useState("");
  const [aiLevel, setAiLevel] = useState("beginner");
  const [aiDuration, setAiDuration] = useState(45);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiOutline, setAiOutline] = useState<string | null>(null);
  const [flowStep, setFlowStep] = useState<
    "plan" | "outline" | "quiz" | "result"
  >("plan");
  const [quizLoading, setQuizLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);

  const [certifications, setCertifications] = useState<any[]>([]);

  useEffect(() => {
    // Fetch real certifications from API
    const fetchCertifications = async () => {
      try {
        // const res = await fetch("/api/certifications");
        // const data = await res.json();
        // setCertifications(data.certifications || []);
        setCertifications([]);
      } catch (error) {
        console.error("Failed to fetch certifications:", error);
        setCertifications([]);
      }
    };
    fetchCertifications();
  }, []);

  const filteredCertifications = certifications.filter((cert) => {
    if (activeTab === "all") return true;
    if (activeTab === "completed") return cert.status === "completed";
    if (activeTab === "in-progress") return cert.status === "in-progress";
    if (activeTab === "not-started") return cert.status === "not-started";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Certifications</h1>
        <p className="text-gray-400">
          Earn industry-recognized certifications to boost your career
        </p>
      </div>

      {/* AI Certification Planner + Flow */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-white font-semibold mb-3">
          Plan a Certification with AI
        </h3>
        {flowStep === "plan" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                placeholder="Course or skill (e.g. React, Data Science)"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
              />
              <select
                className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                value={aiLevel}
                onChange={(e) => setAiLevel(e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <input
                type="number"
                min={15}
                className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                placeholder="Total minutes"
                value={aiDuration}
                onChange={(e) => setAiDuration(Number(e.target.value) || 45)}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded-lg bg-green-600 text-white border border-green-500 disabled:opacity-60"
                disabled={!aiTopic || aiLoading}
                onClick={async () => {
                  try {
                    setAiLoading(true);
                    setAiOutline(null);
                    const res = await fetch("/api/ai-course-planner/generate", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        topic: aiTopic,
                        level: aiLevel,
                        durationMinutes: aiDuration,
                      }),
                    });
                    const json = await res.json();
                    setAiOutline(json?.outline || "");
                    setFlowStep("outline");
                  } catch (e) {
                    setAiOutline("Failed to generate outline.");
                  } finally {
                    setAiLoading(false);
                  }
                }}
              >
                {aiLoading ? "Generating..." : "Generate Certification Plan"}
              </button>
            </div>
          </>
        )}

        {flowStep === "outline" && (
          <>
            <div className="mt-2 p-4 rounded-xl bg-gray-900 border border-gray-700 whitespace-pre-wrap text-gray-200 text-sm">
              {aiOutline}
            </div>
            <div className="flex justify-end mt-3 gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                onClick={() => setFlowStep("plan")}
              >
                Back
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-green-600 text-white border border-green-500"
                onClick={async () => {
                  try {
                    setQuizLoading(true);
                    setQuiz([]);
                    setAnswers([]);
                    setCurrentIdx(0);
                    setSelected(null);
                    const res = await fetch(
                      "/api/certifications/generate-quiz",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          topic: aiTopic,
                          level: aiLevel,
                          numQuestions: 5,
                        }),
                      }
                    );
                    const json = await res.json();
                    setQuiz(json?.quiz || []);
                    setFlowStep("quiz");
                  } catch (e) {
                  } finally {
                    setQuizLoading(false);
                  }
                }}
              >
                {quizLoading ? "Preparing Quiz..." : "Start Quiz"}
              </button>
            </div>
          </>
        )}

        {flowStep === "quiz" && (
          <>
            {quiz.length > 0 ? (
              <div className="mt-2 p-4 rounded-xl bg-gray-900 border border-gray-700 text-gray-200">
                <div className="mb-3 text-sm text-gray-400">
                  Question {currentIdx + 1} of {quiz.length}
                </div>
                <div className="text-white font-medium mb-3">
                  {quiz[currentIdx].question}
                </div>
                <div className="space-y-2">
                  {quiz[currentIdx].options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-2 p-2 rounded border ${
                        selected === idx
                          ? "border-green-500 bg-green-500/10"
                          : "border-gray-700 hover:bg-gray-800"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q_${currentIdx}`}
                        className="accent-green-600"
                        checked={selected === idx}
                        onChange={() => setSelected(idx)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 disabled:opacity-60"
                    disabled={currentIdx === 0}
                    onClick={() => {
                      if (currentIdx === 0) return;
                      const prevIdx = currentIdx - 1;
                      const prevSel = answers[prevIdx] ?? null;
                      setCurrentIdx(prevIdx);
                      setSelected(prevSel);
                    }}
                  >
                    Previous
                  </button>
                  {currentIdx < quiz.length - 1 ? (
                    <button
                      className="px-4 py-2 rounded-lg bg-green-600 text-white border border-green-500 disabled:opacity-60"
                      disabled={selected === null}
                      onClick={() => {
                        const newAnswers = [...answers];
                        newAnswers[currentIdx] = selected as number;
                        setAnswers(newAnswers);
                        setSelected(newAnswers[currentIdx + 1] ?? null);
                        setCurrentIdx(currentIdx + 1);
                      }}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 rounded-lg bg-green-600 text-white border border-green-500 disabled:opacity-60"
                      disabled={selected === null}
                      onClick={() => {
                        const finalAnswers = [...answers];
                        finalAnswers[currentIdx] = selected as number;
                        let s = 0;
                        for (let i = 0; i < quiz.length; i++) {
                          if (finalAnswers[i] === quiz[i].answerIndex) s++;
                        }
                        setScore(s);
                        setAnswers(finalAnswers);
                        setFlowStep("result");
                      }}
                    >
                      Finish
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-2 p-4 rounded-xl bg-gray-900 border border-gray-700 text-gray-200">
                No quiz available.
              </div>
            )}
          </>
        )}

        {flowStep === "result" && (
          <div className="mt-2 p-4 rounded-xl bg-gray-900 border border-gray-700 text-gray-200">
            <div className="text-white text-lg font-semibold mb-2">Results</div>
            <div className="mb-3">
              Topic:{" "}
              <span className="text-green-400 font-medium">{aiTopic}</span> ·
              Level: {aiLevel}
            </div>
            <div className="mb-4">
              Score:{" "}
              <span className="text-green-400 font-semibold">
                {score}/{quiz.length}
              </span>
            </div>
            <div
              id="certificate-print"
              className="bg-white text-black rounded-xl p-6"
            >
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">
                  Certificate of Achievement
                </div>
                <div className="text-sm mb-4">
                  This certifies successful completion of
                </div>
                <div className="text-xl font-semibold mb-2">
                  {aiTopic} ({aiLevel})
                </div>
                <div className="text-sm">
                  Score: {score}/{quiz.length}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                onClick={() => setFlowStep("plan")}
              >
                Start Over
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-green-600 text-white border border-green-500 disabled:opacity-60"
                disabled={score === null}
                onClick={() => {
                  if (typeof window !== "undefined") window.print();
                }}
              >
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #certificate-print,
          #certificate-print * {
            visibility: visible;
          }
          #certificate-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Certifications</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
            <Award className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">3</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-white">2</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Average Score</p>
              <p className="text-2xl font-bold text-white">92%</p>
            </div>
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800/50 rounded-2xl p-2 border border-gray-700">
        <div className="flex space-x-2">
          {[
            { id: "all", label: "All", count: certifications.length },
            {
              id: "completed",
              label: "Completed",
              count: certifications.filter((c) => c.status === "completed")
                .length,
            },
            {
              id: "in-progress",
              label: "In Progress",
              count: certifications.filter((c) => c.status === "in-progress")
                .length,
            },
            {
              id: "not-started",
              label: "Not Started",
              count: certifications.filter((c) => c.status === "not-started")
                .length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-green-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Certification Grid */}
      {filteredCertifications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCertifications.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden hover:border-green-500/50 transition-colors group"
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${cert.color} p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white/80 text-sm font-medium">
                    {cert.badge}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {cert.title}
                  </h3>
                </div>
                <Award className="w-12 h-12 text-white/80" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-300 mb-4">{cert.description}</p>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{cert.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{cert.students.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{cert.rating}</span>
                </div>
              </div>

              {/* Progress */}
              {cert.status === "in-progress" && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{cert.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${cert.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  cert.status === "completed"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : cert.status === "in-progress"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                {cert.status === "completed" ? (
                  <div className="flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Certificate
                  </div>
                ) : cert.status === "in-progress" ? (
                  <div className="flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Continue Learning
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Start Certification
                  </div>
                )}
              </motion.button>
            </div>
          </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-2xl p-12 border border-gray-700 text-center">
          <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-12 h-12 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Certifications Not Created Yet</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Be the first to earn a certification! Start your learning journey and get certified in your field.
          </p>
          <button
            onClick={() => {
              // Scroll to AI planner or show it
              document.getElementById("ai-planner")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            Plan Your First Certification
          </button>
        </div>
      )}
    </div>
  );
};

export default CertificationsPage;
