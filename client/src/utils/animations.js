import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Page Transitions
export const pageTransition = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

// Stagger Children Animation
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Fade Up Animation
export const fadeUpAnimation = {
  initial: {
    y: 60,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

// Scale Animation
export const scaleAnimation = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

// GSAP Animations
export const initScrollAnimations = () => {
  // Fade in elements on scroll
  gsap.utils.toArray('.scroll-fade-in').forEach(element => {
    gsap.from(element, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: element,
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // Scale elements on scroll
  gsap.utils.toArray('.scroll-scale').forEach(element => {
    gsap.from(element, {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: element,
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // Parallax effect
  gsap.utils.toArray('.parallax').forEach(element => {
    gsap.to(element, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
};

// Modal Animations
export const modalAnimation = {
  initial: { scale: 0.95, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

// Button Hover Animation
export const buttonHoverAnimation = {
  scale: 1.05,
  transition: {
    duration: 0.2,
    ease: 'easeInOut',
  },
};

// Card Hover Animation
export const cardHoverAnimation = {
  y: -10,
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  transition: {
    duration: 0.2,
    ease: 'easeInOut',
  },
};

// Loading Animation
export const loadingAnimation = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Notification Animation
export const notificationAnimation = {
  initial: { x: 100, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    x: 100,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

// Tab Switch Animation
export const tabSwitchAnimation = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

// Menu Animation
export const menuAnimation = {
  open: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

// Image Hover Animation
export const imageHoverAnimation = {
  scale: 1.1,
  filter: 'brightness(1.1)',
  transition: {
    duration: 0.3,
    ease: 'easeOut',
  },
};

// List Item Animation
export const listItemAnimation = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// Dropdown Animation
export const dropdownAnimation = {
  hidden: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};