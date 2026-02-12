"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import KakaoMap from "@/components/KakaoMap";
import BottomNav from "@/components/BottomNav";

function MapContent() {
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const radiusParam = searchParams.get("radius");
  const gps = searchParams.get("gps") === "true";

  // 홈에서 km 단위로 넘어오므로 m로 변환 (예: 50km → 50000m)
  const radius = radiusParam ? Number(radiusParam) * 1000 : undefined;

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 relative">
        <KakaoMap
          initialCategory={category}
          initialSearch={search}
          initialRadius={radius}
          useGPS={gps}
        />
      </div>
      <BottomNav />
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
