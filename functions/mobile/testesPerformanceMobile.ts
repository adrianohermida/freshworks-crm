import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tipo = 'completo' } = await req.json();

    const inicioTempo = Date.now();
    const metricas = {
      tempoCarregamento: 0,
      tempoApi: 0,
      tamanhoPayload: 0,
      cacheHits: 0,
      erros: 0
    };

    try {
      // Test 1: API Response Time
      const inicioAPI = Date.now();
      const response = await fetch('/api/health-check');
      metricas.tempoApi = Date.now() - inicioAPI;

      // Test 2: Payload Size
      const json = await response.json();
      metricas.tamanhoPayload = JSON.stringify(json).length;

      // Test 3: Service Worker Cache
      if ('serviceWorker' in navigator) {
        const caches_keys = await caches.keys();
        metricas.cacheHits = caches_keys.length;
      }

      // Test 4: Memory Usage
      if (performance.memory) {
        metricas.memoriaUsada = performance.memory.usedJSHeapSize;
        metricas.memoriaTotal = performance.memory.jsHeapSizeLimit;
      }

      // Calculate metrics
      metricas.tempoCarregamento = Date.now() - inicioTempo;
      
      // Performance score (0-100)
      let score = 100;
      if (metricas.tempoCarregamento > 3000) score -= 20;
      if (metricas.tamanhoPayload > 100000) score -= 15;
      if (metricas.erros > 0) score -= (metricas.erros * 10);

      return Response.json({
        success: true,
        action: 'mobile.testesPerformanceMobile',
        data: {
          tipo,
          metricas,
          performanceScore: Math.max(0, score),
          status: score >= 80 ? 'excelente' : score >= 60 ? 'bom' : 'precisa-melhorar',
          recomendacoes: [
            metricas.tempoCarregamento > 3000 && 'Otimizar tempo de carregamento',
            metricas.tamanhoPayload > 100000 && 'Reduzir tamanho do payload',
            !metricas.cacheHits && 'Ativar cache com Service Worker'
          ].filter(Boolean),
          dataTeste: new Date().toISOString()
        }
      });
    } catch (error) {
      metricas.erros++;
      throw error;
    }
  } catch (error) {
    console.error('TestesPerformanceMobile error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});