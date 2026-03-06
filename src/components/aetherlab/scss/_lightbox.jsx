@charset "UTF-8";

/* ===================================
   GLightbox Integration - Aetherlab
   Image & Media Lightbox Gallery
=================================== */

// Container
.glightbox-container {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999 !important;
  overflow: hidden;
  -ms-touch-action: none;
  touch-action: none;
  -webkit-text-size-adjust: 100%;
  -webkit-backface-visibility: hidden;
  outline: 0;

  &.inactive {
    display: none;
  }

  .gcontainer {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 9999;
    overflow: hidden;
  }

  .gslider {
    -webkit-transition: -webkit-transform 0.4s ease;
    transition: transform 0.4s ease;
    height: 100%;
    left: 0;
    top: 0;
    width: 100%;
    position: relative;
    overflow: hidden;
    display: flex !important;
    justify-content: center;
    align-items: center;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  .gslide {
    width: 100%;
    position: absolute;
    opacity: 0;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;

    &.current {
      opacity: 1;
      z-index: 99999;
      position: relative;
    }

    &.prev {
      opacity: 1;
      z-index: 9999;
    }
  }

  .gslide-inner-content {
    width: 100%;
  }

  .ginner-container {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    max-width: 100%;
    margin: auto;
    height: 100vh;

    &.gvideo-container {
      width: 100%;
    }

    &.desc-bottom,
    &.desc-top {
      flex-direction: column;
    }

    &.desc-left,
    &.desc-right {
      max-width: 100% !important;
    }
  }
}

// Media Elements
.gslide {
  iframe,
  video {
    outline: 0 !important;
    border: none;
    min-height: 165px;
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
    -ms-touch-action: auto;
    touch-action: auto;
  }
}

// Image Slide
.gslide-image {
  align-items: center;

  img {
    max-height: 100vh;
    display: block;
    max-width: 100%;
    margin: 0;
    padding: 0;
    float: none;
    outline: 0;
    border: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    max-width: 100vw;
    width: auto;
    height: auto;
    object-fit: cover;
    -ms-touch-action: none;
    touch-action: none;
    margin: auto;
    min-width: 200px;

    &.zoomable {
      position: relative;
    }

    &.dragging {
      cursor: grabbing !important;
      transition: none;
    }
  }
}

.desc-bottom,
.desc-top {
  .gslide-image img {
    width: auto;
  }
}

.desc-left,
.desc-right {
  .gslide-image img {
    width: auto;
    max-width: 100%;
  }
}

// Video Slide
.gslide-video {
  width: 100%;
  max-width: 100%;
  position: relative;
  width: 100vh;
  max-width: 100vh;
  width: 100% !important;

  .gvideo-wrapper {
    width: 100%;
    margin: auto;
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 0, 0, 0.34);
    display: none;
  }

  &.playing::before {
    display: none;
  }

  &.fullscreen {
    max-width: 100% !important;
    min-width: 100%;
    height: 80vh;

    video {
      max-width: 100% !important;
      width: 100% !important;
    }
  }
}

// Inline Content
.gslide-inline {
  background: #fff;
  text-align: left;
  max-height: calc(100vh - 40px);
  overflow: auto;
  max-width: 100%;

  .ginlined-content {
    padding: 20px;
    width: 100%;
  }
}

.ginlined-content {
  overflow: auto;
  display: block !important;
  opacity: 1;
}

// External Content
.gslide-external {
  display: flex;
  width: 100%;
  min-width: 100%;
  background: #fff;
  padding: 0;
  overflow: auto;
  max-height: 75vh;
  height: 100%;
}

// Media & Description
.gslide-media {
  display: inline-flex;
  display: flex;
  width: auto;
}

.zoomed .gslide-media {
  box-shadow: none !important;
}

.desc-bottom,
.desc-top {
  .gslide-media {
    margin: 0 auto;
    flex-direction: column;
  }
}

.gslide-description {
  position: relative;

  &.description-left,
  &.description-right {
    max-width: 100%;
  }

  &.description-bottom,
  &.description-top {
    margin: 0 auto;
    width: 100%;
  }

  p {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.zoomed .gslide-description {
  display: none;
}

// Mobile Description
.glightbox-mobile .glightbox-container .gslide-description {
  height: auto !important;
  width: 100%;
  background: 0 0;
  position: absolute;
  bottom: 15px;
  padding: 19px 11px;
  max-width: 100vw !important;
  order: 2 !important;
  max-height: 78vh;
  overflow: auto !important;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.75) 100%);
  transition: opacity 0.3s linear;
  padding-bottom: 50px;

  .gslide-title {
    color: #fff;
    font-size: 1em;
  }

  .gslide-desc {
    color: #a1a1a1;

    a {
      color: #fff;
      font-weight: 700;
    }

    * {
      color: inherit;
    }

    string {
      color: #fff;
    }

    .desc-more {
      color: #fff;
      opacity: 0.4;
    }
  }
}

// Description Toggle
.gdesc-open .gslide-media {
  transition: opacity 0.5s ease;
  opacity: 0.4;
}

.gdesc-open .gdesc-inner {
  padding-bottom: 30px;
}

.gdesc-closed .gslide-media {
  transition: opacity 0.5s ease;
  opacity: 1;
}

// Utility Classes
.greset {
  transition: all 0.3s ease;
}

.gabsolute {
  position: absolute;
}

.grelative {
  position: relative;
}

.glightbox-desc {
  display: none !important;
}

.glightbox-open {
  overflow: hidden;
}

