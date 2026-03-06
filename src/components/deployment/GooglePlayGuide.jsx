import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ExternalLink, CheckCircle2 } from 'lucide-react';

/**
 * Guia detalhado para publicação no Google Play Store
 */
export default function GooglePlayGuide() {
  return (
    <div className="max-w-3xl space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Guia passo-a-passo para publicar Legal Tasks no Google Play Store
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>1. Preparação da Conta Developer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Criar Google Play Developer Account</h4>
            <ol className="list-decimal ml-5 space-y-1 text-gray-600">
              <li>Visite <a href="https://play.google.com/console" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Play Console</a></li>
              <li>Faça login com sua conta Google</li>
              <li>Pague a taxa de registro ($25 USD)</li>
              <li>Complete o perfil de desenvolvedor</li>
              <li>Aguarde confirmação (geralmente instantâneo)</li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded">
            <p className="text-blue-900">💡 <strong>Dica:</strong> Use uma conta comercial para facilitar futuros desenvolvimentos</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Criar Aplicação no Console</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`Google Play Console > Criar Novo App
├─ Nome do App: "Legal Tasks"
├─ Idioma padrão: Português (Brasil)
├─ Tipo: Aplicativo
├─ Categoria: Productivity
├─ Classificação de conteúdo: Responder questionário
└─ Contato: seu_email@example.com`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Configuração Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">3.1 Informações do App</h4>
            <div className="bg-gray-50 p-3 rounded space-y-2">
              <p><strong>Título:</strong> Legal Tasks - Gestão de Processos Jurídicos</p>
              <p><strong>Descrição curta:</strong> Plataforma completa para gestão de processos jurídicos</p>
              <p><strong>Descrição completa:</strong></p>
              <pre className="bg-white p-2 rounded text-xs mt-1">
{`Legal Tasks é uma plataforma inteligente para gestão de processos jurídicos. Funcionalidades:

✓ Gerenciamento de processos e intimações
✓ Alertas automáticos de prazos
✓ Sincronização com Advise
✓ Funciona offline (PWA)
✓ Notificações push
✓ Acesso via web e mobile
✓ Interface intuitiva e responsiva

Ideal para advogados, escritórios e departamentos jurídicos.`}
              </pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">3.2 Ícone e Screenshots</h4>
            <ul className="list-disc ml-5 space-y-1 text-gray-600">
              <li>Icon 512x512 PNG (sem transparência em cantos)</li>
              <li>Feature graphic 1024x500 PNG</li>
              <li>2-8 screenshots (1080x1920 ou 1440x2560)</li>
              <li>Video de preview (12-30 segundos, opcional)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">3.3 Detalhes de Contato</h4>
            <div className="bg-gray-50 p-3 rounded space-y-2">
              <p><strong>Email do desenvolvedor:</strong> seu_email@example.com</p>
              <p><strong>Telefone:</strong> seu_telefone (pode ser WhatsApp)</p>
              <p><strong>Website/URL:</strong> seu_site.com (opcional)</p>
              <p><strong>Política de Privacidade:</strong> https://seu_site.com/privacy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Gerenciamento de Versão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`Google Play Console > App > Versões > Criar release

1. Selecionr "Closed Testing" (Internal Testing)
   └─ Enviar versão inicial para teste

2. Adicionar APK/AAB:
   └─ Gerar: npm run build-android-aab
   └─ Upload do arquivo .aab

3. Preencher Release Notes:
   ├─ Título: v1.0.0
   ├─ Descrição: Lançamento inicial
   └─ Tipo: Production Release

4. Revisar e publicar
`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Configuração de Conteúdo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Questionnaire de Conteúdo</h4>
            <ul className="list-disc ml-5 space-y-1 text-gray-600">
              <li>Violência? NÃO</li>
              <li>Conteúdo sexual? NÃO</li>
              <li>Coleta de dados pessoais? SIM (email, preferências)</li>
              <li>Publicidade? Não (por enquanto)</li>
              <li>Conteúdo de jogo? NÃO</li>
              <li>Língua: Português Brasileiro</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Política de Privacidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
            <p className="text-yellow-900"><strong>⚠️ OBRIGATÓRIO:</strong> Você DEVE ter uma política de privacidade antes de publicar</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Itens que devem estar na Privacy Policy:</h4>
            <ul className="list-disc ml-5 space-y-1">
              <li>Quais dados são coletados</li>
              <li>Como os dados são usados</li>
              <li>Como os dados são armazenados</li>
              <li>Direitos do usuário (LGPD/GDPR)</li>
              <li>Contato para privacidade</li>
              <li>Cookies e tracking</li>
              <li>Compartilhamento com terceiros</li>
            </ul>
          </div>

          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`Template básico em: https://termly.io/products/privacy-policy-generator/`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Classificação de Conteúdo (IARC)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Responder Questionário IARC</h4>
            <ul className="list-disc ml-5 space-y-1 text-gray-600">
              <li>Google vai enviar link para questionário</li>
              <li>Responda honestamente sobre conteúdo</li>
              <li>Receba certificado de classificação</li>
              <li>PEGI 3 ou 7 para Legal Tasks (seguro)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>8. Teste e Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Ciclo de Revisão do Google</h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`Fase 1: Internal Testing (você)
  └─ 30 minutos - 2 horas para disponibilizar

Fase 2: Closed Testing (beta, opcional)
  └─ Convide testers
  └─ 2-4 horas para disponibilizar

Fase 3: Production Release
  └─ 2-4 horas de análise automática
  └─ 24-48 horas de revisão manual
  └─ Possível rejeição se houver problemas
`}
            </pre>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded">
            <p className="text-blue-900"><strong>💡 Dica:</strong> Comece com internal testing para testar tudo antes de enviar para produção</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>9. Pré-requisitos de Publicação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              'App Bundle (.aab) ou APK',
              'Ícone 512x512',
              'Screenshots (mínimo 2)',
              'Descrição do app',
              'Categoria selecionada',
              'Classificação de conteúdo (IARC)',
              'Política de Privacidade',
              'Email de contato',
              'Sem conteúdo proibido'
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
          <strong>Timeline de Publicação:</strong>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Preparação: 2-3 horas</li>
            <li>Interno testing: 30 min - 2h</li>
            <li>Revisão automática: 2-4h</li>
            <li>Revisão manual: 24-48h</li>
            <li>Total: 1-3 dias até ir ao ar</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}