# SEO & Performance Optimization Guide

## Overview

This guide covers optimizations for SEO, performance, and Core Web Vitals improvements.

## 1. Static Generation & ISR

### Current Issues

- Many pages use `"use client"` unnecessarily
- Pages that should be static are dynamic
- No ISR (Incremental Static Regeneration) for semi-static content

### Solution: Add ISR to Static Pages

#### Marketplace Page

The marketplace page should use ISR since it's mostly static content that updates periodically:

```typescript
// app/marketplace/page.tsx
// Remove "use client" if possible, or create a server component wrapper

// Revalidate every 5 minutes
export const revalidate = 300;

export default async function MarketplacePage() {
  // Fetch data on server
  const works = await fetchWorks();
  
  return <MarketplaceClient works={works} />;
}
```

#### Courses Page

```typescript
// app/courses/page.tsx
export const revalidate = 600; // 10 minutes

export default async function CoursesPage() {
  const courses = await fetchCourses();
  return <CoursesClient courses={courses} />;
}
```

#### Jobs Page

```typescript
// app/jobs/page.tsx
export const revalidate = 300; // 5 minutes

export default async function JobsPage() {
  const jobs = await fetchJobs();
  return <JobsClient jobs={jobs} />;
}
```

## 2. Metadata Optimization

### Dynamic Metadata Generation

Ensure all pages have proper metadata:

```typescript
// app/courses/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug);
  
  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: [course.thumbnail],
    },
  };
}
```

## 3. Image Optimization

### Use Next.js Image Component

```typescript
import Image from "next/image";

// ✅ CORRECT
<Image
  src={imageUrl}
  alt="Description"
  width={800}
  height={600}
  priority={isAboveFold}
  loading={isAboveFold ? "eager" : "lazy"}
/>

// ❌ WRONG
<img src={imageUrl} alt="Description" />
```

## 4. Core Web Vitals Optimization

### Largest Contentful Paint (LCP)

- Optimize images (use Next.js Image)
- Preload critical resources
- Minimize render-blocking resources

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <link rel="preload" href="/fonts/main.woff2" as="font" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### First Input Delay (FID) / Interaction to Next Paint (INP)

- Minimize JavaScript execution
- Use code splitting
- Defer non-critical JavaScript

### Cumulative Layout Shift (CLS)

- Set image dimensions
- Reserve space for dynamic content
- Avoid inserting content above existing content

```typescript
// Reserve space for images
<div style={{ aspectRatio: "16/9", position: "relative" }}>
  <Image fill src={imageUrl} alt="Description" />
</div>
```

## 5. Caching Strategy

### Next.js Caching

```typescript
// Static pages with ISR
export const revalidate = 3600; // 1 hour

// API routes with caching
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
```

### Browser Caching

Already configured in `next.config.js`:
- Static assets: 1 year
- API responses: 60 seconds with stale-while-revalidate

## 6. Bundle Optimization

Already configured in `next.config.js`:
- Code splitting
- Tree shaking
- Bundle analyzer

## 7. Sitemap & Robots.txt

### Sitemap

✅ Already exists at `app/sitemap.ts`

### Robots.txt

✅ Already exists at `app/robots.ts`

### Dynamic Sitemap Generation

Consider generating sitemap entries for dynamic content:

```typescript
// app/sitemap.ts
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  // Static pages
  const staticPages = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    // ...
  ];
  
  // Dynamic pages
  const courses = await getAllCourses();
  const coursePages = courses.map(course => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: course.updatedAt,
  }));
  
  return [...staticPages, ...coursePages];
}
```

## 8. Performance Monitoring

### Core Web Vitals Tracking

✅ Already implemented in `components/monitoring/PerformanceMonitor.tsx`

### Performance Budget

Set performance budgets:
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- FCP: < 1.8s
- TTFB: < 800ms

## 9. SEO Best Practices

### 1. Semantic HTML

```typescript
// ✅ CORRECT
<article>
  <header>
    <h1>Article Title</h1>
  </header>
  <main>
    <p>Content</p>
  </main>
</article>

// ❌ WRONG
<div>
  <div>Article Title</div>
  <div>Content</div>
</div>
```

### 2. Structured Data

```typescript
// app/courses/[slug]/page.tsx
export default function CoursePage({ course }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": "Dealo Network",
    },
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Page content */}
    </>
  );
}
```

### 3. Open Graph Tags

Already configured in `app/layout.tsx`

## 10. Migration Checklist

### High Priority

- [ ] Add ISR to marketplace page
- [ ] Add ISR to courses page
- [ ] Add ISR to jobs page
- [ ] Optimize images (use Next.js Image)
- [ ] Add metadata to all pages

### Medium Priority

- [ ] Generate dynamic sitemap entries
- [ ] Add structured data
- [ ] Optimize fonts (preload, subset)
- [ ] Minimize JavaScript bundle

### Low Priority

- [ ] Add service worker for offline support
- [ ] Implement prefetching for critical routes
- [ ] Add resource hints (dns-prefetch, preconnect)

## 11. Performance Testing

### Tools

- **Lighthouse**: Built into Chrome DevTools
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **WebPageTest**: https://www.webpagetest.org/

### Testing Checklist

- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Test on mobile devices
- [ ] Test with slow 3G connection
- [ ] Monitor real user metrics

## 12. Expected Improvements

After implementing these optimizations:

- **LCP**: 2.5s → < 1.5s
- **FID**: 200ms → < 100ms
- **CLS**: 0.2 → < 0.1
- **SEO Score**: 70 → 95+
- **Page Load**: 3s → < 1.5s
- **Server Costs**: Reduced by 60-80%

## Files to Update

1. `app/marketplace/page.tsx` - Add ISR
2. `app/courses/page.tsx` - Add ISR
3. `app/jobs/page.tsx` - Add ISR
4. `app/sitemap.ts` - Add dynamic entries
5. All page components - Add metadata



