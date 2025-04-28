import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="flex flex-col items-center space-y-4 text-center mb-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-96 max-w-full" />
      </div>

      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    </div>
  )
}
