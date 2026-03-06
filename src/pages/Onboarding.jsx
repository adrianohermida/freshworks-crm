import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import OnboardingTermos from "@/components/onboarding/OnboardingTermos";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function Onboarding() {
  const navigate = useNavigate();
  const [termos, setTermos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  useEffect(() => {
    loadTermos();
  }, []);

  const loadTermos = async () => {
    const termosData = await base44.entities.TermoLegal.filter({ ativo: true });
    setTermos(termosData);
    setLoading(false);
  };

  const handleAccept = async (aceites) => {
    try {
      const user = await base44.auth.me();
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      const ipData = await fetch('https://api.ipify.org?format=json').then(r => r.json()).catch(() => ({ ip: 'unknown' }));

      // Salvar AceiteEletronico no backend
      await base44.entities.AceiteEletronico.create({
        usuario_email: user.email,
        termos_aceitos: aceites,
        data_aceite: new Date().toISOString(),
        ip: ipData.ip,
        user_agent: navigator.userAgent,
      });

      // SessionStorage como backup local
      sessionStorage.setItem('onboarding_data', JSON.stringify({
        aceites,
        ip: ipData.ip,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }));

      toast.success('Termos aceitos');
      navigate(createPageUrl('Dashboard'));
    } catch (error) {
      toast.error('Erro ao salvar aceite: ' + error.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-[var(--brand-primary)]" />
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Bem-vindo!</h1>
                <p className="text-sm text-[var(--text-secondary)]">Antes de começar, precisamos que você aceite nossos termos</p>
              </div>
            </div>
            <Progress value={50} className="h-2" />
          </CardContent>
        </Card>

        <OnboardingTermos termos={termos} onAccept={handleAccept} />
      </div>
    </div>
  );
}