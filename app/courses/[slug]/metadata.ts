import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // In a real app, you'd fetch the course data from your database
  const course = {
    id: params.slug,
    title: "Complete Web Development Bootcamp - Nigeria Edition",
    description:
      "Master full-stack web development with this comprehensive bootcamp designed specifically for Nigerian developers. Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB with real-world projects.",
    instructor: "Sarah Johnson",
    level: "beginner",
    price: {
      amount: 50000,
      currency: "NGN",
    },
    isFree: false,
    thumbnail: "/courses/web-development-bootcamp.jpg",
    rating: {
      average: 4.8,
      count: 1250,
    },
    duration: "12 weeks",
    lessons: 45,
    students: 2500,
    tags: ["web development", "javascript", "react", "node.js", "mongodb"],
    category: "Programming",
    language: "English",
    lastUpdated: "2024-01-15",
    prerequisites: [
      "Basic computer skills",
      "No programming experience required",
    ],
    whatYouWillLearn: [
      "Build responsive websites with HTML, CSS, and JavaScript",
      "Create dynamic web applications with React",
      "Develop server-side applications with Node.js",
      "Work with databases using MongoDB",
      "Deploy applications to the cloud",
      "Use Git for version control",
      "Implement authentication and authorization",
      "Build RESTful APIs",
    ],
    curriculum: [
      {
        module: "Module 1: HTML & CSS Fundamentals",
        lessons: [
          "Introduction to Web Development",
          "HTML Structure and Elements",
          "CSS Styling and Layout",
          "Responsive Design with CSS Grid and Flexbox",
          "CSS Animations and Transitions",
        ],
      },
      {
        module: "Module 2: JavaScript Basics",
        lessons: [
          "JavaScript Fundamentals",
          "DOM Manipulation",
          "Event Handling",
          "Asynchronous JavaScript",
          "ES6+ Features",
        ],
      },
      {
        module: "Module 3: React Development",
        lessons: [
          "React Components and JSX",
          "State and Props",
          "React Hooks",
          "React Router",
          "State Management with Context API",
        ],
      },
      {
        module: "Module 4: Backend Development",
        lessons: [
          "Node.js Fundamentals",
          "Express.js Framework",
          "RESTful API Development",
          "MongoDB Database",
          "Authentication and Authorization",
        ],
      },
      {
        module: "Module 5: Deployment and DevOps",
        lessons: [
          "Git Version Control",
          "Deployment Strategies",
          "Cloud Platforms (AWS, Vercel)",
          "Performance Optimization",
          "Testing and Debugging",
        ],
      },
    ],
  };

  return generateSEOMetadata({
    title: course.title,
    description: course.description,
    keywords: course.tags,
    url: `/courses/${params.slug}`,
    type: "course",
    author: course.instructor,
    image: course.thumbnail,
  });
}
















