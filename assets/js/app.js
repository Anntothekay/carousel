import TestimonialCarousel from "./carousel.js";

const testimonialCarousel = new TestimonialCarousel("#carousel", {
  autoplay: {
    enabled: true,
    delay: 4000,
  },
});
const testimonialCarouselTwo = new TestimonialCarousel("#carousel-two");
