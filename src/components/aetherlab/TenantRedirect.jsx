import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function TenantRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Parse hostname and extract tenant info
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    let tenantSlug = null;

    // Case 1: Subdomain pattern (docs.acme.com or docs.contoso.com)
    const subdomainMatch = hostname.match(/^([a-z0-9-]+)\./);
    if (subdomainMatch && subdomainMatch[1] !== 'www' && subdomainMatch[1] !== 'app') {
      tenantSlug = subdomainMatch[1];
    }

    // Case 2: Path pattern (/tenant/slug or /acme)
    if (!tenantSlug) {
      const pathParts = pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        // If first path is "tenant", second is slug: /tenant/acme
        if (pathParts[0] === 'tenant' && pathParts[1]) {
          tenantSlug = pathParts[1];
        }
        // Or direct slug: /acme (if it looks like a slug, not a page)
        else if (!['home', 'pricing', 'docs', 'login', 'signup'].includes(pathParts[0])) {
          tenantSlug = pathParts[0];
        }
      }
    }

    // If tenant slug found, redirect to dashboard with tenantId
    if (tenantSlug) {
      // Store in context via URL
      navigate(createPageUrl(`BlockchainRegistry?tenant=${tenantSlug}`), { replace: true });
    } else {
      // Redirect to home if no tenant
      navigate(createPageUrl('Home'), { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
        <p className="text-gray-600">Redirecionando para seu workspace</p>
      </div>
    </div>
  );
}