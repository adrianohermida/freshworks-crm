/* ======================================
   Services CSS - Refactored to Design System
   ====================================== */

.services {
  position: relative;
  z-index: 0;
  background-color: var(--color-gray);
  padding: var(--spacing-2xl) 0;

  .section-title {
    margin-bottom: 50px;

    @media (max-width: 991px) {
      margin-bottom: 30px;
    }

    @media (max-width: 767px) {
      margin-bottom: 30px;
    }
  }

  .upper-content {
    @media (min-width: 1200px) {
      padding-right: 100px;
    }

    .lasthead {
      font-size: 16px;
      font-weight: var(--font-weight-semibold);
      color: var(--color-primary);
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .title {
      font-size: 40px;
      font-weight: var(--font-weight-bold);
      line-height: 50px;
      padding: 21px 0 16px;
      color: var(--color-heading);

      @media (max-width: 991px) {
        font-size: 32px;
        line-height: 40px;
      }

      @media (max-width: 767px) {
        font-size: 28px;
        line-height: 36px;
      }
    }

    p {
      margin-top: 20px;
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
      color: var(--color-body);
    }

    .button {
      margin-top: 40px;
    }
  }

  .single-service {
    min-height: 300px;
    margin-top: 30px;
    border-radius: 20px;
    background-color: var(--color-white);
    box-shadow: var(--shadow-md);
    padding: 40px 50px;
    text-align: center;
    transition: var(--transition-base);
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
    position: relative;

    @media (max-width: 991px) {
      padding: 35px 40px;
      min-height: auto;
    }

    @media (max-width: 767px) {
      padding: 30px 25px;
    }

    &:hover {
      transform: translateY(-8px);
      border-top-color: var(--color-primary);
      border-bottom-color: var(--color-primary);
      box-shadow: var(--shadow-lg);
    }

    .main-icon {
      height: 65px;
      width: 65px;
      line-height: 65px;
      text-align: center;
      background: linear-gradient(135deg, var(--color-primary) 0%, #6b46c1 100%);
      color: var(--color-white);
      border-radius: var(--border-radius-md);
      font-size: 27px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      box-shadow: 0px 10px 25px rgba(126, 87, 255, 0.2);
      transition: var(--transition-base);

      @media (max-width: 767px) {
        height: 55px;
        width: 55px;
        line-height: 55px;
        font-size: 24px;
      }
    }

    .text-title {
      color: var(--color-heading);
      font-size: 18px;
      line-height: 28px;
      font-weight: var(--font-weight-bold);
      margin-top: 30px;
      margin-bottom: 15px;

      @media (max-width: 767px) {
        font-size: 16px;
        margin-top: 20px;
      }
    }

    p {
      line-height: 26px;
      font-size: 15px;
      color: var(--color-body);
      margin: 0;

      @media (max-width: 767px) {
        font-size: 14px;
        line-height: 24px;
      }
    }
  }

  /* Services Grid */
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-xl);

    @media (max-width: 991px) {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-lg);
    }

    @media (max-width: 767px) {
      grid-template-columns: 1fr;
      gap: var(--spacing-lg);
    }
  }
}