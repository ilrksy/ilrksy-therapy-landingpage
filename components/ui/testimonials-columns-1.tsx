"use client";
import React from "react";
import { motion } from "motion/react";

export interface TestimonialItem {
  text: string;
  image: string;
  name: string;
  role: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: TestimonialItem[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-5 pb-5 bg-transparent"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div
                  className="p-6 sm:p-8 rounded-2xl md:rounded-3xl liquid-glass border border-white/20 shadow-xl max-w-xs w-full text-white backdrop-blur-md"
                  key={i}
                >
                  <div className="text-xs sm:text-sm font-light text-white/90 leading-relaxed">
                    "{text}"
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover border border-white/30"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium text-xs sm:text-sm text-white tracking-tight leading-snug">
                        {name}
                      </div>
                      <div className="text-[11px] text-white/60 font-light leading-snug">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

export const testimonialsData: TestimonialItem[] = [
  {
    text: "The bio-energetic sessions completely revitalized my cellular energy. I feel a level of clarity and peace I haven't experienced in years.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    name: "Briana Vance",
    role: "Mindfulness Practitioner",
  },
  {
    text: "Harmonizing my body's resonance brought immediate calm to my nervous system. Highly recommended for modern urban stress.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    name: "Dr. Bilal Ahmed",
    role: "Integrative Specialist",
  },
  {
    text: "The sanctuary experience is pure perfection. Gentle sound frequencies combined with deep rest restored my full vitality.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300",
    name: "Samantha Malik",
    role: "Holistic Health Coach",
  },
  {
    text: "A truly revolutionary approach to energetic equilibrium. The natural frequency alignment completely restored my sleep cycles.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    name: "Omar Raza",
    role: "Wellness Director",
  },
  {
    text: "From my first session, the resonance therapy released years of accumulated physical tension. Extraordinary experience.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
    name: "Zainab Hussain",
    role: "Yoga Instructor",
  },
  {
    text: "Combining cellular bio-resonance with mindful restoration transformed my daily energy and cognitive endurance.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300",
    name: "Aliza Khan",
    role: "Biohacking Researcher",
  },
  {
    text: "The ambient audio frequencies and soothing atmosphere create an unprecedented sanctuary for nervous system recovery.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
    name: "Farhan Siddiqui",
    role: "Acoustic Scientist",
  },
  {
    text: "Exceptional care and subtle energy work. My vitality levels increased dramatically after just three sessions.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=300",
    name: "Sana Sheikh",
    role: "Movement Therapist",
  },
  {
    text: "An indispensable ritual for anyone seeking peak performance through deep energetic balance and mindfulness.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
    name: "Hassan Ali",
    role: "Executive Performance Coach",
  },
];

const firstColumn = testimonialsData.slice(0, 3);
const secondColumn = testimonialsData.slice(3, 6);
const thirdColumn = testimonialsData.slice(6, 9);

export const Testimonials = () => {
  return (
    <section className="bg-transparent relative w-full my-2 sm:my-4">
      <div className="container z-10 mx-auto px-2 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="relative z-20 flex flex-col items-center justify-center max-w-[540px] mx-auto text-center pb-2"
        >
          <div className="liquid-glass rounded-full inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 mb-3 border border-white/20">
            <span className="text-xs font-light text-white/90">Testimonials</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-white drop-shadow-md">
            Voices of Resonance
          </h2>
          <p className="text-center mt-2 text-xs sm:text-sm font-light text-white/70 max-w-sm drop-shadow">
            Discover how bio-energetic therapy and frequency alignment have restored vitality.
          </p>
        </motion.div>

        <div className="relative z-10 flex justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)] max-h-[380px] sm:max-h-[460px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
