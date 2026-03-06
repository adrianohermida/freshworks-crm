import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import SEOContactEnhanced from "@/components/seo/SEOContactEnhanced";
import HeroSection from "@/components/contact/HeroSection";
import ContactInfoCard from "@/components/contact/ContactInfoCard";
import WhatsAppSupportCard from "@/components/contact/WhatsAppSupportCard";
import SocialLinksCard from "@/components/contact/SocialLinksCard";
import ContactForm from "@/components/contact/ContactForm";
import SuccessMessage from "@/components/contact/SuccessMessage";
import LegalDisclaimerCollapsible from "@/components/contact/LegalDisclaimerCollapsible";
import OndeEncontrar from "@/components/contact/OndeEncontrar";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const [escritorio, setEscritorio] = React.useState(null);
  React.useEffect(() => {
    base44.entities.Escritorio.list().then(list => {
      if (list?.[0]?.id) setEscritorio(list[0]);
    });
  }, []);

  const handleSubmit = async (e) => {
     e.preventDefault();
     if (!formData.name || !formData.email || !formData.message) return;

     setIsSubmitting(true);
     try {
       // Criar conversa no sistema interno
       await base44.functions.invoke('criarConversaContato', {
         nome: formData.name,
         email: formData.email,
         telefone: '',
         mensagem: formData.message,
         escritorio_id: escritorio?.id || (await base44.entities.Escritorio.list())?.[0]?.id
       });

       // Criar ticket no Freshdesk
       await base44.functions.invoke('createFreshdeskTicket', {
         name: formData.name,
         email: formData.email,
         subject: formData.subject || 'Contato via Website',
         message: formData.message
       });

       setIsSubmitted(true);
     } catch (error) {
       console.error("Error creating conversa:", error);
     }
     setIsSubmitting(false);
   };

  if (isSubmitted) {
    return <SuccessMessage onBack={() => setIsSubmitted(false)} />;
  }

  return (
    <>
      <SEOContactEnhanced />
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <HeroSection />

        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
              <ContactInfoCard />
              <WhatsAppSupportCard />
              <SocialLinksCard />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
              <Card className="bg-[var(--bg-elevated)] backdrop-blur-sm border border-[var(--border-primary)]">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Envie sua Mensagem</h2>
                  <p className="text-[var(--text-secondary)] mb-6">Preencha o formulário abaixo e retornaremos em breve.</p>
                  <ContactForm 
                    formData={formData} 
                    onChange={handleInputChange} 
                    onSubmit={handleSubmit} 
                    isSubmitting={isSubmitting} 
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <OndeEncontrar />

          <LegalDisclaimerCollapsible />
        </div>
      </div>
    </>
  );
}