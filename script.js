// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, Observer);

// Select DOM Elements
const bgSlides = gsap.utils.toArray(".bg-slide");
const bgImages = gsap.utils.toArray(".bg-image");
const cards = gsap.utils.toArray(".content-card");
const dots = gsap.utils.toArray(".hud-pagination .dot");
const activeIndexEl = document.querySelector(".active-index");

const totalSlides = bgSlides.length;

// Step Management
let currentStep = 0;
let isAnimating = false;

// Total steps calculation
const maxStep = 2 + (totalSlides - 1) * 3;

// Initial Setup
function initSlider() {
  // Set background slide stacking and opacity
  bgSlides.forEach((slide, i) => {
    gsap.set(slide, { opacity: i === 0 ? 1 : 0, zIndex: i + 1 });
  });

  // Slide 1 starts at 1:1 scale
  gsap.set(bgImages[0], { yPercent: 0, scale: 1 });

  // Other slides start with subtle scale for vertical pan
  for (let i = 1; i < totalSlides; i++) {
    gsap.set(bgImages[i], { yPercent: 6, scale: 1.18 });
  }

  // Set all content cards below screen
  cards.forEach((card) => {
    gsap.set(card, {
      opacity: 0,
      y: 160,
      width: "100%",
      pointerEvents: "none",
    });
  });

  updateHUD(1);
}

// Update HUD Indicators (Counter & Dots)
function updateHUD(slideNumber) {
  if (activeIndexEl) {
    activeIndexEl.textContent = slideNumber.toString().padStart(2, "0");
  }

  dots.forEach((dot, idx) => {
    if (idx === slideNumber - 1) {
      gsap.to(dot, { width: 28, backgroundColor: "#ffffff", duration: 0.35 });
    } else {
      gsap.to(dot, { width: 8, backgroundColor: "rgba(255, 255, 255, 0.35)", duration: 0.35 });
    }
  });
}

