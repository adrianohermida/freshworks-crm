/* ======================================
   Team CSS - Refactored to Design System
   ====================================== */

.team {
  padding: var(--spacing-2xl) 0;

  .section-title {
    margin-bottom: 50px;

    @media (max-width: 991px),
           (max-width: 767px) {
      margin-bottom: 30px;
    }
  }

  .single-team {
    margin-top: 30px;
    border-radius: var(--border-radius-md);
    overflow: hidden;
    transition: var(--transition-base);
    text-align: center;
    position: relative;

    img {
      height: 200px;
      width: 200px;
      border-radius: 50%;
      display: inline-block;
      background-color: var(--color-white);
      padding: 10px;
      border: 1px solid var(--color-border);
      object-fit: cover;
      transition: var(--transition-base);

      @media (max-width: 767px) {
        height: 160px;
        width: 160px;
      }
    }

    .content {
      padding: 40px 30px;
      background-color: var(--color-white);
      border-top: 3px solid transparent;
      transition: var(--transition-base);

      @media (max-width: 767px) {
        display: block;
        text-align: center;
        padding: 30px 20px;
      }

      h4 {
        font-size: 18px;
        font-weight: var(--font-weight-semibold);
        color: var(--color-heading);
        margin-bottom: 8px;
        transition: var(--transition-base);

        span {
          color: var(--color-body);
          font-size: 14px;
          display: block;
          margin-top: 10px;
          font-weight: var(--font-weight-normal);
          font-family: var(--font-primary);
        }
      }

      .social {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--spacing-lg);
        opacity: 0;
        visibility: hidden;
        transition: all var(--transition-base);
        transform: translateY(-10px);
        margin-top: 0;

        @media (max-width: 767px) {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          margin-top: 20px;
        }

        li {
          display: inline-block;
          margin: 0;

          a {
            font-size: 15px;
            color: var(--color-heading);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background-color: var(--color-light);
            transition: var(--transition-base);

            &:hover {
              background-color: var(--color-primary);
              color: var(--color-white);
              transform: translateY(-3px);
            }
          }
        }
      }
    }

    &:hover {
      box-shadow: var(--shadow-lg);

      .content {
        border-top-color: var(--color-primary);
      }

      img {
        transform: scale(1.05);
      }

      .social {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      h4 {
        color: var(--color-primary);
      }
    }
  }

  /* Team Grid */
  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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