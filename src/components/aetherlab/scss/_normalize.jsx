
/* ======================================
   Normalize CSS
   ====================================== */
@import url('https://fonts.googleapis.com/css2?family=Spartan:wght@100;200;300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap');

html {
  scroll-behavior: smooth;
}

body {
  font-family: $font;
  font-weight: $font-weight-normal;
  font-style: normal;
  color: $body-color;
  overflow-x: hidden;
  font-size: $font-size-base;
}

p {
  margin: 0;
  padding: 0;
  font-size: $font-size-base;
  line-height: $line-height-relaxed;
}

* {
  margin: 0;
  padding: 0;
}

/* Focus & Interaction States */
.navbar-toggler:focus,
a:focus,
input:focus,
textarea:focus,
button:focus,
.btn:focus,
.btn.focus,
.btn:not(:disabled):not(.disabled).active,
.btn:not(:disabled):not(.disabled):active {
  text-decoration: none;
  outline: none !important;
  border-color: none !important;
  box-shadow: none !important;
}

.form-check-input:checked {
  background-color: $theme-color;
  border-color: $theme-color;
}

/* Select Elements */
select {
  -webkit-writing-mode: horizontal-tb !important;
  text-rendering: auto;
  color: $black;
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: start;
  appearance: menulist;
  box-sizing: border-box;
  align-items: center;
  white-space: pre;
  -webkit-rtl-ordering: logical;
  background-color: $white;
  cursor: default;
  margin: 0em;
  font: $font-weight-normal $font-size-sm;
  border-radius: 0px;
  border-width: 1px;
  border-style: solid;
  border-color: $color-gray-400;
  border-image: initial;
}

/* Links & Spans */
span,
a {
  display: inline-block;
  text-decoration: none;
  transition: all $transition-base;
}

/* Media Elements */
audio,
canvas,
iframe,
img,
svg,
video {
  vertical-align: middle;
}

img {
  max-width: 100%;
}

/* Headings */
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: $font-weight-semibold;
  margin: 0px;
  color: $heading-color;
  font-family: 'Spartan', sans-serif;
}

h1 a,
h2 a,
h3 a,
h4 a,
h5 a,
h6 a {
  color: inherit;
}

h1 {
  font-size: 50px;
}

h2 {
  font-size: 40px;
}

h3 {
  font-size: 30px;
}

h4 {
  font-size: 25px;
}

h5 {
  font-size: 20px;
}

h6 {
  font-size: 16px;
}

/* Lists */
ul,
ol {
  margin: 0px;
  padding: 0px;
  list-style-type: none;
}

/* ======================================
   Spacing Utilities
   ====================================== */
@for $i from 1 through 45 {
  $value: $i * 5;
  
  .mt-#{$value} {
    margin-top: #{$value}px;
  }
  
  .mb-#{$value} {
    margin-bottom: #{$value}px;
  }
  
  .pt-#{$value} {
    padding-top: #{$value}px;
  }
  
  .pb-#{$value} {
    padding-bottom: #{$value}px;
  }
}

/* ======================================
   Background & Container
   ====================================== */
.img-bg {
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}

.container {
  @media #{$sm} {
    width: 450px;
  }
}

/* ======================================
   Breadcrumbs
   ====================================== */
.breadcrumbs {
  position: relative;
  padding-top: 160px;
  padding-bottom: 120px;
  z-index: 2;
  text-align: left;
  background-color: $black;
  background-image: url('../images/bread-bg/banner-bg.svg');
  background-size: cover;
  background-position: right;
  background-repeat: no-repeat;
  box-shadow: $shadow-lg;

  &::before {
    position: absolute;
    content: "";
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: $black;
    opacity: 0.7;
  }

  @media #{$md} {
    padding-top: 110px;
    padding-bottom: 60px;
  }

  @media #{$xs} {
    padding-top: 100px;
    padding-bottom: 50px;
  }

  .breadcrumbs-content {
    position: relative;
    text-align: center;

    .page-title {
      font-size: 26px;
      color: $white;
      font-weight: 700;
      position: relative;
      line-height: 28px;
      text-transform: capitalize;

      @media #{$md} {
        font-size: 24px;
        line-height: 28px;
      }

      @media #{$xs} {
        font-size: 22px;
        text-align: center;
        line-height: 26px;
      }
    }

    .breadcrumb-nav {
      background: transparent;
      border-radius: 0;
      margin-bottom: 0;
      padding: 0;
      display: inline-block;
      margin-top: 10px;
    }
  }

  .breadcrumb-nav {
    text-align: right;

    @media #{$xs} {
      text-align: center;
      margin-top: 15px;
    }

    li {
      display: inline-block;
      position: relative;
      padding-right: 14px;
      margin-right: 14px;
      text-transform: capitalize;
      color: $white;
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;

      &::after {
        content: "\ea62";
        font-family: lineIcons;
        font-size: 11px;
        position: absolute;
        top: 3px;
        right: -7px;
      }

      &:last-child {
        margin: 0;
        padding: 0;

        &::after {
          display: none;
        }
      }

      a {
        color: $white;
        transition: all $transition-base;
        position: relative;

        i {
          font-size: 13px;
          display: inline-block;
          margin-right: 3px;
          position: relative;
          top: -1px;
        }

        &:hover {
          color: rgb(228, 228, 228);
        }
      }
    }
  }
}

/* ======================================
   Sections
   ====================================== */
.section {
  padding-top: 110px;
  padding-bottom: 110px;
  position: relative;

  @media #{$md} {
    padding-top: 70px;
    padding-bottom: 70px;
  }

  @media #{$xs} {
    padding-top: 60px;
    padding-bottom: 60px;
  }
}

