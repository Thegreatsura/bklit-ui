"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { VercelOss } from "@/components/brands/vercel-oss";
import { HeroPlayPill, HeroStudioPill } from "@/components/hero";
import { HomeAreaChart } from "@/components/home-area-chart";
import { HomeStudioVideo } from "@/components/home-studio-video";
import { Button } from "@/components/ui/button";
import { getAnalyticsUrl, trackEvent } from "@/lib/analytics/track-client";

const easeOutQuint = [0.23, 1, 0.32, 1] as const;

const STUDIO_VIDEO_ID = "I3PLqHImYbE";

export function DesignHeroCanvas() {
  const reducedMotion = useReducedMotion();
  const [showVideo, setShowVideo] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fadeTransition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: easeOutQuint };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showVideo) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showVideo]);

  const handlePlay = useCallback(() => {
    trackEvent("homepage_hero_video_open", {
      url: getAnalyticsUrl(),
      video_src: `https://www.youtube.com/watch?v=${STUDIO_VIDEO_ID}`,
    });
    setShowVideo(true);
  }, []);

  const handleClose = useCallback(() => {
    trackEvent("homepage_hero_video_close", {
      url: getAnalyticsUrl(),
      video_src: `https://www.youtube.com/watch?v=${STUDIO_VIDEO_ID}`,
    });
    setShowVideo(false);
  }, []);

  return (
    <>
      <div
        className="absolute inset-0 grid min-h-0 min-w-0 grid-cols-1 grid-rows-1"
        data-grid-fill
      >
        <div className="pointer-events-none col-start-1 row-start-1 flex h-full min-h-0 min-w-0 items-center p-4 sm:p-10 md:block md:p-16 lg:p-20">
          <HomeAreaChart className="w-full shrink-0 opacity-85" />
        </div>

        <div className="relative z-1 col-start-1 row-start-1 flex h-full min-h-0 min-w-0 flex-col justify-center px-4 text-left sm:justify-start sm:px-8 sm:py-20 md:px-16 md:py-28 lg:px-24 lg:py-36">
          <div className="flex min-h-0 flex-col gap-4 sm:flex-1 sm:gap-6">
            <div className="flex shrink-0 items-center justify-start gap-2">
              <HeroStudioPill />
              <HeroPlayPill onClick={handlePlay} />
            </div>

            <div className="flex flex-col items-start gap-4 sm:flex-1 sm:justify-center">
              <div className="flex max-w-full flex-col items-start justify-center">
                <h1 className="font-bold text-4xl tracking-tight sm:text-5xl md:text-7xl lg:text-9xl">
                  Bklit UI
                </h1>
                <p className="font-mono text-sm leading-snug sm:text-lg md:text-2xl lg:text-3xl">
                  Design engineered data visualization components
                </p>
              </div>
              <div className="flex items-start justify-center">
                <Button size="lg" variant="default">
                  Get started
                </Button>
              </div>
            </div>

            <div className="flex shrink-0 justify-start">
              <a
                className="inline-flex text-foreground"
                href="https://vercel.com/oss"
                rel="noopener noreferrer"
                target="_blank"
              >
                <VercelOss className="h-auto w-[180px] max-w-full sm:w-[220px] md:w-[280px]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {showVideo ? (
                <>
                  <motion.button
                    animate={{ opacity: 1 }}
                    aria-label="Close video"
                    className="fixed inset-0 z-40 cursor-default bg-black/55 backdrop-blur-sm"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    key="hero-video-backdrop"
                    onClick={handleClose}
                    transition={fadeTransition}
                    type="button"
                  />
                  <motion.div
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    className="pointer-events-none fixed inset-0 z-[41] flex items-center justify-center p-6 sm:p-10"
                    exit={
                      reducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, filter: "blur(6px)", scale: 0.985 }
                    }
                    initial={
                      reducedMotion
                        ? { opacity: 1, filter: "blur(0px)", scale: 1 }
                        : { opacity: 0, filter: "blur(6px)", scale: 0.985 }
                    }
                    key="hero-video"
                    transition={{
                      ...fadeTransition,
                      delay: reducedMotion ? 0 : 0.06,
                    }}
                  >
                    <HomeStudioVideo
                      animationDelay={0}
                      className="pointer-events-auto w-full max-w-5xl"
                      startActive
                      videoId={STUDIO_VIDEO_ID}
                    />
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  );
}
