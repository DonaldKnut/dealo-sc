import React from "react";
import { Reveal } from "@/app/reveal";

interface FooterLinksProps {
  title: string;
  links: string[] | { label: string; email: string }[];
  isContact?: boolean;
}

const FooterLinks: React.FC<FooterLinksProps> = ({
  title,
  links,
  isContact = false,
}) => {
  return (
    <div className="col-span-1">
      <Reveal>
        <h3 className="text-lg font-semibold mb-4 text-green-400">{title}</h3>
      </Reveal>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <Reveal key={index}>
            <li>
              {isContact ? (
                <a
                  href={`mailto:${
                    (link as { label: string; email: string }).email
                  }`}
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                >
                  {(link as { label: string; email: string }).label}:{" "}
                  {(link as { label: string; email: string }).email}
                </a>
              ) : (
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                >
                  {link as string}
                </a>
              )}
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
};

export default FooterLinks;
