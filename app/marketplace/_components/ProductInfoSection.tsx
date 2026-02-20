import React from "react";
import { CheckCircle, Globe, Mail, Briefcase, Award } from "lucide-react";
import SectionHeader from "./SectionHeader";
import ProductDescription from "./ProductDescription";

interface Work {
  description: string;
  experienceLevel?: string;
  languagesSpoken?: string[];
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  portfolioLink?: string;
  certifications?: string[];
}

const ProductInfoSection: React.FC<{ work: Work }> = ({ work }) => (
  <>
    <div className="mt-6">
      <SectionHeader
        title="Description"
        icon={<CheckCircle className="text-green-600" />}
      />
      <ProductDescription description={work.description} />
    </div>

    {work.languagesSpoken && (
      <div className="mt-6">
        <SectionHeader
          title="Languages Spoken"
          icon={<Globe className="text-green-600" />}
        />
        <ul className="list-disc pl-5 text-sm text-green-800">
          {work.languagesSpoken.map((lang, index) => (
            <li key={index}>{lang}</li>
          ))}
        </ul>
      </div>
    )}

    {work.contactInfo && (
      <div className="mt-6">
        <SectionHeader
          title="Contact Information"
          icon={<Mail className="text-green-600" />}
        />
        {work.contactInfo.email && (
          <p className="text-sm text-green-800">
            Email:{" "}
            <a
              href={`mailto:${work.contactInfo.email}`}
              className="text-green-600 underline"
            >
              {work.contactInfo.email}
            </a>
          </p>
        )}
        {work.contactInfo.phone && (
          <p className="text-sm text-green-800">
            Phone:{" "}
            <a
              href={`tel:${work.contactInfo.phone}`}
              className="text-green-600 underline"
            >
              {work.contactInfo.phone}
            </a>
          </p>
        )}
      </div>
    )}

    {work.portfolioLink && (
      <div className="mt-6">
        <SectionHeader
          title="Portfolio"
          icon={<Briefcase className="text-green-600" />}
        />
        <a
          href={work.portfolioLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 underline text-sm"
        >
          View Portfolio
        </a>
      </div>
    )}

    {work.certifications && (
      <div className="mt-6">
        <SectionHeader
          title="Certifications"
          icon={<Award className="text-green-600" />}
        />
        <ul className="list-disc pl-5 text-sm text-green-800">
          {work.certifications.map((cert, index) => (
            <li key={index}>
              <a
                href={cert}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline"
              >
                Certification {index + 1}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </>
);

export default ProductInfoSection;
