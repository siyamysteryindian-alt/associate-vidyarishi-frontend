// src/components/Skeleton.tsx
export const Line = ({ w = "w-full", h = "h-4", className = "" }: any) => (
  <div className={`skeleton ${w} ${h} ${className}`}></div>
);

export const CardSkeleton = () => (
  <div className="card p-4">
    <div className="space-y-3">
      <Line w="w-2/3" h="h-5" />
      <Line w="w-full" h="h-10" />
      <div className="flex gap-2">
        <Line w="w-24" h="h-8" />
        <Line w="w-24" h="h-8" />
      </div>
    </div>
  </div>
);
