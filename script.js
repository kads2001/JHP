// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, Observer);

// Select DOM Elements
const bgSlides = gsap.utils.toArray(".bg-slide");
const bgImages = gsap.utils.toArray(".bg-img");
const cards = gsap.utils.toArray(".content-card");
const dots = gsap.utils.toArray(".hud-pagination .dot");
const activeIndexEl = document.querySelector(".active-index");

const totalSlides = bgSlides.length;

// Step Management (3 steps per slide matching the 12-frame flow)
let currentStep = 0;
let isAnimating = false;

// Total steps = 11 steps for 4 slides
const maxStep = totalSlides * 3 - 1;

// Helper: Proper Full-Screen Bottom-to-Top Card Entrance
function animateCardIn(card, tl) {
  const elements = card.querySelectorAll(".card-tag, .card-title, .card-description");
  
  // Card starts completely off-screen below the bottom viewport edge (75vh)
  tl.fromTo(
    card,
    { y: "75vh", opacity: 0, scale: 0.98 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.85,
      ease: "power3.out",
      pointerEvents: "auto",
    }
  );

  // Staggered text reveal as it lands in place
  tl.fromTo(
    elements,
    { y: 24, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.65,
      stagger: 0.08,
      ease: "power2.out",
    },
    "<+=0.2"
  );
}

// Helper: Card Exit
function animateCardOut(card, tl) {
  const elements = card.querySelectorAll(".card-tag, .card-title, .card-description");

  tl.to(elements, {
    y: -14,
    opacity: 0,
    duration: 0.3,
    stagger: 0.03,
    ease: "power2.in",
  });

  tl.to(
    card,
    {
      opacity: 0,
      y: -28,
      pointerEvents: "none",
      duration: 0.55,
      ease: "power2.inOut",
    },
    "<+=0.06"
  );
}

// Initial Setup
function initSlider() {
  bgSlides.forEach((slide, i) => {
    gsap.set(slide, { opacity: i === 0 ? 1 : 0, zIndex: i + 1 });
  });

  // All images start at top portion (yPercent: 0)
  bgImages.forEach((img) => {
    gsap.set(img, { yPercent: 0, scale: 1 });
  });

  // All cards start completely off-screen below the bottom (75vh)
  cards.forEach((card) => {
    const elements = card.querySelectorAll(".card-tag, .card-title, .card-description");
    gsap.set(card, {
      opacity: 0,
      y: "75vh",
      scale: 0.98,
      pointerEvents: "none",
    });
    gsap.set(elements, { opacity: 0, y: 24 });
  });

  updateHUD(1);
}

// Update HUD Indicators
function updateHUD(slideNumber) {
  if (activeIndexEl) {
    activeIndexEl.textContent = slideNumber.toString().padStart(2, "0");
  }

  dots.forEach((dot, idx) => {
    if (idx === slideNumber - 1) {
      gsap.to(dot, { width: 28, backgroundColor: "#ffffff", duration: 0.35, ease: "power3.out" });
    } else {
      gsap.to(dot, { width: 8, backgroundColor: "rgba(255, 255, 255, 0.35)", duration: 0.35, ease: "power3.out" });
    }
  });
}

