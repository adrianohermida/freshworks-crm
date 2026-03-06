import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Scale, Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin'); // signin, signup, reset
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('signup') === 'true') {
      setMode('signup');
      setEmail(params.get('email') || '');
    }
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const isAuthenticated = await base44.auth.isAuthenticated();
      if (isAuthenticated) {
        navigate(createPageUrl('Processes'));
      } else {
        base44.auth.redirectToLogin(createPageUrl('Processes'));
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Senhas não conferem');
      return;
    }

    if (password.length < 8) {
      setError('Senha deve ter no mínimo 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Enviar convite para email
      await base44.users.inviteUser(email, 'user');
      
      setSuccess('Verifique seu email para confirmar o cadastro. Você será redirecionado em 3 segundos...');
      
      setTimeout(() => {
        base44.auth.redirectToLogin(createPageUrl('Processes'));
      }, 3000);
    } catch (err) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="p-3 bg-white rounded-lg">
            <Scale className="w-8 h-8 text-cyan-600" />
          </div>
        </div>

        {/* Card */}
        <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {mode === 'signin' ? 'Entrar' : 'Criar Conta'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {mode === 'signin'
                  ? 'Acesse sua conta DataJud'
                  : 'Junte-se à comunidade de advogados'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm text-green-700 dark:text-green-300">
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
              {/* Full Name (Signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome Completo
                  </label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome"
                    disabled={loading || success}
                    className="dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    disabled={loading || success}
                    className="pl-10 dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading || success}
                    className="pl-10 pr-10 dark:bg-slate-800 dark:border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'signup' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Mínimo 8 caracteres
                  </p>
                )}
              </div>

              {/* Confirm Password (Signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirme a Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={loading || success}
                      className="pl-10 pr-10 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || success}
                className="w-full bg-cyan-600 hover:bg-cyan-700 h-10"
              >
                {loading ? 'Processando...' : mode === 'signin' ? 'Entrar' : 'Criar Conta'}
              </Button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {mode === 'signin' ? 'Não tem conta? ' : 'Já tem conta? '}
              </span>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setError('');
                  setSuccess('');
                }}
                className="text-cyan-600 hover:text-cyan-700 font-medium"
              >
                {mode === 'signin' ? 'Cadastre-se' : 'Entre'}
              </button>
            </div>
          </div>
        </Card>

        {/* Terms */}
        <p className="text-xs text-white text-center">
          Ao entrar, você concorda com nossos{' '}
          <a href="#" className="underline hover:text-gray-200">
            Termos de Serviço
          </a>
          {' '}e{' '}
          <a href="#" className="underline hover:text-gray-200">
            Política de Privacidade
          </a>
        </p>
      </div>
    </div>
  );
}