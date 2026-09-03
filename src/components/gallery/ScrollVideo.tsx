"use client";

import { useEffect, useRef } from "react";

export default function ScrollVideo({
  src,
  className,
  onError,
}: {
  src: string;
  className?: string;
  onError?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !onError) return;

    // The native `error` event on <video> doesn't bubble, and (unlike
    // <img>) isn't reliably delivered through React's synthetic `onError`
    // prop for it — attach a real listener instead of trusting JSX here.
    // If the element already failed before this ran (a fast 404 racing
    // hydration), catch that too.
    if (video.error) {
      onError();
      return;
    }
    video.addEventListener("error", onError);
    return () => video.removeEventListener("error", onError);
  }, [onError]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
    />
  );
}
