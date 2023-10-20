export default class Carousel {
  constructor(containerSelector, options = {}) {
    this.options = {
      offset: options.offset || 0,
      autoplay: {
        enabled: options.autoplay?.enabled || false,
        delay: options.autoplay?.delay || 3000,
      },
    };

    this.container = document.querySelector(containerSelector);
    this.carouselWrapper = this.container.querySelector(".js-carousel-wrapper");
    this.carousel = Array.from(
      this.container.querySelectorAll(".js-carousel-card")
    );
    this.dotsContainer = this.container.querySelector(".js-dots");
    this.carouselItemClassName = "carousel-card";
    this.carouselLength = this.carousel.length;
    this.currentIndex = this.options.offset;

    this.minScreenSize = 768; // mq-medium

    this.isDesktopCarousel =
      window.innerWidth > this.minScreenSize &&
      window.screen.availWidth > this.minScreenSize;

    // bind event handler functions
    this.stopAutoplayHandler = () => this.stopAutoplay();
    this.startAutoplayHandler = () => this.startAutoplay();
    this.boundMoveToCarouselItem = [];

    window.addEventListener("resize", () => this.handleWindowResize());

    this.init();
  }

  init() {
    if (this.isDesktopCarousel) {
      document.addEventListener("DOMContentLoaded", () => {
        this.addEventListeners();
        this.buildDotNavigation(this.carouselLength);
        this.updateCarousel();
        if (this.options.autoplay.enabled) {
          this.startAutoplay();
        }
      });
    }
  }

  updateDots() {
    const dots = this.dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot) => dot.classList.remove("is-active"));
    dots[this.currentIndex].classList.add("is-active");
  }

  buildDotNavigation(carouselLength) {
    this.dotsContainer.innerHTML = "";
    for (let i = 0; i < carouselLength; i++) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      dot.addEventListener("click", () => this.moveToCarouselItem(i));
      this.dotsContainer.appendChild(dot);
    }
    this.updateDots();
  }

  updateCarousel() {
    const leftSideItemCount = Math.floor((this.carouselLength - 1) / 2);
    const rightSideItemCount = Math.ceil((this.carouselLength - 1) / 2);

    this.carousel.forEach((carouselItem, index) => {
      const offset = index - this.currentIndex;

      carouselItem.className = this.carouselItemClassName;

      if (offset === 0) {
        carouselItem.classList.add("is-current");
      } else if (offset === 1 || offset === -this.carouselLength + 1) {
        carouselItem.classList.add("is-next");
      } else if (offset === -1 || offset === this.carouselLength - 1) {
        carouselItem.classList.add("is-prev");
      } else if (
        (offset < -1 && offset >= -leftSideItemCount) ||
        offset > rightSideItemCount
      ) {
        carouselItem.classList.add("is-left");
      } else if (
        (offset > 1 && offset <= rightSideItemCount) ||
        offset < -leftSideItemCount
      ) {
        carouselItem.classList.add("is-right");
      }
    });

    this.updateDots();
  }

  moveToCarouselItem(index) {
    this.currentIndex = index;
    this.updateCarousel();
  }
  moveToCarouselItemHandler(index, event) {
    this.moveToCarouselItem(index);
  }

  startAutoplay() {
    if (this.options.autoplay.enabled) {
      this.autoplayInterval = setInterval(() => {
        const nextIndex = (this.currentIndex + 1) % this.carouselLength;
        this.moveToCarouselItem(nextIndex);
      }, this.options.autoplay.delay);
    }
  }

  stopAutoplay() {
    clearInterval(this.autoplayInterval);
  }

  addEventListeners() {
    this.carousel.forEach((carouselItem, index) => {
      const boundMoveToCarouselItem = this.moveToCarouselItemHandler.bind(
        this,
        index
      );
      carouselItem.addEventListener("click", boundMoveToCarouselItem);
      this.boundMoveToCarouselItem.push(boundMoveToCarouselItem);
    });

    this.carouselWrapper.addEventListener(
      "mouseenter",
      this.stopAutoplayHandler
    );
    this.carouselWrapper.addEventListener(
      "mouseleave",
      this.startAutoplayHandler
    );
  }

  removeEventListeners() {
    this.carousel.forEach((carouselItem, index) => {
      const boundMoveToCarouselItem = this.boundMoveToCarouselItem[index];

      carouselItem.removeEventListener("click", boundMoveToCarouselItem);
    });

    this.carouselWrapper.removeEventListener(
      "mouseenter",
      this.stopAutoplayHandler
    );
    this.carouselWrapper.removeEventListener(
      "mouseleave",
      this.startAutoplayHandler
    );
  }

  handleWindowResize() {
    if (
      !this.isDesktopCarousel &&
      window.innerWidth >= this.minScreenSize &&
      window.screen.availWidth >= this.minScreenSize
    ) {
      this.isDesktopCarousel = true;
      this.addEventListeners();
      this.buildDotNavigation(this.carouselLength);
      this.updateCarousel();
      if (this.options.autoplay.enabled) {
        this.startAutoplay();
      }
    } else if (
      this.isDesktopCarousel &&
      window.innerWidth < this.minScreenSize &&
      window.screen.availWidth < this.minScreenSize
    ) {
      if (this.options.autoplay.enabled) {
        this.stopAutoplay();
      }
      this.isDesktopCarousel = false;
      this.dotsContainer.innerHTML = "";
      this.removeEventListeners();
    }
  }
}
