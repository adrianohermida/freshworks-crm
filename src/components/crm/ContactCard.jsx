import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Building2 } from 'lucide-react';

export default function ContactCard({ contact }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          {contact.first_name} {contact.last_name}
        </CardTitle>
        <div className="text-sm text-gray-500 mt-1">
          {contact.job_title && <p>{contact.job_title}</p>}
          {contact.company_name && (
            <p className="flex items-center gap-1 mt-1">
              <Building2 className="w-3 h-3" />
              {contact.company_name}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {contact.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gray-400" />
            <a href={`mailto:${contact.email}`} className="text-cyan-600 hover:underline">
              {contact.email}
            </a>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-gray-400" />
            <a href={`tel:${contact.phone}`} className="text-gray-600">
              {contact.phone}
            </a>
          </div>
        )}
        <Badge variant="outline" className="mt-2">
          Sincronizado: {new Date(contact.last_sync).toLocaleDateString()}
        </Badge>
      </CardContent>
    </Card>
  );
}