import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { User, Mail, Phone, MapPin, Save, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '@/components/aetherlab/Card';
import Button from '@/components/aetherlab/Button';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setFormData({
          full_name: currentUser.full_name || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          city: currentUser.city || '',
          state: currentUser.state || '',
        });
      } catch (err) {
        setMessage({ type: 'error', text: 'Erro ao carregar perfil' });
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await base44.auth.updateMe({
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
      });
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao salvar perfil: ' + err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-body)' }}>Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-lg)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
            Meu Perfil
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', marginTop: 'var(--spacing-sm)' }}>
            Gerencie suas informações pessoais
          </p>
        </div>

        {/* Messages */}
        {message.text && (
          <Card variant={message.type === 'success' ? 'default' : 'default'} style={{ marginBottom: 'var(--spacing-lg)', borderLeft: `4px solid ${message.type === 'success' ? '#10B981' : '#EF4444'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              {message.type === 'success' ? (
                <CheckCircle style={{ width: '20px', height: '20px', color: '#10B981', flexShrink: 0 }} />
              ) : (
                <AlertCircle style={{ width: '20px', height: '20px', color: '#EF4444', flexShrink: 0 }} />
              )}
              <p style={{ margin: 0, color: message.type === 'success' ? '#10B981' : '#EF4444' }}>
                {message.text}
              </p>
            </div>
          </Card>
        )}

        {/* Profile Card */}
        <Card variant="default">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)' }}>
            {/* Read-only fields */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--color-heading)', marginBottom: 'var(--spacing-sm)' }}>
                <User style={{ width: '14px', height: '14px', marginRight: '6px', display: 'inline' }} />
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.full_name}
                disabled
                style={{
                  width: '100%', padding: 'var(--spacing-md)', borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--color-border)', backgroundColor: 'var(--color-gray-100)',
                  color: 'var(--color-body)', cursor: 'not-allowed', fontSize: 'var(--font-size-sm)',
                }}
              />
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', marginTop: '4px', opacity: 0.6 }}>
                Não pode ser alterado
              </p>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--color-heading)', marginBottom: 'var(--spacing-sm)' }}>
                <Mail style={{ width: '14px', height: '14px', marginRight: '6px', display: 'inline' }} />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                style={{
                  width: '100%', padding: 'var(--spacing-md)', borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--color-border)', backgroundColor: 'var(--color-gray-100)',
                  color: 'var(--color-body)', cursor: 'not-allowed', fontSize: 'var(--font-size-sm)',
                }}
              />
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', marginTop: '4px', opacity: 0.6 }}>
                Não pode ser alterado
              </p>
            </div>

            {/* Editable fields */}
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--color-heading)', marginBottom: 'var(--spacing-sm)' }}>
                <Phone style={{ width: '14px', height: '14px', marginRight: '6px', display: 'inline' }} />
                Telefone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(XX) XXXXX-XXXX"
                style={{
                  width: '100%', padding: 'var(--spacing-md)', borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--color-border)', fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-heading)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--color-heading)', marginBottom: 'var(--spacing-sm)' }}>
                Estado
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="SP, RJ, MG..."
                style={{
                  width: '100%', padding: 'var(--spacing-md)', borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--color-border)', fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-heading)',
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--color-heading)', marginBottom: 'var(--spacing-sm)' }}>
                <MapPin style={{ width: '14px', height: '14px', marginRight: '6px', display: 'inline' }} />
                Cidade
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="São Paulo, Rio de Janeiro..."
                style={{
                  width: '100%', padding: 'var(--spacing-md)', borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--color-border)', fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-heading)',
                }}
              />
            </div>

            {/* Save Button */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                variant="primary"
                style={{ minWidth: '120px' }}
              >
                <Save style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </Card>

        {/* User Info Card */}
        {user && (
          <Card variant="default" style={{ marginTop: 'var(--spacing-lg)' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', marginBottom: 'var(--spacing-lg)' }}>
              Informações da Conta
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)' }}>
              <div>
                <p style={{ color: 'var(--color-body)', margin: '0 0 4px', fontWeight: '500' }}>Role</p>
                <p style={{ color: 'var(--color-heading)', margin: 0, fontWeight: '600' }}>
                  {user.role === 'admin' ? '🔐 Admin' : '👤 Usuário'}
                </p>
              </div>
              <div>
                <p style={{ color: 'var(--color-body)', margin: '0 0 4px', fontWeight: '500' }}>ID</p>
                <p style={{ color: 'var(--color-heading)', margin: 0, fontFamily: 'monospace', fontSize: 'var(--font-size-xs)', wordBreak: 'break-all' }}>
                  {user.id}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}