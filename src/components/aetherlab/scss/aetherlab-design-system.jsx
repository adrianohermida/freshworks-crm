/* ===============================================
   Aetherlab Refactored with Design System
   Using CSS Custom Properties (Variables)
   =============================================== */

/* ===== Section & Layout ===== */
.section {
  padding-top: var(--spacing-2xl);
  padding-bottom: var(--spacing-2xl);
  position: relative;
}

.section-title {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  padding: 0 300px;
  position: relative;
  z-index: 5;
}

.section-title h3 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  display: inline-block;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
  text-transform: capitalize;
}

.section-title h2 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-md);
  line-height: 1.4;
  text-transform: capitalize;
  position: relative;
  font-weight: var(--font-weight-bold);
}

.section-title p {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
}

/* ===== Breadcrumbs ===== */
.breadcrumbs {
  position: relative;
  padding-top: 160px;
  padding-bottom: 120px;
  z-index: 2;
  text-align: left;
  background-color: var(--color-heading);
  background-size: cover;
  background-position: right;
  background-repeat: no-repeat;
  box-shadow: var(--shadow-md);
}

.breadcrumbs::before {
  position: absolute;
  content: "";
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: var(--color-heading);
  opacity: 0.7;
}

.breadcrumbs .page-title {
  font-size: 26px;
  color: var(--color-white);
  font-weight: var(--font-weight-bold);
  position: relative;
  line-height: 28px;
  text-transform: capitalize;
}

.breadcrumb-nav li {
  display: inline-block;
  position: relative;
  padding-right: 14px;
  margin-right: 14px;
  text-transform: capitalize;
  color: var(--color-white);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.breadcrumb-nav li a {
  color: var(--color-white);
  text-decoration: none;
  transition: var(--transition-base);
}

.breadcrumb-nav li a:hover {
  color: rgba(255, 255, 255, 0.8);
}

/* ===== Pagination ===== */
.pagination {
  text-align: left;
  margin: var(--spacing-2xl) 0 0 0;
  display: block;
}

.pagination.center {
  text-align: center;
}

.pagination .pagination-list li a {
  background: var(--color-white);
  color: var(--color-heading);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: center;
  border: 1px solid var(--color-border);
  text-decoration: none;
  transition: var(--transition-base);
}

.pagination .pagination-list li.active a,
.pagination .pagination-list li:hover a {
  background: var(--color-primary);
  color: var(--color-white);
  border-color: transparent;
}

/* ===== Buttons ===== */
.button .btn {
  display: inline-block;
  text-transform: capitalize;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  transition: var(--transition-base);
  border-radius: 30px;
  position: relative;
  z-index: 1;
  margin-right: var(--spacing-sm);
  overflow: hidden;
  cursor: pointer;
}

.button .btn:hover {
  color: var(--color-white);
  background-color: var(--color-heading);
}

.button .btn:last-child {
  margin: 0;
}

.button .btn-alt {
  background-color: var(--color-heading) !important;
  color: var(--color-white) !important;
}

.button .btn-alt:hover {
  background-color: var(--color-primary) !important;
  color: var(--color-white) !important;
}

/* ===== Scroll Top Button ===== */
.scroll-top {
  width: 45px;
  height: 45px;
  line-height: 45px;
  background: var(--color-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--font-size-sm);
  color: var(--color-white) !important;
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9;
  cursor: pointer;
  transition: var(--transition-base);
  border-radius: var(--border-radius-md);
  border: none;
}

.scroll-top:hover {
  box-shadow: var(--shadow-lg);
  transform: translate3d(0, -5px, 0);
  background-color: var(--color-primary);
}

/* ===== Overlay ===== */
.overlay {
  position: relative;
  z-index: 1;
}

.overlay::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.4;
  background: var(--color-heading);
  content: "";
  transition: var(--transition-base);
  z-index: -1;
}

/* ===== Hero Area ===== */
.hero-area {
  position: relative;
  background-color: var(--color-heading);
  z-index: 0;
}

.hero-area .hero-content {
  border-radius: 0;
  position: relative;
  z-index: 1;
  text-align: left;
  padding: 240px 0 140px 0;
}

.hero-area .hero-content h4 {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-md);
}

.hero-area .hero-content h1 {
  font-weight: var(--font-weight-bold);
  font-size: 38px;
  line-height: 55px;
  color: var(--color-white);
  text-transform: capitalize;
}

.hero-area .hero-content p {
  font-weight: var(--font-weight-normal);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  margin-top: var(--spacing-md);
  color: #e6e6e6;
}

.hero-area .hero-content .button {
  margin-top: var(--spacing-xl);
}

.hero-area .hero-content .button .btn:hover {
  color: var(--color-heading);
  background-color: var(--color-white);
}

