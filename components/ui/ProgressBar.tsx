"use client";

import { motion } from "framer-motion";

export default function ProgressBar({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1 w-full">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="h-0.5 flex-1 rounded-full bg-white/20 overflow-hidden">
          {i <= current && (
            <motion.div
              key={`fill-${i}-${current}`}
              className="h-full bg-white/90 rounded-full"
              initial={{ width: i < current ? "100%" : "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: i === current ? 0.3 : 0, ease: "easeOut" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
