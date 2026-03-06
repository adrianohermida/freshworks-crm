/* ======================================
   FAQ CSS
   ====================================== */
.faq {
    padding-bottom: 80px;
    background-color: $gray;

    @media #{$xs} {
        .xs-margin {
            margin-top: 20px !important;
        }
    }

    .section-title {
        margin-bottom: 60px;

        @media #{$md} {
            margin-bottom: 40px;
        }

        @media #{$xs} {
            margin-bottom: 30px;
        }
    }

    @media #{$md} {
        padding-bottom: 40px;
    }

    @media #{$xs} {
        padding-bottom: 30px;
    }
}

.accordion-item:first-of-type .accordion-button {
    border-top-left-radius: $border-radius-sm;
    border-top-right-radius: $border-radius-sm;
    padding-right: 40px;
}

.accordion-item:last-of-type .accordion-button.collapsed {
    border-bottom-right-radius: $border-radius-sm;
    border-bottom-left-radius: $border-radius-sm;
}

.accordion-item .accordion-button {
    border-radius: $border-radius-sm;
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    width: 100%;
    display: block;
    overflow: hidden;
    border: none;
    padding: 15px 25px;
    padding-right: 40px;
    background-color: $white;
    transition: all $transition-base;

    @media #{$md} {
        padding: 18px 20px;
        padding-right: 40px;

    }

    @media #{$xs} {
        padding: 15px 20px;
        padding-right: 40px;

    }

    .title {
        font-size: $font-size-sm;
        position: relative;
        font-weight: $font-weight-semibold;
        float: left;
        line-height: 25px;
        color: $heading-color;

        @media #{$md} {
            font-size: $font-size-sm;
        }

        @media #{$xs} {
            font-size: $font-size-sm;
        }
    }

    i {
        font-size: $font-size-sm;
        transition: all $transition-base;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 20px;
        color: $heading-color;
    }
}

.accordion-button:not(.collapsed) {
    color: $white;
    background-color: $theme-color;
    border-radius: $border-radius-sm $border-radius-sm 0 0;

    i {
        color: $white;

        &::before {
            content: "\eb2e";
            font-family: lineIcons;
        }
    }
}

.accordion-button::after {
    display: none;
}

.accordion-collapse {
    border: none;
}

.accordion-body {
    border-radius: 0 0 $border-radius-sm $border-radius-sm;
    padding: $spacing-lg;
    background-color: $white;

    @media #{$md} {
        padding: $spacing-xl;
    }

    @media #{$xs} {
        padding: 20px;
    }

    p {
        margin: 0;
        margin-bottom: 20px;
        color: $body-color;
        font-size: $font-size-sm;
        line-height: $line-height-relaxed;

        &:last-child {
            margin: 0;
        }
    }
}

.accordion-item {
    margin-bottom: 20px;
    box-shadow: $shadow-sm;
    border-radius: $border-radius-sm;

    &:last-child {
        margin: 0;
    }
}