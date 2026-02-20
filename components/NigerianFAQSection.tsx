"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const NIGERIAN_FAQS = [
  {
    question: "How can I make money as a freelancer in Nigeria on Dealo?",
    answer:
      "Join Dealo for free, create your profile, upload portfolio samples, and start applying to jobs immediately. Nigerian freelancers typically get their first client within 7 days. We charge only 10% (vs Fiverr's 20%), and you get paid directly in Naira via Paystack or Flutterwave. Over 50,000 Nigerians are already earning on Dealo!",
  },
  {
    question: "Is Dealo free to use for Nigerians?",
    answer:
      "Yes! Signing up, browsing jobs, taking many courses, and networking is 100% FREE. We only take a 10% fee when you complete paid freelance projects. No monthly subscriptions, no hidden charges. Start earning today at zero cost!",
  },
  {
    question: "How does Dealo compare to Fiverr and Upwork for Nigerian users?",
    answer:
      "Dealo is BETTER for Nigerians: (1) Lower fees - 10% vs Fiverr's 20%, (2) Local payments in Naira, (3) Faster withdrawals, (4) No international transaction fees, (5) Nigerian-focused support, (6) Better exchange rates. We built Dealo specifically FOR Nigerians!",
  },
  {
    question: "How do I get paid on Dealo? Can I withdraw in Naira?",
    answer:
      "Yes! Payments are processed through Paystack and Flutterwave directly to your Nigerian bank account in Naira. Funds are held in secure escrow until work is approved, then released within 24-48 hours. No PayPal needed!",
  },
  {
    question: "What type of courses can I find on Dealo?",
    answer:
      "Dealo offers 10,000+ courses in programming, design, digital marketing, business, data science, and more. Many courses are FREE for Nigerians. Get certified and boost your earning potential. All courses are practical and tailored for the Nigerian job market.",
  },
  {
    question: "Can Nigerian companies hire teams on Dealo?",
    answer:
      "Yes! Our Bulk Hiring service helps Nigerian businesses hire teams of 5-50+ pre-vetted professionals in just 2-4 weeks. Starting from ₦500,000. Perfect for startups and growing companies. Save 60% compared to recruitment agencies.",
  },
  {
    question: "How quickly can I start earning on Dealo?",
    answer:
      "Many Nigerian freelancers get their first client within 24-72 hours! Create a compelling profile, upload 3-5 portfolio samples, set competitive rates, and start applying. The more complete your profile, the faster you'll land jobs.",
  },
  {
    question: "Is Dealo safe for Nigerian users?",
    answer:
      "Absolutely! We use bank-level security with SSL encryption. All payments go through escrow - clients can't access your work without paying, and you get paid once work is approved. We verify all users and have dispute resolution support.",
  },
  {
    question: "Can I use Dealo on my phone?",
    answer:
      "Yes! Dealo works perfectly on mobile browsers. You can browse jobs, apply to projects, take courses, message clients, and manage orders right from your phone. Coming soon: dedicated Android and iOS apps!",
  },
  {
    question: "What skills are most in-demand on Dealo Nigeria?",
    answer:
      "Top earning skills for Nigerian freelancers: (1) Web/App Development, (2) Graphic Design, (3) Digital Marketing, (4) Content Writing, (5) Video Editing, (6) UI/UX Design, (7) Data Analysis. Learn these on Dealo and start earning immediately!",
  },
];

const NigerianFAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* FAQ Schema for Google Featured Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: NIGERIAN_FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <HelpCircle className="w-16 h-16 text-green-400 mx-auto" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300">
            Everything you need to know about using Dealo in Nigeria
          </p>
        </motion.div>

        <div className="space-y-4">
          {NIGERIAN_FAQS.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-green-500/30 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <h3 className="text-lg font-semibold text-white pr-8">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-green-400 flex-shrink-0" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">Still have questions?</p>
          <a
            href="mailto:hello@dealo.africa"
            className="inline-block px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default NigerianFAQSection;


