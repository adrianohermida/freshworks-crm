import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, CheckCircle2, AlertCircle, Terminal, Code, Zap } from 'lucide-react';

/**
 * Guia interativo Fase 1 - Setup Manual Sprint 13
 * Instruções passo-a-passo para desbloquear Sprint 17
 */
export default function Sprint17Phase1Guide() {
  const [copied, setCopied] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleStep = (stepId) => {
    setCompletedSteps(prev =>
      prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId]
    );
  };

  const steps = [
    {
      id: 'step1',
      title: 'Passo 1: Copiar service-worker.js',
      time: '5 min',
      description: 'Copie o arquivo service-worker.js para public/',
      instructions: [
        'Abra a página PWAManualSetupInstructions (menu)',
        'Vá até a tab "Files"',
        'Localize "service-worker.js"',
        'Copie o código completo',
        'Crie arquivo: public/service-worker.js',
        'Cole o conteúdo e salve'
      ],
      code: `// Arquivo: public/service-worker.js
// Copie o código de PWAManualSetupInstructions`,
      verification: 'Verificar: DevTools > Application > Service Workers'
    },
    {
      id: 'step2',
      title: 'Passo 2: Copiar manifest.json',
      time: '5 min',
      description: 'Copie o arquivo manifest.json para public/',
      instructions: [
        'Na página PWAManualSetupInstructions, tab "Files"',
        'Localize "manifest.json"',
        'Copie o JSON completo',
        'Crie arquivo: public/manifest.json',
        'Cole o conteúdo e salve'
      ],
      code: `{
  "name": "Legal Tasks - PWA",
  "short_name": "Legal Tasks",
  // ... copie de PWAManualSetupInstructions
}`,
      verification: 'Verificar: DevTools > Application > Manifest'
    },
    {
      id: 'step3',
      title: 'Passo 3: Copiar offline.html',
      time: '5 min',
      description: 'Copie o arquivo offline.html para public/',
      instructions: [
        'Na página PWAManualSetupInstructions, tab "Files"',
        'Localize "offline.html"',
        'Copie o HTML completo',
        'Crie arquivo: public/offline.html',
        'Cole o conteúdo e salve'
      ],
      code: `<!-- Arquivo: public/offline.html -->
<!-- Copie o código de PWAManualSetupInstructions -->`,
      verification: 'Verificar: Acessar http://localhost:5173/offline.html'
    },
    {
      id: 'step4',
      title: 'Passo 4: Gerar VAPID Keys',
      time: '10 min',
      description: 'Gere as chaves VAPID para push notifications',
      instructions: [
        'Abra terminal na pasta do projeto',
        'Execute: npx web-push generate-vapid-keys',
        'Copie a Public Key e Private Key',
        'Salve em local seguro (você precisará depois)',
        'NÃO compartilhe a Private Key'
      ],
      command: 'npx web-push generate-vapid-keys',
      verification: 'Verificar: Você tem 2 chaves (Public e Private) geradas'
    },
    {
      id: 'step5',
      title: 'Passo 5: Gerar Icons PNG',
      time: '15 min',
      description: 'Gere 9 icons de diferentes tamanhos',
      instructions: [
        'Você precisa de 1 imagem base (PNG 512x512 recomendado)',
        'Opção A: Usar ImageMagick (terminal):',
        '  convert original.png -resize 192x192 public/icon-192.png',
        '  convert original.png -resize 512x512 public/icon-512.png',
        'Opção B: Usar site online (ezgif.com, squoosh.app)',
        'Gerar tamanhos: 72, 96, 128, 144, 152, 192, 384, 512, 1024'
      ],
      command: `# Usar ImageMagick ou online tools
# Tamanhos necessários:
- icon-72.png
- icon-96.png
- icon-128.png
- icon-144.png
- icon-152.png
- icon-192.png
- icon-384.png
- icon-512.png
- icon-1024.png`,
      verification: 'Verificar: public/ contém 9 arquivos icon-*.png'
    },
    {
      id: 'step6',
      title: 'Passo 6: Instalar web-push',
      time: '2 min',
      description: 'Instale o pacote npm web-push',
      instructions: [
        'Terminal na pasta do projeto',
        'Execute: npm install web-push',
        'Aguarde instalação completar',
        'Você verá "added X packages"'
      ],
      command: 'npm install web-push',
      verification: 'Verificar: package.json contém "web-push" em dependencies'
    },
    {
      id: 'step7',
      title: 'Passo 7: Configurar .env.local',
      time: '5 min',
      description: 'Crie arquivo .env.local com as chaves VAPID',
      instructions: [
        'Na raiz do projeto, crie arquivo: .env.local',
        'Cole as variáveis abaixo (substitua pelos seus valores)',
        'Salve o arquivo',
        'NÃO comita .env.local (verifique .gitignore)'
      ],
      code: `VITE_VAPID_PUBLIC_KEY=seu_public_key_aqui
VITE_API_URL=http://localhost:4173`,
      verification: 'Verificar: arquivo .env.local existe e contém VITE_VAPID_PUBLIC_KEY'
    }
  ];

  const totalSteps = steps.length;
  const completedCount = completedSteps.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sprint 17 - Fase 1 (Setup Manual)</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Guia passo-a-passo para desbloquear o Sprint</p>
            </div>
          </div>

          {/* Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Progresso Fase 1</span>
                  <Badge className="bg-green-600">{progressPercent}%</Badge>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {completedCount} de {totalSteps} passos concluídos
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert */}
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <strong>⏱️ Tempo total: ~50 minutos</strong> | Tempo é flexível conforme suas ações
          </AlertDescription>
        </Alert>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step) => (
            <Card key={step.id} className={completedSteps.includes(step.id) ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      checked={completedSteps.includes(step.id)}
                      onCheckedChange={() => toggleStep(step.id)}
                      className="mt-1"
                    />
                    <div>
                      <CardTitle className={`flex items-center gap-2 ${completedSteps.includes(step.id) ? 'line-through text-gray-400' : ''}`}>
                        {step.title}
                      </CardTitle>
                      <CardDescription className="mt-1">{step.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">⏱️ {step.time}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Instructions */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">📋 Instruções:</h4>
                  <ol className="space-y-2">
                    {step.instructions.map((instruction, idx) => (
                      <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex gap-2">
                        <span className="font-semibold text-gray-500 flex-shrink-0">{idx + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Code/Command */}
                {(step.code || step.command) && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">💻 Código/Comando:</h4>
                    <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs overflow-auto max-h-48">
                      <pre>{step.code || step.command}</pre>
                    </div>
                    {(step.code || step.command) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(step.code || step.command, step.id)}
                        className="mt-2 w-full"
                      >
                        {copied === step.id ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copiar
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}

                {/* Verification */}
                {step.verification && (
                  <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                      <strong>✅ Verificar:</strong> {step.verification}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Completion Card */}
        {progressPercent === 100 && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <strong>✅ Fase 1 COMPLETA!</strong>
              <p className="mt-2 text-sm">
                Próximo passo: Abrir <strong>Sprint 17 Validation</strong> e marcar as tarefas como concluídas. 
                Depois executar <strong>Fase 2 (Build & Lighthouse)</strong>.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Next Steps */}
        {progressPercent === 100 && (
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-lg">🚀 Próximas Ações (Fase 2)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">1. Fazer Build</h4>
                <code className="text-xs bg-white dark:bg-slate-800 p-2 rounded block">
                  npm run build
                </code>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">2. Testar Preview com HTTPS</h4>
                <code className="text-xs bg-white dark:bg-slate-800 p-2 rounded block">
                  npm run preview -- --https
                </code>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">3. Rodar Lighthouse Audit</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Chrome DevTools → Lighthouse → Audit (PWA, Performance, Accessibility)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="text-lg">💡 Dicas & Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm mb-1">❓ Como copiar arquivo de PWAManualSetupInstructions?</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Abra a página, vá até tab "Files", copie o conteúdo, crie arquivo em public/
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-1">❓ web-push generate-vapid-keys não funciona?</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Use: npm install -g web-push (global) ou npx web-push@latest
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-1">❓ Como gerar icons se não tenho ImageMagick?</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Use ferramentas online: ezgif.com, squoosh.app, ou online-convert.com
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-1">❓ .env.local não é reconhecido?</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Reinicie o dev server após criar .env.local (parar e rodar novamente)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}