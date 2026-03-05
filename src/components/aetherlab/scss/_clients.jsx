/* ======================================
   Clients Logo Section CSS (Refactored)
   ====================================== */

.client-logo {
  background-color: $color-gray;
  padding: $spacing-2xl 0;

  .single-logo {
    padding: 0 $spacing-xl;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    transition: all $transition-base;

    @media #{$md} {
      padding: 0 $spacing-md;
    }

    @media #{$xs} {
      padding: $spacing-md $spacing-xl;
      border: 1px solid $color-border;
      background: $color-white;
      border-radius: $border-radius-sm;
      min-height: auto;
    }

    img {
      max-width: 100%;
      height: auto;
      object-fit: contain;
      filter: grayscale(100%);
      opacity: 0.8;
      transition: all $transition-base;

      @media #{$xs} {
        width: 75%;
      }

      &:hover {
        filter: grayscale(0%);
        opacity: 1;
      }
    }

    &:hover {
      @media #{$xs} {
        box-shadow: $shadow-md;
      }
    }
  }
}