/* ===== Services ===== */
.services {
  position: relative;
  z-index: 0;
  background-color: var(--color-light);
}

.services .single-service {
  min-height: 300px;
  margin-top: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  background-color: var(--color-white);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-xl);
  text-align: center;
  transition: var(--transition-base);
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
}

.services .single-service:hover {
  transform: scale(1.05);
  border-top-color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.services .single-service .main-icon {
  height: 65px;
  width: 65px;
  line-height: 65px;
  text-align: center;
  background-color: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--border-radius-md);
  font-size: 27px;
  display: inline-block;
}

.services .single-service .text-title {
  color: var(--color-heading);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  font-weight: var(--font-weight-bold);
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.services .single-service p {
  line-height: 26px;
  font-size: var(--font-size-sm);
}

/* ===== Testimonials ===== */
.testimonials {
  background-color: var(--color-light);
  position: relative;
  padding-bottom: 180px;
}

.testimonials .single-testimonial {
  background-color: var(--color-white);
  padding: var(--spacing-xl);
  transition: var(--transition-base);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  position: relative;
  margin: var(--spacing-md) 0;
}

.testimonials .single-testimonial:hover {
  box-shadow: var(--shadow-md);
}

.testimonials .single-testimonial::before {
  position: absolute;
  content: "";
  right: -30px;
  top: -30px;
  height: 60px;
  width: 60px;
  background-color: var(--color-primary);
  border-radius: 50%;
}

.testimonials .single-testimonial .text h4 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-relaxed);
}

.testimonials .single-testimonial .author {
  position: relative;
  padding-left: 70px;
  margin-top: var(--spacing-lg);
}

.testimonials .single-testimonial .author img {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.testimonials .single-testimonial .author h4 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.testimonials .tns-nav button {
  height: 6px;
  width: 14px;
  background-color: var(--color-heading);
  border-radius: var(--border-radius-sm);
  display: inline-block;
  border: none;
  margin: 0px var(--spacing-sm);
  transition: var(--transition-base);
}

.testimonials .tns-nav button:hover {
  background-color: var(--color-primary);
}

.testimonials .tns-nav button.tns-nav-active {
  width: 25px;
  background-color: var(--color-primary);
}

/* ===== Blog ===== */
.single-blog-grid {
  margin-top: var(--spacing-lg);
  background-color: var(--color-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.single-blog-grid .blog-img img {
  width: 100%;
  transition: var(--transition-base);
}

.single-blog-grid:hover .blog-img img {
  transform: scale(1.1);
}

.single-blog-grid .blog-content {
  padding: var(--spacing-lg);
}

.single-blog-grid .blog-content h4 a {
  font-size: 17px;
  color: var(--color-heading);
  font-weight: var(--font-weight-bold);
  display: inline-block;
}

.single-blog-grid .blog-content h4 a:hover {
  color: var(--color-primary);
}

/* ===== Portfolio ===== */
.portfolio-item-wrapper {
  position: relative;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  margin-bottom: var(--spacing-lg);
}

.portfolio-item-wrapper:hover .portfolio-img img {
  transform: scale(1.1);
}

.portfolio-item-wrapper .portfolio-img img {
  width: 100%;
  transition: var(--transition-base);
}

.portfolio-item-wrapper .portfolio-overlay {
  position: absolute;
  left: 15px;
  bottom: 15px;
  background-color: var(--color-white);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-md);
  display: inline-block;
}

/* ===== Pricing Table ===== */
.pricing-table {
  background-color: var(--color-light);
}

.pricing-table .single-table {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  margin-top: var(--spacing-xl);
  background-color: var(--color-white);
  transition: var(--transition-base);
  padding: var(--spacing-xl);
  text-align: left;
  position: relative;
  overflow: hidden;
}

.pricing-table .single-table:hover {
  box-shadow: var(--shadow-md);
}

.pricing-table .single-table .title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
  display: inline-block;
  border-radius: 30px;
}

.pricing-table .single-table .table-head .price .amount {
  font-size: 45px;
  font-weight: var(--font-weight-bold);
  display: inline-block;
  position: relative;
  padding-left: 16px;
}

.pricing-table .single-table .table-content .table-list li {
  font-size: var(--font-size-sm);
  margin-bottom: 16px;
  padding-left: var(--spacing-lg);
  font-weight: var(--font-weight-normal);
  color: var(--color-heading);
  position: relative;
}

/* ===== FAQ ===== */
.faq {
  padding-bottom: 80px;
  background-color: var(--color-light);
}

.accordion-item {
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-md);
}

.accordion-item .accordion-button {
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  width: 100%;
  display: block;
  overflow: hidden;
  border: none;
  padding: var(--spacing-md);
  padding-right: 40px;
  background-color: var(--color-white);
}

