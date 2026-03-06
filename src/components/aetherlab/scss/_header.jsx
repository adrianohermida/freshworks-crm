
/* ======================================
   Header CSS - Refactored to Design System
   ====================================== */

.header {
  width: 100%;
  background: transparent;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  transition: var(--transition-base);

  @media (max-width: 991px) {
    padding: 18px 0 !important;

    .mobile-menu-btn .toggler-icon {
      background-color: var(--color-white);
    }

    .button {
      margin: 0 !important;
    }

    .navbar-collapse {
      position: absolute;
      top: 67px !important;
      left: 0;
      width: 100%;
      background-color: var(--color-white);
      z-index: 9;
      box-shadow: var(--shadow-md);
      padding: var(--spacing-sm) var(--spacing-md);
      max-height: 350px;
      overflow-y: scroll;
      border-top: 1px solid var(--color-border);
      border-radius: var(--border-radius-md);
    }

    .navbar .navbar-nav .nav-item a {
      &:hover {
        color: var(--color-primary) !important;
      }

      &.active {
        color: var(--color-primary) !important;
      }
    }

    .navbar-nav .nav-item {
      margin: 0;

      &:hover a {
        color: var(--color-primary);
      }

      a {
        padding: 12px 16px !important;

        &::before {
          display: none;
        }
      }
    }

    .navbar-nav .nav-item .sub-menu {
      position: static;
      width: 100%;
      opacity: 1;
      visibility: visible;
      box-shadow: none;
      padding: 0;
      border: none;
      margin-left: 15px;
      margin-right: 15px;

      .nav-item a {
        padding: 12px 12px;

        &:hover {
          color: var(--color-primary) !important;
        }
      }
    }

    .navbar-nav .nav-item a {
      color: var(--color-heading);
      display: flex;
      justify-content: space-between;
      padding: 10px 0;

      &::after {
        opacity: 1;
        visibility: visible;
      }
    }

    .navbar-nav .nav-item .sub-menu li.active {
      background: var(--color-white) !important;
      color: var(--color-primary) !important;
    }

    .navbar-nav .nav-item .sub-menu {
      .nav-item {
        margin: 0 !important;

        a {
          padding: 10px 12px !important;
        }
      }
    }

    .navbar-nav .nav-item .sub-menu li:hover {
      background: var(--color-white) !important;
      color: var(--color-primary) !important;
    }

    .navbar-nav .nav-item a {
      font-size: var(--font-size-sm);

      &:hover {
        color: var(--color-primary);
      }
    }
  }

  @media (max-width: 767px) {
    padding: 18px 0 !important;

    .mobile-menu-btn .toggler-icon {
      background-color: var(--color-white);
    }

    .navbar-collapse {
      position: absolute;
      top: 62px !important;
      left: 0;
      width: 100%;
      background-color: var(--color-white);
      z-index: 9;
      box-shadow: var(--shadow-md);
      padding: var(--spacing-sm) var(--spacing-md);
      max-height: 350px;
      overflow-y: scroll;
      border-top: 1px solid var(--color-border);
      border-radius: var(--border-radius-md);
    }

    .navbar .navbar-nav .nav-item a {
      &:hover {
        color: var(--color-primary) !important;
      }

      &.active {
        color: var(--color-primary) !important;
      }
    }

    .navbar-nav .nav-item {
      margin: 0;

      &:hover a {
        color: var(--color-primary);
      }

      a {
        padding: 12px 16px !important;

        &::before {
          display: none;
        }
      }
    }

    .navbar-nav .nav-item .sub-menu {
      position: static;
      width: 100%;
      opacity: 1;
      visibility: visible;
      box-shadow: none;
      padding: 0;
      border: none;
      margin-left: 15px;
      margin-right: 15px;

      .nav-item a {
        padding: 12px 12px;

        &:hover {
          color: var(--color-primary) !important;
        }
      }
    }

    .navbar-nav .nav-item a {
      color: var(--color-heading);
      display: flex;
      justify-content: space-between;
      padding: 10px 0;

      &::after {
        opacity: 1;
        visibility: visible;
      }
    }

    .navbar-nav .nav-item .sub-menu li.active {
      background: var(--color-white) !important;
      color: var(--color-primary) !important;
    }

    .navbar-nav .nav-item .sub-menu {
      .nav-item {
        margin: 0 !important;

        a {
          padding: 10px 12px !important;
        }
      }
    }

    .navbar-nav .nav-item .sub-menu li:hover {
      background: var(--color-white) !important;
      color: var(--color-primary) !important;
    }

    .navbar-nav .nav-item a {
      font-size: var(--font-size-sm);

      &:hover {
        color: var(--color-primary);
      }
    }
  }

  .navbar-brand {
    img {
      width: 130px;

      @media (max-width: 991px) {
        width: 125px;
      }

      @media (max-width: 767px) {
        width: 120px;
      }
    }
  }

  &.sticky {
    .button {
      .btn {
        background-color: var(--color-primary);
        color: var(--color-white);

        &:hover {
          background-color: var(--color-heading);
          color: var(--color-white);
        }
      }
    }
  }
}

