export default function LoadingDashboard() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-10 w-52 bg-gray-200 animate-pulse rounded-md" />
        <div className="h-10 w-40 bg-gray-200 animate-pulse rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-[300px] bg-gray-200 animate-pulse rounded-md" />
        <div className="h-[300px] bg-gray-200 animate-pulse rounded-md" />
      </div>
    </div>
  )
}
