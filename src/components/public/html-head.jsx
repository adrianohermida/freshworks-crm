<!-- Meta tags para PWA e otimização -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="description" content="Plataforma de integração com DataJud - CNJ para sincronização de processos jurídicos">
<meta name="keywords" content="datajud,cnj,processos,jurídico,integração">
<meta name="theme-color" content="#00bcd4">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="DataJud">

<!-- Icons -->
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect fill='%2300bcd4' width='192' height='192'/><path fill='white' d='M96 32c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm0 112c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z'/></svg>">
<link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect fill='%2300bcd4' width='192' height='192'/><path fill='white' d='M96 32c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm0 112c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z'/></svg>">

<!-- PWA Manifest -->
<link rel="manifest" href="/manifest.json">

<!-- Security headers suggestions -->
<!-- Add to server: X-Content-Type-Options: nosniff -->
<!-- Add to server: X-Frame-Options: SAMEORIGIN -->
<!-- Add to server: X-XSS-Protection: 1; mode=block -->
<!-- Add to server: Referrer-Policy: strict-origin-when-cross-origin -->

<!-- Preconnect to DataJud API -->
<link rel="preconnect" href="${DATAJUD_BASE_URL}">
<link rel="dns-prefetch" href="${DATAJUD_BASE_URL}">

<!-- Accessibility -->
<link rel="preload" as="style" href="/globals.css">
<link rel="stylesheet" href="/globals.css">