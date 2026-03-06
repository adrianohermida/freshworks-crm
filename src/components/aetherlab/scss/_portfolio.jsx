/* ======================================
   Portfolio CSS - Refactored to Design System
   ====================================== */

.portfolio-section {
  &.section {
    // inherits from .section
  }

  .section-title {
    margin-bottom: 60px;

    @media (max-width: 991px) {
      margin-bottom: 50px;
    }

    @media (max-width: 767px) {
      margin-bottom: 40px;
    }
  }

  .portfolio-btn-wrapper {
    margin-bottom: 0;
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--spacing-sm);

    button {
      padding: 10px 23px;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      border: none;
      background-color: var(--color-light);
      color: var(--color-heading);
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      transition: var(--transition-base);

      @media (max-width: 991px) {
        padding: 7px 18px;
        margin-right: var(--spacing-sm);
      }

      @media (max-width: 767px) {
        padding: 7px 18px;
        margin-right: var(--spacing-sm);
      }

      &:hover {
        background-color: var(--color-primary);
        color: var(--color-white);
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
      }

      &.active {
        background-color: var(--color-primary);
        color: var(--color-white);
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
}

.grid {
  margin-top: 80px;

  @media (max-width: 991px) {
    margin-top: 60px;
  }

  @media (max-width: 767px) {
    margin-top: 40px;
  }
}

.portfolio-item-wrapper {
  position: relative;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  margin-bottom: 30px;
  background-color: var(--color-white);
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);

  &:hover {
    box-shadow: var(--shadow-lg);

    .portfolio-img img {
      transform: scale(1.1);
    }
  }

  .portfolio-img {
    overflow: hidden;
    height: 300px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: var(--transition-base);
    }
  }

  .portfolio-overlay {
    position: absolute;
    left: 15px;
    bottom: 15px;
    background-color: var(--color-white);
    padding: 20px 35px 20px 20px;
    border-radius: var(--border-radius-sm);
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.096);
    display: inline-block;

    .overlay-content {
      h4 {
        margin-top: 5px;
        font-size: 16px;
        font-weight: var(--font-weight-bold);
        line-height: 28px;
        color: var(--color-heading);
      }

      p {
        font-size: var(--font-size-sm);
        color: var(--color-body);
        margin: 8px 0 0 0;
      }

      .border-btn {
        display: inline-block;
        padding: 8px 27px;
        margin-top: 8px;
        color: var(--color-white);
        background-color: var(--color-primary);
        border: 2px solid var(--color-primary);
        border-radius: var(--border-radius-sm);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        cursor: pointer;
        transition: var(--transition-base);
        text-decoration: none;

        &:hover {
          color: var(--color-primary);
          background-color: var(--color-white);
          border-color: var(--color-primary);
          box-shadow: var(--shadow-md);
        }
      }
    }
  }
}

/* Single Portfolio */
.single-portfolio {
  .single-portfolio-img {
    border-radius: 0;
    overflow: hidden;
    margin-bottom: var(--spacing-lg);

    img {
      width: 100%;
      display: block;
    }
  }

  .single-portfolio-content {
    background-color: var(--color-white);
    padding: var(--spacing-lg);
    border-radius: var(--border-radius-md);
  }
}

/* Project Info Box */
.project-info-box {
  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      margin-bottom: 15px;
      display: flex;
      align-items: flex-start;
      font-size: 14px;
      color: var(--color-body);

      &:last-child {
        margin-bottom: 0;
      }

      .destination {
        width: 40%;
        color: var(--color-heading);
        text-transform: uppercase;
        font-weight: var(--font-weight-semibold);
        margin-right: var(--spacing-md);
      }

      .info {
        flex: 1;
        color: var(--color-body);
      }
    }
  }
}