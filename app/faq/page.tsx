"use client";

import { motion } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is Dealo?",
      answer: "Dealo is an AI-powered professional development platform that offers courses, certifications, freelance opportunities, and job postings.",
    },
    {
      question: "How do I get started?",
      answer: "Simply create an account, complete your profile, and start exploring courses, jobs, or freelance opportunities.",
    },
    {
      question: "Are the courses free?",
      answer: "We offer both free and paid courses. You can browse our catalog and choose what works best for you.",
    },
    {
      question: "How do I apply for jobs?",
      answer: "Browse available jobs, create a resume using our AI builder, and apply directly through the platform.",
    },
    {
      question: "Is Dealo available in Nigeria?",
      answer: "Yes! Dealo is based in Nigeria and we support payments in Naira and other African currencies.",
    },
    {
      question: "How do certifications work?",
      answer: "Complete courses and assessments to earn industry-recognized certifications that you can add to your profile.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">Find answers to common questions</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 text-gray-600"
                >
                  {faq.answer}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}


