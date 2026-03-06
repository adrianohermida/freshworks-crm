
/* ======================================
   Call To Action CSS - Refactored to Design System
   ====================================== */

.call-action {
  background-color: var(--color-gray);
  padding: var(--spacing-xl) 0;

  .inner-content {
    position: relative;
    padding: var(--spacing-2xl) 0;
    border-radius: var(--border-radius-lg);
    z-index: 0;
    overflow: hidden;
    background-color: var(--color-white);
    box-shadow: var(--shadow-md);

    @media (max-width: 991px) {
      padding: 50px 0;
    }

    @media (max-width: 767px) {
      padding: 50px 0;
      text-align: center;
    }

    .bg-shape {
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: -1;
      opacity: 0.1;
    }
  }

  .text {
    position: relative;
    z-index: 1;

    h2 {
      font-size: 28px;
      font-weight: var(--font-weight-bold);
      line-height: 42px;
      color: var(--color-heading);
      margin: 0;

      span {
        color: var(--color-primary);
        display: block;
      }

      @media (max-width: 991px) {
        font-size: 25px;
        line-height: 38px;
      }

      @media (max-width: 767px) {
        font-size: 22px;
        line-height: 32px;
      }
    }
  }

  .button {
    float: right;
    margin-top: var(--spacing-lg);

    @media (max-width: 767px) {
      float: none;
      margin-top: var(--spacing-xl);
    }

    .btn {
      padding: 14px 30px;
      background-color: var(--color-primary);
      color: var(--color-white);
      border: none;
      border-radius: 30px;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: var(--transition-base);

      &:hover {
        background-color: var(--color-heading);
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }
    }
  }
}
