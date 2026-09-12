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

// 2. Select Elements
const bgSlides = gsap.utils.toArray(".bg-slide");
const bgImages = gsap.utils.toArray(".bg-image");
const cards = gsap.utils.toArray(".content-card");
const dots = gsap.utils.toArray(".hud-pagination .dot");
const activeIndexEl = document.querySelector(".active-index");

const totalSlides = bgSlides.length;

// 3. Initial Setup
bgSlides.forEach((slide, i) => {
  gsap.set(slide, { opacity: i === 0 ? 1 : 0 });
});

bgImages.forEach((img) => {
  gsap.set(img, { yPercent: 0, scale: 1.40 }); // Starts closer / zoomed in
});

cards.forEach((card) => {
  gsap.set(card, {
    opacity: 0,
    y: 70,
    width: "100%",
    pointerEvents: "none",
  });
});

// 4. Master Timeline pinned on Scroll with smooth scrub
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".slider-section",
    start: "top top",
    end: () => `+=${totalSlides * 300}%`,
    pin: true,
    scrub: 1.2, // Smooth interpolation
    anticipatePin: 1,
  },
});

// 5. Build Smooth 3-Step Sequence for each slide
for (let i = 0; i < totalSlides; i++) {
  const currentBgSlide = bgSlides[i];
  const currentBgImage = bgImages[i];
  const currentCard = cards[i];
  const currentDot = dots[i];

  // STEP 1: Smooth camera pan down from top to bottom of image (zoomed in)
  tl.to(currentBgImage, {
    yPercent: -22,
    duration: 1.4,
    ease: "power1.inOut",
  });

  // STEP 2: Content card fades up at standard width + Background ZOOMS OUT to full wide view
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
      scale: 1.0, // Zoom out from 1.40 to 1.0
      duration: 1.0,
      ease: "power2.out",
    },
    "<"
  );

  // Comfortable pause to view content while scrolling
  tl.to({}, { duration: 0.5 });

  // STEP 3: When card is going -> Increase width on right side while exiting
  if (i < totalSlides - 1) {
    const nextBgSlide = bgSlides[i + 1];
    const nextBgImage = bgImages[i + 1];
    const nextDot = dots[i + 1];

    // Card expands width on the right side as it fades out
    tl.to(currentCard, {
      opacity: 0,
      y: -20,
      width: "140%", // Expands to the right
      pointerEvents: "none",
      duration: 0.7,
      ease: "power2.inOut",
    });

    // Crossfade to next background
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

    // Reset next image starting state (zoomed in at scale: 1.40)
    tl.set(nextBgImage, { yPercent: 0, scale: 1.40 }, "<");

    // Smooth transition for pagination dots
    if (currentDot && nextDot) {
      tl.to(
        currentDot,
        {
          width: 8,
          borderRadius: 50,
          backgroundColor: "rgba(255, 255, 255, 0.35)",
          duration: 0.4,
          ease: "power2.out",
        },
        "<"
      );
      tl.to(
        nextDot,
        {
          width: 26,
          borderRadius: 6,
          backgroundColor: "#38bdf8",
          duration: 0.4,
          ease: "power2.out",
        },
        "<"
      );
    }

    // Update slide counter
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
