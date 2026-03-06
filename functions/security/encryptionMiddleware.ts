import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Encryption Middleware para proteção de dados sensíveis
 * Suporta AES-256-GCM para dados em repouso
 */

async function generateKey() {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  return key;
}

async function encryptData(data, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(JSON.stringify(data));

  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedData
  );

  return {
    iv: Array.from(iv),
    ciphertext: Array.from(new Uint8Array(encryptedData)),
    algorithm: 'AES-256-GCM'
  };
}

async function decryptData(encrypted, key) {
  const iv = new Uint8Array(encrypted.iv);
  const ciphertext = new Uint8Array(encrypted.ciphertext);

  const decryptedData = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decryptedData));
}

async function encryptionMiddleware(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Retrieve or generate encryption key from environment
    const masterKey = Deno.env.get('MASTER_ENCRYPTION_KEY');
    if (!masterKey) {
      return Response.json(
        { error: 'Encryption key not configured' },
        { status: 500 }
      );
    }

    return {
      success: true,
      user,
      encryptionEnabled: true,
      masterKeyHash: masterKey.substring(0, 16) + '...'
    };
  } catch (error) {
    return Response.json(
      { error: `Encryption Error: ${error.message}` },
      { status: 500 }
    );
  }
}

Deno.serve(async (req) => {
  const result = await encryptionMiddleware(req);
  return Response.json(result);
});

// Export para reutilização
export { encryptData, decryptData, generateKey };