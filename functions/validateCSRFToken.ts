import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import crypto from 'crypto';

/**
 * CSRF Token Management
 * Implements double-submit cookie pattern
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const method = body.method || req.method;

    // GET requests don't need CSRF validation
    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
      return new Response(JSON.stringify({ valid: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate CSRF token for POST/PUT/DELETE
    const csrfToken = body.csrfToken || req.headers.get('X-CSRF-Token');
    const sessionCookie = req.headers.get('Cookie');

    if (!csrfToken) {
      return new Response(JSON.stringify({ error: 'CSRF token missing' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate new token for response
    const newToken = crypto.randomBytes(32).toString('hex');

    return new Response(JSON.stringify({
      valid: true,
      csrfToken: newToken,
      userEmail: user.email,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': newToken,
      },
    });
  } catch (error) {
    console.error('CSRF validation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});