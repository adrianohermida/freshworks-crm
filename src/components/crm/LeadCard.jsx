import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Building2, TrendingUp } from 'lucide-react';

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-green-100 text-green-800',
  unqualified: 'bg-red-100 text-red-800'
};

const conversionColors = {
  unconverted: 'bg-gray-100 text-gray-800',
  converted: 'bg-cyan-100 text-cyan-800'
};

export default function LeadCard({ lead }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          {lead.first_name} {lead.last_name}
        </CardTitle>
        <div className="flex gap-2 mt-2">
          <Badge className={statusColors[lead.lead_status]}>
            {lead.lead_status}
          </Badge>
          <Badge className={conversionColors[lead.conversion_status]}>
            {lead.conversion_status === 'converted' ? 'Convertido' : 'Não convertido'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {lead.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gray-400" />
            <a href={`mailto:${lead.email}`} className="text-cyan-600 hover:underline">
              {lead.email}
            </a>
          </div>
        )}
        {lead.company_name && (
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 text-gray-400" />
            {lead.company_name}
          </div>
        )}
        {lead.lead_source && (
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            Fonte: {lead.lead_source}
          </div>
        )}
      </CardContent>
    </Card>
  );
}