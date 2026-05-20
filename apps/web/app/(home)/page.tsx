"use client";

import { ArrowRightIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { AnimatedBrand } from "@/components/animated-brand";
import { HomeComponents } from "@/components/home-components";
import { TestimonialGrid } from "@/components/testimonial-grid";
import { Button } from "@/components/ui/button";

const staggerDelay = 0.12;

const fadeInBlur = {
  initial: { opacity: 0, filter: "blur(2px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
};

// Separate variant for chart container - avoids filter property which breaks backdrop-filter
const fadeInOnly = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export default function HomePage() {
  const [showContent, setShowContent] = useState(false);

  return (
    <main className="flex flex-1 flex-col items-center justify-center space-y-24 px-4 py-18 text-center">
      <div className="max-w-xl space-y-5">
        <motion.div
          animate="animate"
          className="mx-auto flex w-fit"
          initial="initial"
          transition={{ duration: 0.5 }}
          variants={fadeInBlur}
        >
          <Button
            asChild
            className="h-auto rounded-full px-0.5 py-0.5"
            size="lg"
            variant="outline"
          >
            <Link href="/studio" title="Studio">
              <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                Introducing
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1">
                Studio
                <HugeiconsIcon icon={ArrowRightIcon} size={14} />
              </span>
            </Link>
          </Button>
        </motion.div>

        <AnimatedBrand onAnimationComplete={() => setShowContent(true)} />

        <AnimatePresence>
          {showContent && (
            <>
              <motion.p
                animate="animate"
                className="text-lg sm:text-xl"
                initial="initial"
                transition={{ delay: staggerDelay * 0, duration: 0.5 }}
                variants={fadeInBlur}
              >
                Design engineered charts and components.
              </motion.p>

              <motion.div
                animate="animate"
                className="flex flex-col items-center justify-center gap-1 sm:flex-row"
                initial="initial"
                transition={{ delay: staggerDelay * 1, duration: 0.5 }}
                variants={fadeInBlur}
              >
                <Button asChild size="lg" variant="outline">
                  <Link href="/docs">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <Link href="/docs/components">Components</Link>
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showContent && (
          <>
            <motion.div
              animate="animate"
              className="container mx-auto"
              initial="initial"
              transition={{ delay: staggerDelay * 2, duration: 0.6 }}
              variants={fadeInOnly}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                <HomeComponents />
              </div>
            </motion.div>

            <motion.div
              animate="animate"
              className="container mx-auto w-full max-w-6xl"
              initial="initial"
              transition={{ delay: staggerDelay * 3, duration: 0.6 }}
              variants={fadeInOnly}
            >
              <TestimonialGrid />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