/* Sticky Header */
.sticky {
  position: fixed;
  z-index: 99;
  box-shadow: var(--shadow-xl);
  transition: var(--transition-base);
  top: 0;
  background-color: var(--color-white);
}

.navbar-expand-lg .navbar-nav {
  margin: 0;
  margin-left: auto !important;
  margin-right: auto !important;
}

.header .navbar .navbar-nav .nav-item a.active {
  color: var(--color-white);
}

.sticky .navbar .navbar-nav .nav-item a.active {
  color: var(--color-primary);
}

.sticky .navbar .navbar-nav .nav-item a {
  color: var(--color-heading);
}

.header .navbar .navbar-nav .nav-item .sub-menu a.active {
  color: var(--color-white);
}

.sticky .navbar .navbar-nav .nav-item .sub-menu a.active {
  color: var(--color-white);
}

.sticky .navbar .mobile-menu-btn .toggler-icon {
  background: var(--color-heading);
}

/* ===== NAVBAR ===== */
.navbar-area {
  width: 100%;
  z-index: 99;
  transition: var(--transition-base);
  padding: 0;
}

.navbar-area.sticky {
  position: fixed;
  z-index: 99;
  box-shadow: var(--shadow-xl);
  transition: var(--transition-base);
  padding: 0;
}

.navbar {
  padding: 0;
  position: relative;
  transition: var(--transition-base);
}

.navbar-brand {
  padding-left: 0;
  border-radius: 0;
}

.mobile-menu-btn {
  padding: 0;
}

.mobile-menu-btn:focus {
  text-decoration: none;
  outline: none;
  box-shadow: none;
}

.mobile-menu-btn .toggler-icon {
  width: 30px;
  height: 2px;
  background-color: var(--color-heading);
  display: block;
  margin: 5px 0;
  position: relative;
  transition: var(--transition-base);
}

.mobile-menu-btn.active .toggler-icon:nth-of-type(1) {
  transform: rotate(45deg);
  top: 7px;
}

.mobile-menu-btn.active .toggler-icon:nth-of-type(2) {
  opacity: 0;
}

.mobile-menu-btn.active .toggler-icon:nth-of-type(3) {
  transform: rotate(135deg);
  top: -7px;
}

/* Navigation Items */
.navbar-nav .nav-item {
  z-index: 1;
  position: relative;
  margin-right: 40px;

  &:last-child {
    margin-right: 0 !important;
  }
}

.navbar-nav .nav-item:hover a {
  color: var(--color-primary);
}

.sticky .navbar-nav .nav-item:hover a {
  color: var(--color-primary);
}

.navbar-nav .nav-item a {
  font-size: var(--font-size-base);
  color: var(--color-white);
  transition: var(--transition-base);
  position: relative;
  padding: 35px 0;
  display: inline-flex;
  align-items: center;
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;

  &::after {
    opacity: 0;
    visibility: hidden;
  }
}

.navbar-nav .nav-item:hover a:before {
  width: 100%;
}

.navbar-nav .nav-item a.active {
  color: var(--color-white);
}

