/* ======================================
   Error 404 CSS - Refactored to Design System
   ====================================== */

.error-area {
  height: 100vh;
  text-align: center;
  width: auto;
  margin-left: auto;
  margin-right: auto;
  background-color: var(--color-heading);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .error-content {
    display: inline-block;
    padding: 70px 60px;
    background-color: var(--color-white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-xl);
    max-width: 600px;
    animation: fadeInUp 0.6s ease-out;

    @media (max-width: 991px) {
      padding: 60px 50px;
    }

    @media (max-width: 767px) {
      padding: 50px 40px;
      margin: var(--spacing-md);
    }

    h1 {
      font-size: 90px;
      color: var(--color-primary);
      margin-bottom: var(--spacing-lg);
      font-weight: var(--font-weight-bold);
      line-height: 100px;
      font-family: var(--font-primary);

      @media (max-width: 991px) {
        font-size: 60px;
        line-height: 70px;
      }

      @media (max-width: 767px) {
        font-size: 45px;
        line-height: 55px;
      }
    }

    h2 {
      font-size: 20px;
      margin-bottom: var(--spacing-sm);
      color: var(--color-heading);
      font-weight: var(--font-weight-bold);
      line-height: 35px;

      @media (max-width: 991px) {
        font-size: 22px;
      }

      @media (max-width: 767px) {
        font-size: 18px;
        line-height: 28px;
      }
    }

    p {
      font-weight: var(--font-weight-normal);
      margin-bottom: var(--spacing-xl);
      color: var(--color-gray-500);
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
    }

    .button {
      margin-top: var(--spacing-md);

      .btn {
        padding: 14px 30px;
        background-color: var(--color-primary);
        color: var(--color-white);
        border: none;
        border-radius: 30px;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-sm);
        cursor: pointer;
        transition: var(--transition-base);

        &:hover {
          background-color: var(--color-heading);
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        &:active {
          transform: translateY(0);
        }
      }
    }
  }
}

/* Table Display Utilities (for vertical centering) */
.d-table {
  width: 100%;
  height: 100%;
  display: table !important;
}

.d-table-cell {
  vertical-align: middle;
  display: table-cell !important;
}

/* Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}