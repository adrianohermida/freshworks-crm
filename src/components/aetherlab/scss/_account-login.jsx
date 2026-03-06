/* ======================================
   Account Login Section CSS (Refactored)
   ====================================== */

.account-login {
  background-color: $color-gray;
  padding: $spacing-xl 0;

  .inner-content {
    border-radius: $border-radius-md;
    overflow: hidden;
    box-shadow: $shadow-lg;
  }

  .login-form {
    padding: 60px 70px;
    background-color: $color-white;
    border: none;

    @media #{$md} {
      padding: 50px;
    }

    @media #{$xs} {
      padding: 50px 35px;
    }

    .card-body {
      padding: 0;
    }

    .title {
      margin-bottom: 45px;
      text-align: center;

      @media #{$xs} {
        margin-bottom: 30px;
      }

      h3 {
        font-size: 25px;
        font-weight: $font-weight-bold;
        color: $color-heading;
        margin-bottom: 8px;

        @media #{$xs} {
          font-size: 22px;
        }
      }
    }

    .input-head {
      // Additional styling as needed
    }
  }

  .bottom-content {
    margin-top: $spacing-lg;
  }

  .form-group {
    margin-bottom: $spacing-md;
    position: relative;

    label {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 9;
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      color: $color-gray-600;
    }

    .form-control {
      padding: 0 $spacing-md;
      transition: all $transition-base;
      border: 1px solid $color-gray-200;
      background-color: $color-gray;
      color: $color-gray-600;
      font-size: $font-size-sm;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      height: 52px;
      border-radius: 30px !important;
      overflow: hidden;
      width: 100%;
      padding-left: 55px;

      &::placeholder {
        color: $color-gray-400;
      }

      &:focus {
        border-color: $color-primary;
        background-color: $color-white;
        box-shadow: 0px 5px 8px rgba(126, 87, 255, 0.15);
        outline: none;
      }

      &:hover {
        border-color: $color-gray-300;
      }
    }
  }

  .lost-pass {
    color: $color-gray-500;
    font-size: $font-size-sm;
    text-decoration: none;
    transition: all $transition-base;

    &:hover {
      color: $color-primary;
      text-decoration: underline;
    }
  }

  .button {
    margin-top: 40px;
    text-align: center;

    @media #{$xs} {
      display: block;
      margin-top: 30px;

      .btn {
        margin-bottom: 13px;
        width: 100%;

        &:last-child {
          margin: 0;
        }
      }
    }

    .btn {
      padding: 14px 40px;
      margin-right: 20px;
      width: 100%;
      min-width: auto;

      &:last-child {
        margin: 0;
      }
    }
  }

  .or {
    position: relative;
    text-align: center;
    margin: $spacing-2xl 0;
    z-index: 0;

    span {
      text-align: center;
      font-size: $font-size-base;
      background-color: $color-white;
      padding: 5px 12px;
      color: $color-gray-600;
    }

    &::before {
      position: absolute;
      content: "";
      left: 0;
      top: 50%;
      margin-top: -1px;
      background-color: $color-border;
      height: 1px;
      width: 100%;
      z-index: -1;
    }
  }

  .alt-option {
    margin-top: $spacing-2xl;
    text-align: center;

    @media #{$xs} {
      margin-top: $spacing-lg;
    }

    .small-title {
      margin-bottom: $spacing-lg;
      text-align: center;
      display: block;
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      color: $color-heading;
    }

    .option-button {
      padding: 14px 25px 14px 15px;
      border: 1px solid $color-gray-200;
      border-radius: 30px;
      display: inline-block;
      text-align: center;
      color: $color-body;
      background-color: $color-white;
      transition: all $transition-base;
      cursor: pointer;
      margin-right: $spacing-sm;
      margin-bottom: $spacing-sm;

      &:hover {
        border-color: $color-primary;
        box-shadow: 0px 4px 12px rgba(126, 87, 255, 0.1);
      }

      img {
        display: inline-block;
        margin-right: $spacing-md;
        height: 20px;
        width: auto;
      }
    }

    li {
      font-weight: $font-weight-medium;
      display: inline-block;
      margin-right: $spacing-md;

      @media #{$xs} {
        display: block;
        margin-top: $spacing-sm;
        margin-right: 0;
      }

      &:last-child {
        margin-right: 0;
      }

      span {
        color: $color-body;
        display: inline-block;
      }

      a {
        color: $color-primary;
        text-decoration: none;
        transition: all $transition-base;

        &:hover {
          color: $color-heading;
          text-decoration: underline;
        }
      }
    }
  }

  .create-account {
    font-weight: $font-weight-medium;
    color: $color-heading;
    text-align: center;
    margin-top: 35px;
    font-size: $font-size-sm;
    display: block;

    a {
      color: $color-primary;
      text-decoration: none;
      transition: all $transition-base;

      &:hover {
        text-decoration: underline;
        color: $color-primary-dark;
      }
    }
  }
}