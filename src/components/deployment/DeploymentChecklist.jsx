import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

export default function DeploymentChecklist() {
  const [checklist, setChecklist] = useState({
    predeployment: {
      titulo: 'Pré-Deployment',
      items: [
        { id: 1, nome: 'Código revisado e mergeado', status: 'completo' },
        { id: 2, nome: 'Testes passando (100%)', status: 'completo' },
        { id: 3, nome: 'Documentação atualizada', status: 'completo' },
        { id: 4, nome: 'Performance validada', status: 'completo' },
        { id: 5, nome: 'Segurança testada', status: 'completo' }
      ]
    },
    deployment: {
      titulo: 'Durante Deployment',
      items: [
        { id: 6, nome: 'Backup de dados realizado', status: 'completo' },
        { id: 7, nome: 'Variables de env configuradas', status: 'completo' },
        { id: 8, nome: 'Migrações executadas', status: 'completo' },
        { id: 9, nome: 'Cache limpo', status: 'completo' },
        { id: 10, nome: 'Monitoring ativado', status: 'completo' }
      ]
    },
    postdeployment: {
      titulo: 'Pós-Deployment',
      items: [
        { id: 11, nome: 'Smoke tests no prod', status: 'completo' },
        { id: 12, nome: 'Health check endpoints', status: 'completo' },
        { id: 13, nome: 'Performance monitorado', status: 'completo' },
        { id: 14, nome: 'Logs verificados', status: 'completo' },
        { id: 15, nome: 'Notificar stakeholders', status: 'completo' }
      ]
    },
    rollback: {
      titulo: 'Plano de Rollback',
      items: [
        { id: 16, nome: 'Versão anterior testada', status: 'completo' },
        { id: 17, nome: 'Procedimento documentado', status: 'completo' },
        { id: 18, nome: 'Automação configurada', status: 'completo' }
      ]
    }
  });

  const getIcon = (status) => {
    switch(status) {
      case 'completo':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'pendente':
        return <Circle className="w-5 h-5 text-gray-400" />;
      case 'erro':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const totalItems = Object.values(checklist).reduce((acc, section) => acc + section.items.length, 0);
  const completedItems = Object.values(checklist).reduce(
    (acc, section) => acc + section.items.filter(i => i.status === 'completo').length,
    0
  );
  const percentual = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">🚀 Deployment Checklist</h1>
        <p className="text-gray-600">Sprint 25 - Pronto para Produção</p>
      </div>

      {/* Progress */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Status Geral</h2>
          <span className="text-2xl font-bold text-green-600">{percentual}%</span>
        </div>
        <div className="w-full h-3 bg-green-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-600 transition-all"
            style={{ width: `${percentual}%` }}
          />
        </div>
        <p className="text-sm text-green-700 mt-2">{completedItems}/{totalItems} itens completos</p>
      </Card>

      {/* Checklists */}
      {Object.values(checklist).map((section, idx) => (
        <Card key={idx} className="p-6">
          <h2 className="text-lg font-semibold mb-4">{section.titulo}</h2>
          <div className="space-y-2">
            {section.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2">
                {getIcon(item.status)}
                <span className={`text-sm ${item.status === 'completo' ? 'text-gray-700' : 'text-gray-500'}`}>
                  {item.nome}
                </span>
                <span className="ml-auto text-xs font-semibold text-gray-500">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Go Live Approval */}
      <Card className="p-6 border-2 border-green-600 bg-green-50">
        <h2 className="text-lg font-semibold text-green-900 mb-3">✅ Aprovação Go Live</h2>
        <div className="space-y-2 text-sm text-green-800">
          <p>✓ Todos os testes passando</p>
          <p>✓ Performance validada</p>
          <p>✓ Segurança testada</p>
          <p>✓ Documentação completa</p>
          <p>✓ Plano de rollback pronto</p>
          <p>✓ Monitoramento configurado</p>
        </div>
        <div className="mt-4 pt-4 border-t border-green-200">
          <p className="font-bold text-green-900">🎉 SPRINT 25 PRONTO PARA PRODUÇÃO</p>
        </div>
      </Card>
    </div>
  );
}