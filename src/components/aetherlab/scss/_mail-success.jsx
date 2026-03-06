
/* ======================================
   Mail Success CSS - Refactored to Design System
   ====================================== */

.mail-success {
  height: 100vh;
  text-align: center;
  width: auto;
  background-color: var(--color-heading);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .success-content {
    display: inline-block;
    padding: var(--spacing-2xl);
    background-color: var(--color-white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);

    @media (max-width: 991px) {
      padding: 60px 50px;
    }

    @media (max-width: 767px) {
      padding: 50px 40px;
    }

    h1 {
      font-size: 40px;
      color: var(--color-primary);
      margin-bottom: var(--spacing-md);
      font-weight: var(--font-weight-bold);
      line-height: 1.2;

      @media (max-width: 991px) {
        font-size: 30px;
      }

      @media (max-width: 767px) {
        font-size: 22px;
      }
    }

    h2 {
      font-size: var(--font-size-lg);
      margin-bottom: var(--spacing-md);
      color: var(--color-heading);
      font-weight: var(--font-weight-semibold);

      @media (max-width: 991px) {
        font-size: var(--font-size-sm);
      }

      @media (max-width: 767px) {
        font-size: var(--font-size-sm);
      }
    }

    p {
      font-weight: var(--font-weight-normal);
      margin-bottom: var(--spacing-lg);
      color: var(--color-heading);
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
      margin: 0;
    }
  }
}

/* Table Display Utilities */
.d-table {
  width: 100%;
  height: 100%;
  display: table !important;
}

.d-table-cell {
  vertical-align: middle;
  display: table-cell !important;
}
