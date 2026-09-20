"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/motion";

/**
 * A silent looping clip that plays only while it is on screen. Decoding every
 * clip in a 29-tile mosaic at once would be wasteful, and autoplaying motion a
 * visitor has asked not to see would be worse — so playback is driven here
 * rather than by the autoplay attribute.
 */
export function TileVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element || prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Rejected autoplay is normal on some platforms; the still frame
          // stands in perfectly well.
          void element.play().catch(() => {});
        } else {
          element.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={video}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      // Not decorative, but it carries no information a caption does not.
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
