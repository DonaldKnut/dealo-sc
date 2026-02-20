"use client";

import React, { useState } from "react";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import "@styles/Form.scss";
import { categories } from "../(dummy)/data";
import Image from "next/image";

// Define the Work interface to match your schema
interface Work {
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
}

interface FormProps {
  type: string;
  work: Work;
  setWork: React.Dispatch<React.SetStateAction<Work>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form: React.FC<FormProps> = ({ type, work, setWork, handleSubmit }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("prefix", "marketplace");

      const response = await fetch("/api/uploads/r2", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload media");
      }

      const data = await response.json();
      const uploadedMedia = data.urls.map((url: string) => {
        // Determine type from URL or file extension
        const isVideo = url.match(/\.(mp4|webm|quicktime)$/i);
        return { url, type: isVideo ? "video" : "image" } as const;
      });

      setWork((prev) => ({
        ...prev,
        workMedia: [...prev.workMedia, ...uploadedMedia],
      }));
    } catch (error: any) {
      console.error("Error uploading media:", error);
      alert(error.message || "Failed to upload media. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveMedia = (indexToRemove: number) => {
    setWork((prev) => ({
      ...prev,
      workMedia: prev.workMedia.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.includes("contactInfo.")) {
      const key = name.split(".")[1] as "email" | "phone";
      setWork((prev) => ({
        ...prev,
        contactInfo: { ...prev.contactInfo, [key]: value },
      }));
    } else {
      setWork((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (
    name: "skills" | "languagesSpoken" | "certifications",
    value: string
  ) => {
    const values = value
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v);
    setWork((prev) => ({ ...prev, [name]: values }));
  };

  return (
    <div className="form">
      <h1>{type} Your Work</h1>
      <form onSubmit={handleSubmit}>
        <h3>Category</h3>
        <div className="category-list">
          {categories.map((item, index) => (
            <p
              key={index}
              className={`${work.category === item ? "selected" : ""}`}
              onClick={() => setWork({ ...work, category: item })}
            >
              {item}
            </p>
          ))}
        </div>

        <h3>Add Media (Images or Videos)</h3>
        {work.workMedia.length < 1 && (
          <div className="photos">
            <input
              id="media"
              type="file"
              style={{ display: "none" }}
              accept="image/*,video/*"
              onChange={handleUploadMedia}
              multiple
            />
            <label htmlFor="media" className="alone">
              <div className="icon">
                <IoIosImages />
              </div>
              <p>Upload from your device</p>
            </label>
          </div>
        )}

        {work.workMedia.length > 0 && (
          <div className="photos">
            {work.workMedia.map((media, index) => (
              <div key={index} className="photo">
                {media.type === "image" ? (
                  <Image
                    src={media.url}
                    alt="Uploaded Work"
                    width={100}
                    height={100}
                  />
                ) : (
                  <video src={media.url} controls width={100} height={100} />
                )}
                <button type="button" onClick={() => handleRemoveMedia(index)}>
                  <BiTrash />
                </button>
              </div>
            ))}
            <input
              id="media"
              type="file"
              style={{ display: "none" }}
              accept="image/*,video/*"
              onChange={handleUploadMedia}
              multiple
            />
            <label htmlFor="media" className="together">
              <div className="icon">
                <IoIosImages />
              </div>
              <p>Upload more</p>
            </label>
          </div>
        )}

        {isUploading && <p className="uploading-spinner">Uploading...</p>}

        <h3>Work Details</h3>
        <div className="description">
          <p>Title</p>
          <input
            type="text"
            name="title"
            value={work.title}
            onChange={handleChange}
            required
          />
          <p>Description</p>
          <textarea
            name="description"
            value={work.description}
            onChange={handleChange}
            required
          />
          <p>Price ($)</p>
          <input
            type="number"
            name="price"
            value={work.price}
            onChange={handleChange}
            required
            min="0"
          />
          <p>Delivery Date</p>
          <input
            type="date"
            name="deliveryDate"
            value={work.deliveryDate}
            onChange={handleChange}
            required
          />
          <p>Delivery Time</p>
          <input
            type="text"
            name="deliveryTime"
            value={work.deliveryTime}
            onChange={handleChange}
            required
          />
          <p>Skills (comma-separated)</p>
          <input
            type="text"
            name="skills"
            value={work.skills.join(", ")}
            onChange={(e) => handleArrayChange("skills", e.target.value)}
            required
          />
          <p>Email</p>
          <input
            type="email"
            name="contactInfo.email"
            value={work.contactInfo.email}
            onChange={handleChange}
            required
          />
          <p>Phone</p>
          <input
            type="tel"
            name="contactInfo.phone"
            value={work.contactInfo.phone}
            onChange={handleChange}
            required
          />
          <p>Experience Level</p>
          <select
            name="experienceLevel"
            value={work.experienceLevel}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
          </select>
          <p>Portfolio Link</p>
          <input
            type="url"
            name="portfolioLink"
            value={work.portfolioLink}
            onChange={handleChange}
            required
          />
          <p>Languages Spoken (optional, comma-separated)</p>
          <input
            type="text"
            name="languagesSpoken"
            value={work.languagesSpoken?.join(", ") || ""}
            onChange={(e) =>
              handleArrayChange("languagesSpoken", e.target.value)
            }
          />
          <p>Certifications (optional, comma-separated)</p>
          <input
            type="text"
            name="certifications"
            value={work.certifications?.join(", ") || ""}
            onChange={(e) =>
              handleArrayChange("certifications", e.target.value)
            }
          />
        </div>

        <button className="submit_btn" type="submit" disabled={isUploading}>
          {isUploading ? "Uploading Media..." : "PUBLISH YOUR WORK"}
        </button>
      </form>
    </div>
  );
};

export default Form;
