import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Simulated MFA service — generates TOTP codes and validates them
function generateTOTP(secret, window = 0) {
  const timeStep = Math.floor(Date.now() / 30000) + window;
  // Deterministic code based on secret + time (simplified for demo)
  const hash = [...(secret + timeStep)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) & 0x7FFFFFFF, 0);
  return String(hash % 1000000).padStart(6, '0');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const action = body.action; // 'setup' | 'verify' | 'status'

    if (action === 'setup') {
      const secret = btoa(`${user.email}-${Date.now()}`).replace(/=/g, '').substring(0, 16).toUpperCase();
      const qrData = `otpauth://totp/LegalPush:${user.email}?secret=${secret}&issuer=LegalPush`;
      return Response.json({
        success: true,
        secret,
        qrData,
        backupCodes: Array.from({ length: 8 }, () => Math.random().toString(36).substring(2, 10).toUpperCase()),
        message: 'MFA configurado. Escaneie o QR code com seu app autenticador.'
      });
    }

    if (action === 'verify') {
      const { code, secret } = body;
      const valid = [generateTOTP(secret, -1), generateTOTP(secret, 0), generateTOTP(secret, 1)].includes(code);
      await base44.asServiceRole.entities.AuditLog.create({
        eventType: 'AUTH_LOGIN',
        timestamp: new Date().toISOString(),
        userId: user.email,
        userRole: user.role,
        status: valid ? 'success' : 'failure',
        details: { action: 'mfa_verify', result: valid ? 'passed' : 'failed' }
      });
      return Response.json({ success: valid, message: valid ? 'MFA verificado com sucesso.' : 'Código inválido.' });
    }

    return Response.json({
      status: 'mfa_available',
      user: user.email,
      methods: ['totp', 'backup_codes'],
      message: 'MFA service ativo.'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});