/* Section Title */
.section-title {
  text-align: center;
  margin-bottom: 80px;
  padding: 0 300px;
  position: relative;
  z-index: 5;

  h3 {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    display: inline-block;
    margin-bottom: 20px;
    color: $theme-color;
    text-transform: capitalize;
  }

  h2 {
    font-size: 34px;
    margin-bottom: 20px;
    line-height: 42px;
    text-transform: capitalize;
    position: relative;
    font-weight: 700;
  }

  p {
    font-size: $font-size-base;
    line-height: $line-height-relaxed;
  }

  @media #{$lg} {
    padding: 0px 200px;
    margin-bottom: 70px;
  }

  @media #{$md} {
    padding: 0px 20px;
    margin-bottom: 50px;

    h3 {
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      margin-bottom: 12px;
    }

    h2 {
      font-size: 24px;
      line-height: 32px;
      margin-bottom: 20px;
    }

    p {
      font-size: $font-size-sm;
    }
  }

  @media #{$xs} {
    padding: 0px 10px;
    margin-bottom: 40px;

    h3 {
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      margin-bottom: 12px;
    }

    h2 {
      font-size: 24px;
      line-height: 30px;
      margin-bottom: 18px;
    }

    p {
      font-size: $font-size-sm;
    }
  }
}

.section-title.align-right {
  padding: 0;
  padding-left: 600px;

  h2 {
    &:after {
      position: absolute;
      right: 0;
      bottom: -1px;
      height: 2px;
      width: 50px;
      background: $theme-color;
      content: "";
    }
  }
}

.section-title.align-left {
  padding: 0;
  padding-right: 600px;

  h2 {
    &:before {
      left: 0;
      margin-left: 0;
    }
  }
}

/* ======================================
   Scroll to Top Button
   ====================================== */
.scroll-top {
  width: 45px;
  height: 45px;
  line-height: 45px;
  background: $theme-color;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: $white !important;
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9;
  cursor: pointer;
  transition: all $transition-base;
  border-radius: 5px;

  &:hover {
    box-shadow: $shadow-lg;
    transform: translate3d(0, -5px, 0);
    background-color: $theme-color;
  }
}

/* ======================================
   Overlay
   ====================================== */
.overlay {
  position: relative;
  z-index: 1;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.4;
    background: $black;
    content: "";
    transition: all $transition-base;
    z-index: -1;
  }
}

/* ======================================
   Pagination
   ====================================== */
.pagination {
  text-align: left;
  margin: 60px 0 0 0;
  display: block;

  @media #{$md} {
    margin-top: 50px;
  }

  @media #{$xs} {
    margin-top: 40px;
  }

  &.center {
    text-align: center;
  }

  &.right {
    text-align: right;
  }

  &.left {
    text-align: left;
  }

  .pagination-list {
    display: inline-block;
    overflow: hidden;

    li {
      margin-right: 5px;
      display: inline-block;
      margin-top: 10px;

      &:last-child {
        margin-right: 0px;
      }

      a {
        background: $white;
        color: $heading-color;
        font-weight: $font-weight-medium;
        font-size: $font-size-sm;
        border-radius: 5px;
        padding: 8px 20px;
        text-align: center;
        border: 1px solid $color-border;
        transition: all $transition-base;

        i {
          font-size: 13px;
        }
      }

      &.active a,
      &:hover a {
        background: $theme-color;
        color: $white;
        border-color: transparent;
      }
    }
  }
}

.blog-grids.pagination {
  margin-top: 50px;
  text-align: center;
}

/* ======================================
   Buttons
   ====================================== */
.button {
  margin-left: 0 !important;

  .btn {
    display: inline-block;
    text-transform: capitalize;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    padding: 14px 30px;
    background-color: $theme-color;
    color: $white;
    border: none;
    transition: all $transition-base;
    border-radius: 30px;
    position: relative;
    z-index: 1;
    margin-right: 7px;
    overflow: hidden;
    cursor: pointer;

    @media #{$md} {
      padding: 14px 25px;
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
    }

    @media #{$xs} {
      padding: 14px 25px;
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
    }

    i {
      display: inline-block;
      margin-right: 5px;
    }

    &:last-child {
      margin: 0;
    }

    &:hover {
      color: $white;
      background-color: $black;
    }
  }

  .btn-alt {
    background-color: $black !important;
    color: $white !important;

    @media #{$md} {
      padding: 14px 25px;
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
    }

    @media #{$xs} {
      padding: 14px 25px;
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
    }

    &:hover {
      background-color: $theme-color !important;
      color: $white !important;
    }
  }
}

/* ======================================
   Text Alignment
   ====================================== */
.align-left {
  text-align: left;
}

.align-right {
  text-align: right;
}

.align-center {
  text-align: center;
}

/* ======================================
   Preloader
   ====================================== */
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999999;
  width: 100%;
  height: 100%;
  background-color: $white;
  overflow: hidden;
}

.preloader-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.preloader-icon {
  width: 100px;
  height: 100px;
  display: inline-block;
  padding: 0px;

  span {
    position: absolute;
    display: inline-block;
    width: 100px;
    height: 100px;
    border-radius: 100%;
    background: $theme-color;
    animation: preloader-fx 1.6s linear infinite;

    &:last-child {
      animation-delay: -0.8s;
    }
  }
}

@keyframes preloader-fx {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }

  100% {
    transform: scale(1, 1);
    opacity: 0;
  }
}
