import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function TicketTagsUpdater({ ticket }) {
  const [tags, setTags] = useState(ticket?.tags || []);
  const [newTag, setNewTag] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    setTags(ticket?.tags || []);
  }, [ticket?.tags]);

  const updateTagsMutation = useMutation({
    mutationFn: async (newTags) => {
      const response = await base44.functions.invoke('updateTicketTags', {
        ticketId: ticket.freshdesk_id,
        tags: newTags
      });
      if (response.data?.error) throw new Error(response.data.error);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Tags atualizadas!');
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const updated = [...tags, newTag.trim()];
    setTags(updated);
    setNewTag('');
    updateTagsMutation.mutate(updated);
  };

  const handleRemoveTag = (tagToRemove) => {
    const updated = tags.filter(t => t !== tagToRemove);
    setTags(updated);
    updateTagsMutation.mutate(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tags</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge key={tag} variant="outline" className="flex items-center gap-1">
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                disabled={updateTagsMutation.isPending}
                className="ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Nova tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            disabled={updateTagsMutation.isPending}
          />
          <Button
            size="sm"
            onClick={handleAddTag}
            disabled={!newTag.trim() || updateTagsMutation.isPending}
            className="gap-1"
          >
            {updateTagsMutation.isPending ? (
              <Loader className="w-3 h-3 animate-spin" />
            ) : (
              <Plus className="w-3 h-3" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}