// types.ts
export interface Avatar {
  url: string;
}

export interface Creator {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: Avatar;
}

export interface Work {
  _id?: string; // Optional for fetched data
  category: string;
  workMedia: { url: string; type: "image" | "video" }[];
  title: string;
  description: string;
  price: number;
  deliveryDate: string;
  deliveryTime: string;
  skills: string[];
  contactInfo: { email: string; phone: string };
  experienceLevel: string;
  portfolioLink: string;
  languagesSpoken?: string[];
  certifications?: string[];
  creator?: string; // Optional, populated as string if needed
  createdAt?: string; // Optional for display
  updatedAt?: string; // Optional for display
}
