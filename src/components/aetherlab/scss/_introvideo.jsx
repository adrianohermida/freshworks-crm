/* ======================================
   Intro Video CSS - Refactored to Design System
   ====================================== */

.intro-video-area {
  background-color: var(--color-heading);
  position: relative;
  z-index: 9;
  padding-bottom: 0;
  padding-top: 130px;

  @media (max-width: 991px) {
    padding-top: 90px;
  }

  @media (max-width: 767px) {
    padding-top: 60px;
  }

  .section-title {
    margin-bottom: 150px;
    padding: 0 265px;
    text-align: center;

    @media (max-width: 991px) {
      padding: 0 var(--spacing-lg);
      margin-bottom: 120px;
    }

    @media (max-width: 767px) {
      padding: 0 var(--spacing-md);
      margin-bottom: 100px;

      h2 {
        font-size: 20px;
      }
    }

    h2 {
      color: var(--color-white);
      font-weight: var(--font-weight-bold);
      font-size: 34px;
      line-height: 42px;
      margin-bottom: var(--spacing-md);
    }

    p {
      color: #e6e6e6;
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
    }

    span {
      display: block;
      margin-bottom: var(--spacing-md);
      color: var(--color-primary);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 1px;

      @media (max-width: 767px) {
        margin-bottom: var(--spacing-sm);
      }
    }
  }

  &::before {
    position: absolute;
    content: "";
    left: 0;
    bottom: 0;
    height: 150px;
    width: 100%;
    background-color: var(--color-white);
    z-index: -1;
  }

  .inner-content-head {
    padding: var(--spacing-lg);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: var(--border-radius-xl);
    background: rgba(255, 255, 255, 0.14);
    backdrop-filter: blur(10px);

    @media (max-width: 767px) {
      padding: 0;
      border: none;
      background: transparent;
    }
  }

  .inner-content {
    background-color: var(--color-white);
    padding: 100px 0;
    height: 100%;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-xl);
    position: relative;
    overflow: hidden;

    @media (max-width: 991px) {
      padding: var(--spacing-xl) 0;
      padding-bottom: var(--spacing-2xl);
    }

    @media (max-width: 767px) {
      padding: var(--spacing-xl) 0;
    }

    .shape1 {
      height: 120px;
      width: 120px;
      position: absolute;
      right: -60px;
      bottom: 58px;
      background: radial-gradient(circle, var(--color-primary), transparent);
      filter: blur(40px);
      border-radius: 50%;

      @media (max-width: 767px) {
        width: 80px;
        height: 80px;
        right: -50px;
        bottom: 20px;
      }
    }

    .shape2 {
      height: 100px;
      width: 100px;
      position: absolute;
      left: -10px;
      top: 30px;
      background: radial-gradient(circle, var(--color-primary), transparent);
      filter: blur(40px);
      border-radius: 50%;

      @media (max-width: 767px) {
        width: 80px;
        height: 80px;
      }
    }
  }
}

.intro-video-area .intro-video-play {
  position: relative;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-video-area .intro-video-play .play-thumb {
  position: relative;
  width: 100%;
}

.intro-video-area .intro-video-play .play-thumb a {
  position: absolute;
  left: 50%;
  bottom: 0;
  height: 80px;
  width: 80px;
  text-align: center;
  line-height: 83px;
  background: var(--color-primary);
  border-radius: 50%;
  padding-left: 5px;
  font-size: 22px;
  color: var(--color-white);
  transform: translateX(-50%);
  cursor: pointer;
  transition: var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 991px) {
    height: 70px;
    width: 70px;
    font-size: 20px;
    line-height: 70px;
  }

  @media (max-width: 767px) {
    height: 60px;
    width: 60px;
    line-height: 60px;
    font-size: 18px;
  }

  &:hover {
    background-color: var(--color-heading);
    color: var(--color-white);
    box-shadow: var(--shadow-lg);
    transform: translateX(-50%) scale(1.05);
  }
}

.intro-video-area .intro-video-play .play-thumb a::before {
  position: absolute;
  content: '';
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  border: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: pulse-border-2 1.5s linear infinite;
}

.intro-video-area .intro-video-play .play-thumb a::after {
  position: absolute;
  content: '';
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  border: 2px solid var(--color-white);
  border-radius: 50%;
  animation: pulse-border 1s linear infinite;
}

/* Animations */
@keyframes pulse-border {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

@keyframes pulse-border-2 {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}