.navbar-nav .nav-item a.dd-menu::after {
  content: "\ea5e";
  font: normal normal normal 1em/1 "LineIcons";
  position: absolute;
  right: 17px;
  font-size: 10px;
  top: 50%;
  margin-left: 5px;
  transition: var(--transition-base);
  height: 10px;
}

@media (min-width: 992px) and (max-width: 1199px) {
  .navbar-nav .nav-item a.dd-menu::after {
    right: 13px;
  }
}

@media (min-width: 768px) and (max-width: 991px),
(max-width: 767px) {
  .navbar-nav .nav-item a.dd-menu::after {
    top: 18px;
    right: 0;
    transform: rotate(180deg);
  }

  .navbar-nav .nav-item a.collapsed::after {
    transform: rotate(0deg);
  }
}

/* Submenu */
.navbar-nav .nav-item:hover > .sub-menu {
  top: 100%;
  opacity: 1;
  visibility: visible;
}

.navbar-nav .nav-item:hover > .sub-menu .sub-menu {
  left: 100%;
  top: 0;
}

.navbar-nav .nav-item .sub-menu {
  padding: var(--spacing-lg);
  min-width: 240px;
  background: var(--color-white);
  box-shadow: var(--shadow-md);
  position: absolute;
  top: 110% !important;
  left: 0;
  opacity: 0;
  visibility: hidden;
  transition: var(--transition-base);
  border-radius: var(--border-radius-md);
}

.navbar-nav .nav-item:hover {
  .sub-menu {
    top: 100% !important;
  }
}

.navbar-nav .nav-item .sub-menu .nav-item {
  width: 100%;
  margin-bottom: 15px;

  &:last-child {
    margin: 0;
  }
}

.navbar-nav .nav-item .sub-menu .nav-item a {
  padding: 0;
  color: var(--color-body);
  display: block;
  width: 100%;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;
  position: relative;
  z-index: 1;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  transition: var(--transition-base);

  &:hover {
    color: var(--color-primary);
  }
}

.navbar-nav .nav-item .sub-menu.left-menu {
  left: -100%;
}

.navbar-nav .nav-item .sub-menu.collapse:not(.show) {
  display: block;
}

@media (min-width: 768px) and (max-width: 991px),
(max-width: 767px) {
  .navbar-nav .nav-item .sub-menu.collapse:not(.show) {
    display: none;
  }
}

.navbar-nav .nav-item .sub-menu > li {
  display: block;
  margin-left: 0;
}

.navbar-nav .nav-item .sub-menu > li:last-child {
  border: none;
}

.navbar-nav .nav-item .sub-menu > li.active > a {
  color: var(--color-primary) !important;
}

.navbar-nav .nav-item .sub-menu > li > a {
  font-weight: var(--font-weight-normal);
  display: block;
  padding: 12px 15px;
  font-size: var(--font-size-sm);
  color: var(--color-heading);
}

.navbar-nav .nav-item .sub-menu > li:first-child a {
  border: none;
}

/* Header Buttons */
.header .button {
  display: inline-block;
  margin-left: var(--spacing-sm);

  @media (max-width: 767px) {
    display: none;
  }

  .btn {
    background-color: var(--color-white);
    color: var(--color-heading);
    font-weight: var(--font-weight-medium);
    padding: 12px 24px;
    border-radius: 30px;
    border: none;
    cursor: pointer;
    transition: var(--transition-base);

    &:hover {
      color: var(--color-white);
      background-color: var(--color-primary);
    }
  }
}

.sticky .button {
  .btn {
    background-color: var(--color-primary);
    color: var(--color-white);

    &:hover {
      background-color: var(--color-primary);
      color: var(--color-white);
    }
  }
}

.header {
  @media (max-width: 991px),
  (max-width: 767px) {
    .button {
      .signin {
        color: var(--color-heading);

        &:hover {
          color: var(--color-primary);
        }
      }

      .signup {
        background-color: var(--color-primary);
        color: var(--color-white);

        &:hover {
          background-color: var(--color-primary);
          color: var(--color-white);
        }
      }
    }
  }
}

/* ===== End Header CSS ===== */
