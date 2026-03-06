import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ExternalLink, CheckCircle2 } from 'lucide-react';

/**
 * Guia detalhado para publicação no Apple App Store
 */
export default function AppleAppStoreGuide() {
  return (
    <div className="max-w-3xl space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Guia para publicar Legal Tasks no Apple App Store (iOS/macOS/iPadOS)
        </AlertDescription>
      </Alert>

      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-900">⚠️ Importante: Web App vs Native App</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-yellow-800">
          <p className="mb-2">
            Legal Tasks é uma Web App (PWA). No App Store, você pode:
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li><strong>Opção 1:</strong> Criar wrapper nativo (recomendado para começar)</li>
            <li><strong>Opção 2:</strong> Progressive Web App (não está no App Store, mas funciona via Safari)</li>
            <li><strong>Opção 3:</strong> Hybrid app com React Native (mais trabalho)</li>
          </ul>
          <p className="mt-3 font-semibold">Recomendação: Comece com Opção 1 (wrapper) - 90% dos esforços de publicação são iguais</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1. Preparação da Conta Apple Developer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Registrar Apple Developer Account</h4>
            <ol className="list-decimal ml-5 space-y-1 text-gray-600">
              <li>Visite <a href="https://developer.apple.com/account" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Apple Developer Account</a></li>
              <li>Faça login/crie Apple ID</li>
              <li>Pague taxa anual ($99 USD)</li>
              <li>Aguarde aprovação (até 24 horas)</li>
              <li>Acesse <a href="https://appstoreconnect.apple.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">App Store Connect</a></li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded">
            <p className="text-blue-900">💡 <strong>Custo:</strong> $99/ano (Apple Developer Program)</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Criar Aplicação no App Store Connect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`App Store Connect > Meu App > Novo App
├─ Plataforma: iOS
├─ Nome: "Legal Tasks"
├─ Idioma primário: Português (Brasil)
├─ Bundle ID: com.seu-empresa.legaltasks
├─ SKU: LEGALTASKS001
└─ Categoria: Produtividade`}
          </pre>

          <div className="bg-purple-50 border border-purple-200 p-3 rounded">
            <p className="text-purple-900"><strong>Bundle ID:</strong> Deve ser único. Formato: com.seu-empresa.seu-app</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Configuração de Informações do App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">3.1 Informações Gerais</h4>
            <div className="bg-gray-50 p-3 rounded space-y-2">
              <p><strong>Nome do App:</strong> Legal Tasks</p>
              <p><strong>Subtítulo:</strong> Gestão de Processos Jurídicos</p>
              <p><strong>Descrição:</strong></p>
              <pre className="bg-white p-2 rounded text-xs mt-1">
{`Legal Tasks - Sua plataforma inteligente para gestão de processos jurídicos.

Funcionalidades:
✓ Gerenciamento completo de processos
✓ Alertas automáticos de prazos
✓ Intimações e movimentações em tempo real
✓ Funciona 100% offline
✓ Notificações push
✓ Interface moderna e responsiva
✓ Sincronização com sistemas Advise

Ideal para: Advogados, Escritórios, Departamentos Jurídicos

Compatível com: iPhone, iPad, Apple Watch`}
              </pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">3.2 Palavras-chave</h4>
            <p className="text-gray-600">legal, processo, advogado, jurídico, intimação, prazos, case management</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">3.3 URL do Suporte</h4>
            <p className="text-gray-600">https://seu-site.com/suporte</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">3.4 Política de Privacidade</h4>
            <p className="text-gray-600">https://seu-site.com/privacy (OBRIGATÓRIO)</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Recursos Visuais (Assets)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Ícone do App</h4>
            <ul className="list-disc ml-5 space-y-1 text-gray-600">
              <li>1024x1024 PNG (sem transparência)</li>
              <li>Sem bordas arredondadas (iOS faz isso automaticamente)</li>
              <li>Deve ser legível em 27x27 pixels</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Screenshots (Obrigatório)</h4>
            <ul className="list-disc ml-5 space-y-1 text-gray-600">
              <li>Mínimo 2, máximo 10 por tamanho</li>
              <li>iPhone 6.5": 1242x2688 pixels</li>
              <li>iPad 12.9": 2048x2732 pixels</li>
              <li>Ordem importa: mostre melhores primeiro</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Preview (Opcional)</h4>
            <ul className="list-disc ml-5 space-y-1 text-gray-600">
              <li>Vídeo 30 segundos max</li>
              <li>Formato: MOV ou MP4</li>
              <li>Máximo 500 MB</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Preço e Disponibilidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Configuração de Preço</h4>
            <div className="bg-gray-50 p-3 rounded">
              <p><strong>Preço base:</strong> Gratuito (Tier Gratuito)</p>
              <p className="text-gray-600 mt-1">Ou escolha modelo freemium/pago depois</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Disponibilidade</h4>
            <ul className="list-disc ml-5 space-y-1 text-gray-600">
              <li>Selecionar países/regiões (comece com Brasil)</li>
              <li>Data de lançamento (pode ser imediato)</li>
              <li>Versão padrão da app</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Classificação de Conteúdo (IARC)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Questionário de Classificação</h4>
            <ul className="list-disc ml-5 space-y-1 text-gray-600">
              <li>Apple enviará link para App Store Connect</li>
              <li>Responda questionário IARC</li>
              <li>Classificação automática (4+, 12+, 17+)</li>
              <li>Para Legal Tasks: <strong>4+</strong> (sem conteúdo adulto)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Informações de Revisão do App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">Notas para a Revisão</h4>
            <pre className="bg-white p-2 rounded text-xs">
{`App de produtividade para gestão de processos jurídicos.

Funcionalidades testadas:
✓ Gerenciamento de processos
✓ Notificações push
✓ Funcionalidade offline
✓ Sincronização de dados

Credenciais de teste (se necessário):
Email: test@legal-tasks.com
Senha: TestPassword123!`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Contato de Suporte</h4>
            <div className="bg-gray-50 p-3 rounded">
              <p><strong>Email:</strong> seu_email@example.com</p>
              <p><strong>Telefone:</strong> +55 XX XXXXX-XXXX</p>
              <p><strong>Website:</strong> https://seu-site.com</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Funcionalidades de Privacidade</h4>
            <ul className="list-disc ml-5 space-y-1 text-gray-600">
              <li>Coleta de email do usuário</li>
              <li>Dados de processos jurídicos (local)</li>
              <li>Nenhuma venda de dados</li>
              <li>Conformidade LGPD/GDPR</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>8. Build e Submissão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Gerar Build (Xcode)</h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# Com EAS (Expo Application Services)
npm install -g eas-cli
eas build --platform ios

# Ou manualmente com Xcode
xcodebuild -workspace ios/LegalTasks.xcworkspace \
  -scheme LegalTasks \
  -configuration Release \
  -derivedDataPath build`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Upload para TestFlight</h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`1. Gerar build assinado
2. Fazer upload via App Store Connect
3. Esperar processamento (2-5 minutos)
4. Disponibilizar para testadores
5. Testar antes de enviara revisão`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>9. Revisão do Apple</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="bg-green-50 border border-green-200 p-3 rounded">
            <h4 className="font-semibold text-green-900 mb-2">Timeline</h4>
            <ul className="list-disc ml-5 space-y-1 text-green-900">
              <li>TestFlight: 30 minutos - 2 horas</li>
              <li>Review do App Store: 24-48 horas</li>
              <li>Aprovado → Disponível imediatamente</li>
              <li>Rejeitado → Correção + novo envio</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Motivos Comuns de Rejeição</h4>
            <ul className="list-disc ml-5 space-y-1 text-gray-600">
              <li>Crash/bugs críticos</li>
              <li>Falta de política de privacidade</li>
              <li>Coleta de dados não declarada</li>
              <li>Publicidade enganosa</li>
              <li>Funcionalidade incompleta</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>10. Pré-requisitos de Publicação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              'Build assinado e pronto',
              'Ícone 1024x1024',
              'Screenshots para iPhone/iPad',
              'Descrição do app',
              'Palavras-chave',
              'Classificação de conteúdo',
              'Política de privacidade',
              'URL de suporte',
              'Contato de suporte',
              'Sem bugs críticos'
            ].map((item, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Alert className="border-green-200 bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Timeline de Publicação (App Store):</strong>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Preparação & assets: 3-4 horas</li>
            <li>Build & TestFlight: 1-2 horas</li>
            <li>Testes internos: 1-2 horas</li>
            <li>Revisão do Apple: 24-48 horas</li>
            <li>Total: 1-3 dias até go live</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}