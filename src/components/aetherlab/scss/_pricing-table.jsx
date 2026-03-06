/* ======================================
   Pricing Table CSS - Refactored to Design System
   ====================================== */

.pricing-table {
  background-color: var(--color-gray);
  padding: var(--spacing-2xl) 0;

  .section-title {
    margin-bottom: 50px;

    @media (max-width: 991px) {
      margin-bottom: 30px;
    }

    @media (max-width: 767px) {
      margin-bottom: 20px;
    }
  }

  .single-table {
    border: 1px solid var(--color-border);
    border-radius: 10px;
    margin-top: 40px;
    background-color: var(--color-white);
    transition: var(--transition-base);
    padding: 50px 35px;
    text-align: left;
    z-index: 0;
    position: relative;
    overflow: hidden;

    @media (max-width: 991px) {
      padding: 40px 30px;
    }

    @media (max-width: 767px) {
      padding: 30px 20px;
      margin-top: 30px;
    }

    &:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-5px);
    }

    .popular {
      position: absolute;
      right: 20px;
      top: 18px;
      color: var(--color-primary);
      font-size: 15px;
      font-weight: var(--font-weight-medium);
      background-color: rgba(126, 87, 255, 0.1);
      padding: 5px 12px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    &.middle {
      border: 2px solid var(--color-primary);
      box-shadow: var(--shadow-lg);
      transform: scale(1.05);

      @media (max-width: 991px) {
        transform: scale(1);
      }

      .table-head {
        .title {
          color: var(--color-primary);
          background-color: rgba(126, 87, 255, 0.1);
          padding: 10px 20px;
        }
      }
    }

    .table-head {
      .title {
        font-size: 20px;
        font-weight: var(--font-weight-semibold);
        margin-bottom: 8px;
        color: var(--color-heading);
        display: inline-block;
        border-radius: 30px;
        transition: var(--transition-base);
      }

      .sub-title {
        margin-bottom: 30px;
        font-size: var(--font-size-sm);
        color: var(--color-body);
      }

      p {
        font-weight: var(--font-weight-normal);
        color: var(--color-body);
        font-size: 14px;
        line-height: 22px;
      }

      .price {
        margin-top: 20px;

        .amount {
          font-size: 45px;
          font-weight: var(--font-weight-bold);
          display: inline-block;
          position: relative;
          padding-left: 16px;
          color: var(--color-heading);

          .currency {
            font-weight: var(--font-weight-medium);
            color: var(--color-body);
            font-size: 17px;
            position: absolute;
            left: 0;
            top: 3px;
          }

          .duration {
            display: inline-block;
            font-size: 14px;
            color: var(--color-body);
            font-weight: var(--font-weight-normal);
            margin-left: 3px;
          }
        }
      }
    }

    .table-list {
      margin-top: 40px;
    }

    .button {
      margin: 0;
      margin-top: 50px;

      .btn {
        width: 100%;
        text-align: center;
        transition: var(--transition-base);

        i {
          display: inline-block;
          font-size: 20px;
          margin-left: 10px;
          position: relative;
          top: 2px;
        }

        &:hover {
          transform: translateY(-2px);
        }
      }
    }

    .no-card {
      display: block;
      margin-top: 15px;
      font-size: var(--font-size-sm);
      color: var(--color-body);
      text-align: center;
    }

    .table-content {
      .table-list {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          font-size: 15px;
          margin-bottom: 16px;
          padding-left: 25px;
          font-weight: var(--font-weight-normal);
          color: var(--color-heading);
          position: relative;
          line-height: 24px;

          &::before {
            position: absolute;
            left: 0;
            top: 0;
            content: "\ea5a";
            font-family: LineIcons;
            color: var(--color-success);
            font-size: 15px;
            font-weight: bold;
          }

          &.disable {
            color: var(--color-body);

            &::before {
              color: var(--color-gray-300);
              content: "\ea87";
              opacity: 0.6;
            }
          }

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}