// Step Transition Controller (One Scroll -> One Step)
function goToStep(targetStep, direction) {
  if (isAnimating) return;
  if (targetStep < 0 || targetStep > maxStep) return;

  isAnimating = true;
  const isForward = direction > 0;
  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onComplete: () => {
      currentStep = targetStep;
      setTimeout(() => {
        isAnimating = false;
      }, 250);
    },
  });

  if (isForward) {
    // ==========================================
    // FORWARD TRANSITIONS (SCROLL DOWN)
    // ==========================================
    switch (targetStep) {
      // SLIDE 1
      case 1:
        // 1st scroll: Text box 1 slides up from bottom
        tl.to(cards[0], {
          y: 0,
          opacity: 1,
          width: "100%",
          pointerEvents: "auto",
          duration: 0.9,
          ease: "power2.out",
        });
        updateHUD(1);
        break;

      case 2:
        // 2nd scroll: Background 1 zooms in proportionally
        tl.to(bgImages[0], {
          scale: 1.18,
          duration: 1.0,
        });
        updateHUD(1);
        break;

      // SLIDE 2
      case 3:
        // 3rd scroll: Card 1 exits, Slide 2 appears (top view, no card)
        tl.to(cards[0], {
          opacity: 0,
          y: -30,
          width: "140%",
          pointerEvents: "none",
          duration: 0.6,
        });
        tl.to(bgSlides[1], { opacity: 1, duration: 0.8 }, "<");
        tl.to(bgSlides[0], { opacity: 0, duration: 0.8 }, "<");
        tl.set(bgImages[1], { yPercent: 6, scale: 1.18 }, "<");
        updateHUD(2);
        break;

      case 4:
        // 4th scroll: Slide 2 pans down to reveal climber
        tl.to(bgImages[1], {
          yPercent: -6,
          duration: 1.1,
        });
        updateHUD(2);
        break;

      case 5:
        // 5th scroll: Card 2 slides up from bottom
        tl.to(cards[1], {
          y: 0,
          opacity: 1,
          width: "100%",
          pointerEvents: "auto",
          duration: 0.9,
          ease: "power2.out",
        });
        updateHUD(2);
        break;

      // SLIDE 3
      case 6:
        // 6th scroll: Card 2 exits, Slide 3 appears (top sunburst view, no card)
        tl.to(cards[1], {
          opacity: 0,
          y: -30,
          width: "140%",
          pointerEvents: "none",
          duration: 0.6,
        });
        tl.to(bgSlides[2], { opacity: 1, duration: 0.8 }, "<");
        tl.to(bgSlides[1], { opacity: 0, duration: 0.8 }, "<");
        tl.set(bgImages[2], { yPercent: 7, scale: 1.20 }, "<");
        updateHUD(3);
        break;

      case 7:
        // 7th scroll: Slide 3 pans down to reveal hammock & feet
        tl.to(bgImages[2], {
          yPercent: -7,
          duration: 1.1,
        });
        updateHUD(3);
        break;

      case 8:
        // 8th scroll: Card 3 slides up from bottom
        tl.to(cards[2], {
          y: 0,
          opacity: 1,
          width: "100%",
          pointerEvents: "auto",
          duration: 0.9,
          ease: "power2.out",
        });
        updateHUD(3);
        break;

      // SLIDE 4
      case 9:
        // 9th scroll: Card 3 exits, Slide 4 appears (top view, no card)
        tl.to(cards[2], {
          opacity: 0,
          y: -30,
          width: "140%",
          pointerEvents: "none",
          duration: 0.6,
        });
        tl.to(bgSlides[3], { opacity: 1, duration: 0.8 }, "<");
        tl.to(bgSlides[2], { opacity: 0, duration: 0.8 }, "<");
        tl.set(bgImages[3], { yPercent: 6, scale: 1.18 }, "<");
        updateHUD(4);
        break;

      case 10:
        // 10th scroll: Slide 4 pans down
        tl.to(bgImages[3], {
          yPercent: -6,
          duration: 1.1,
        });
        updateHUD(4);
        break;

      case 11:
        // 11th scroll: Card 4 slides up from bottom
        tl.to(cards[3], {
          y: 0,
          opacity: 1,
          width: "100%",
          pointerEvents: "auto",
          duration: 0.9,
          ease: "power2.out",
        });
        updateHUD(4);
        break;
    }
  } else {
    // ==========================================
    // BACKWARD TRANSITIONS (SCROLL UP / REVERSE)
    // ==========================================
    switch (currentStep) {
      // SLIDE 1
      case 1:
        // Hide Card 1 back down
        tl.to(cards[0], {
          y: 160,
          opacity: 0,
          width: "100%",
          pointerEvents: "none",
          duration: 0.7,
        });
        updateHUD(1);
        break;

      case 2:
        // Zoom out Image 1 back to normal
        tl.to(bgImages[0], {
          scale: 1,
          duration: 0.8,
        });
        updateHUD(1);
        break;

      // SLIDE 2
      case 3:
        // Back to Slide 1 (Zoomed state with Card 1)
        tl.to(bgSlides[1], { opacity: 0, duration: 0.7 });
        tl.to(bgSlides[0], { opacity: 1, duration: 0.7 }, "<");
        tl.to(cards[0], {
          opacity: 1,
          y: 0,
          width: "100%",
          pointerEvents: "auto",
          duration: 0.7,
        }, "<");
        updateHUD(1);
        break;

      case 4:
        // Pan Image 2 back to top
        tl.to(bgImages[1], {
          yPercent: 6,
          duration: 0.9,
        });
        updateHUD(2);
        break;

      case 5:
        // Hide Card 2 back down
        tl.to(cards[1], {
          y: 160,
          opacity: 0,
          width: "100%",
          pointerEvents: "none",
          duration: 0.7,
        });
        updateHUD(2);
        break;

      // SLIDE 3
      case 6:
        // Back to Slide 2 (Panned state with Card 2)
        tl.to(bgSlides[2], { opacity: 0, duration: 0.7 });
        tl.to(bgSlides[1], { opacity: 1, duration: 0.7 }, "<");
        tl.to(cards[1], {
          opacity: 1,
          y: 0,
          width: "100%",
          pointerEvents: "auto",
          duration: 0.7,
        }, "<");
        updateHUD(2);
        break;

      case 7:
        // Pan Image 3 back to top sunburst
        tl.to(bgImages[2], {
          yPercent: 7,
          duration: 0.9,
        });
        updateHUD(3);
        break;

      case 8:
        // Hide Card 3 back down
        tl.to(cards[2], {
          y: 160,
          opacity: 0,
          width: "100%",
          pointerEvents: "none",
          duration: 0.7,
        });
        updateHUD(3);
        break;

      // SLIDE 4
      case 9:
        // Back to Slide 3 (Panned state with Card 3)
        tl.to(bgSlides[3], { opacity: 0, duration: 0.7 });
        tl.to(bgSlides[2], { opacity: 1, duration: 0.7 }, "<");
        tl.to(cards[2], {
          opacity: 1,
          y: 0,
          width: "100%",
          pointerEvents: "auto",
          duration: 0.7,
        }, "<");
        updateHUD(3);
        break;

      case 10:
        // Pan Image 4 back to top
        tl.to(bgImages[3], {
          yPercent: 6,
          duration: 0.9,
        });
        updateHUD(4);
        break;

      case 11:
        // Hide Card 4 back down
        tl.to(cards[3], {
          y: 160,
          opacity: 0,
          width: "100%",
          pointerEvents: "none",
          duration: 0.7,
        });
        updateHUD(4);
        break;
    }
  }
}

// Initialize on page load
initSlider();

// 6. Direct Input Controller: Scroll Down -> Forward, Scroll Up -> Backward
let touchStartY = 0;

// Mouse Wheel & Trackpad Listener
window.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    if (isAnimating) return;

    if (Math.abs(e.deltaY) < 12) return;

    if (e.deltaY > 0) {
      if (currentStep < maxStep) goToStep(currentStep + 1, 1);
    } else if (e.deltaY < 0) {
      if (currentStep > 0) goToStep(currentStep - 1, -1);
    }
  },
  { passive: false }
);

// Mobile Touch Gestures
window.addEventListener(
  "touchstart",
  (e) => {
    touchStartY = e.touches[0].clientY;
  },
  { passive: true }
);

window.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
  },
  { passive: false }
);

window.addEventListener(
  "touchend",
  (e) => {
    if (isAnimating) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        if (currentStep < maxStep) goToStep(currentStep + 1, 1);
      } else {
        if (currentStep > 0) goToStep(currentStep - 1, -1);
      }
    }
  },
  { passive: true }
);

// Keyboard Navigation Support
window.addEventListener("keydown", (e) => {
  if (isAnimating) return;

  if (["ArrowDown", "PageDown", " "].includes(e.key)) {
    e.preventDefault();
    if (currentStep < maxStep) goToStep(currentStep + 1, 1);
  } else if (["ArrowUp", "PageUp"].includes(e.key)) {
    e.preventDefault();
    if (currentStep > 0) goToStep(currentStep - 1, -1);
  }
});