// Loader
.gloader {
  height: 25px;
  width: 25px;
  animation: lightboxLoader 0.8s infinite linear;
  border: 2px solid #fff;
  border-right-color: transparent;
  border-radius: 50%;
  position: absolute;
  display: block;
  z-index: 9999;
  left: 0;
  right: 0;
  margin: 0 auto;
  top: 47%;
}

// Overlay
.goverlay {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #000;
  will-change: opacity;
}

.glightbox-mobile .goverlay {
  background: #000;
}

// Controls
.gclose,
.gnext,
.gprev {
  background-repeat: no-repeat;
  z-index: 99999;
  cursor: pointer;
  width: 26px;
  height: 44px;
  display: block;
  background-position: 0 0;
  border: none;

  svg {
    display: block;
    width: 100%;
    height: auto;
  }

  &.disabled {
    opacity: 0.1;
  }

  .garrow {
    stroke: #fff;
  }
}

iframe.wait-autoplay {
  opacity: 0;
}

.glightbox-closing {
  .gclose,
  .gnext,
  .gprev {
    opacity: 0 !important;
  }
}

// Theme: Clean & Modern
.glightbox-clean,
.glightbox-modern {
  .gslide-description {
    background: #fff;
  }

  .gdesc-inner {
    padding: 22px 20px;
  }

  .gslide-title {
    font-size: 1em;
    font-weight: 400;
    font-family: arial;
    color: #000;
    margin-bottom: 19px;
    line-height: 1.4em;
  }

  .gslide-desc {
    font-size: 0.86em;
    margin-bottom: 0;
    font-family: arial;
    line-height: 1.4em;
  }

  .gslide-video {
    background: #000;
  }

  .gclose,
  .gnext,
  .gprev {
    background-color: rgba(0, 0, 0, 0.12);

    &:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }

    path {
      fill: #fff;
    }
  }

  button:focus:not(.focused):not(.disabled) {
    outline: 0;
  }

  .gprev {
    position: absolute;
    top: -100%;
    left: 30px;
    width: 40px;
    height: 56px;
  }

  .gnext {
    position: absolute;
    top: -100%;
    right: 30px;
    width: 40px;
    height: 56px;
  }

  .gclose {
    width: 35px;
    height: 35px;
    top: 15px;
    right: 10px;
    position: absolute;
    opacity: 0.7;
    background-position: -59px 2px;

    svg {
      width: 20px;
    }

    &:hover {
      opacity: 1;
    }
  }
}

// Animations
.gfadeIn {
  animation: gfadeIn 0.5s ease;
}

.gfadeOut {
  animation: gfadeOut 0.5s ease;
}

.gslideOutLeft {
  animation: gslideOutLeft 0.3s ease;
}

.gslideInLeft {
  animation: gslideInLeft 0.3s ease;
}

.gslideOutRight {
  animation: gslideOutRight 0.3s ease;
}

.gslideInRight {
  animation: gslideInRight 0.3s ease;
}

.gzoomIn {
  animation: gzoomIn 0.5s ease;
}

.gzoomOut {
  animation: gzoomOut 0.5s ease;
}

// Keyframes
@keyframes lightboxLoader {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes gfadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes gfadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes gslideInLeft {
  from {
    opacity: 0;
    transform: translate3d(-60%, 0, 0);
  }
  to {
    visibility: visible;
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes gslideOutLeft {
  from {
    opacity: 1;
    visibility: visible;
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-60%, 0, 0);
    opacity: 0;
    visibility: hidden;
  }
}

@keyframes gslideInRight {
  from {
    opacity: 0;
    visibility: visible;
    transform: translate3d(60%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes gslideOutRight {
  from {
    opacity: 1;
    visibility: visible;
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(60%, 0, 0);
    opacity: 0;
  }
}

@keyframes gzoomIn {
  from {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  to {
    opacity: 1;
  }
}

@keyframes gzoomOut {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  to {
    opacity: 0;
  }
}

// Desktop Styles
@media (min-width: 769px) {
  .glightbox-container .ginner-container {
    width: auto;
    height: auto;
    flex-direction: row;

    &.desc-top {
      .gslide-description {
        order: 0;
      }

      .gslide-image,
      .gslide-image img {
        order: 1;
      }
    }

    &.desc-left {
      .gslide-description {
        order: 0;
      }

      .gslide-image {
        order: 1;
      }
    }
  }

  .gslide-image img {
    max-height: 97vh;
    max-width: calc(100% - 20px);
    max-width: 100%;

    &.zoomable {
      cursor: zoom-in;
    }
  }

  .zoomed .gslide-image img.zoomable {
    cursor: grab;
  }

  .gslide-inline {
    max-height: 95vh;
  }

  .gslide-external {
    max-height: 100vh;
  }

  .gslide-description {
    &.description-left,
    &.description-right {
      max-width: 275px;
    }
  }

  .glightbox-open {
    height: auto;
  }

  .goverlay {
    background: rgba(0, 0, 0, 0.92);
  }

  .glightbox-clean,
  .glightbox-modern {
    .gslide-media {
      box-shadow: 1px 2px 9px 0 rgba(0, 0, 0, 0.65);
    }

    .gprev {
      top: 45%;
    }

    .gnext {
      top: 45%;
    }
  }
}

@media (min-width: 992px) {
  .glightbox-clean,
  .glightbox-modern {
    .gclose {
      right: 20px;
    }
  }
}

@media screen and (max-height: 420px) {
  .goverlay {
    background: #000;
  }
}