/* ======================================
   Testimonial CSS - Refactored to Design System
   ====================================== */

.testimonials {
  background-color: var(--color-gray);
  position: relative;
  padding: var(--spacing-2xl) 0 180px;

  @media (max-width: 991px) {
    padding-bottom: 120px;
  }

  @media (max-width: 767px) {
    padding-bottom: 100px;
  }

  .testimonial-slider {
    margin: 0;
    padding: 0;
  }

  .tns-nav {
    text-align: center;
    position: absolute;
    bottom: 90px;
    transform: translateX(-50%);
    width: 100%;
    left: 50%;
    z-index: 9;
    margin: 0;
    display: flex;
    justify-content: center;
    gap: 5px;

    @media (max-width: 991px) {
      bottom: 55px;
    }

    @media (max-width: 767px) {
      bottom: 50px;
    }

    button {
      height: 6px;
      width: 14px;
      background-color: var(--color-gray-400);
      border-radius: 5px;
      display: inline-block;
      border: none;
      margin: 0;
      transition: all var(--transition-base);
      cursor: pointer;

      &:hover {
        background-color: var(--color-primary);
        width: 20px;
      }

      &.tns-nav-active {
        width: 25px;
        background-color: var(--color-primary);
      }
    }
  }

  .single-testimonial {
    background-color: var(--color-white);
    padding: 50px 40px;
    transition: var(--transition-base);
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    margin: 15px 0;
    box-shadow: var(--shadow-sm);

    @media (max-width: 767px) {
      padding: 40px 30px;
    }

    &:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-5px);

      .quote-icon i {
        opacity: 0.15;
      }
    }

    &::before {
      position: absolute;
      content: "";
      right: -30px;
      top: -30px;
      height: 60px;
      width: 60px;
      background: linear-gradient(135deg, var(--color-primary) 0%, #6b46c1 100%);
      border-radius: 50%;
      opacity: 0.8;
      transition: var(--transition-base);
    }

    &:hover::before {
      transform: scale(1.1);
    }

    .text {
      margin-bottom: 20px;

      h4 {
        font-size: 16px;
        font-weight: var(--font-weight-semibold);
        line-height: 28px;
        color: var(--color-heading);
        margin: 0;

        @media (max-width: 991px) {
          font-size: 15px;
        }

        @media (max-width: 767px) {
          font-size: 15px;
          line-height: 26px;
        }
      }
    }

    .author {
      position: relative;
      padding-left: 70px;
      margin-top: 40px;
      display: flex;
      align-items: center;

      img {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: 0;
        object-fit: cover;
        border: 2px solid var(--color-primary);

        @media (max-width: 767px) {
          height: 45px;
          width: 45px;
        }
      }

      h4 {
        font-size: 15px;
        font-weight: var(--font-weight-semibold);
        color: var(--color-heading);
        margin: 0 0 6px 0;

        span {
          color: var(--color-body);
          display: block;
          font-size: 13px;
          font-weight: var(--font-weight-normal);
          margin-top: 6px;
        }
      }
    }

    .quote-icon {
      position: absolute;
      right: 40px;
      bottom: 50px;
      pointer-events: none;

      i {
        font-size: 45px;
        color: var(--color-primary);
        opacity: 0.1;
        transition: var(--transition-base);

        @media (max-width: 767px) {
          font-size: 35px;
          right: 20px;
          bottom: 30px;
        }
      }
    }
  }

  /* Testimonial Carousel */
  .testimonials-carousel {
    position: relative;
    padding-bottom: 80px;
  }

  .tns-outer {
    [hidden] {
      display: none !important;
    }
  }

  .tns-inner {
    padding: 0;
  }

  .tns-container {
    margin: 0;
    padding: 0;
  }
}