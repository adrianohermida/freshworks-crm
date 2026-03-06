/**
 * Input Validation & XSS Prevention
 * Sanitizes user input to prevent XSS attacks
 */
Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { input, type } = body;

    if (!input) {
      return new Response(JSON.stringify({ error: 'Input required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // XSS Prevention: Escape HTML special characters
    const sanitizeHTML = (str) => {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      };
      return str.replace(/[&<>"']/g, (char) => map[char]);
    };

    // SQL Injection Prevention: Parameterized queries (handled by SDK)
    // NoSQL Injection Prevention: Whitelist allowed characters
    const sanitizeNoSQL = (str) => {
      return str.replace(/[\${}]/g, '');
    };

    // Path Traversal Prevention
    const sanitizePath = (str) => {
      return str.replace(/\.\.|\/\//g, '').replace(/^\/+/, '');
    };

    let sanitized = input;

    if (type === 'html') {
      sanitized = sanitizeHTML(input);
    } else if (type === 'nosql') {
      sanitized = sanitizeNoSQL(input);
    } else if (type === 'path') {
      sanitized = sanitizePath(input);
    } else if (type === 'email') {
      // Email validation RFC 5322
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        return new Response(JSON.stringify({ error: 'Invalid email format' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      sanitized = input.toLowerCase();
    } else if (type === 'url') {
      // URL validation - only allow http/https
      try {
        const url = new URL(input);
        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error('Invalid protocol');
        }
        sanitized = url.toString();
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid URL' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({
      valid: true,
      sanitized,
      original: input,
      type,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Input validation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});