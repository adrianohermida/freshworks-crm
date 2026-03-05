/* ======================================
   Pricing Table CSS
   ====================================== */

.pricing-table {
  background-color: $gray;
  padding: $spacing-2xl 0;

  .section-title {
    margin-bottom: 50px;

    @media #{$md} {
      margin-bottom: 30px;
    }

    @media #{$xs} {
      margin-bottom: 20px;
    }
  }

  .single-table {
    border: 1px solid $color-gray-200;
    border-radius: $borderRadius;
    margin-top: 40px;
    background-color: $white;
    transition: all $transition-base;
    padding: $spacing-xl $spacing-lg;
    text-align: left;
    z-index: 0;
    position: relative;
    overflow: hidden;

    .popular {
      position: absolute;
      right: 20px;
      top: 18px;
      color: $theme-color;
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      background: $color-primary-light;
      padding: $spacing-sm;
      border-radius: 30px;
      text-transform: capitalize;
    }

    &:hover {
      box-shadow: $shadow-md;
      transform: translateY(-5px);
    }

    &.featured {
      border: 2px solid $theme-color;
      
      .table-head {
        .title {
          color: $theme-color;
        }
      }
    }

    .table-head {
      .title {
        font-size: $font-size-xl;
        font-weight: $font-weight-semibold;
        margin-bottom: 8px;
        color: $theme-color;
        display: inline-block;
        border-radius: 30px;
      }

      .sub-title {
        margin-bottom: 30px;
        font-size: $font-size-sm;
        color: $body-color;
      }

      p {
        font-weight: $font-weight-normal;
        color: $body-color;
      }

      .price {
        margin: $spacing-lg 0;
        
        .amount {
          font-size: 45px;
          font-weight: $font-weight-bold;
          display: inline-block;
          position: relative;
          padding-left: 16px;

          .currency {
            font-weight: $font-weight-medium;
            color: $body-color;
            font-size: $font-size-lg;
            position: absolute;
            left: 0;
            top: 3px;
          }

          .duration {
            display: inline-block;
            font-size: $font-size-sm;
            color: $body-color;
            font-weight: $font-weight-medium;
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
        background-color: $theme-color;
        color: $white;
        border: none;
        padding: 14px 30px;
        border-radius: 30px;
        font-size: $font-size-sm;
        font-weight: $font-weight-medium;
        cursor: pointer;
        transition: all $transition-base;
        text-transform: capitalize;

        &:hover {
          background-color: $color-primary-dark;
          color: $white;
        }

        i {
          display: inline-block;
          font-size: 20px;
          margin-left: 10px;
          position: relative;
          top: 2px;
        }
      }
    }

    .table-content {
      .table-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          font-size: $font-size-sm;
          margin-bottom: 16px;
          padding-left: 25px;
          font-weight: $font-weight-normal;
          color: $heading-color;
          position: relative;

          &::before {
            position: absolute;
            left: 0;
            top: 2px;
            content: "✓";
            color: $color-success;
            font-weight: $font-weight-bold;
            font-size: 16px;
          }

          &.disable {
            color: $body-color;

            &::before {
              content: "✗";
              color: $color-gray-300;
            }
          }
        }
      }
    }
  }
}