.accordion-button:not(.collapsed) {
  color: var(--color-white);
  background-color: var(--color-primary);
  border-radius: var(--border-radius-md) var(--border-radius-md) 0 0;
}

.accordion-body {
  border-radius: 0 0 var(--border-radius-md) var(--border-radius-md);
  padding: var(--spacing-lg);
  background-color: var(--color-white);
}

.accordion-body p {
  margin: 0;
  margin-bottom: var(--spacing-md);
  color: var(--color-body);
}

/* ===== Contact Form ===== */
.contact-us .contact-form .form-group input,
.contact-us .contact-form .form-group textarea {
  height: 52px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: 0px var(--spacing-md);
  width: 100%;
  transition: var(--transition-base);
  background-color: var(--color-white);
  color: var(--color-body);
  font-size: var(--font-size-sm);
}

.contact-us .contact-form .form-group input:focus,
.contact-us .contact-form .form-group textarea:focus {
  border-color: var(--color-primary);
}

.contact-us .contact-form .form-group textarea {
  height: 200px;
  padding: var(--spacing-lg);
  resize: none;
}

/* ===== Team ===== */
.team .single-team {
  margin-top: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  transition: var(--transition-base);
  text-align: center;
}

.team .single-team img {
  height: 200px;
  width: 200px;
  border-radius: 50%;
  display: inline-block;
  background-color: var(--color-white);
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
}

.team .single-team .content {
  padding: var(--spacing-xl) var(--spacing-lg);
}

.team .single-team .content h4 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

/* ===== Footer ===== */
.footer {
  background-color: var(--color-heading);
  position: relative;
  padding-bottom: 0;
}

.footer .single-footer.f-about p {
  color: var(--color-white);
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-lg);
}

.footer .single-footer.f-about .social-title {
  color: var(--color-white);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  display: block;
  margin-bottom: var(--spacing-md);
}

.footer .single-footer.f-about .social li a {
  color: var(--color-white);
}

.footer .single-footer.f-about .social li a:hover {
  color: var(--color-primary);
}

.footer .single-footer h3 {
  font-size: 17px;
  font-weight: var(--font-weight-semibold);
  display: block;
  margin-bottom: var(--spacing-lg);
  color: var(--color-white);
}

.footer .single-footer.f-link li a {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  color: var(--color-white);
}

.footer .single-footer.f-link li a:hover {
  color: var(--color-primary);
}

.footer .newsletter-form input {
  height: 52px;
  width: 100%;
  border-radius: var(--border-radius-md);
  border: none;
  box-shadow: none;
  padding-left: 18px;
  padding-right: 70px;
  transition: var(--transition-base);
  background-color: rgba(255, 255, 255, 0.12);
  color: var(--color-white);
}

.footer .newsletter-form input:focus {
  border-color: var(--color-primary);
}

.footer .newsletter-form .button .sub-btn {
  height: 52px;
  width: 52px;
  border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0;
  background-color: rgba(255, 255, 255, 0.16);
  color: var(--color-white);
  text-align: center;
  line-height: 52px;
  border: none;
  font-size: var(--font-size-base);
  transition: var(--transition-base);
  cursor: pointer;
}

.footer .newsletter-form .button .sub-btn:hover {
  color: var(--color-white);
  background-color: var(--color-primary);
}

.footer .copyright-area p {
  color: var(--color-white);
  font-size: var(--font-size-sm);
}

.footer .copyright-area p a {
  text-decoration: underline;
  color: var(--color-white);
}

.footer .copyright-area p a:hover {
  color: var(--color-primary);
}

/* ===== Error Pages ===== */
.error-area {
  height: 100vh;
  text-align: center;
  width: auto;
  margin-left: auto;
  margin-right: auto;
  background-color: var(--color-heading);
  position: relative;
  overflow: hidden;
}

.error-area .error-content {
  display: inline-block;
  padding: var(--spacing-2xl);
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
}

.error-area .error-content h1 {
  font-size: 90px;
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
  font-weight: 800;
  line-height: 100px;
}

.error-area .error-content h2 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
  color: var(--color-heading);
  font-weight: var(--font-weight-bold);
  line-height: 35px;
}

/* ===== Call to Action ===== */
.call-action {
  background-color: var(--color-light);
}

.call-action .inner-content {
  position: relative;
  padding: 80px 0;
  border-radius: var(--border-radius-lg);
  z-index: 0;
  overflow: hidden;
}

.call-action .text h2 {
  font-size: 28px;
  font-weight: var(--font-weight-bold);
  line-height: 42px;
  color: var(--color-heading);
}

.call-action .text h2 span {
  color: var(--color-primary);
  display: block;
}