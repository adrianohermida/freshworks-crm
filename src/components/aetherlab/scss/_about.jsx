/* ======================================
   About Section CSS (Refactored)
   ====================================== */

.about {
  img {
    width: 100%;
  }

  .content {
    @media #{$laptop} {
      padding-left: $spacing-xl;
    }

    @media #{$desktop} {
      padding-left: $spacing-xl;
    }

    @media #{$md} {
      margin-top: 60px;
    }

    @media #{$xs} {
      margin-top: 50px;
    }

    h4 {
      color: $color-primary;
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      margin-bottom: $spacing-lg;
      text-transform: capitalize;
      letter-spacing: 0.5px;
    }

    h2 {
      font-size: 35px;
      font-weight: $font-weight-bold;
      line-height: 48px;
      color: $color-heading;
      margin-bottom: $spacing-lg;

      @media #{$md} {
        font-size: 30px;
        font-weight: $font-weight-bold;
        line-height: 42px;
      }

      @media #{$xs} {
        font-size: 24px;
        font-weight: $font-weight-bold;
        line-height: 34px;
      }
    }

    p {
      font-size: $font-size-base;
      margin-top: $spacing-lg;
      color: $color-body;
      line-height: $line-height-relaxed;
    }

    .list {
      margin-top: $spacing-xl;

      .single-list {
        position: relative;
        padding-left: 42px;
        margin-top: $spacing-2xl;
        display: inline-block;
        transition: all $transition-base;

        @media #{$md} {
          width: 49%;
          margin-right: 2%;
        }

        @media #{$xs} {
          display: block;
          width: 100%;
        }

        .list-icon {
          height: 20px;
          width: 20px;
          line-height: 20px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: $color-white;
          font-size: $font-size-xs;
          background-color: $color-primary;
          position: absolute;
          left: 0;
          top: 0;
          transition: all $transition-base;
          flex-shrink: 0;
        }

        &:hover {
          .list-icon {
            transform: rotate(360deg);
            background-color: $color-primary-dark;
            box-shadow: 0 4px 12px rgba(126, 87, 255, 0.3);
          }
        }

        h4 {
          color: $color-heading;
          font-size: $font-size-sm;
          font-weight: $font-weight-semibold;
          margin-bottom: $spacing-sm;
          margin-top: 0;
        }

        p {
          margin: 0;
          font-size: $font-size-sm;
          line-height: $line-height-normal;
          color: $color-body;
        }
      }
    }
  }
}