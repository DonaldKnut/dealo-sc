import Skeleton from "@/components/ui/skeleton";

export default function CoursesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        {/* Hero skeleton */}
        <div className="mb-12 text-center">
          <Skeleton height="h-12" width="w-96" className="mx-auto mb-4" />
          <Skeleton height="h-6" width="w-[600px]" className="mx-auto" />
        </div>

        {/* Search bar skeleton */}
        <div className="max-w-2xl mx-auto mb-12">
          <Skeleton height="h-14" rounded="xl" />
        </div>

        {/* Categories skeleton */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton
              key={i}
              height="h-10"
              width="w-32"
              rounded="full"
              className="flex-shrink-0"
            />
          ))}
        </div>

        {/* Course grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
              {/* Thumbnail */}
              <Skeleton height="h-40" rounded="lg" className="mb-4" />

              {/* Category badge */}
              <Skeleton height="h-6" width="w-24" rounded="full" className="mb-3" />

              {/* Title */}
              <Skeleton height="h-6" className="mb-3" />

              {/* Instructor */}
              <div className="flex items-center gap-2 mb-4">
                <Skeleton height="h-8" width="w-8" rounded="full" />
                <Skeleton height="h-4" width="w-32" />
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <Skeleton height="h-4" width="w-16" />
                <Skeleton height="h-6" width="w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

