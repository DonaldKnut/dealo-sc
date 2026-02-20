import { FAQStructuredData } from "./StructuredData";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
  className?: string;
}

export function FAQSection({
  faqs,
  title = "Frequently Asked Questions",
  className = "",
}: FAQSectionProps) {
  return (
    <>
      <FAQStructuredData faqs={faqs} />
      <section className={`py-16 ${className}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            {title}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// Nigerian-specific FAQs
const nigerianFAQs: FAQItem[] = [
  {
    question: "Is Dealo available in Nigeria?",
    answer:
      "Yes! Dealo is specifically designed for Nigerian professionals. We support local payment methods, Naira pricing, and culturally relevant content.",
  },
  {
    question: "What payment methods do you accept in Nigeria?",
    answer:
      "We accept all major Nigerian payment methods including bank transfers, debit cards, and mobile money. All prices are displayed in Naira (₦).",
  },
  {
    question: "Are the courses suitable for Nigerian professionals?",
    answer:
      "Absolutely! Our courses are designed with the Nigerian job market in mind, featuring local case studies, relevant examples, and skills in high demand in Nigeria.",
  },
  {
    question: "Can I get a job after completing courses on Dealo?",
    answer:
      "Many of our students have successfully landed jobs or freelance opportunities. We provide career guidance, job placement assistance, and connect you with Nigerian employers.",
  },
  {
    question: "Do you offer certificates recognized in Nigeria?",
    answer:
      "Yes, all our certificates are industry-recognized and can be used to enhance your CV when applying for jobs in Nigeria and internationally.",
  },
  {
    question: "What if I have technical issues?",
    answer:
      "Our support team is available 24/7 and understands the unique challenges Nigerian users might face. We provide support in English and local languages.",
  },
];

export function NigerianFAQSection({ className = "" }: { className?: string }) {
  return (
    <FAQSection
      faqs={nigerianFAQs}
      title="Frequently Asked Questions for Nigerian Users"
      className={className}
    />
  );
}
