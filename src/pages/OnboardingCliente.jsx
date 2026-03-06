import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/components/hooks/useTheme';
import { Button } from '@/components/ui/button';

// Steps
const STEPS = [
  { id: 'welcome', name: 'Bem-vindo', component: 'WelcomeStep' },
  { id: 'dados-pessoais', name: 'Dados Pessoais', component: 'PersonalDataStep' },
  { id: 'endereco', name: 'Endereço', component: 'AddressStep' },
  { id: 'contatos', name: 'Contatos', component: 'ContatosStep' },
  { id: 'documento-rg', name: 'RG/CNH', component: 'DocumentoRGStep' },
  { id: 'documento-comprovante', name: 'Comprovante Endereço', component: 'DocumentoComprovanteStep' },
  { id: 'documento-selfie', name: 'Selfie com Documento', component: 'DocumentoSelfieStep' },
  { id: 'termos', name: 'Termos LGPD', component: 'TermosLGPD' },
  { id: 'resumo', name: 'Resumo', component: 'SummaryStep' }
];

export default function OnboardingCliente() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    rg_numero: '',
    data_nascimento: '',
    profissao: '',
    nacionalidade: 'Brasileira',
    estado_civil: '',
    endereco_cep: '',
    endereco_logradouro: '',
    endereco_numero: '',
    endereco_complemento: '',
    endereco_bairro: '',
    endereco_cidade: '',
    endereco_estado: '',
    telefone: '',
    telefone_whatsapp: false,
    email_adicional: ''
  });

  const [documentData, setDocumentData] = useState({
    rg_cnh: null,
    comprovante_endereco: null,
    selfie: null
  });

  const [termoAceito, setTermoAceito] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  useEffect(() => {
    const saved = localStorage.getItem('onboard_progress');
    if (saved) {
      try {
        const { step, form, docs, termo } = JSON.parse(saved);
        setCurrentStep(step || 0);
        if (form) setFormData(form);
        if (docs) setDocumentData(docs);
        if (termo !== undefined) setTermoAceito(termo);
      } catch (e) {
        console.log('Erro ao recuperar progresso de onboarding');
      }
    }
  }, []);

  const createClienteMutation = useMutation({
    mutationFn: async (data) => {
      // 1. Validar CPF único + enriquecer dados
      let dadosEnriquecidos = {
        nome_completo: data.nome,
        data_nascimento: data.data_nascimento,
        profissao: data.profissao,
        cpf_validado: true
      };

      try {
        const enriquecimentoResponse = await base44.functions.invoke('enriquecerDadosClienteOnboarding', {
          cpf: data.cpf,
          nome: data.nome,
          email: user.email
        });

        if (enriquecimentoResponse.data.success) {
          dadosEnriquecidos = enriquecimentoResponse.data.dados_enriquecidos;
        }
      } catch (err) {
        console.log('Enriquecimento indisponível, prosseguindo com dados básicos');
      }

      const escritorio = (await base44.entities.Escritorio.list())?.[0];
      const escritorio_id = escritorio?.id;
      
      const clienteData = {
        escritorio_id,
        nome_completo: dadosEnriquecidos.nome_completo,
        email: user.email,
        cpf: data.cpf.replace(/\D/g, ''),
        rg: data.rg_numero,
        data_nascimento: data.data_nascimento || dadosEnriquecidos.data_nascimento,
        profissao: dadosEnriquecidos.profissao || data.profissao,
        telefone: data.telefone,
        endereco: {
          cep: data.endereco_cep,
          logradouro: data.endereco_logradouro,
          numero: data.endereco_numero,
          complemento: data.endereco_complemento,
          bairro: data.endereco_bairro,
          cidade: data.endereco_cidade,
          estado: data.endereco_estado
        },
        consentimento_lgpd: termoAceito,
        data_consentimento: new Date().toISOString(),
        status_onboarding: 'em_validacao'
      };

      const cliente = await base44.entities.Cliente.create(clienteData);

      // 2. Validar documents estruture
      const validacaoResponse = await base44.functions.invoke('validarDocumentosOnboarding', {
        cliente_email: user.email,
        documentos: documentData
      });

      if (!validacaoResponse.data?.success) {
        throw new Error('Documentos inválidos: ' + (validacaoResponse.data?.mensagem || 'Erro na validação'));
      }

      // 3. Criar ValidacaoDocumento para cada documento
      const docs = [
        { url: documentData.rg_cnh.frente, tipo: 'rg_frente', label: 'RG/CNH Frente' },
        { url: documentData.rg_cnh.verso, tipo: 'rg_verso', label: 'RG/CNH Verso' },
        { url: documentData.comprovante_endereco, tipo: 'comprovante_endereco', label: 'Comprovante Endereço' },
        { url: documentData.selfie, tipo: 'selfie', label: 'Selfie com Documento' }
      ];

      for (const doc of docs) {
        await base44.entities.ValidacaoDocumento.create({
          cliente_email: user.email,
          cliente_nome: cliente.nome_completo,
          tipo: doc.tipo,
          status: 'pendente',
          documento_url: doc.url,
          documento_id: `${cliente.id}_${doc.tipo}`,
          escritorio_id,
          notas_internas: `Upload: ${doc.label}`
        });
      }

      try {
        await base44.functions.invoke('notificarOnboardingConcluido', {
          cliente_email: user.email,
          cliente_nome: cliente.nome_completo,
          escritorio_id
        });
      } catch (err) {
        console.error('Erro ao enviar notificacao de email:', err);
      }

      return cliente;
    },
    onSuccess: async () => {
      // Salvar dados no User entity do Base44
      try {
        await base44.auth.updateMe({
          cpf: formData.cpf.replace(/\D/g, ''),
          profissao: formData.profissao,
          nacionalidade: formData.nacionalidade,
          estado_civil: formData.estado_civil,
          data_nascimento: formData.data_nascimento,
          rg: formData.rg_numero,
          telefone: formData.telefone
        });
      } catch (err) {
        console.error('Erro ao atualizar perfil do usuário:', err);
      }

      queryClient.invalidateQueries({ queryKey: ['cliente', user?.email] });
      queryClient.invalidateQueries({ queryKey: ['meu-painel-validacoes'] });
      toast.success('Cadastro concluído! Aguarde aprovação dos documentos.');
      localStorage.removeItem('onboard_progress');
      
      setTimeout(() => {
        navigate(createPageUrl('MeuPainel'));
      }, 2000);
    },
    onError: (error) => {
      toast.error('Erro ao finalizar cadastro: ' + error.message);
      setSubmitting(false);
    }
  });

  const validateStepData = (stepId) => {
    const calcularIdade = (dataNascimento) => {
      const hoje = new Date();
      const data = new Date(dataNascimento);
      let idade = hoje.getFullYear() - data.getFullYear();
      const mes = hoje.getMonth() - data.getMonth();
      if (mes < 0 || (mes === 0 && hoje.getDate() < data.getDate())) {
        idade--;
      }
      return idade;
    };

    switch (stepId) {
      case 'dados-pessoais':
        if (!formData.nome?.trim()) {
          toast.error('Nome é obrigatório');
          return false;
        }
        if (!formData.cpf?.replace(/\D/g, '') || formData.cpf.replace(/\D/g, '').length !== 11) {
          toast.error('CPF inválido');
          return false;
        }
        if (!formData.data_nascimento) {
          toast.error('Data de nascimento é obrigatória');
          return false;
        }
        if (calcularIdade(formData.data_nascimento) < 18) {
          toast.error('Você deve ter 18 anos ou mais');
          return false;
        }
        if (!formData.profissao?.trim()) {
          toast.error('Profissão é obrigatória');
          return false;
        }
        if (!formData.estado_civil) {
          toast.error('Estado civil é obrigatório');
          return false;
        }
        if (!formData.nacionalidade?.trim()) {
          toast.error('Nacionalidade é obrigatória');
          return false;
        }
        return true;

      case 'endereco':
        if (!formData.endereco_cep?.trim()) {
          toast.error('CEP é obrigatório');
          return false;
        }
        if (!formData.endereco_logradouro?.trim()) {
          toast.error('Logradouro é obrigatório');
          return false;
        }
        if (!formData.endereco_numero?.trim()) {
          toast.error('Número é obrigatório');
          return false;
        }
        if (!formData.endereco_bairro?.trim()) {
          toast.error('Bairro é obrigatório');
          return false;
        }
        if (!formData.endereco_cidade?.trim()) {
          toast.error('Cidade é obrigatória');
          return false;
        }
        if (!formData.endereco_estado?.trim()) {
          toast.error('Estado é obrigatório');
          return false;
        }
        return true;

      case 'contatos':
        if (!formData.telefone?.trim()) {
          toast.error('Telefone é obrigatório');
          return false;
        }
        return true;

      case 'documento-rg':
        if (!documentData.rg_cnh?.frente || !documentData.rg_cnh?.verso) {
          toast.error('RG/CNH frente e verso são obrigatórios');
          return false;
        }
        return true;

      case 'documento-comprovante':
        if (!documentData.comprovante_endereco) {
          toast.error('Comprovante de endereço é obrigatório');
          return false;
        }
        return true;

      case 'documento-selfie':
        if (!documentData.selfie) {
          toast.error('Selfie com documento é obrigatória');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      const stepId = STEPS[currentStep].id;
      
      if (!validateStepData(stepId)) {
        return;
      }

      // Salvar progresso localmente
      localStorage.setItem('onboard_progress', JSON.stringify({
        step: currentStep + 1,
        form: formData,
        docs: documentData,
        termo: termoAceito
      }));
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleConcluir = async () => {
    if (!termoAceito) {
      toast.error('Você deve aceitar os termos LGPD para continuar');
      return;
    }

    // Validações obrigatórias - TODAS
    if (!formData.nome?.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    if (!formData.cpf?.replace(/\D/g, '') || formData.cpf.replace(/\D/g, '').length !== 11) {
      toast.error('CPF inválido');
      return;
    }
    if (!formData.profissao?.trim()) {
      toast.error('Profissão é obrigatória');
      return;
    }
    if (!formData.estado_civil) {
      toast.error('Estado civil é obrigatório');
      return;
    }
    if (!formData.nacionalidade?.trim()) {
      toast.error('Nacionalidade é obrigatória');
      return;
    }
    if (!formData.data_nascimento) {
      toast.error('Data de nascimento é obrigatória');
      return;
    }
    if (!formData.telefone?.trim()) {
      toast.error('Telefone é obrigatório');
      return;
    }
    if (!documentData.rg_cnh?.frente || !documentData.rg_cnh?.verso) {
      toast.error('RG/CNH frente e verso são obrigatórios');
      return;
    }
    if (!documentData.comprovante_endereco) {
      toast.error('Comprovante de endereço é obrigatório');
      return;
    }
    if (!documentData.selfie) {
      toast.error('Selfie com documento é obrigatória');
      return;
    }

    setSubmitting(true);
    createClienteMutation.mutate(formData);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <div className="text-center">
          <p className="mb-4 text-[var(--text-primary)]">Por favor, faça login para continuar</p>
          <Button onClick={() => base44.auth.redirectToLogin(createPageUrl('OnboardingCliente'))}>
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  const stepData = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-[#0a0f0d] to-[#111916]' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
              Etapa {currentStep + 1} de {STEPS.length}
            </p>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
              {Math.round(((currentStep + 1) / STEPS.length) * 100)}%
            </p>
          </div>

          <div className="flex gap-1">
            {STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all ${
                  index <= currentStep
                    ? 'bg-[var(--brand-primary)]'
                    : theme === 'dark'
                    ? 'bg-white/10'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stepData.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-[#111916] border border-white/5' : 'bg-white'}`}
          >
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {stepData.name}
            </h2>

            {/* Step Components - Renderizar baseado no ID */}
            <StepContent
              stepId={stepData.id}
              formData={formData}
              setFormData={setFormData}
              documentData={documentData}
              setDocumentData={setDocumentData}
              termoAceito={termoAceito}
              setTermoAceito={setTermoAceito}
              theme={theme}
              submitting={submitting}
              user={user}
            />
          </motion.div>
        </AnimatePresence>

        {/* Validation Message */}
        {!submitting && !isLastStep && (
          <div className={`p-3 rounded-lg border ${
            validateStepData(STEPS[currentStep].id)
              ? theme === 'dark' ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
              : theme === 'dark' ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
          }`}>
            <p className={`text-sm font-medium ${
              validateStepData(STEPS[currentStep].id)
                ? 'text-green-700 dark:text-green-200'
                : 'text-red-700 dark:text-red-200'
            }`}>
              {validateStepData(STEPS[currentStep].id)
                ? '✓ Todos os campos obrigatórios foram preenchidos'
                : '✗ Preencha todos os campos obrigatórios para continuar'}
            </p>
          </div>
        )}

        {/* Navigation */}
        {!submitting && (
          <div className="flex gap-4 mt-8">
            <Button
              onClick={handlePrev}
              disabled={isFirstStep}
              variant="outline"
              className="flex-1"
            >
              ← Voltar
            </Button>

            {!isLastStep ? (
              <Button
                onClick={handleNext}
                disabled={!validateStepData(STEPS[currentStep].id)}
                className="flex-1 bg-[var(--brand-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo →
              </Button>
            ) : (
              <Button
                onClick={handleConcluir}
                disabled={!termoAceito}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Finalizar Cadastro
              </Button>
            )}
          </div>
        )}

        {submitting && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--brand-primary)]" />
            <p className={theme === 'dark' ? 'text-white/60' : 'text-gray-600'}>
              Finalizando seu cadastro...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}



// Step Content Component
function StepContent({ stepId, formData, setFormData, documentData, setDocumentData, termoAceito, setTermoAceito, theme, submitting, user }) {
  switch (stepId) {
    case 'welcome':
      return (
        <div className={`text-center space-y-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <div className="text-5xl mb-4">⚖️</div>
          <p>Bem-vindo! Vamos completar seu cadastro em alguns passos.</p>
        </div>
      );

    case 'dados-pessoais':
      const PersonalDataStep = React.lazy(() => import('@/components/onboarding/PersonalDataStep'));
      return (
        <React.Suspense fallback={<div className="text-center py-8">Carregando...</div>}>
          <PersonalDataStep
            formData={formData}
            setFormData={setFormData}
            errors={{}}
            theme={theme}
          />
        </React.Suspense>
      );

    case 'endereco':
      const AddressStep = React.lazy(() => import('@/components/onboarding/AddressStep'));
      return (
        <React.Suspense fallback={<div className="text-center py-8">Carregando...</div>}>
          <AddressStep
            formData={formData}
            setFormData={setFormData}
            errors={{}}
            theme={theme}
          />
        </React.Suspense>
      );

    case 'contatos':
      const ContatosStep = React.lazy(() => import('@/components/onboarding/ContatosStep'));
      return (
        <React.Suspense fallback={<div className="text-center py-8">Carregando...</div>}>
          <ContatosStep
            formData={formData}
            setFormData={setFormData}
            theme={theme}
          />
        </React.Suspense>
      );

    case 'documento-rg':
      const DocumentoRGStep = React.lazy(() => import('@/components/onboarding/DocumentoRGStep'));
      return (
        <React.Suspense fallback={<div className="text-center py-8">Carregando...</div>}>
          <DocumentoRGStep
            documentData={documentData}
            setDocumentData={setDocumentData}
            theme={theme}
          />
        </React.Suspense>
      );

    case 'documento-comprovante':
      const DocumentoComprovanteStep = React.lazy(() => import('@/components/onboarding/DocumentoComprovanteStep'));
      return (
        <React.Suspense fallback={<div className="text-center py-8">Carregando...</div>}>
          <DocumentoComprovanteStep
            formData={formData}
            documentData={documentData}
            setDocumentData={setDocumentData}
            theme={theme}
          />
        </React.Suspense>
      );

    case 'documento-selfie':
      const DocumentoSelfieStep = React.lazy(() => import('@/components/onboarding/DocumentoSelfieStepEnhanced'));
      return (
        <React.Suspense fallback={<div className="text-center py-8">Carregando...</div>}>
          <DocumentoSelfieStep
            documentData={documentData}
            setDocumentData={setDocumentData}
            theme={theme}
          />
        </React.Suspense>
      );

    case 'termos':
      return (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border max-h-48 overflow-y-auto ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>
              Você concorda em compartilhar seus dados pessoais para fins de processamento jurídico e comunicação, de acordo com a LGPD. Seus dados serão protegidos e utilizados apenas para os fins especificados.
            </p>
          </div>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={termoAceito}
              onChange={(e) => setTermoAceito(e.target.checked)}
              className="w-4 h-4 rounded mt-1"
            />
            <span className={theme === 'dark' ? 'text-white/80' : 'text-gray-700'}>
              Aceito os termos de uso e política de privacidade (LGPD)
            </span>
          </label>
        </div>
      );

    case 'resumo':
      return (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              ✓ {formData.nome}
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
              CPF: {formData.cpf} • {formData.endereco_cidade}, {formData.endereco_estado}
            </p>
          </div>
          <div className={`p-4 rounded-lg border-2 border-green-500 ${theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'}`}>
            <p className="text-sm text-green-700 font-medium">
              ✓ Todos os dados foram preenchidos corretamente. Clique em "Finalizar Cadastro" para concluir.
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
}