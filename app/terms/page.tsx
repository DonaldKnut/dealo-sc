// pages/terms.tsx
import React from "react";

// ✅ Static page - Better for SEO

const TermsOfService: React.FC = () => {
  return (
    <>
      <div className="mx-auto p-4 text-white max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Terms of Service
        </h1>
        <p className="text-center mb-4">
          <strong>Dealo Talent Network Ltd</strong>
          <br />
          Effective Date: 27th March, 2025
        </p>
        <p className="mb-6">
          Welcome to Dealo Talent Network Ltd (&quot;Dealo&quot;,
          &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). These Terms of
          Service (&quot;Terms&quot;) govern your access to and use of the Dealo
          platform, including mobile applications, website(s), services, and
          features (collectively, the &quot;Platform&quot;). By registering an
          account, accessing, or using any part of the Platform, you agree to be
          legally bound by these Terms. If you do not agree, do not use the
          Platform.
        </p>

        <section id="section-1" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Services Offered</h2>
          <p>The Dealo Platform includes but is not limited to:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              A freelance marketplace connecting clients with digital service
              providers.
            </li>
            <li>AI-curated learning using YouTube API + Gemini AI.</li>
            <li>Certification exams, badges, and skill verification.</li>
            <li>
              Access to online job boards, project listings, and mentorship.
            </li>
            <li>Real-time messaging and video communication tools.</li>
            <li>
              Access to educational services such as JAMB, NECO, and WAEC cards.
            </li>
            <li>
              Access to travel loan programs (subject to KYC and eligibility).
            </li>
          </ul>
          <p>
            These Terms govern your access to and use of all features provided
            by Dealo, whether on the web, mobile, or future versions of the
            platform.
          </p>
        </section>

        <section id="section-2" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            2. Eligibility & Age Requirements
          </h2>
          <p>
            Dealo is committed to empowering digital talent and learners of all
            ages.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>The Platform is open to users aged 13 years and above.</li>
            <li>Not be restricted by sanctions or prohibited jurisdictions.</li>
            <li>
              Users aged 16-17 may engage in freelance work with limited
              restrictions, subject to platform rules.
            </li>
            <li>
              Users aged 13 to 15 may access learning tools, JAMB/WAEC services,
              and certifications but cannot offer freelance services unless
              parental/guardian consent is confirmed.
            </li>
            <li>
              We reserve the right to require age verification and may suspend
              accounts pending confirmation.
            </li>
          </ul>
        </section>

        <section id="section-3" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            3. Account Registration
          </h2>
          <p>
            You agree to provide accurate and complete information during
            registration and to keep your information up-to-date. You are
            responsible for:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Maintaining the confidentiality of your credentials.</li>
            <li>All activities that occur under your account.</li>
            <li>
              Ensuring your profile complies with our community standards.
            </li>
          </ul>
          <p>
            We reserve the right to terminate accounts that violate our terms.
          </p>
        </section>

        <section id="section-4" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Use of the Platform</h2>
          <p>You agree to:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Use Dealo only for lawful purposes.</li>
            <li>
              Refrain from exploiting, harassing, or impersonating other users.
            </li>
            <li>
              Dealo may charge commissions, subscription fees, or withdrawal
              fees with prior notice.
            </li>
            <li>
              Use real identities and maintain ethical behavior when offering or
              seeking services.
            </li>
            <li>
              Not upload content that is abusive, misleading, or infringes
              intellectual property rights.
            </li>
          </ul>
          <p>
            We reserve the right to remove content or suspend accounts that
            violate these terms.
          </p>
        </section>

        <section id="section-5" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            5. Payments & Financial Services
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              All financial transactions on Dealo are processed through
              Flutterwave and Paystack.
            </li>
            <li>
              Dealo does not store card or bank information on its servers.
            </li>
            <li>
              Freelancers and clients are solely responsible for agreed terms of
              service and payment schedules.
            </li>
            <li>
              Loan applications may require separate verification, and Dealo is
              not liable for loan outcomes.
            </li>
          </ul>
        </section>

        <section id="section-6" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            6. Certification and Verification
          </h2>
          <p>
            Dealo may offer assessments or courses that, upon successful
            completion, qualify a user for a &quot;Certified&quot; badge.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Verified users will display a checkmark badge on their profile.
            </li>
            <li>
              Certification does not guarantee employment, ranking, or income.
            </li>
            <li>
              Dealo reserves the right to revoke certifications for misconduct
              or fraud.
            </li>
          </ul>
        </section>

        <section id="section-7" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            7. Content Ownership & License
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Users retain ownership of content they upload.</li>
            <li>
              You grant Dealo a non-exclusive, worldwide, royalty-free license
              to host and display your content on the Platform.
            </li>
            <li>
              You must have the rights to all content uploaded or shared on
              Dealo.
            </li>
          </ul>
        </section>

        <section id="section-8" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Termination</h2>
          <p>We may suspend or terminate your account if you:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Violate these Terms.</li>
            <li>Misuse our services.</li>
            <li>Become inactive or unverified for an extended period.</li>
            <li>Misrepresent your age, role, or qualifications.</li>
          </ul>
        </section>

        <section id="section-9" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            9. Disclaimers & Limitations
          </h2>
          <p>
            Dealo is not liable for disputes between freelancers and clients.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              The Platform does not guarantee job placements or service quality.
            </li>
            <li>
              Dealo does not control third-party loan approvals or educational
              product availability.
            </li>
          </ul>
        </section>

        <section id="section-10" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            10. Prohibited Activities
          </h2>
          <p>Using the Platform you agree not to:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Hack, DDoS, or interfere with Dealo&apos;s infrastructure.</li>
            <li>
              Use bots or automated tools to access or abuse the platform.
            </li>
          </ul>
        </section>

        <section id="section-13" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            13. Intellectual Property
          </h2>
          <p>Using the Platform you agree not to:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Impersonate other users or Dealo Staff.</li>
            <li>
              Dealo, its logo, platform UI, and content (excluding user-uploaded
              content) are the intellectual property of Dealo Talent Network
              Ltd.
            </li>
            <li>
              Unauthorized reproduction or resale of our services is strictly
              prohibited.
            </li>
          </ul>
        </section>

        <section id="section-14" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            14. Disclaimer & Limitation of Liability
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Dealo is provided &quot;as is&quot; with no warranties of any
              kind.
            </li>
            <li>
              We are not liable for loss of data, business interruption, or loss
              of income caused by the use or inability to use the platform.
            </li>
            <li>
              Some services may be provided by third parties, and we do not
              guarantee their availability.
            </li>
            <li>
              Dealo is not liable for disputes between freelancers and clients.
            </li>
          </ul>
        </section>

        <section id="section-15" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">15. Changes to Terms</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>We may update these Terms from time to time.</li>
            <li>
              You will be notified of material changes via email or platform
              notification.
            </li>
            <li>
              Continued use after updates means you agree to the revised terms.
            </li>
          </ul>
        </section>

        <section id="section-19" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">19. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of the Federal Republic of Nigeria.
          </p>
        </section>

        <section id="section-20" className="mb-6">
          <h2 className="text-xl font-semibold mb-2">20. Contact</h2>
          <p>Questions? Contact us at:</p>
          <ul className="list-none space-y-2">
            <li>
              Email:{" "}
              <a
                href="mailto:team@dealonetwork.com"
                className="text-[#cacccb] hover:underline"
              >
                team@dealonetwork.com
              </a>
            </li>
            <li>Phone: +2348157062795</li>
            <li>
              Address: 251 Bashorun Okusanya Street, Off Admiralty Road, Off
              Admiralty Way, Lekki Phase 1, Lagos
            </li>
          </ul>
        </section>

        <footer className="text-center mt-8">
          <p>
            Dealo Talent Network Limited
            <br />
            Elevating African Talent. Powering Global Opportunity.
          </p>
        </footer>
      </div>
    </>
  );
};

export default TermsOfService;
