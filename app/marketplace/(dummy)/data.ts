// Dummy categories data
export const categories = [
  "All",
  "Technology",
  "Art",
  "Music",
  "Health",
  "Education",
  "Business",
  "Lifestyle",
  "Science",
];

// Dummy work items data for illustration purposes
export const workItems = [
  {
    _id: "1",
    title: "Web Development",
    price: 100,
    category: "Technology",
    workPhotoPaths: ["https://example.com/photo1.jpg"],
    creator: {
      _id: "creator1",
      username: "john_doe",
      profileImagePath: "https://example.com/profile1.jpg",
    },
  },
  {
    _id: "2",
    title: "Graphic Design",
    price: 150,
    category: "Art",
    workPhotoPaths: ["https://example.com/photo2.jpg"],
    creator: {
      _id: "creator2",
      username: "jane_doe",
      profileImagePath: "https://example.com/profile2.jpg",
    },
  },
  // Add more dummy work items as needed
];
