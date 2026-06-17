"use client";

import { useEffect, useState } from "react";
import Landing from "@/components/pawcup/Landing";
import Slide0 from "@/components/pawcup/Slide0";
import Slide1 from "@/components/pawcup/Slide1";
import Slide2 from "@/components/pawcup/Slide2";
import Slide3 from "@/components/pawcup/Slide3";
import Slide4 from "@/components/pawcup/Slide4";
import Slide5 from "@/components/pawcup/Slide5";
import Slide6 from "@/components/pawcup/Slide6";
import Slide7 from "@/components/pawcup/Slide7";
import Slide8 from "@/components/pawcup/Slide8";
import type { WrappedProfile } from "@/types/wrapped";

const DECORATIVE_SLIDES = [Slide0, Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7] as const;

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? children : null;
}

export function WorldCupLanding({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <ClientOnly>
      <Landing isLoggedIn={isLoggedIn} />
    </ClientOnly>
  );
}

export function WorldCupSlide({ index, profile }: { index: number; profile?: WrappedProfile }) {
  // Slide 8 (bonus) is personalized and needs the profile
  if (index === 8) {
    return (
      <ClientOnly>
        <Slide8 profile={profile} />
      </ClientOnly>
    );
  }
  const Slide = DECORATIVE_SLIDES[index] ?? Slide0;
  return (
    <ClientOnly>
      <Slide />
    </ClientOnly>
  );
}
