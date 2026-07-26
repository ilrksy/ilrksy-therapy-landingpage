/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { CircleUserRound, Menu, X, Sparkles, ShieldCheck, HeartPulse, Feather, Compass, Sun, Infinity, Waves, CalendarCheck } from 'lucide-react';
import { motion } from 'motion/react';
import VerticalTabs from './components/ui/vertical-tabs';
import Testimonials from './components/ui/testimonials-columns-1';
import AudioSoundscape from './components/AudioSoundscape';
import BookingModal from './components/BookingModal';

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const textItemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [currentFreq, setCurrentFreq] = useState(432);
  const [progress, setProgress] = useState(0); // 0 to 5 (0..1 = Page 1, 1..2 = Page 2, 2..3 = Page 3, 3..4 = Page 4, 4..5 = Page 5)
  const [cursorPos, setCursorPos] = useState({ x: -1000, y: -1000 });

  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const video3Ref = useRef<HTMLVideoElement>(null);
  const video4Ref = useRef<HTMLVideoElement>(null);
  const video5Ref = useRef<HTMLVideoElement>(null);
  const prevXRef = useRef<number | null>(null);

  const targetProgressRef = useRef<number>(0);
  const displayProgressRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // RAF loop for smooth video frame scrubbing and progress interpolation
  useEffect(() => {
    let lastProgress = -1;
    const FRAME_STEP = 1 / 30; // Throttled frame interval (~0.033s) to prevent decoder lag

    const syncVideoTime = (v: HTMLVideoElement | null, pageProg: number) => {
      if (v && v.readyState >= 1 && v.duration && !isNaN(v.duration)) {
        const targetTime = Math.max(0, Math.min(v.duration - 0.05, pageProg * v.duration));
        if (!v.seeking && Math.abs(v.currentTime - targetTime) >= FRAME_STEP) {
          try {
            v.currentTime = targetTime;
          } catch {
            // Ignore temporary seek errors
          }
        }
      }
    };

    const updateVideoTimes = () => {
      const v1 = video1Ref.current;
      const v2 = video2Ref.current;
      const v3 = video3Ref.current;
      const v4 = video4Ref.current;
      const v5 = video5Ref.current;

      const diff = targetProgressRef.current - displayProgressRef.current;

      if (Math.abs(diff) > 0.0001) {
        displayProgressRef.current += diff * 0.08;
        const currentProg = Math.max(0, Math.min(4, displayProgressRef.current));

        // Sync video playback frame to page progress
        syncVideoTime(v1, Math.max(0, Math.min(1, currentProg)));
        syncVideoTime(v2, Math.max(0, Math.min(1, currentProg - 1)));
        syncVideoTime(v3, Math.max(0, Math.min(1, currentProg - 2)));
        syncVideoTime(v4, Math.max(0, Math.min(1, currentProg - 3)));
        syncVideoTime(v5, Math.max(0, Math.min(1, currentProg - 3)));

        if (Math.abs(currentProg - lastProgress) > 0.001) {
          lastProgress = currentProg;
          setProgress(currentProg);
        }
      }

      rafIdRef.current = requestAnimationFrame(updateVideoTimes);
    };

    rafIdRef.current = requestAnimationFrame(updateVideoTimes);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Smooth mouse cursor tracking, horizontal mouse drag scrubbing, and mouse wheel navigation
  useEffect(() => {
    let pendingCursor = { x: -1000, y: -1000 };
    let cursorScheduled = false;

    const handleMouseMove = (e: MouseEvent) => {
      pendingCursor = { x: e.clientX, y: e.clientY };
      if (!cursorScheduled) {
        cursorScheduled = true;
        requestAnimationFrame(() => {
          setCursorPos(pendingCursor);
          cursorScheduled = false;
        });
      }

      const currentX = e.clientX;
      if (prevXRef.current === null) {
        prevXRef.current = currentX;
        return;
      }

      const delta = currentX - prevXRef.current;
      prevXRef.current = currentX;

      const SENSITIVITY = 0.35;
      const progressOffset = (delta / window.innerWidth) * SENSITIVITY;
      let newTarget = targetProgressRef.current + progressOffset;
      newTarget = Math.max(0, Math.min(4, newTarget));
      targetProgressRef.current = newTarget;
    };

    const handleWheel = (e: WheelEvent) => {
      const delta = e.deltaY;
      const SENSITIVITY = 0.0004;
      let newTarget = targetProgressRef.current + delta * SENSITIVITY;
      newTarget = Math.max(0, Math.min(4, newTarget));
      targetProgressRef.current = newTarget;
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const goToPage = (pageIndex: number) => {
    targetProgressRef.current = Math.max(0, Math.min(4, pageIndex));
  };

  // Cubic smoothstep for seamless, dip-free video crossfading
  const smoothstep = (min: number, max: number, value: number) => {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  };

  // Top-layer video crossfades over solid base to prevent any visual cuts or background dips
  const v1Opacity = 1;
  const v2Opacity = smoothstep(0.2, 0.8, progress);
  const v3Opacity = smoothstep(1.2, 1.8, progress);
  const v4Opacity = smoothstep(2.2, 2.8, progress);
  const v5Opacity = smoothstep(3.2, 3.8, progress);

  // Section UI opacities & translations aligned 1:1 with each page keyframe
  const s1Opacity = Math.max(0, Math.min(1, 1 - (progress - 0.2) / 0.4));
  const s1TranslateY = (1 - s1Opacity) * -30;

  const s2Opacity =
    progress <= 1.2
      ? Math.max(0, Math.min(1, (progress - 0.4) / 0.4))
      : Math.max(0, Math.min(1, 1 - (progress - 1.2) / 0.4));
  const s2TranslateY = (1 - s2Opacity) * 30;

  const s3Opacity =
    progress <= 2.2
      ? Math.max(0, Math.min(1, (progress - 1.4) / 0.4))
      : Math.max(0, Math.min(1, 1 - (progress - 2.2) / 0.4));
  const s3TranslateY = (1 - s3Opacity) * 30;

  const s4Opacity =
    progress <= 3.2
      ? Math.max(0, Math.min(1, (progress - 2.4) / 0.4))
      : Math.max(0, Math.min(1, 1 - (progress - 3.2) / 0.4));
  const s4TranslateY = (1 - s4Opacity) * 30;

  const s5Opacity = Math.max(0, Math.min(1, (progress - 3.4) / 0.4));
  const s5TranslateY = (1 - s5Opacity) * 30;

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col justify-between text-white select-none">
      {/* Background Video 1 - Page 1 (Base Layer) */}
      <video
        ref={video1Ref}
        src="https://video.zig.ht/api/videos/file/1785065836696-560438717.mp4"
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ objectPosition: '70% center', opacity: v1Opacity, zIndex: 1 }}
      />

      {/* Background Video 2 - Page 2 */}
      <video
        ref={video2Ref}
        src="https://video.zig.ht/api/videos/file/1785066393791-534727429.mp4"
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ objectPosition: '70% center', opacity: v2Opacity, zIndex: 2 }}
      />

      {/* Background Video 3 - Page 3 */}
      <video
        ref={video3Ref}
        src="https://video.zig.ht/api/videos/file/1785067607151-280169606.mp4"
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ objectPosition: '70% center', opacity: v3Opacity, zIndex: 3 }}
      />

      {/* Background Video 4 - Page 4 */}
      <video
        ref={video4Ref}
        src="https://video.zig.ht/api/videos/file/1785069516662-847863123.mp4"
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ objectPosition: '70% center', opacity: v4Opacity, zIndex: 4 }}
      />

      {/* Background Video 5 - Page 5 */}
      <video
        ref={video5Ref}
        src="https://video.zig.ht/api/videos/file/1785070303591-734667469.mp4"
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ objectPosition: '70% center', opacity: v5Opacity, zIndex: 5 }}
      />

      {/* Subtle Radial Gradient Cursor Glow for Liquid Glass Aesthetic */}
      <div
        className="fixed inset-0 z-10 pointer-events-none transition-opacity duration-300 ease-out"
        style={{
          background: `radial-gradient(600px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03) 40%, transparent 80%)`,
        }}
      />

      {/* Navigation Header */}
      <header className="relative z-20 flex items-center justify-between px-5 pt-6 sm:px-8 sm:pt-8 md:px-16 lg:px-20">
        {/* Left: Custom SVG Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => goToPage(0)}
        >
          <svg
            viewBox="0 0 256 256"
            className="w-8 h-8 md:w-[36px] md:h-[36px] fill-white"
            aria-label="Vibrant Wellness Logo"
          >
            <path d="M 128 128 C 198.692 128 256 185.308 256 256 L 151.883 256 C 149.812 220.307 120.213 192 84 192 C 47.787 192 18.188 220.307 16.117 256 L 0 256 C 0 185.308 57.308 128 128 128 Z M 104.117 0 C 106.188 35.694 135.787 64 172 64 C 208.213 64 237.812 35.694 239.883 0 L 256 0 C 256 70.692 198.692 128 128 128 C 57.308 128 0 70.692 0 0 Z" />
          </svg>
        </div>

        {/* Center: Desktop Nav Pill */}
        <nav className="hidden md:flex items-center gap-8 liquid-glass rounded-full px-8 py-3">
          <button
            onClick={() => goToPage(0)}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              progress < 0.7 ? 'text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => goToPage(1)}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              progress >= 0.7 && progress < 1.7 ? 'text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            Our Approach
          </button>
          <button
            onClick={() => goToPage(2)}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              progress >= 1.7 && progress < 2.7 ? 'text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            Healing Methods
          </button>
          <button
            onClick={() => goToPage(3)}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              progress >= 2.7 && progress < 3.7 ? 'text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            Inner Sanctuary
          </button>
          <button
            onClick={() => goToPage(4)}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              progress >= 3.7 ? 'text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            Eternal Vitality
          </button>
        </nav>

        {/* Right Actions: Audio Soundscape, Reserve Session & Profile */}
        <div className="hidden md:flex items-center gap-3">
          <AudioSoundscape currentFreq={currentFreq} onFreqChange={(f) => setCurrentFreq(f)} />

          <button
            onClick={() => setBookingOpen(true)}
            className="liquid-glass rounded-full px-4 py-2 text-xs font-medium text-white hover:bg-white/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-white/90" />
            <span>Reserve Session</span>
          </button>

          <div
            onClick={() => setBookingOpen(true)}
            className="flex items-center justify-center h-10 w-10 rounded-full liquid-glass cursor-pointer hover:bg-white/20 transition"
            title="Account & Sanctuary Reservations"
          >
            <CircleUserRound className="h-5 w-5 text-white/80" strokeWidth={1.5} />
          </div>
        </div>

        {/* Mobile Right Bar: Audio + Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <AudioSoundscape currentFreq={currentFreq} onFreqChange={(f) => setCurrentFreq(f)} />

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            className="relative h-10 w-10 rounded-full liquid-glass z-50 flex items-center justify-center cursor-pointer focus:outline-none"
          >
            <Menu
              className={`absolute h-5 w-5 text-white transition-all duration-300 ${
                menuOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <X
              className={`absolute h-5 w-5 text-white transition-all duration-300 ${
                menuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl md:hidden transition-all duration-500 ease-out ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`flex flex-col items-center gap-8 transition-transform duration-500 ease-out ${
            menuOpen ? 'translate-y-0' : '-translate-y-8'
          }`}
        >
          <button
            onClick={() => {
              goToPage(0);
              setMenuOpen(false);
            }}
            className="text-white text-2xl font-medium"
          >
            Home
          </button>
          <button
            onClick={() => {
              goToPage(1);
              setMenuOpen(false);
            }}
            className="text-white/80 hover:text-white text-2xl font-medium"
          >
            Our Approach
          </button>
          <button
            onClick={() => {
              goToPage(2);
              setMenuOpen(false);
            }}
            className="text-white/80 hover:text-white text-2xl font-medium"
          >
            Healing Methods
          </button>
          <button
            onClick={() => {
              goToPage(3);
              setMenuOpen(false);
            }}
            className="text-white/80 hover:text-white text-2xl font-medium"
          >
            Inner Sanctuary
          </button>
          <button
            onClick={() => {
              goToPage(4);
              setMenuOpen(false);
            }}
            className="text-white/80 hover:text-white text-2xl font-medium"
          >
            Eternal Vitality
          </button>

          <div className="flex items-center gap-3 mt-4">
            <div className="h-10 w-10 rounded-full liquid-glass flex items-center justify-center">
              <CircleUserRound className="h-5 w-5 text-white/80" strokeWidth={1.5} />
            </div>
            <span className="text-sm font-light text-white/60">Account</span>
          </div>
        </div>
      </div>

      {/* Main Content Container with Overlapping Sections */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-5 pb-8 sm:px-8 sm:pb-10 md:px-16 md:pb-12 lg:px-20 lg:pb-16 pointer-events-none">
        {/* SECTION 1: HERO HOME */}
        <main
          style={{
            opacity: menuOpen ? 0 : s1Opacity,
            transform: `translateY(${s1TranslateY}px)`,
          }}
          className="absolute inset-x-5 bottom-8 sm:inset-x-8 sm:bottom-10 md:inset-x-16 md:bottom-12 lg:inset-x-20 lg:bottom-16 top-0 flex flex-col justify-between transition-transform duration-75 ease-out pointer-events-auto"
        >
          {/* Top Hero Block */}
          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            animate={s1Opacity > 0.3 ? "visible" : "hidden"}
            className="mt-14 sm:mt-20 md:mt-28 max-w-2xl"
          >
            {/* Badge */}
            <motion.div
              variants={textItemVariants}
              className="liquid-glass rounded-full inline-flex items-center gap-2.5 sm:gap-3 px-3 py-1.5 sm:px-4 sm:py-2 mb-5 sm:mb-6"
            >
              <div className="flex -space-x-2">
                <img
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Community member"
                  className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 border-white/20 object-cover"
                />
                <img
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Community member"
                  className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 border-white/20 object-cover"
                />
                <img
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Community member"
                  className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 border-white/20 object-cover"
                />
                <img
                  src="https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Community member"
                  className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 border-white/20 object-cover"
                />
              </div>
              <span className="text-xs sm:text-sm font-light text-white/80">
                our path to natural wellness
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={textItemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] text-white tracking-[-0.05em]"
            >
              Heal Your Body
              <br />
              Naturally
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={textItemVariants}
              className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg font-light text-white/70"
            >
              Holistic wellness. Transformative results.
            </motion.p>

            {/* CTA Button */}
            <motion.button
              variants={textItemVariants}
              onClick={() => goToPage(1)}
              className="liquid-glass rounded-full px-6 py-3 sm:px-7 sm:py-3.5 mt-6 sm:mt-8 text-sm font-medium text-white transition duration-300 hover:bg-white/10 cursor-pointer focus:outline-none"
            >
              Begin Your Journey
            </motion.button>
          </motion.div>

          {/* Bottom Stats */}
          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            animate={s1Opacity > 0.3 ? "visible" : "hidden"}
            className="flex items-end gap-6 sm:gap-10 md:gap-16"
          >
            {/* Stat 1 */}
            <motion.div variants={textItemVariants} className="flex flex-col gap-1.5">
              <div className="relative w-5 h-5 mb-1">
                <span className="absolute w-[2.5px] h-[2.5px] bg-white/60 top-[1px] left-[8.75px]" />
                <span className="absolute w-[2.5px] h-[2.5px] bg-white/60 top-[8.5px] left-[4px]" />
                <span className="absolute w-[2.5px] h-[2.5px] bg-white/60 top-[8.5px] left-[8.75px]" />
                <span className="absolute w-[2.5px] h-[2.5px] bg-white/60 top-[8.5px] left-[13.5px]" />
                <span className="absolute w-[2.5px] h-[2.5px] bg-white/60 top-[16px] left-[0px]" />
                <span className="absolute w-[2.5px] h-[2.5px] bg-white/60 top-[16px] left-[4.375px]" />
                <span className="absolute w-[2.5px] h-[2.5px] bg-white/60 top-[16px] left-[8.75px]" />
                <span className="absolute w-[2.5px] h-[2.5px] bg-white/60 top-[16px] left-[13.125px]" />
                <span className="absolute w-[2.5px] h-[2.5px] bg-white/60 top-[16px] left-[17.5px]" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-normal text-white">
                48 Hours
              </div>
              <div className="text-xs sm:text-sm font-light text-white/60">
                Initial Consultation
              </div>
            </motion.div>

            {/* Stat 2 */}
            <motion.div variants={textItemVariants} className="flex flex-col gap-1.5">
              <div className="grid grid-cols-3 gap-[2px] w-5 h-5 mb-1">
                <span className="w-full h-full bg-white/60 rounded-[1px]" />
                <span className="w-full h-full bg-white/0 rounded-[1px]" />
                <span className="w-full h-full bg-white/60 rounded-[1px]" />
                <span className="w-full h-full bg-white/0 rounded-[1px]" />
                <span className="w-full h-full bg-white/60 rounded-[1px]" />
                <span className="w-full h-full bg-white/0 rounded-[1px]" />
                <span className="w-full h-full bg-white/60 rounded-[1px]" />
                <span className="w-full h-full bg-white/0 rounded-[1px]" />
                <span className="w-full h-full bg-white/60 rounded-[1px]" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-normal text-white">
                100% Bio-Aligned
              </div>
              <div className="text-xs sm:text-sm font-light text-white/60">
                Healing Sessions
              </div>
            </motion.div>
          </motion.div>
        </main>

        {/* SECTION 2: OUR APPROACH / TRANSFORMATIVE HEALING (VERTICAL TABS) */}
        <main
          style={{
            opacity: menuOpen ? 0 : s2Opacity,
            transform: `translateY(${s2TranslateY}px)`,
          }}
          className={`absolute inset-x-5 bottom-4 sm:inset-x-8 sm:bottom-6 md:inset-x-16 md:bottom-8 lg:inset-x-20 lg:bottom-10 top-16 sm:top-20 md:top-24 flex flex-col justify-center overflow-y-auto transition-transform duration-75 ease-out ${
            s2Opacity > 0.1 ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <div className="w-full my-auto">
            <VerticalTabs />
          </div>
        </main>

        {/* SECTION 3: HEALING METHODS (PAGE 3 - TESTIMONIALS) */}
        <main
          style={{
            opacity: menuOpen ? 0 : s3Opacity,
            transform: `translateY(${s3TranslateY}px)`,
          }}
          className={`absolute inset-x-5 bottom-4 sm:inset-x-8 sm:bottom-6 md:inset-x-16 md:bottom-8 lg:inset-x-20 lg:bottom-10 top-16 sm:top-20 md:top-24 flex flex-col justify-center overflow-y-auto transition-transform duration-75 ease-out ${
            s3Opacity > 0.1 ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <div className="w-full my-auto">
            <Testimonials />
          </div>
        </main>

        {/* SECTION 4: INNER SANCTUARY (PAGE 4) */}
        <main
          style={{
            opacity: menuOpen ? 0 : s4Opacity,
            transform: `translateY(${s4TranslateY}px)`,
          }}
          className={`absolute inset-x-5 bottom-8 sm:inset-x-8 sm:bottom-10 md:inset-x-16 md:bottom-12 lg:inset-x-20 lg:bottom-16 top-0 flex flex-col justify-between transition-transform duration-75 ease-out ${
            s4Opacity > 0.1 ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          {/* Top Section 4 Block */}
          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            animate={s4Opacity > 0.3 ? "visible" : "hidden"}
            className="mt-14 sm:mt-20 md:mt-28 max-w-2xl"
          >
            {/* Badge */}
            <motion.div
              variants={textItemVariants}
              className="liquid-glass rounded-full inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mb-5 sm:mb-6"
            >
              <Sun className="w-4 h-4 text-white/80" />
              <span className="text-xs sm:text-sm font-light text-white/80">
                transcendent vitality & inner peace
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              variants={textItemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] text-white tracking-[-0.05em]"
            >
              Experience Pure
              <br />
              Illumination
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              variants={textItemVariants}
              className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg font-light text-white/70"
            >
              Step into an immersive aura of stillness, deep presence, and effortless rejuvenation.
            </motion.p>

            {/* CTA Button */}
            <motion.button
              variants={textItemVariants}
              onClick={() => goToPage(4)}
              className="liquid-glass rounded-full px-6 py-3 sm:px-7 sm:py-3.5 mt-6 sm:mt-8 text-sm font-medium text-white transition duration-300 hover:bg-white/10 cursor-pointer focus:outline-none"
            >
              Explore Eternal Vitality
            </motion.button>
          </motion.div>

          {/* Bottom Section 4 Stats / Highlights */}
          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            animate={s4Opacity > 0.3 ? "visible" : "hidden"}
            className="flex items-end gap-6 sm:gap-10 md:gap-16"
          >
            <motion.div variants={textItemVariants} className="flex flex-col gap-1.5">
              <Compass className="w-5 h-5 text-white/70 mb-1" />
              <div className="text-xl sm:text-2xl md:text-3xl font-normal text-white">
                50,000+
              </div>
              <div className="text-xs sm:text-sm font-light text-white/60">
                Transformations
              </div>
            </motion.div>

            <motion.div variants={textItemVariants} className="flex flex-col gap-1.5">
              <div className="text-xl sm:text-2xl md:text-3xl font-normal text-white">
                Infinite
              </div>
              <div className="text-xs sm:text-sm font-light text-white/60">
                Cellular Harmony
              </div>
            </motion.div>
          </motion.div>
        </main>

        {/* SECTION 5: ETERNAL VITALITY (PAGE 5) */}
        <main
          style={{
            opacity: menuOpen ? 0 : s5Opacity,
            transform: `translateY(${s5TranslateY}px)`,
          }}
          className={`absolute inset-x-5 bottom-8 sm:inset-x-8 sm:bottom-10 md:inset-x-16 md:bottom-12 lg:inset-x-20 lg:bottom-16 top-0 flex flex-col justify-between transition-transform duration-75 ease-out ${
            s5Opacity > 0.1 ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          {/* Top Section 5 Block */}
          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            animate={s5Opacity > 0.3 ? "visible" : "hidden"}
            className="mt-14 sm:mt-20 md:mt-28 max-w-2xl"
          >
            {/* Badge */}
            <motion.div
              variants={textItemVariants}
              className="liquid-glass rounded-full inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mb-5 sm:mb-6"
            >
              <Infinity className="w-4 h-4 text-white/80" />
              <span className="text-xs sm:text-sm font-light text-white/80">
                infinite holistic resonance & mastery
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              variants={textItemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] text-white tracking-[-0.05em]"
            >
              Embrace Eternal
              <br />
              Vitality & Harmony
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              variants={textItemVariants}
              className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg font-light text-white/70"
            >
              Experience the ultimate synthesis of bio-energetic wisdom, deep resonance, and holistic mastery.
            </motion.p>

            {/* CTA Button */}
            <motion.button
              variants={textItemVariants}
              onClick={() => goToPage(0)}
              className="liquid-glass rounded-full px-6 py-3 sm:px-7 sm:py-3.5 mt-6 sm:mt-8 text-sm font-medium text-white transition duration-300 hover:bg-white/10 cursor-pointer focus:outline-none"
            >
              Back to Overview
            </motion.button>
          </motion.div>

          {/* Bottom Section 5 Stats / Highlights */}
          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            animate={s5Opacity > 0.3 ? "visible" : "hidden"}
            className="flex items-end gap-6 sm:gap-10 md:gap-16"
          >
            <motion.div variants={textItemVariants} className="flex flex-col gap-1.5">
              <Waves className="w-5 h-5 text-white/70 mb-1" />
              <div className="text-xl sm:text-2xl md:text-3xl font-normal text-white">
                100%
              </div>
              <div className="text-xs sm:text-sm font-light text-white/60">
                Bio-Aligned Sync
              </div>
            </motion.div>

            <motion.div variants={textItemVariants} className="flex flex-col gap-1.5">
              <div className="text-xl sm:text-2xl md:text-3xl font-normal text-white">
                Conscious
              </div>
              <div className="text-xs sm:text-sm font-light text-white/60">
                Holistic Equilibrium
              </div>
            </motion.div>
          </motion.div>
        </main>

        {/* Sanctuary Booking Modal */}
        <BookingModal
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
          selectedFreq={currentFreq}
        />
      </div>
    </div>
  );
}

