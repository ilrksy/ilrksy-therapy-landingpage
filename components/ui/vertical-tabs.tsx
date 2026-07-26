"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// Holistic Sanctuary Pillars
const SERVICES = [
  {
    id: "01",
    title: "Bio-Resonance Alignment",
    description:
      "Harmonizing cellular frequencies and restoring energetic equilibrium with non-invasive sound bath acoustics.",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200",
  },
  {
    id: "02",
    title: "Cellular Light Alchemy",
    description:
      "Restoring vitality at the mitochondrial level using calibrated full-spectrum photons and frequency immersion.",
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1200",
  },
  {
    id: "03",
    title: "Mindful Energy Balance",
    description:
      "Aligning body, mind, and spirit through personalized frequency protocols and restorative breathing practices.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200",
  },
];

const AUTO_PLAY_DURATION = 5000;

export function VerticalTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % SERVICES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + SERVICES.length) % SERVICES.length);
  }, []);

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_DURATION);

    return () => clearInterval(interval);
  }, [activeIndex, isPaused, handleNext]);

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      y: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <section className="w-full bg-transparent py-4 md:py-8">
      <div className="w-full px-2 sm:px-4 md:px-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Content */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 pt-2">
            <div className="space-y-1 mb-6 sm:mb-8">
              <h2 className="tracking-tighter text-balance text-2xl font-medium sm:text-3xl md:text-4xl text-white">
                Our Core Pillars
              </h2>
              <span className="text-[10px] font-medium text-white/60 uppercase tracking-[0.3em] block ml-0.5">
                (OUR APPROACH)
              </span>
            </div>

            <div className="flex flex-col space-y-0">
              {SERVICES.map((service, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={service.id}
                    onClick={() => handleTabClick(index)}
                    className={cn(
                      "group relative flex items-start gap-4 py-4 md:py-6 text-left transition-all duration-500 border-t border-white/20 first:border-0 cursor-pointer",
                      isActive
                        ? "text-white"
                        : "text-white/50 hover:text-white"
                    )}
                  >
                    <div className="absolute left-[-12px] md:left-[-18px] top-0 bottom-0 w-[2px] bg-white/10">
                      {isActive && (
                        <motion.div
                          key={`progress-${index}-${isPaused}`}
                          className="absolute top-0 left-0 w-full bg-white origin-top"
                          initial={{ height: "0%" }}
                          animate={
                            isPaused ? { height: "0%" } : { height: "100%" }
                          }
                          transition={{
                            duration: AUTO_PLAY_DURATION / 1000,
                            ease: "linear",
                          }}
                        />
                      )}
                    </div>

                    <span className="text-[9px] md:text-[10px] font-medium mt-1 tabular-nums opacity-60">
                      /{service.id}
                    </span>

                    <div className="flex flex-col gap-1.5 flex-1">
                      <span
                        className={cn(
                          "text-xl md:text-2xl lg:text-3xl font-normal tracking-tight transition-colors duration-500",
                          isActive ? "text-white" : ""
                        )}
                      >
                        {service.title}
                      </span>

                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.23, 1, 0.32, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <p className="text-white/70 text-xs sm:text-sm font-normal leading-relaxed max-w-sm pb-1">
                              {service.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-end h-full order-1 lg:order-2">
            <div
              className="relative group/gallery"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative aspect-4/3 md:aspect-16/10 rounded-2xl md:rounded-3xl overflow-hidden liquid-glass border border-white/20">
                <AnimatePresence
                  initial={false}
                  custom={direction}
                  mode="popLayout"
                >
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      y: { type: "spring", stiffness: 260, damping: 32 },
                      opacity: { duration: 0.4 },
                    }}
                    className="absolute inset-0 w-full h-full cursor-pointer"
                    onClick={handleNext}
                  >
                    <img
                      src={SERVICES[activeIndex].image}
                      alt={SERVICES[activeIndex].title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 !m-0 !p-0 block"
                    />

                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex gap-2 md:gap-3 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="w-9 h-9 md:w-11 md:h-11 rounded-full liquid-glass border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90 cursor-pointer"
                    aria-label="Previous"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="w-9 h-9 md:w-11 md:h-11 rounded-full liquid-glass border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90 cursor-pointer"
                    aria-label="Next"
                  >
                    <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VerticalTabs;
