scss
/*======================================
	Footer CSS
========================================*/
.footer {
    background-color: $black;
    position: relative;
    padding-bottom: 0;
    padding-top: 80px;

    @media #{$md} {
        padding-top: 30px;
    }

    @media #{$xs} {
        padding-top: 20px;
    }

    .single-footer {
        @media #{$md} {
            margin-top: 40px;
        }

        @media #{$xs} {
            margin-top: 40px;
            text-align: center;
        }

        &.f-about {
            padding-right: 30px;

            @media #{$xs} {
                padding: 0;
            }

            .logo {
                margin-bottom: 20px;

                img {
                    width: 130px;

                    @media #{$md} {
                        width: 125px;
                    }

                    @media #{$xs} {
                        width: 120px;
                    }
                }
            }

            p {
                color: $white;
                margin-top: 20px;
                font-size: $font-size-sm;
                margin-bottom: 25px;
            }

            .social-title {
                color: $white;
                font-size: $font-size-xs;
                font-weight: $font-weight-semibold;
                display: block;
                margin-bottom: 20px;
            }

            .social {
                li {
                    display: inline-block;
                    margin-right: 15px;
                    transition: all $transition-base;

                    &:last-child {
                        margin: 0;
                    }

                    a {
                        color: $white;
                        transition: all $transition-base;

                        &:hover {
                            color: $theme-color;
                        }
                    }
                }
            }

            .copyright-text {
                color: $white;
                font-size: $font-size-sm;
                margin-top: 40px;

                span {
                    display: block;
                }

                @media #{$xs} {
                    margin-top: 20px;
                }

                a {
                    color: $white;
                    text-decoration: underline;
                    transition: all $transition-base;

                    &:hover {
                        color: $theme-color;
                    }
                }
            }
        }

        &.f-link {
            li {
                display: block;
                margin-bottom: 15px;

                &:last-child {
                    margin: 0;
                }

                a {
                    font-size: $font-size-sm;
                    font-weight: $font-weight-normal;
                    color: $white;
                    transition: all $transition-base;

                    &:hover {
                        color: $theme-color;
                    }
                }
            }
        }

        &.newsletter {
            @media #{$laptop},#{$desktop} {
                padding-left: 80px;
            }

            p {
                color: $white;
            }
        }

        h3 {
            font-size: 17px;
            font-weight: $font-weight-semibold;
            display: block;
            margin-bottom: 35px;
            color: $white;

            @media #{$md} {
                margin-bottom: 25px;
            }

            @media #{$xs} {
                margin-bottom: 25px;
            }
        }
    }

    .newsletter-form {
        margin-top: 30px;
        position: relative;

        input {
            height: 52px;
            width: 100%;
            border-radius: $border-radius-md;
            border: none;
            box-shadow: none;
            text-shadow: none;
            padding-left: 18px;
            padding-right: 70px;
            transition: all $transition-base;
            background-color: rgba(255, 255, 255, 0.12);
            color: $white;

            &::placeholder {
                color: rgba(255, 255, 255, 0.7);
            }

            &:hover {
                border-color: $theme-color;
            }

            &:focus {
                border-color: $theme-color;
                box-shadow: 0 0 0 3px rgba(126, 87, 255, 0.1);
            }
        }

        .button {
            position: absolute;
            right: 0px;
            top: 0;

            .sub-btn {
                height: 52px;
                width: 52px;
                border-radius: 0 $border-radius-md $border-radius-md 0;
                background-color: rgba(255, 255, 255, 0.16);
                color: $white;
                text-align: center;
                line-height: 52px;
                border: none;
                box-shadow: none;
                text-shadow: none;
                font-size: 18px;
                transition: all $transition-base;
                cursor: pointer;

                &:hover {
                    color: $white;
                    background-color: $theme-color;
                }
            }
        }
    }

    .copyright-area {

        .inner-content {
            border-top: 1px solid rgba(238, 238, 238, 0.288);
            padding-top: 30px;
            padding-bottom: 30px;
            margin-top: 80px;

            @media #{$xs} {
                margin-top: 50px;
                text-align: center;
            }
        }

        .copyright-owner {
            text-align: right;

            @media #{$xs} {
                text-align: center;
                margin-top: 3px;
            }
        }

        p {
            color: $white;
            font-size: $font-size-sm;

            a {
                text-decoration: underline;
                color: $white;
                transition: all $transition-base;

                &:hover {
                    color: $theme-color;
                }
            }
        }
    }
}
