"use client";

import stadium from "@/components/pawcup/assets/stadium.asset.json";

export default function WorldCupSlideBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
      {/* Stadium image with subtle blur */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${stadium.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          filter: "blur(3px)",
          transform: "scale(1.06)",
        }}
      />
      {/* Purple vignette — same as landing page */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/50 via-transparent to-purple-950/70" />
    </div>
  );
}
