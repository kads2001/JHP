// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Lenis Smooth Scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.5,
});

// Synchronize Lenis with GSAP ScrollTrigger
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Window resize sync
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
  lenis.resize();
});

// 2. Select Elements
const bgSlides = gsap.utils.toArray(".bg-slide");
const bgImages = gsap.utils.toArray(".bg-image");
const cards = gsap.utils.toArray(".content-card");
const dots = gsap.utils.toArray(".hud-pagination .dot");
const activeIndexEl = document.querySelector(".active-index");
const totalIndexEl = document.querySelector(".total-index");

const totalSlides = bgSlides.length;

if (totalIndexEl) {
  totalIndexEl.textContent = totalSlides.toString().padStart(2, "0");
}

// 3. Responsive Animations via gsap.matchMedia
const mm = gsap.matchMedia();

// -------------------------------------------------------------
// DESKTOP & TABLET (Width >= 768px)
// -------------------------------------------------------------
mm.add("(min-width: 768px)", () => {
  // Initial States
  bgSlides.forEach((slide, i) => {
    gsap.set(slide, { opacity: i === 0 ? 1 : 0 });
  });

  bgImages.forEach((img) => {
    gsap.set(img, { yPercent: 0, scale: 1.38 });
  });

  cards.forEach((card) => {
    gsap.set(card, {
      opacity: 0,
      y: 60,
      width: "100%",
      pointerEvents: "none",
    });
  });

  dots.forEach((dot, i) => {
    gsap.set(dot, {
      width: i === 0 ? 28 : 8,
      backgroundColor: i === 0 ? "#ffffff" : "rgba(255, 255, 255, 0.35)",
    });
  });

  if (activeIndexEl) activeIndexEl.textContent = "01";

  // Master Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".slider-section",
      start: "top top",
      end: () => `+=${totalSlides * 260}%`,
      pin: true,
      scrub: 1.2,
      anticipatePin: 1,
    },
  });

  for (let i = 0; i < totalSlides; i++) {
    const currentBgSlide = bgSlides[i];
    const currentBgImage = bgImages[i];
    const currentCard = cards[i];
    const currentDot = dots[i];

    // STEP 1: Camera Pan Down
    tl.to(currentBgImage, {
      yPercent: -20,
      duration: 1.4,
      ease: "power1.inOut",
    });

    // STEP 2: Card fade up + Background Zoom Out
    tl.to(currentCard, {
      opacity: 1,
      y: 0,
      width: "100%",
      pointerEvents: "auto",
      duration: 1.0,
      ease: "power2.out",
    });

    tl.to(
      currentBgImage,
      {
        scale: 1.0,
        duration: 1.0,
        ease: "power2.out",
      },
      "<"
    );

    // Reading Pause
    tl.to({}, { duration: 0.5 });

    // STEP 3: Card Expand & Fade Out + Crossfade to Next Slide
    if (i < totalSlides - 1) {
      const nextBgSlide = bgSlides[i + 1];
      const nextBgImage = bgImages[i + 1];
      const nextDot = dots[i + 1];

      tl.to(currentCard, {
        opacity: 0,
        y: -20,
        width: "135%",
        pointerEvents: "none",
        duration: 0.75,
        ease: "power2.inOut",
      });

      tl.to(
        nextBgSlide,
        {
          opacity: 1,
          duration: 0.9,
          ease: "power1.inOut",
        },
        "<"
      );

      tl.to(
        currentBgSlide,
        {
          opacity: 0,
          duration: 0.9,
          ease: "power1.inOut",
        },
        "<"
      );

      tl.set(nextBgImage, { yPercent: 0, scale: 1.38 }, "<");

      if (currentDot && nextDot) {
        tl.to(
          currentDot,
          {
            width: 8,
            backgroundColor: "rgba(255, 255, 255, 0.35)",
            duration: 0.4,
            ease: "power2.out",
          },
          "<"
        );
        tl.to(
          nextDot,
          {
            width: 28,
            backgroundColor: "#ffffff",
            duration: 0.4,
            ease: "power2.out",
          },
          "<"
        );
      }

      tl.call(
        () => {
          const num = (i + 2).toString().padStart(2, "0");
          if (activeIndexEl) activeIndexEl.textContent = num;
        },
        null,
        "<+=0.2"
      );
    }
  }
});

