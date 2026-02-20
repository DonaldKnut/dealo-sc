import axios from "axios";

export const onDrop = async (
  acceptedFiles: File[],
  courseId: string,
  setUploading: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const file = acceptedFiles[0];
  const formData = new FormData();
  formData.append("file", file);
  formData.append("prefix", "courses");

  setUploading(courseId);
  try {
    const response = await fetch("/api/uploads/r2", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload image");
    }

    const data = await response.json();
    await axios.put(`/api/courses/${courseId}`, {
      bannerUrl: data.url,
    });

    setUploading(null);
  } catch (err) {
    console.error("Error uploading image:", err);
    setUploading(null);
  }
};
