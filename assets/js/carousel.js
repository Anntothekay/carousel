export default class TestimonialCarousel {
  #currentIndex = 0;

  constructor(containerSelector, options = {}) {
    this.options = {
      offset: options.offset || 0,
      autoplay: {
        enabled: options.autoplay?.enabled || false,
        delay: options.autoplay?.delay || 3000,
      },
    };
    this.container = document.querySelector(containerSelector);
    this.testimonialWrapper = this.container.querySelector(
      ".testimonial-wrapper"
    );
    this.testimonials = Array.from(
      this.container.querySelectorAll(".testimonial")
    );
    this.dotsContainer = this.container.querySelector(".dots");
    this.minScreenSize = 800;
    this.currentIndex = this.options.offset;

    this.isDesktopCarousel = window.innerWidth > this.minScreenSize;

    window.addEventListener("resize", () => this.handleWindowResize());

    this.init();
  }

  init() {
    if (this.isDesktopCarousel) {
      document.addEventListener("DOMContentLoaded", () => {
        this.updateCarousel();
        this.addEventListeners();
        if (this.options.autoplay.enabled) {
          this.startAutoplay();
        }
      });
    }
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
    const leftSideItemCount = Math.floor((testimonialLength - 1) / 2);
    const rightSideItemCount = Math.ceil((testimonialLength - 1) / 2);

    this.testimonials.forEach((testimonial, index) => {
      const offset = index - this.currentIndex;

      testimonial.className = "testimonial";

      if (offset === 0) {
        testimonial.classList.add("current");
      } else if (offset === 1 || offset === -testimonialLength + 1) {
        testimonial.classList.add("next");
      } else if (offset === -1 || offset === testimonialLength - 1) {
        testimonial.classList.add("prev");
      } else if (
        (offset < -1 && offset >= -leftSideItemCount) ||
        offset > rightSideItemCount
      ) {
        testimonial.classList.add("left");
      } else if (
        (offset > 1 && offset <= rightSideItemCount) ||
        offset < -leftSideItemCount
      ) {
        testimonial.classList.add("right");
      }
    });

    this.buildDotNavigation(testimonialLength);
  }

  moveToTestimonial(index) {
    this.currentIndex = index;
    this.updateCarousel();
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      const nextIndex = (this.currentIndex + 1) % this.testimonials.length;
      this.moveToTestimonial(nextIndex);
    }, this.options.autoplay.delay);
  }

  stopAutoplay() {
    clearInterval(this.autoplayInterval);
  }

  addEventListeners() {
    this.testimonials.forEach((testimonial, index) => {
      testimonial.addEventListener("click", () =>
        this.moveToTestimonial(index)
      );
      testimonial.addEventListener("mouseenter", () => this.stopAutoplay());
      testimonial.addEventListener("mouseleave", () => {
        if (this.options.autoplay.enabled) {
          this.startAutoplay();
        }
      });
    });
  }

  removeEventListeners() {
    this.testimonials.forEach((testimonial) => {
      testimonial.removeEventListener("click", this.moveToTestimonial);
      testimonial.removeEventListener("mouseover", this.stopAutoplay);
      testimonial.removeEventListener("mouseenter", this.stopAutoplay);
    });
  }

  handleWindowResize() {
    if (!this.isDesktopCarousel && window.innerWidth > 800) {
      this.isDesktopCarousel = true;
      this.updateCarousel();
      this.addEventListeners();
    } else {
      this.removeEventListeners();
    }
  }
}
