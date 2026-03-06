import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, User, Clock } from 'lucide-react';

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  assigned: 'bg-purple-100 text-purple-800',
  waiting: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
};

export default function ConversationCard({ conversation }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{conversation.visitor_name}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{conversation.visitor_email}</p>
          </div>
          <Badge className={statusColors[conversation.status]}>
            {conversation.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {conversation.last_message && (
          <div className="flex gap-2">
            <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
            <p className="text-sm text-gray-600 line-clamp-2">{conversation.last_message}</p>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          {new Date(conversation.last_message_at).toLocaleString()}
        </div>
        {conversation.assigned_agent && (
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-400" />
            {conversation.assigned_agent}
          </div>
        )}
      </CardContent>
    </Card>
  );
}