import React from "react";
import Image from "next/image";
import { PACKAGES } from "@/constant";
import { SearchIcon, DollarSignIcon } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/app/reveal";

// Define types for package data
interface PackageData {
  title: string;
  path: string;
  price?: string;
  desc?: string;
  wantedJobs?: string[];
}

// Define types for PackageItem props
interface PackageItemProps {
  title: string;
  path: string;
  price?: string;
  desc?: string;
  wantedJobs?: string[];
}

const Packages: React.FC = () => {
  return (
    <div className="bg-green-50 py-12 px-4 sm:px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <h3 className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-6">
            Our Packages
          </h3>
        </Reveal>
        <Reveal>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
            Explore our tailored packages designed to meet your travel needs.
            Choose the one that suits you and embark on your journey without
            hesitation.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKAGES.map((card: PackageData) => (
            <PackageItem
              key={card.title}
              title={card.title}
              path={card.path}
              price={card.price}
              desc={card.desc}
              wantedJobs={card.wantedJobs}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const PackageItem: React.FC<PackageItemProps> = ({
  title,
  path,
  price,
  desc,
  wantedJobs,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-green-300 bg-white shadow-md group transition-transform hover:scale-105">
      <div className="relative overflow-hidden h-48">
        <Image
          src={path}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
        />
        <Link
          href="/"
          className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-60 text-white text-xl rounded-full scale-0 group-hover:scale-100 transition-all duration-500"
        >
          <SearchIcon className="h-6 w-6" />
        </Link>
      </div>
      <div className="p-4">
        <Reveal>
          <h2 className="text-lg font-semibold text-green-800 mb-2">{title}</h2>
        </Reveal>
        {price && (
          <Reveal>
            <p className="flex items-center text-green-600 mb-2">
              <DollarSignIcon className="h-5 w-5 mr-1" /> Price: {price}
            </p>
          </Reveal>
        )}
        {desc && (
          <Reveal>
            <p className="text-gray-700 mb-4">{desc}</p>
          </Reveal>
        )}
        {wantedJobs && (
          <div>
            <Reveal>
              <p className="text-green-700 font-medium mb-2">Wanted Jobs:</p>
            </Reveal>
            <ul className="list-disc list-inside text-gray-600">
              {wantedJobs.map((job, index) => (
                <Reveal key={index}>
                  <li>{job}</li>
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;
