import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function AdvancedFilterPanel({ groups, tags, onFilter, onClose }) {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSLA, setSelectedSLA] = useState('all');

  const handleFilter = () => {
    onFilter({
      groups: selectedGroups,
      tags: selectedTags,
      types: selectedTypes,
      slaProblem: selectedSLA !== 'all' ? selectedSLA === 'atraso' : null
    });
  };

  const toggleGroup = (groupId) => {
    setSelectedGroups(prev =>
      prev.includes(groupId) ? prev.filter(g => g !== groupId) : [...prev, groupId]
    );
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const TYPES = ['incident', 'problem', 'feature_request', 'lead'];
  const uniqueTags = [...new Set(tags)];

  return (
    <div className="bg-white dark:bg-slate-900 border border-border rounded-lg p-4 space-y-4 mb-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Filtros Avançados</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Groups */}
      {groups.length > 0 && (
        <div>
          <label className="text-sm font-medium mb-2 block">Grupos</label>
          <div className="flex flex-wrap gap-2">
            {groups.map(group => (
              <button
                key={group.id}
                onClick={() => toggleGroup(group.id)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedGroups.includes(group.id)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {group.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Types */}
      <div>
        <label className="text-sm font-medium mb-2 block">Tipos</label>
        <div className="flex flex-wrap gap-2">
          {TYPES.map(type => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                selectedTypes.includes(type)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      {uniqueTags.length > 0 && (
        <div>
          <label className="text-sm font-medium mb-2 block">Tags</label>
          <div className="flex flex-wrap gap-2">
            {uniqueTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SLA Status */}
      <div>
        <label className="text-sm font-medium mb-2 block">Status SLA</label>
        <Select value={selectedSLA} onValueChange={setSelectedSLA}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="norazo">No Prazo</SelectItem>
            <SelectItem value="atraso">Em Atraso</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleFilter} className="w-full">
        Aplicar Filtros
      </Button>
    </div>
  );
}