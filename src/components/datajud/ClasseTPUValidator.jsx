import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Database } from "lucide-react";

export default function ClasseTPUValidator({ value, onChange, onValidate }) {
  const [search, setSearch] = useState(value || "");
  const [open, setOpen] = useState(false);

  // Busca classes TPU (simples búsqueda por código/nome)
  const { data: classes = [], isLoading } = useQuery({
    queryKey: ["tpu_classes", search],
    queryFn: async () => {
      if (!search || search.length < 1) return [];
      try {
        const result = await base44.entities.TPUClasses.filter(
          search.length <= 4 && !isNaN(search)
            ? { cod_classe: parseInt(search) }
            : { nome: { $regex: search, $options: "i" } }
        );
        return result || [];
      } catch (err) {
        console.warn("Erro ao buscar classes:", err);
        return [];
      }
    },
    enabled: open && search.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const handleSelect = (classe) => {
    onChange(classe.cod_classe);
    setSearch(`${classe.cod_classe} - ${classe.nome}`);
    setOpen(false);
    if (onValidate) onValidate(true);
  };

  const handleChange = (val) => {
    setSearch(val);
    onChange(null);
    if (onValidate) onValidate(false);
    setOpen(true);
  };

  const isValid = search && classes.some((c) => c.cod_classe === value);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          placeholder="Digite código (ex: 0001) ou nome da classe..."
          value={search}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          className={isValid ? "border-green-500" : search && !isValid ? "border-red-500" : ""}
        />
        {isLoading && <Database className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-slate-400" />}
        {isValid && <CheckCircle2 className="absolute right-3 top-2.5 h-4 w-4 text-green-600" />}
        {search && !isValid && <AlertCircle className="absolute right-3 top-2.5 h-4 w-4 text-red-600" />}
      </div>

      {/* Dropdown */}
      {open && search.length > 0 && classes.length > 0 && (
        <div className="absolute z-50 w-full mt-0 bg-white border border-slate-200 rounded-lg shadow-lg">
          <div className="max-h-48 overflow-y-auto">
            {classes.slice(0, 10).map((classe) => (
              <button
                key={classe.id}
                onClick={() => handleSelect(classe)}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 border-b last:border-0"
                type="button"
              >
                <div className="font-medium text-sm">{classe.cod_classe} - {classe.nome}</div>
                {classe.glossario && <div className="text-xs text-slate-500 mt-1">{classe.glossario}</div>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Validação */}
      {search && !isValid && (
        <div className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Classe TPU não encontrada
        </div>
      )}
      {isValid && (
        <div className="text-xs text-green-600 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Classe válida no TPU
        </div>
      )}
    </div>
  );
}