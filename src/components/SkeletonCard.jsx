export default function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full skeleton-shimmer" />
        <div className="h-3 w-20 rounded skeleton-shimmer" />
        <div className="ml-auto h-3 w-12 rounded skeleton-shimmer" />
      </div>
      <div className="h-4 w-full rounded skeleton-shimmer" />
      <div className="h-3 w-3/4 rounded skeleton-shimmer" />
      <div className="flex items-center justify-between pt-1">
        <div className="h-5 w-12 rounded-full skeleton-shimmer" />
        <div className="h-5 w-5 rounded skeleton-shimmer" />
      </div>
    </div>
  );
}