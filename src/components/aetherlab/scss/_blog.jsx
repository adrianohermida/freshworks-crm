
/*======================================
    Blog CSS
========================================*/
.blog-section {
    background-color: $white;

    .section-title {
        margin-bottom: 50px;

        @media #{$md} {
            margin-bottom: 30px;
        }

        @media #{$xs} {
            margin-bottom: 20px;
        }
    }

}

/* Single Blog Grid*/
.single-blog-grid {
    margin-top: 30px;
    background-color: $white;
    border-radius: $border-radius;
    box-shadow: $shadow-md;
    overflow: hidden;
    transition: all $transition-base;

    .blog-img {
        overflow: hidden;

        a {
            width: 100%;
        }

        img {
            width: 100%;
            transition: all $transition-base;
        }
    }

    &:hover {
        box-shadow: $shadow-lg;
        transform: translateY(-5px);

        .blog-img {
            img {
                transform: scale(1.1);
            }
        }
    }

    .blog-content {
        padding: $spacing-xl;

        .meta-info {
            margin-bottom: 20px;

            a {
                display: inline-block;
                margin-right: 22px;
                font-size: $font-size-sm;
                color: $body-color;
                font-weight: $font-weight-medium;
                transition: all $transition-base;

                i {
                    display: inline-block;
                    margin-right: 5px;
                    color: $theme-color;
                    font-size: 16px;
                }

                &:last-child {
                    margin: 0;
                }

                &:hover {
                    color: $theme-color;
                }
            }
        }

        h4 {
            display: block;
            line-height: 28px;

            a {
                font-size: $font-size-lg;
                color: $black;
                font-weight: $font-weight-bold;
                display: inline-block;
                transition: all $transition-base;

                &:hover {
                    color: $theme-color;
                }
            }
        }

        p {
            display: block;
            margin-top: 20px;
            color: $body-color;
            font-size: $font-size-sm;
        }

        .button {
            margin-top: 20px;

            .btn {
                padding: 0;
                background-color: transparent;
                color: $black;
                text-decoration: underline;
                overflow: visible;
                font-weight: $font-weight-medium;
                transition: all $transition-base;

                &:hover {
                    color: $theme-color;
                }
            }
        }
    }
}

.blog-list {
    background: $gray;

    @media #{$md},$xs {
        .pagination {
            margin-top: 20px;
        }
    }

    .single-blog {
        margin-bottom: 30px;
    }
}

/* News Details */
.blog-single {
    background: $white;

    .main-content-head {
        @media #{$laptop},$desktop {
            padding-right: 30px;
        }
    }

    .meta-info {
        margin-top: 20px;
        margin-bottom: 30px;

        li {
            font-size: $font-size-sm;
            display: inline-block;
            margin-right: 15px;
            padding-right: 15px;
            position: relative;

            @media #{$xs} {
                margin-bottom: 8px;
            }

            &::before {
                position: absolute;
                content: "";
                right: -5px;
                top: 50%;
                background-color: $color-gray-300;
                height: 5px;
                width: 5px;
                border-radius: 50%;
                transform: translateY(-50%);
            }

            &:last-child {
                margin: 0;
                padding: 0;

                &::before {
                    display: none;
                }
            }

            a {
                color: $body-color;
                font-size: $font-size-sm;
                font-weight: $font-weight-normal;
                transition: all $transition-base;

                i {
                    display: inline-block;
                    margin-right: 2px;
                }

                &:hover {
                    color: $theme-color;
                }

                img {
                    height: 50px;
                    width: 50px;
                    border-radius: 50%;
                    display: inline-block;
                    margin-right: 12px;
                }
            }
        }
    }

    .post-thumbnils {
        position: relative;
        overflow: hidden;
        border-radius: $border-radius;
        margin-bottom: 40px;

        @media #{$md} {
            margin-bottom: 40px;
        }

        @media #{$xs} {
            margin-bottom: 30px;
        }

        img {
            width: 100%;
        }
    }

    .post-title {
        line-height: 40px;
        font-size: 26px;
        font-weight: $font-weight-bold;
        display: inline-block;

        @media #{$md} {
            line-height: 40px;
            font-size: 22px;
        }

        @media #{$xs} {
            line-height: 32px;
            font-size: 20px;
        }
    }

    p {
        font-size: $font-size-sm;
        margin: 30px 0;
        line-height: $line-height-relaxed;
        color: $body-color;

        &:first-child {
            margin-top: 0;
        }

        &:last-child {
            margin-bottom: 0;
        }
    }

    h3 {
        font-size: $font-size-xl;
        margin-bottom: 30px;
        font-weight: $font-weight-bold;
        line-height: 28px;
        color: $heading-color;

        @media #{$xs} {
            font-size: 18px;
        }
    }

    .image-block {
        margin: 30px 0;

        img {
            width: 100%;
            border-radius: $border-radius-sm;

            @media #{$xs} {
                margin: 10px 0;
            }
        }
    }
}

