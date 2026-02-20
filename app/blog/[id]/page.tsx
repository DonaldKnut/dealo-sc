import { Metadata } from "next";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  Globe,
} from "lucide-react";
import ClientPost from "./ClientPost";
import {
  generateMetadata as generateSEOMetadata,
  generateStructuredData,
} from "@/lib/seo";
import { StructuredData } from "@/components/SEO/StructuredData";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // In a real app, you'd fetch the blog post data from your database
  const post = {
    id: params.id,
    title: "10 Essential Skills Every Developer Needs in 2024",
    description:
      "Discover the most in-demand skills that every developer should master in 2024. From AI and ML to cloud computing and cybersecurity, learn what skills will boost your career prospects in Nigeria's growing tech industry.",
    author: "Sarah Johnson",
    publishedTime: "2024-12-27T00:00:00Z",
    modifiedTime: "2024-12-27T00:00:00Z",
    category: "tech-insights",
    tags: [
      "Programming",
      "Career Growth",
      "Technology",
      "AI",
      "Cloud Computing",
    ],
    image: "/blog/developer-skills-2024.jpg",
  };

  return generateSEOMetadata({
    title: post.title,
    description: post.description,
    keywords: post.tags,
    url: `/blog/${params.id}`,
    type: "article",
    publishedTime: post.publishedTime,
    modifiedTime: post.modifiedTime,
    author: post.author,
    section: post.category,
    tags: post.tags,
    image: post.image,
  });
}
const BlogPostPage = ({ params }: { params: { id: string } }) => {
  // This would typically fetch the blog post data based on params.id
  const post = {
    id: params.id,
    title: "10 Essential Skills Every Developer Needs in 2024",
    description:
      "Discover the most in-demand skills that every developer should master in 2024. From AI and ML to cloud computing and cybersecurity, learn what skills will boost your career prospects in Nigeria's growing tech industry.",
    content: `
      <p>The tech industry is constantly evolving, and staying ahead requires continuous learning and skill development. In this comprehensive guide, we'll explore the most in-demand skills that every developer should master in 2024.</p>
      
      <h2>1. Artificial Intelligence and Machine Learning</h2>
      <p>AI and ML are no longer optional skills for developers. Understanding the basics of machine learning, neural networks, and AI frameworks like TensorFlow and PyTorch can significantly boost your career prospects.</p>
      
      <h2>2. Cloud Computing</h2>
      <p>With the increasing adoption of cloud services, developers need to be proficient in cloud platforms like AWS, Azure, and Google Cloud. Understanding containerization with Docker and Kubernetes is also essential.</p>
      
      <h2>3. Cybersecurity</h2>
      <p>As cyber threats continue to rise, developers must understand security best practices, secure coding principles, and common vulnerabilities to build safer applications.</p>
      
      <h2>4. DevOps and CI/CD</h2>
      <p>Modern development requires knowledge of DevOps practices, continuous integration/continuous deployment pipelines, and tools like Jenkins, GitLab CI, and GitHub Actions.</p>
      
      <h2>5. Mobile Development</h2>
      <p>With mobile usage continuing to grow, skills in React Native, Flutter, or native iOS/Android development are highly valuable.</p>
    `,
    author: "Sarah Johnson",
    date: "Dec 27, 2024",
    readTime: "8 min read",
    category: "tech-insights",
    views: "12.5K",
    tags: [
      "Programming",
      "Career Growth",
      "Technology",
      "AI",
      "Cloud Computing",
    ],
    publishedTime: "2024-12-27T00:00:00Z",
    modifiedTime: "2024-12-27T00:00:00Z",
    image: "/blog/developer-skills-2024.jpg",
  };

  // Structured data for the article
  const articleData = {
    title: post.title,
    description: post.description,
    author: post.author,
    publishedTime: post.publishedTime,
    modifiedTime: post.modifiedTime,
    url: `/blog/${params.id}`,
    image: post.image,
    category: post.category,
    tags: post.tags,
  };

  return (
    <>
      <StructuredData type="Article" data={articleData} />
      <ClientPost post={post} />
    </>
  );
};

export default BlogPostPage;
