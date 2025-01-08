class StickyHeader {
  constructor(headerSelector, scrollThreshold = 180) {
    this.header = document.querySelector(headerSelector);
    this.scrollThreshold = scrollThreshold;
    this.ticking = false;

    if (!this.header) {
      console.error(
        `Header element with selector '${headerSelector}' not found.`
      );
      return;
    }

    // Pre-calculate styles for performance
    this.headerHeight = this.header.offsetHeight;

    this._handleScroll = this._handleScroll.bind(this);
    this._init();
  }

  _init() {
    // Set initial state
    this._applyInitialState();

    // Use passive event listener for better performance
    window.addEventListener("scroll", this._handleScroll, { passive: true });

    // Handle resize events
    this._handleResize = this._debounce(() => {
      this.headerHeight = this.header.offsetHeight;
      this._handleScroll();
    }, 250);

    window.addEventListener("resize", this._handleResize);
  }

  _handleScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this._updateHeaderState();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  _updateHeaderState() {
    const isSticky = this.header.classList.contains("sticky");
    const shouldBeSticky = window.scrollY > this.scrollThreshold;

    if (shouldBeSticky && !isSticky) {
      this.header.classList.add("sticky");
    } else if (!shouldBeSticky && isSticky) {
      this.header.classList.remove("sticky");
    }
  }

  _applyInitialState() {
    requestAnimationFrame(() => {
      if (window.scrollY >= this.scrollThreshold) {
        this.header.classList.add("sticky");
      }
    });
  }

  _debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  destroy() {
    window.removeEventListener("scroll", this._handleScroll);
    window.removeEventListener("resize", this._handleResize);
    this.header.style.willChange = "";
    this.header.classList.remove("sticky");
  }
}

class TestimonialCarousel {
  constructor(autoplayInterval = 3000) {
    this.leftArrow = document.querySelector(".testimonial__arrow--left");
    this.rightArrow = document.querySelector(".testimonial__arrow--right");
    this.testimonialItems = document.querySelectorAll(
      ".testimonial__track__item"
    );
    this.testimonialItemsImage = document.querySelectorAll(
      ".testimonial__track__item-image"
    );
    this.testimonialTexts = document.querySelectorAll(".testimonial__text");
    this.currentIndex = 0;
    this.autoplayInterval = autoplayInterval;
    this.autoplay = null;

    if (
      !this.leftArrow ||
      !this.rightArrow ||
      this.testimonialItems.length === 0 ||
      this.testimonialItemsImage.length === 0 ||
      this.testimonialTexts.length === 0 ||
      this.testimonialItems.length !== this.testimonialItemsImage.length ||
      this.testimonialItems.length !== this.testimonialTexts.length
    ) {
      console.error(
        "Error initializing Testimonial Carousel. Check your HTML structure and class names."
      );
      return;
    }

    this._updateActiveItem(this.currentIndex);
    this._updateActiveText(this.currentIndex);
    this._setupEventListeners();
    this._startAutoplay();
  }

  _updateActiveItem(index) {
    this.testimonialItems.forEach((item) =>
      item.classList.remove("testimonial__track__item--active")
    );
    this.testimonialItemsImage.forEach((item) =>
      item.classList.remove("testimonial__track__item-image--active")
    );

    this.testimonialItems[index].classList.add(
      "testimonial__track__item--active"
    );
    this.testimonialItemsImage[index].classList.add(
      "testimonial__track__item-image--active"
    );
  }

  _updateActiveText(index) {
    this.testimonialTexts.forEach((text) =>
      text.classList.remove("testimonial__text--active")
    );
    this.testimonialTexts[index].classList.add("testimonial__text--active");
  }

  nextTestimonial() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonialItems.length;
    this._updateActiveItem(this.currentIndex);
    this._updateActiveText(this.currentIndex);
  }

  previousTestimonial() {
    this.currentIndex =
      (this.currentIndex - 1 + this.testimonialItems.length) %
      this.testimonialItems.length;
    this._updateActiveItem(this.currentIndex);
    this._updateActiveText(this.currentIndex);
  }

  _setupEventListeners() {
    this.leftArrow.addEventListener("click", () => this.previousTestimonial());
    this.rightArrow.addEventListener("click", () => this.nextTestimonial());

    this.testimonialItems.forEach((item) => {
      item.addEventListener("mouseover", () => this._pauseAutoplay());
      item.addEventListener("mouseout", () => this._startAutoplay());
    });
  }

  _startAutoplay() {
    if (!this.autoplay) {
      this.autoplay = setInterval(
        () => this.nextTestimonial(),
        this.autoplayInterval
      );
    }
  }

  _pauseAutoplay() {
    clearInterval(this.autoplay);
    this.autoplay = null;
  }

  destroy() {
    this._pauseAutoplay();
    this.leftArrow.removeEventListener("click", () =>
      this.previousTestimonial()
    );
    this.rightArrow.removeEventListener("click", () => this.nextTestimonial());
    this.testimonialItems.forEach((item) => {
      item.removeEventListener("mouseover", () => this._pauseAutoplay());
      item.removeEventListener("mouseout", () => this._startAutoplay());
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const headerSection = new StickyHeader("header.section", 400);
  const testimonialCarousel = new TestimonialCarousel();
});