blockquote {
    position: relative;
    color: $white;
    font-weight: $font-weight-normal;
    clear: both;
    z-index: 1;
    margin: 40px 0;
    text-align: center;
    padding: 40px;
    background-color: $black;
    border-radius: $border-radius;
    overflow: hidden;

    &::before {
        position: absolute;
        content: "";
        right: -30px;
        top: -30px;
        height: 80px;
        width: 80px;
        border-radius: 50%;
        border: 4px solid $theme-color;
    }

    &::after {
        position: absolute;
        content: "";
        left: -30px;
        bottom: -30px;
        height: 80px;
        width: 80px;
        border-radius: 50%;
        border: 4px solid $theme-color;
    }

    @media #{$xs} {
        padding: 20px;
    }

    .icon i {
        font-size: 32px;
        color: $white;
        display: block;
        margin-bottom: 20px;

        @media #{$xs} {
            margin-bottom: 15px;
        }
    }

    h4 {
        font-weight: $font-weight-medium;
        font-size: $font-size-sm;
        line-height: 24px;
        color: $white;

        @media #{$xs} {
            font-size: $font-size-sm;
        }
    }

    span {
        font-size: 13px;
        display: block;
        margin-top: 20px;
        color: $white;
    }
}

/* Comments */
.post-comments {
    @media #{$laptop},$desktop {
        padding-right: 30px;
    }

    margin-top: 80px;

    @media #{$md} {
        margin-top: 60px;
    }

    @media #{$xs} {
        margin-top: 40px;
    }
}

.comment-title {
    font-size: $font-size-xl !important;
    font-weight: $font-weight-bold !important;
    margin-bottom: 30px !important;
    position: relative;
    z-index: 1;
    text-transform: capitalize;
    color: $heading-color;

    @media #{$xs} {
        font-size: 18px !important;
    }
}

.post-comments .comments-list li {
    padding-left: 110px;
    position: relative;
    font-size: $font-size-sm;
    border-radius: $border-radius;
    margin-top: 50px;

    @media #{$xs} {
        margin-top: 35px;
        padding: 0;
    }
}

.post-comments .comments-list li .comment-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 80px;
    height: 80px;

    @media #{$xs} {
        position: relative;
        top: 0;
        left: 0;
        margin-bottom: 18px;
    }
}

.post-comments .comments-list li .comment-img img {
    max-width: 80px;
    max-height: 80px;
    border-radius: 50%;
}

.post-comments .comments-list li .comment-desc .desc-top {
    margin-bottom: 20px;
    position: relative;
    display: block;
}

.post-comments .comments-list li .comment-desc .desc-top h6 {
    font-size: $font-size-base;
    margin-bottom: 8px;
    font-weight: $font-weight-semibold;
    color: $heading-color;
}

.post-comments .comments-list li .comment-desc .desc-top span.date {
    font-size: $font-size-sm;
    font-weight: $font-weight-normal;
    color: $body-color;

    @media #{$xs} {
        display: block;
    }
}

.post-comments .comments-list li .comment-desc .desc-top .reply-link {
    position: absolute;
    right: 0;
    top: 0;
    display: inline-block;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    z-index: 2;
    color: $black;
    transition: all $transition-base;

    @media #{$xs} {
        position: relative;
        display: inline-block;
        margin-top: 15px;
    }

    &:hover {
        color: $theme-color;
    }

    i {
        margin-right: 5px;
    }
}

.post-comments .comments-list li .comment-desc p {
    font-weight: $font-weight-normal;
    margin-bottom: 0;
    font-size: $font-size-sm;
    color: $body-color;

    @media #{$xs} {
        margin-top: 20px;
    }
}

.post-comments .comments-list li.children {
    margin-left: 130px;

    @media #{$xs} {
        margin: 0;
    }
}

/* Comment Form */
.comment-form {
    @media #{$laptop},$desktop {
        padding-right: 30px;
    }

    margin-top: 80px;

    @media #{$md} {
        margin-top: 60px;
    }

    @media #{$xs} {
        margin-top: 40px;
    }
}

.comment-reply-title {
    font-size: $font-size-xl !important;
    font-weight: $font-weight-bold !important;
    margin-bottom: 30px !important;
    position: relative;
    z-index: 1;
    text-transform: capitalize;
    color: $heading-color;

    @media #{$xs} {
        font-size: 18px !important;
    }
}

.comment-form form .form-box {
    position: relative;

    label {
        color: $black;
        display: block;
        margin-bottom: 10px;
        font-weight: $font-weight-normal;
    }
}

.comment-form form .form-box .icon {
    position: absolute;
    top: 17px;
    right: 25px;
    font-size: 16px;
    color: $body-color;
}

