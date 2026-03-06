/* ======================================
   Contact CSS - Refactored to Design System
   ====================================== */

.contact-us {
  position: relative;
  background-color: var(--color-gray);
  padding: var(--spacing-2xl) 0;

  .form-title {
    font-size: 28px;
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-lg);
    color: var(--color-heading);

    @media (max-width: 991px) {
      font-size: 24px;
      line-height: 35px;
    }

    @media (max-width: 767px) {
      font-size: 22px;
      line-height: 35px;
    }
  }

  .contact-form {
    .form-group {
      margin-bottom: var(--spacing-md);

      input {
        height: 52px;
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-sm);
        padding: 0 var(--spacing-md);
        width: 100%;
        transition: var(--transition-base);
        background-color: var(--color-white);
        font-size: var(--font-size-base);
        color: var(--color-heading);

        &::placeholder {
          color: var(--color-gray-400);
        }

        &:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(126, 87, 255, 0.1);
          outline: none;
        }

        &:hover {
          border-color: var(--color-gray-300);
        }
      }

      textarea {
        min-height: 200px;
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-sm);
        padding: var(--spacing-md);
        resize: vertical;
        width: 100%;
        transition: var(--transition-base);
        background-color: var(--color-white);
        font-family: var(--font-primary);
        font-size: var(--font-size-base);
        color: var(--color-heading);

        &::placeholder {
          color: var(--color-gray-400);
        }

        &:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(126, 87, 255, 0.1);
          outline: none;
        }

        &:hover {
          border-color: var(--color-gray-300);
        }
      }
    }

    .button {
      margin-top: var(--spacing-sm);

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

        &:active {
          transform: translateY(0);
        }
      }
    }
  }

  .contact-widget-wrapper {
    padding-right: 80px;

    @media (max-width: 991px) {
      padding: 0;
      padding-right: 200px;
      margin-bottom: var(--spacing-2xl);
    }

    @media (max-width: 767px) {
      padding: 0;
      margin-bottom: var(--spacing-xl);
    }

    .main-title {
      margin-bottom: var(--spacing-xl);

      h2 {
        font-size: 28px;
        font-weight: var(--font-weight-bold);
        margin-bottom: var(--spacing-md);
        line-height: 40px;
        color: var(--color-heading);

        @media (max-width: 991px) {
          font-size: 24px;
          line-height: 35px;
        }

        @media (max-width: 767px) {
          font-size: 22px;
          line-height: 35px;
        }
      }

      p {
        font-size: var(--font-size-base);
        color: var(--color-body);
        line-height: var(--line-height-relaxed);
      }
    }

    .contact-widget-block {
      margin-bottom: var(--spacing-lg);

      &:last-child {
        margin: 0;
      }

      h3 {
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-bold);
        display: block;
        margin-bottom: 18px;
        color: var(--color-heading);
      }

      p {
        margin-bottom: 3px;
        color: var(--color-body);
        font-size: var(--font-size-sm);

        a {
          color: var(--color-primary);
          text-decoration: none;
          transition: var(--transition-base);

          &:hover {
            text-decoration: underline;
          }
        }

        &:last-child {
          margin: 0;
        }
      }
    }
  }
}

/* Map Section */
.map-section {
  background-color: var(--color-gray);
  padding-bottom: var(--spacing-2xl);

  @media (max-width: 991px) {
    padding-bottom: var(--spacing-xl);
  }

  @media (max-width: 767px) {
    padding-bottom: 60px;
  }

  .mapouter {
    padding: var(--spacing-md);
    background-color: var(--color-white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    overflow: hidden;

    iframe {
      width: 100%;
      height: 450px;
      border: none;
      border-radius: var(--border-radius-sm);

      @media (max-width: 991px) {
        height: 400px;
      }

      @media (max-width: 767px) {
        height: 300px;
      }
    }
  }
}