import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MessageSquare, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sentiment, setSentiment] = useState('positive');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      await base44.functions.invoke('feedbackCollector', {
        action: 'submit',
        feedback_text: text,
        feedback_type: sentiment,
        feature: 'general'
      });

      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setText('');
        setSentiment('positive');
      }, 2000);
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-40"
        aria-label="Enviar feedback"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-xl font-bold mb-2">Obrigado!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Seu feedback é muito importante para nós.
              </p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Compartilhe seu feedback</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Sentiment Selection */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">
                    Como você se sente sobre o DataJud?
                  </Label>
                  <RadioGroup value={sentiment} onValueChange={setSentiment}>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="positive" id="positive" />
                      <Label htmlFor="positive" className="cursor-pointer">
                        👍 Adorei!
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="neutral" id="neutral" />
                      <Label htmlFor="neutral" className="cursor-pointer">
                        💭 Poderia melhorar
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="negative" id="negative" />
                      <Label htmlFor="negative" className="cursor-pointer">
                        👎 Não gostei
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Feedback Text */}
                <div>
                  <Label htmlFor="feedback" className="text-sm font-semibold mb-2 block">
                    Conte-nos mais:
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Ex: A interface é muito intuitiva... ou poderia adicionar..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {text.length}/500 caracteres
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className="dark:border-gray-600"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !text.trim()}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}