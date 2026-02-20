import Skeleton from "@/components/ui/skeleton";

export default function MarketplaceLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        {/* Header skeleton */}
        <div className="mb-8">
          <Skeleton height="h-10" width="w-64" className="mb-4" />
          <Skeleton height="h-6" width="w-96" />
        </div>

        {/* Filter skeleton */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton
              key={i}
              height="h-10"
              width="w-24"
              rounded="full"
              className="flex-shrink-0"
            />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
              {/* Image */}
              <Skeleton height="h-48" rounded="lg" className="mb-4" />

              {/* Title */}
              <Skeleton height="h-5" width="w-3/4" className="mb-3" />

              {/* Description */}
              <div className="space-y-2 mb-4">
                <Skeleton height="h-3" />
                <Skeleton height="h-3" width="w-5/6" />
              </div>

              {/* Price and rating */}
              <div className="flex items-center justify-between">
                <Skeleton height="h-6" width="w-20" />
                <Skeleton height="h-4" width="w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

