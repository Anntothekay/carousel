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

      switch (true) {
        case offset === 0:
          testimonial.classList.add("current");
          testimonial.classList.remove("prev", "next", "left", "right");
          break;
        case offset === 1 || offset === testimonialLength + 1:
          testimonial.classList.add("next");
          testimonial.classList.remove("current", "prev", "left", "right");
          break;
        case offset === -1 || offset === testimonialLength - 1:
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

    const currentTestimonial = this.testimonials[this.currentIndex];
    const currentTestimonialWidth = currentTestimonial.offsetWidth;
    this.testimonialWrapper.style.transform = `translateX(-${
      (this.currentIndex + (this.hasClones ? 1 : 0)) * currentTestimonialWidth
    }px)`;
    if (this.currentIndex === 0) {
      this.testimonials[0].classList.remove("prev");
    }

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
