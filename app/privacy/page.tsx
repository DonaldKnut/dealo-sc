// pages/privacy.tsx
import React from "react";

// ✅ Static page - Better for SEO

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <div className="container mx-auto p-4 text-white max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
        <p className="text-center mb-4">
          <strong>Dealo Talent Network Ltd</strong>
          <br />
          Effective Date: 27th March, 2025
        </p>
        <p className="mb-6">
          This Privacy Policy explains how Dealo collects, uses, and protects
          your personal data. We value your privacy and are committed to
          complying with the Nigeria Data Protection Regulation (NDPR) and
          global data privacy best practices.
        </p>

        <section id="section-1" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            1. Information We Collect
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Personal Data</strong>: Name, email, phone number, photo,
              payment info. We collect your name, email, and photo via Google
              OAuth when you sign in or register on Dealo Network.
            </li>
            <li>
              <strong>Usage Data</strong>: IP address, device type, browsing
              history, OS.
            </li>
            <li>
              <strong>Content Data</strong>: Videos, photos, chats, application
              documents.
            </li>
            <li>
              <strong>Cookies & Tracking</strong>: We use cookies to remember
              preferences and improve performance.
            </li>
            <li>
              <strong>Activity and Behavioral Analytics</strong>: Clicks, usage
              patterns, performance.
            </li>
          </ul>
        </section>

        <section id="section-2" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            2. How We Use Your Data
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>To operate and improve the Platform.</li>
            <li>To process payments and withdrawals securely.</li>
            <li>To deliver educational and freelance-related services.</li>
            <li>To improve the platform and prevent fraud.</li>
            <li>
              To communicate with users about updates, gigs, jobs, or learning
              content.
            </li>
            <li>To issue certifications and badges.</li>
            <li>To enable parental/guardian moderation for teen accounts.</li>
          </ul>
        </section>

        <section id="section-3" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>
          <p>We may share your data:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>With payment processors (e.g., Paystack, Flutterwave).</li>
            <li>
              With hiring companies or loan partners (only with your consent).
            </li>
            <li>With government or law enforcement (if legally required).</li>
            <li>Internally with employees or contractors under NDA.</li>
          </ul>
          <p>We do not sell your data to third parties.</p>
        </section>

        <section id="section-4" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. User Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Access your data.</li>
            <li>Correct inaccurate info.</li>
            <li>Request account deletion.</li>
            <li>
              Withdraw consent for marketing emails or for a teen account.
            </li>
          </ul>
          <p>
            To exercise any right, contact{" "}
            <a
              href="mailto:privacy@dealonetwork.com"
              className="text-[#cacccb] hover:underline"
            >
              privacy@dealonetwork.com
            </a>
            .
          </p>
        </section>

        <section id="section-5" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Security Measures</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Data is encrypted at rest and in transit.</li>
            <li>
              Access is role-restricted and logged, with some restricted to
              authorized Dealo staff only.
            </li>
            <li>Servers are monitored for breaches or abnormal activity.</li>
          </ul>
        </section>

        <section id="section-6" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            6. Third-Party Links & Embeds
          </h2>
          <p>
            Our platform may embed YouTube videos and link to external
            platforms. We are not responsible for external sites’ privacy
            practices.
          </p>
        </section>

        <section id="section-7" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Cookies & Tracking</h2>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Access your data.</li>
            <li>Correct inaccurate info.</li>
            <li>Request account deletion.</li>
            <li>Withdraw consent for marketing emails.</li>
          </ul>
          <p>
            To exercise any right, contact{" "}
            <a
              href="mailto:support@dealonetwork.com"
              className="text-[#cacccb] hover:underline"
            >
              support@dealonetwork.com
            </a>
            .
          </p>
        </section>

        <section id="section-8" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            8. Teen Accounts & Children’s Privacy
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Data is encrypted at rest and in transit.</li>
            <li>Access is role-restricted and logged.</li>
            <li>Servers are monitored for breaches or abnormal activity.</li>
          </ul>
        </section>

        <section id="section-9" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            9. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy to reflect changes in law or
            business needs. You will be notified of major updates.
          </p>
        </section>

        <section id="section-10" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
          <p>For privacy concerns or data access requests:</p>
          <ul className="list-none space-y-2">
            <li>
              Email:{" "}
              <a
                href="mailto:support@dealonetwork.com"
                className="text-[#cacccb] hover:underline"
              >
                support@dealonetwork.com
              </a>
            </li>
            <li>Phone: +2348157062795</li>
            <li>
              Address: 23 Bashorun Okusanya Street, Off Admiralty Road, Off
              Admiralty Way, Lekki Phase 1, Lagos
            </li>
          </ul>
        </section>

        <footer className="text-center mt-8">
          <p>
            Dealo Talent Network
            <br />
            Elevating African Talent. Powering Global Opportunity.
          </p>
        </footer>
      </div>
    </>
  );
};

export default PrivacyPolicy;
