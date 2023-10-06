export default class TestimonialCarousel {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.testimonialWrapper = this.container.querySelector(
      ".testimonial-wrapper"
    );
    this.testimonials = Array.from(
      this.container.querySelectorAll(".testimonial")
    );
    this.dotsContainer = this.container.querySelector(".dots");
    this.currentIndex = 0;

    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.initializeCarousel();
      this.updateCarousel();
      this.addEventListeners();
    });
  }

  initializeCarousel() {
    // Clone the last testimonial and insert it at the beginning
    const firstTestimonial = this.testimonials[0];
    const lastTestimonial = this.testimonials[this.testimonials.length - 1];
    const firstTestimonialClone = firstTestimonial.cloneNode(true);
    const lastTestimonialClone = lastTestimonial.cloneNode(true);

    // Copy over the classes from the original testimonial
    firstTestimonialClone.classList.add("next", "clone");
    lastTestimonialClone.classList.add("prev", "clone");

    this.testimonialWrapper.insertBefore(
      firstTestimonialClone,
      this.testimonials[this.testimonials.length - 1].nextSibling
    );
    this.testimonialWrapper.insertBefore(
      lastTestimonialClone,
      this.testimonials[0]
    );

    // Set the curr
  }

  updateCarousel() {
    this.testimonialWrapper.style.transform = `translateX(-${
      (this.currentIndex + 1) * 600
    }px)`;

    const numTestimonials = this.testimonials.length;

    this.testimonials.forEach((testimonial, index) => {
      const offset = index - this.currentIndex;

      switch (true) {
        case offset === 0:
          testimonial.classList.add("current");
          testimonial.classList.remove("prev", "next", "left", "right");
          break;
        case offset === 1 || offset === -numTestimonials + 1:
          testimonial.classList.add("next");
          testimonial.classList.remove("current", "prev", "left", "right");
          break;
        case offset === -1 || offset === numTestimonials - 1:
          testimonial.classList.add("prev");
          testimonial.classList.remove("current", "next", "left", "right");
          break;
        case offset < -1:
          testimonial.classList.add("left");
          testimonial.classList.remove("current", "prev", "next", "right");
          break;
        case offset > 1:
          testimonial.classList.add("right");
          testimonial.classList.remove("current", "prev", "next", "left");
          break;
        default:
          break;
      }
    });

    // Ensure the "prev" testimonial is not clickable when it's to the left of the "current" testimonial
    if (this.currentIndex === 0) {
      this.testimonials[0].classList.remove("prev");
    }

    this.dotsContainer.innerHTML = "";
    for (let i = 0; i < numTestimonials; i++) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      dot.addEventListener("click", () => this.moveToTestimonial(i));
      this.dotsContainer.appendChild(dot);
    }
    const dots = this.dotsContainer.querySelectorAll(".dot");
    dots[this.currentIndex].classList.add("active");
  }

  moveToTestimonial(index) {
    this.currentIndex = index;
    this.updateCarousel();
  }

  addEventListeners() {
    this.testimonials.forEach((testimonial, index) => {
      testimonial.addEventListener("click", () =>
        this.moveToTestimonial(index)
      );
    });
  }
}