// -------------------------------------------------------------
// MOBILE DEVICES (Width < 768px)
// -------------------------------------------------------------
mm.add("(max-width: 767px)", () => {
  // Initial States
  bgSlides.forEach((slide, i) => {
    gsap.set(slide, { opacity: i === 0 ? 1 : 0 });
  });

  bgImages.forEach((img) => {
    gsap.set(img, { yPercent: 0, scale: 1.25 });
  });

  cards.forEach((card) => {
    gsap.set(card, {
      opacity: 0,
      y: 40,
      width: "100%",
      pointerEvents: "none",
    });
  });

  dots.forEach((dot, i) => {
    gsap.set(dot, {
      width: i === 0 ? 22 : 6,
      backgroundColor: i === 0 ? "#ffffff" : "rgba(255, 255, 255, 0.35)",
    });
  });

  if (activeIndexEl) activeIndexEl.textContent = "01";

  // Master Timeline for Mobile
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".slider-section",
      start: "top top",
      end: () => `+=${totalSlides * 200}%`,
      pin: true,
      scrub: 1.0,
      anticipatePin: 1,
    },
  });

  for (let i = 0; i < totalSlides; i++) {
    const currentBgSlide = bgSlides[i];
    const currentBgImage = bgImages[i];
    const currentCard = cards[i];
    const currentDot = dots[i];

    // STEP 1: Gentle Pan Down
    tl.to(currentBgImage, {
      yPercent: -12,
      duration: 1.2,
      ease: "power1.inOut",
    });

    // STEP 2: Card Fade Up + Background Zoom Out
    tl.to(currentCard, {
      opacity: 1,
      y: 0,
      pointerEvents: "auto",
      duration: 0.9,
      ease: "power2.out",
    });

    tl.to(
      currentBgImage,
      {
        scale: 1.0,
        duration: 0.9,
        ease: "power2.out",
      },
      "<"
    );

    // Reading Pause
    tl.to({}, { duration: 0.4 });

    // STEP 3: Exit transition (Vertical fade without horizontal overflow)
    if (i < totalSlides - 1) {
      const nextBgSlide = bgSlides[i + 1];
      const nextBgImage = bgImages[i + 1];
      const nextDot = dots[i + 1];

      tl.to(currentCard, {
        opacity: 0,
        y: -24,
        pointerEvents: "none",
        duration: 0.65,
        ease: "power2.inOut",
      });

      tl.to(
        nextBgSlide,
        {
          opacity: 1,
          duration: 0.8,
          ease: "power1.inOut",
        },
        "<"
      );

      tl.to(
        currentBgSlide,
        {
          opacity: 0,
          duration: 0.8,
          ease: "power1.inOut",
        },
        "<"
      );

      tl.set(nextBgImage, { yPercent: 0, scale: 1.25 }, "<");

      if (currentDot && nextDot) {
        tl.to(
          currentDot,
          {
            width: 6,
            backgroundColor: "rgba(255, 255, 255, 0.35)",
            duration: 0.3,
            ease: "power2.out",
          },
          "<"
        );
        tl.to(
          nextDot,
          {
            width: 22,
            backgroundColor: "#ffffff",
            duration: 0.3,
            ease: "power2.out",
          },
          "<"
        );
      }

      tl.call(
        () => {
          const num = (i + 2).toString().padStart(2, "0");
          if (activeIndexEl) activeIndexEl.textContent = num;
        },
        null,
        "<+=0.2"
      );
    }
  }
});

