import React from 'react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import Card from '@/components/aetherlab/Card';
import Button from '@/components/aetherlab/Button';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'var(--color-light)', padding: 'var(--spacing-lg)',
        }}>
          <Card variant="default" style={{ maxWidth: '500px', textAlign: 'center' }}>
            <AlertCircle style={{
              width: '64px', height: '64px', margin: '0 auto var(--spacing-lg)',
              color: '#EF4444', opacity: 0.8,
            }} />
            <h1 style={{
              fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-heading)', margin: '0 0 var(--spacing-md)',
            }}>
              Oops! Algo deu errado
            </h1>
            <p style={{
              fontSize: 'var(--font-size-sm)', color: 'var(--color-body)',
              margin: '0 0 var(--spacing-lg)', lineHeight: '1.6',
            }}>
              Desculpe, encontramos um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div style={{
                backgroundColor: 'var(--color-gray-100)', padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)', marginBottom: 'var(--spacing-lg)',
                textAlign: 'left', fontSize: 'var(--font-size-xs)', fontFamily: 'monospace',
                color: '#EF4444', overflowX: 'auto',
              }}>
                <strong>Erro:</strong> {this.state.error.toString()}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
              <Button variant="primary" onClick={this.handleReset}>
                <RefreshCw style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                Tentar Novamente
              </Button>
              <Button variant="primary">
                <Home style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                Ir para Inicio
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}