.comment-form form .form-box .form-control-custom {
    border: none;
    font-size: $font-size-sm;
    color: $black;
    padding: 0 25px;
    font-weight: $font-weight-medium;
    height: 53px;
    border: 1px solid $color-gray-200;
    margin-bottom: 20px;
    font-weight: $font-weight-normal;
    border-radius: $border-radius-sm;
    transition: all $transition-base;
    background-color: $gray;

    @media #{$xs} {
        margin-bottom: 20px;
    }

    &:focus {
        border-color: $theme-color;
        box-shadow: 0 0 0 3px rgba(126, 87, 255, 0.1);
    }
}

.comment-form form .form-box textarea.form-control-custom {
    height: 180px;
    padding: 25px;
}

.comment-form form .form-box .form-control-custom::placeholder {
    font-size: $font-size-sm;
    color: $color-gray-500;
    font-weight: $font-weight-normal;
}

/* News Sidebar */
.sidebar {}

.sidebar .widget {
    margin-bottom: 40px;
    overflow: hidden;
    padding: 40px;
    border-radius: $border-radius;
    background-color: $white;
    box-shadow: $shadow-md;
    border-top: 3px solid $theme-color;

    @media #{$md},$xs {
        &:first-child {
            margin-top: 50px;
        }
    }

    @media #{$xs} {
        padding: 35px;
    }

    &:last-child {
        margin-bottom: 0;
    }
}

.sidebar .widget .widget-title {
    font-size: $font-size-lg;
    margin-bottom: 25px;
    position: relative;
    font-weight: $font-weight-semibold;
    line-height: 28px;
    z-index: 1;
    color: $black;
}

.sidebar .widget.search-widget form {
    position: relative;
}

.sidebar .widget.search-widget form input {
    width: 100%;
    background-color: transparent;
    height: 55px;
    border: none;
    padding: 0 55px 0 25px;
    font-size: $font-size-sm;
    font-weight: $font-weight-normal;
    border-radius: $border-radius-sm;
    background-color: $white;
    border: 1px solid $color-gray-200;
    box-shadow: none;
    transition: all $transition-base;
    color: $black;

    &:focus {
        box-shadow: 0px 0px 23px rgba(0, 0, 0, 0.06) !important;
        border-color: $theme-color;
    }
}

.sidebar .widget.search-widget form input::placeholder {
    color: $color-gray-600;
    font-weight: $font-weight-normal;
}

.sidebar .widget.search-widget form button {
    border: none;
    position: absolute;
    right: 0;
    top: 0;
    width: 55px;
    height: 55px;
    z-index: 1;
    color: #333 !important;
    font-size: 18px;
    -webkit-transition: all $transition-base;
    transition: all $transition-base;
    border-radius: 0;
    padding: 0 !important;
    background: transparent;

    &:hover {
        color: $theme-color !important;
    }
}


.sidebar .widget.popular-feeds .single-popular-feed {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-bottom: 25px;
    padding-bottom: 25px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border-bottom: 1px solid $color-gray-200;

    &:last-child {
        border: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }
}

.sidebar .widget.popular-feeds .single-popular-feed .feed-desc {
    position: relative;

    .post-title {
        margin-bottom: 12px;
        line-height: 26px;

        a {
            font-size: $font-size-sm;
            font-weight: $font-weight-semibold;
            color: $black;
            transition: all $transition-base;

            &:hover {
                color: $theme-color;
            }
        }
    }

    .time {
        font-weight: $font-weight-normal;
        font-size: $font-size-sm;
        color: $body-color;


        i {
            margin-right: 4px;
        }
    }
}


.sidebar .widget.categories-widget ul li:last-child {
    margin-bottom: 0;
}

.sidebar .widget.categories-widget ul li {
    &:first-child {
        a {
            padding-top: 0;
        }
    }

    &:last-child {
        a {
            padding-bottom: 0;
            border: none;
        }
    }

    a {
        font-size: $font-size-sm;
        padding: 8px 0;
        font-weight: $font-weight-medium;
        display: block;
        color: $black;
        transition: all $transition-base;

        &:hover {
            color: $theme-color;
            padding-left: 10px;
        }
    }
}

.sidebar .widget.popular-tag-widget {
    padding-bottom: 35px;
}

.popular-tag-widget .tags>a {
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    padding: 8px 20px;
    text-transform: capitalize;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    margin-right: 5px;
    margin-bottom: 10px;
    color: $black;
    border: 1px solid $color-gray-200;
    background: transparent;
    border-radius: 30px;
    transition: all $transition-base;

    &:hover {
        background-color: $theme-color;
        color: $white;
        border-color: transparent;
    }
}

/* Blog Grid Page */
.blog-grid-page {
    padding-top: 80px;

    @media #{$md} {
        padding-top: 40px;
    }

    @media #{$xs} {
        padding-top: 30px;
    }

    .sidebar {
        margin-top: 30px;
    }
}
