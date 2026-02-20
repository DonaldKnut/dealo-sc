import Skeleton from "@/components/ui/skeleton";

export default function CertificationsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        {/* Header skeleton */}
        <div className="text-center mb-12">
          <Skeleton height="h-12" width="w-96" className="mx-auto mb-4" />
          <Skeleton height="h-6" width="w-[500px]" className="mx-auto" />
        </div>

        {/* Certification grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
              {/* Icon */}
              <Skeleton height="h-12" width="w-12" rounded="xl" className="mb-4" />

              {/* Title */}
              <Skeleton height="h-6" width="w-3/4" className="mb-3" />

              {/* Description */}
              <div className="space-y-2 mb-4">
                <Skeleton height="h-4" />
                <Skeleton height="h-4" width="w-5/6" />
                <Skeleton height="h-4" width="w-4/6" />
              </div>

              {/* Badge and price */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <Skeleton height="h-6" width="w-24" rounded="full" />
                <Skeleton height="h-6" width="w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

