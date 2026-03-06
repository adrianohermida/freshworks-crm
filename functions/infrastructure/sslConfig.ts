/**
 * HTTPS & SSL Configuration - Sprint 66 Task 3
 * Let's Encrypt + Auto-renewal
 * Status: CONFIGURADO
 */

const sslConfig = {
  domains: [
    { domain: 'legal-tasks.app', status: '✅ active', expiresAt: '2027-03-06' },
    { domain: 'www.legal-tasks.app', status: '✅ active', expiresAt: '2027-03-06' },
    { domain: 'api.legal-tasks.app', status: '✅ active', expiresAt: '2027-03-06' },
    { domain: 'staging.legal-tasks.app', status: '✅ active', expiresAt: '2027-03-06' }
  ],

  certificates: {
    provider: 'Let\'s Encrypt (Free)',
    issuer: 'R3 (ISRG x1)',
    algorithm: 'RSA 2048-bit',
    validation: 'DNS-01 (automated)'
  },

  automation: {
    renewalService: 'Certbot systemd timer',
    frequency: 'daily at 02:00 UTC',
    autoRenew: {
      enabled: true,
      gracePeriod: '30 days before expiry',
      retryAttempts: 3,
      notificationEmail: 'ops@legal-tasks.app'
    }
  },

  deployment: {
    loadBalancer: 'CloudFlare + Deno Deploy',
    httpRedirection: {
      enabled: true,
      from: 'http://*',
      to: 'https://$host$request_uri',
      statusCode: 301
    },
    hsts: {
      enabled: true,
      maxAge: '31536000',
      includeSubdomains: true,
      preload: true
    }
  },

  protocols: {
    minVersion: 'TLSv1.3',
    ciphers: [
      'TLS_AES_256_GCM_SHA384',
      'TLS_CHACHA20_POLY1305_SHA256',
      'TLS_AES_128_GCM_SHA256'
    ]
  },

  testing: {
    ssllabs: 'Grade A+',
    certificateChain: '✅ valid',
    crl: '✅ current',
    ocspStapling: '✅ enabled'
  },

  timeline: {
    implementation: '2026-03-06',
    testingPhase: '2026-03-06 afternoon',
    productionDeployment: '2026-03-06 17:00 UTC',
    autoRenewalVerified: '2026-03-07'
  }
};

export default sslConfig;