// Master Step Controller Matching Exact 12-Frame Filmstrip Flow
function goToStep(targetStep, direction) {
  if (isAnimating) return;
  if (targetStep < 0 || targetStep > maxStep) return;

  isAnimating = true;
  const isForward = direction > 0;
  const tl = gsap.timeline({
    onComplete: () => {
      currentStep = targetStep;
      setTimeout(() => {
        isAnimating = false;
      }, 70);
    },
  });

  if (isForward) {
    // ==========================================
    // FORWARD TRANSITIONS (SCROLL DOWN)
    // ==========================================
    switch (targetStep) {
      // ----------------- SLIDE 1 (Frames 1-3) -----------------
      case 1:
        // Frame 2: Slide 1 zooms in on scroll
        tl.to(bgImages[0], {
          scale: 1.22,
          yPercent: -16,
          duration: 0.85,
          ease: "power2.out",
        });
        updateHUD(1);
        break;

      case 2:
        // Frame 3: Card 1 glides up properly from the bottom of the screen
        animateCardIn(cards[0], tl);
        updateHUD(1);
        break;

      // ----------------- SLIDE 2 (Frames 4-6) -----------------
      case 3:
        // Frame 4: Card 1 exits, Slide 2 appears at top portion (no card)
        animateCardOut(cards[0], tl);
        tl.to(bgSlides[1], { opacity: 1, duration: 0.65, ease: "power2.inOut" }, "<+=0.12");
        tl.to(bgSlides[0], { opacity: 0, duration: 0.65, ease: "power2.inOut" }, "<");
        tl.set(bgImages[1], { yPercent: 0, scale: 1 }, "<");
        updateHUD(2);
        break;

      case 4:
        // Frame 5: Slide 2 pans down to reveal climber
        tl.to(bgImages[1], {
          yPercent: -20,
          duration: 0.8,
          ease: "power2.inOut",
        });
        updateHUD(2);
        break;

      case 5:
        // Frame 6: Card 2 glides up properly from the bottom of the screen
        animateCardIn(cards[1], tl);
        updateHUD(2);
        break;

      // ----------------- SLIDE 3 (Frames 7-9) -----------------
      case 6:
        // Frame 7: Card 2 exits, Slide 3 appears at top sunburst view (no card)
        animateCardOut(cards[1], tl);
        tl.to(bgSlides[2], { opacity: 1, duration: 0.65, ease: "power2.inOut" }, "<+=0.12");
        tl.to(bgSlides[1], { opacity: 0, duration: 0.65, ease: "power2.inOut" }, "<");
        tl.set(bgImages[2], { yPercent: 0, scale: 1 }, "<");
        updateHUD(3);
        break;

      case 7:
        // Frame 8: Slide 3 pans down to reveal hammock & feet
        tl.to(bgImages[2], {
          yPercent: -20,
          duration: 0.8,
          ease: "power2.inOut",
        });
        updateHUD(3);
        break;

      case 8:
        // Frame 9: Card 3 glides up properly from the bottom of the screen
        animateCardIn(cards[2], tl);
        updateHUD(3);
        break;

      // ----------------- SLIDE 4 (Frames 10-12) -----------------
      case 9:
        // Frame 10: Card 3 exits, Slide 4 appears at top view (no card)
        animateCardOut(cards[2], tl);
        tl.to(bgSlides[3], { opacity: 1, duration: 0.65, ease: "power2.inOut" }, "<+=0.12");
        tl.to(bgSlides[2], { opacity: 0, duration: 0.65, ease: "power2.inOut" }, "<");
        tl.set(bgImages[3], { yPercent: 0, scale: 1 }, "<");
        updateHUD(4);
        break;

      case 10:
        // Frame 11: Slide 4 zooms in on scroll
        tl.to(bgImages[3], {
          scale: 1.22,
          yPercent: -16,
          duration: 0.85,
          ease: "power2.out",
        });
        updateHUD(4);
        break;

      case 11:
        // Frame 12: Card 4 glides up properly from the bottom of the screen
        animateCardIn(cards[3], tl);
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
        // Zoom Image 1 back out to initial state
        tl.to(bgImages[0], {
          scale: 1,
          yPercent: 0,
          duration: 0.7,
          ease: "power2.inOut",
        });
        updateHUD(1);
        break;

      case 2:
        // Slide Card 1 back down completely below screen (75vh)
        tl.to(cards[0].querySelectorAll(".card-tag, .card-title, .card-description"), {
          y: 24,
          opacity: 0,
          duration: 0.3,
          stagger: 0.02,
          ease: "power2.in",
        });
        tl.to(cards[0], {
          y: "75vh",
          opacity: 0,
          scale: 0.98,
          pointerEvents: "none",
          duration: 0.65,
          ease: "power2.inOut",
        }, "<+=0.08");
        updateHUD(1);
        break;

      // SLIDE 2
      case 3:
        // Back to Slide 1 with Card 1 in place and zoomed image
        tl.to(bgSlides[1], { opacity: 0, duration: 0.6, ease: "power2.inOut" });
        tl.to(bgSlides[0], { opacity: 1, duration: 0.6, ease: "power2.inOut" }, "<");
        tl.set(bgImages[0], { scale: 1.22, yPercent: -16 }, "<");
        animateCardIn(cards[0], tl);
        updateHUD(1);
        break;

      case 4:
        // Pan Image 2 back to top
        tl.to(bgImages[1], {
          yPercent: 0,
          duration: 0.7,
          ease: "power2.inOut",
        });
        updateHUD(2);
        break;

      case 5:
        // Slide Card 2 back down completely below screen (75vh)
        tl.to(cards[1].querySelectorAll(".card-tag, .card-title, .card-description"), {
          y: 24,
          opacity: 0,
          duration: 0.3,
          stagger: 0.02,
          ease: "power2.in",
        });
        tl.to(cards[1], {
          y: "75vh",
          opacity: 0,
          scale: 0.98,
          pointerEvents: "none",
          duration: 0.65,
          ease: "power2.inOut",
        }, "<+=0.08");
        updateHUD(2);
        break;

      // SLIDE 3
      case 6:
        // Back to Slide 2 with Card 2 in place
        tl.to(bgSlides[2], { opacity: 0, duration: 0.6, ease: "power2.inOut" });
        tl.to(bgSlides[1], { opacity: 1, duration: 0.6, ease: "power2.inOut" }, "<");
        tl.set(bgImages[1], { yPercent: -20 }, "<");
        animateCardIn(cards[1], tl);
        updateHUD(2);
        break;

      case 7:
        // Pan Image 3 back to top sunburst
        tl.to(bgImages[2], {
          yPercent: 0,
          duration: 0.7,
          ease: "power2.inOut",
        });
        updateHUD(3);
        break;

      case 8:
        // Slide Card 3 back down completely below screen (75vh)
        tl.to(cards[2].querySelectorAll(".card-tag, .card-title, .card-description"), {
          y: 24,
          opacity: 0,
          duration: 0.3,
          stagger: 0.02,
          ease: "power2.in",
        });
        tl.to(cards[2], {
          y: "75vh",
          opacity: 0,
          scale: 0.98,
          pointerEvents: "none",
          duration: 0.65,
          ease: "power2.inOut",
        }, "<+=0.08");
        updateHUD(3);
        break;

      // SLIDE 4
      case 9:
        // Back to Slide 3 with Card 3 in place
        tl.to(bgSlides[3], { opacity: 0, duration: 0.6, ease: "power2.inOut" });
        tl.to(bgSlides[2], { opacity: 1, duration: 0.6, ease: "power2.inOut" }, "<");
        tl.set(bgImages[2], { yPercent: -20 }, "<");
        animateCardIn(cards[2], tl);
        updateHUD(3);
        break;

      case 10:
        // Zoom Image 4 back out to initial state
        tl.to(bgImages[3], {
          scale: 1,
          yPercent: 0,
          duration: 0.7,
          ease: "power2.inOut",
        });
        updateHUD(4);
        break;

      case 11:
        // Slide Card 4 back down completely below screen (75vh)
        tl.to(cards[3].querySelectorAll(".card-tag, .card-title, .card-description"), {
          y: 24,
          opacity: 0,
          duration: 0.3,
          stagger: 0.02,
          ease: "power2.in",
        });
        tl.to(cards[3], {
          y: "75vh",
          opacity: 0,
          scale: 0.98,
          pointerEvents: "none",
          duration: 0.65,
          ease: "power2.inOut",
        }, "<+=0.08");
        updateHUD(4);
        break;
    }
  }
}

// Initialize on page load
initSlider();

// Direct Input Controller
let touchStartY = 0;

// Mouse Wheel & Trackpad Listener (1 Scroll Flick -> 1 Step)
window.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    if (isAnimating) return;

    if (Math.abs(e.deltaY) < 10) return;

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

    if (Math.abs(diff) > 35) {
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
