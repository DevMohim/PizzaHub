"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

const MotionLink = motion.create(Link);

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const Banner = () => {
  const reduce = useReducedMotion();

  // Reduced motion চালু থাকলে animation ছাড়াই content দেখাবে
  const variants = reduce ? undefined : container;
  const itemVariants = reduce ? undefined : fadeUp;

  return (
    <section className="banner" aria-label="PizzaHub hero banner">
      <div className="banner-inner">
        <motion.div
          className="banner-content"
          variants={variants}
          initial={reduce ? false : "hidden"}
          animate="visible"
        >
          <motion.span className="banner-eyebrow" variants={itemVariants}>
            🔥 Fresh from the oven
          </motion.span>

          <motion.h1 className="banner-title" variants={itemVariants}>
            Hot &amp; Fresh Pizza,{" "}
            <span className="gradient-text">Delivered Fast</span>
          </motion.h1>

          <motion.p className="banner-desc" variants={itemVariants}>
            Discover top-rated local pizzerias, customize your favorite slices
            and get them delivered hot to your door — all in one place.
          </motion.p>

          <motion.div className="banner-actions" variants={itemVariants}>
            <MotionLink
              href="/browse-menu"
              className="btn-primary banner-cta"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore Pizza Menu
              <ArrowRight className="banner-cta-icon" aria-hidden="true" />
            </MotionLink>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;
