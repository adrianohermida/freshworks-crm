
/*======================================
    Hero Area CSS
========================================*/
.hero-area {
    position: relative;
    background-image: url('../images/hero/bg-shapes.svg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: $black;
    z-index: 0;

    @media #{$md} {
        background-image: none;
        padding: 150px 0 100px 0;
    }

    @media #{$xs} {
        background-image: none;
        padding: 110px 0 80px 0;
    }

    .hero-content {
        border-radius: 0;
        position: relative;
        z-index: 1;
        text-align: left;
        padding: 240px 0 140px 0;

        @media #{$md} {
            padding: 0px 140px;
        }

        h4 {
            color: $theme-color;
            font-weight: $font-weight-semibold;
            font-size: $font-size-sm;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        h1 {
            font-weight: $font-weight-bold;
            font-size: 38px;
            line-height: 55px;
            color: $white;
            text-transform: capitalize;
            font-family: $font-heading;
            margin: 0;
        }

        p {
            font-weight: $font-weight-normal;
            font-size: $font-size-base;
            line-height: $line-height-relaxed;
            margin-top: 20px;
            color: rgba(230, 230, 230, 0.9);
        }

        .button {
            margin-top: 50px;
            display: flex;
            gap: 15px;

            @media #{$md} {
                margin-top: 30px !important;
                width: 100%;
            }

            @media #{$xs} {
                margin-top: 30px;
                width: 100%;
                flex-direction: column;
            }

            .btn {
                transition: all $transition-base;

                @media #{$xs} {
                    width: 100%;
                }

                &:hover {
                    color: $black;
                    background-color: $white;
                    transform: translateY(-2px);
                }
            }
        }

        @media #{$lg} {
            h1 {
                font-size: 40px;
            }
        }

        @media #{$md} {
            text-align: center;

            h1 {
                font-size: 30px;
                font-weight: $font-weight-bold;
                line-height: 38px;
            }

            p {
                font-size: $font-size-sm;
            }
        }

        @media #{$xs} {
            padding: 0 10px;
            text-align: center;

            h1 {
                font-size: 24px;
                line-height: 32px;
            }

            p {
                margin-top: 15px;
                font-size: $font-size-sm;
                line-height: 26px;
            }

            .button {
                .btn {
                    width: 100%;
                    margin: 0;
                    margin-bottom: 7px;

                    &:last-child {
                        margin: 0;
                    }
                }
            }
        }
    }

    .hero-image {
        height: 100%;
        width: 100%;

        @media #{$md},#{$xs} {
            display: none;
        }

        .main-image {
            position: absolute;
            bottom: 0;
            z-index: 0;
            left: 53%;
        }
    }

}
