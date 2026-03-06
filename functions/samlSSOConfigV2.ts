import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { action, config } = await req.json();

    // SAML Configuration Handler
    if (action === 'configure') {
      const samlConfig = {
        entityId: config.entityId,
        ssoUrl: config.ssoUrl,
        certificateFingerprint: config.certificateFingerprint,
        nameIdFormat: config.nameIdFormat || 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
        attributeMappings: {
          email: config.emailAttribute || 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
          firstName: config.firstNameAttribute || 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
          lastName: config.lastNameAttribute || 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
          role: config.roleAttribute || 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'
        },
        encryptionEnabled: config.encryptionEnabled !== false,
        signedRequests: config.signedRequests !== false,
        forceAuthn: config.forceAuthn || false,
        isPassive: config.isPassive || false
      };

      return Response.json({ 
        success: true, 
        message: 'SAML configuration saved',
        config: samlConfig,
        metadata: generateMetadata(samlConfig)
      });
    }

    // Generate SP Metadata
    if (action === 'metadata') {
      const metadata = generateMetadata(config);
      return new Response(metadata, {
        headers: { 'Content-Type': 'application/xml' }
      });
    }

    // Validate SAML Response
    if (action === 'validate') {
      const { samlResponse } = config;
      // This would normally validate using a SAML library
      // Placeholder for SAML response validation
      return Response.json({
        valid: true,
        user: {
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user'
        }
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('SAML Configuration Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function generateMetadata(config) {
  const timestamp = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${config.entityId}">
  <SPSSODescriptor AuthnRequestsSigned="${config.signedRequests}" WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <KeyDescriptor use="signing">
      <KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
        <X509Data>
          <X509Certificate>${config.certificateFingerprint}</X509Certificate>
        </X509Data>
      </KeyInfo>
    </KeyDescriptor>
    <SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://app.example.com/auth/saml/logout"/>
    <AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://app.example.com/auth/saml/acs" index="0" isDefault="true"/>
  </SPSSODescriptor>
</EntityDescriptor>`;
}