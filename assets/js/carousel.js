export default class TestimonialCarousel {
  constructor(containerSelector, hasClones = true, offset = 0) {
    this.container = document.querySelector(containerSelector);
    this.hasClones = hasClones;
    this.testimonialWrapper = this.container.querySelector(
      ".testimonial-wrapper"
    );
    this.testimonials = Array.from(
      this.container.querySelectorAll(".testimonial")
    );
    this.dotsContainer = this.container.querySelector(".dots");
    this.minScreenSize = 800;
    this.currentIndex = offset;

    this.isDesktopCarousel = window.innerWidth > this.minScreenSize;

    window.addEventListener("resize", this.handleWindowResize.bind(this));

    this.init();
  }

  init() {
    if (this.isDesktopCarousel) {
      document.addEventListener("DOMContentLoaded", () => {
        this.hasClones && this.cloneOuterTestimonials();
        this.updateCarousel();
        this.addEventListeners();
      });
    }
  }

  cloneOuterTestimonials() {
    const firstTestimonial = this.testimonials[0];
    const lastTestimonial = this.testimonials[this.testimonials.length - 1];
    const firstTestimonialClone = firstTestimonial.cloneNode(true);
    const lastTestimonialClone = lastTestimonial.cloneNode(true);

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
  }

  buildDotNavigation(testimonialLength) {
    this.dotsContainer.innerHTML = "";
    for (let i = 0; i < testimonialLength; i++) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      dot.addEventListener("click", () => this.moveToTestimonial(i));
      this.dotsContainer.appendChild(dot);
    }
    const dots = this.dotsContainer.querySelectorAll(".dot");
    dots[this.currentIndex].classList.add("active");
  }

  updateCarousel() {
    const testimonialLength = this.testimonials.length;

    this.testimonials.forEach((testimonial, index) => {
      const offset = index - this.currentIndex;

      // Clear all classes
      testimonial.className = "testimonial";

      if (offset === 0) {
        testimonial.classList.add("current");
      } else if (offset === 1 || offset === -testimonialLength + 1) {
        testimonial.classList.add("next");
      } else if (offset === -1 || offset === testimonialLength - 1) {
        testimonial.classList.add("prev");
      } else if (offset < -1) {
        testimonial.classList.add("left");
      } else if (offset > 1) {
        testimonial.classList.add("right");
      }
    });

    this.buildDotNavigation(testimonialLength);
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

  handleWindowResize() {
    if (!this.isDesktopCarousel && window.innerWidth > 800) {
      this.isDesktopCarousel = true;
      this.cloneOuterTestimonials();
      this.updateCarousel();
      this.addEventListeners();
    } else {
      this.removeEventListeners();
    }
  }

  removeEventListeners() {
    this.testimonials.forEach((testimonial, index) => {
      testimonial.removeEventListener(
        "click",
        this.moveToTestimonial.bind(this, index)
      );
    });
  }
}
