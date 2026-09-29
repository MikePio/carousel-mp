const carousel = document.querySelector("#carousel");

if (carousel) {
  const slides = Array.from(carousel.querySelectorAll(".slide"));
  const dots = Array.from(carousel.querySelectorAll(".dot"));
  const previousButton = carousel.querySelector(".arrow--previous");
  const nextButton = carousel.querySelector(".arrow--next");
  let activeIndex = 0;
  let timerId;
  let exitTimeoutId;
  let pointerStartX = null;

  function startTimer() {
    window.clearTimeout(timerId);

    if (document.hidden) return;
    timerId = window.setTimeout(() => showSlide(activeIndex + 1, "next"), 3000);
  }

  function showSlide(requestedIndex, direction) {
    const nextIndex = (requestedIndex + slides.length) % slides.length;
    const previousSlide = slides[activeIndex];

    if (nextIndex === activeIndex) {
      startTimer();
      return;
    }

    window.clearTimeout(exitTimeoutId);
    carousel.dataset.direction = direction;
    previousSlide.classList.remove("is-active");
    previousSlide.classList.add("is-exiting");
    previousSlide.setAttribute("aria-hidden", "true");

    activeIndex = nextIndex;
    slides[activeIndex].classList.add("is-active");
    slides[activeIndex].setAttribute("aria-hidden", "false");

    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("is-active", isActive);

      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    exitTimeoutId = window.setTimeout(() => {
      previousSlide.classList.remove("is-exiting");
    }, 850);

    startTimer();
  }

  previousButton.addEventListener("click", () => {
    showSlide(activeIndex - 1, "previous");
  });

  nextButton.addEventListener("click", () => {
    showSlide(activeIndex + 1, "next");
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index, index < activeIndex ? "previous" : "next");
    });
  });

  carousel.addEventListener("click", (event) => {
    if (event.target.closest("button")) return;
    startTimer();
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(activeIndex - 1, "previous");
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(activeIndex + 1, "next");
    }
  });

  carousel.addEventListener("pointerdown", (event) => {
    pointerStartX = event.clientX;
  });

  carousel.addEventListener("pointerup", (event) => {
    if (pointerStartX === null) return;

    const distance = event.clientX - pointerStartX;
    pointerStartX = null;

    if (Math.abs(distance) > 45) {
      const direction = distance < 0 ? "next" : "previous";
      showSlide(activeIndex + (distance < 0 ? 1 : -1), direction);
    }
  });

  carousel.addEventListener("pointercancel", () => {
    pointerStartX = null;
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearTimeout(timerId);
    } else {
      startTimer();
    }
  });

  startTimer();
}
