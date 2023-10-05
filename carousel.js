export default class TestimonialCarousel {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.testimonials = this.container.querySelectorAll(".testimonial");
    this.dotsContainer = this.container.querySelector(".dots");
    this.currentIndex = 1; // Start with the first testimonial

    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.updateCarousel();
      this.addEventListeners();
    });
  }

  updateCarousel() {
    const numTestimonials = this.testimonials.length;

    this.testimonials.forEach((testimonial, index) => {
      const offset = index - this.currentIndex;

      if (offset === 0) {
        testimonial.classList.add("current");
        testimonial.classList.remove("next", "prev");
      } else if (offset === 1 || offset === -numTestimonials + 1) {
        testimonial.classList.add("next");
        testimonial.classList.remove("current", "prev");
      } else if (offset === -1 || offset === numTestimonials - 1) {
        testimonial.classList.add("prev");
        testimonial.classList.remove("current", "next");
      } else {
        testimonial.classList.remove("current", "next", "prev");
      }
    });

    this.dotsContainer.innerHTML = "";
    for (let i = 0; i < this.testimonials.length; i++) {
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
