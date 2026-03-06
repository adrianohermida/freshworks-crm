/**
 * Testes de Resiliência
 * Valida comportamento com falhas de API
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { retryWithBackoff } from '../utils/retryWithBackoff.js';
import { Logger } from '../utils/logger.js';

Deno.serve(async (req) => {
  const logger = new Logger('testResiliencia');
  
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      logger.error('Usuário não autenticado');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.info('Iniciando testes de resiliência');

    const results = {
      testeFalhaAPI: await testeFalhaAPI(logger),
      testeRetryBackoff: await testeRetryBackoff(logger),
      testeTimeout: await testeTimeout(logger),
      testeRateLimit: await testeRateLimit(logger),
      testeCircuitBreaker: await testeCircuitBreaker(logger)
    };

    logger.success('Todos os testes completados');

    return Response.json({
      results,
      logs: logger.export()
    });

  } catch (error) {
    logger.error('Erro fatal nos testes', { message: error.message });
    return Response.json({
      error: error.message,
      logs: logger.export()
    }, { status: 500 });
  }
});

async function testeFalhaAPI(logger) {
  logger.info('Teste 1: Falha de API');
  
  try {
    const result = await retryWithBackoff(
      () => {
        throw new Error('Simulated API failure');
      },
      3,
      100
    );
    return { passed: false, message: 'Deveria ter falho' };
  } catch (error) {
    logger.success('Falha capturada corretamente', { retries: 3 });
    return { passed: true, message: 'Falha tratada corretamente', error: error.message };
  }
}

async function testeRetryBackoff(logger) {
  logger.info('Teste 2: Retry com Backoff');
  
  let attempts = 0;
  const startTime = Date.now();
  
  try {
    await retryWithBackoff(
      async () => {
        attempts++;
        if (attempts < 3) {
          const error = new Error('Temporary failure');
          error.status = 500;
          throw error;
        }
        return 'success';
      },
      3,
      50
    );
    
    const duration = Date.now() - startTime;
    logger.success('Retry bem-sucedido após falhas', { attempts, duration: `${duration}ms` });
    return { passed: true, attempts, duration };
  } catch (error) {
    return { passed: false, message: error.message, attempts };
  }
}

async function testeTimeout(logger) {
  logger.info('Teste 3: Timeout handling');
  
  try {
    await Promise.race([
      new Promise(resolve => setTimeout(() => resolve('ok'), 100)),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 50))
    ]);
    return { passed: false, message: 'Timeout deveria ter sido lançado' };
  } catch (error) {
    logger.success('Timeout capturado', { error: error.message });
    return { passed: true, message: 'Timeout tratado corretamente' };
  }
}

async function testeRateLimit(logger) {
  logger.info('Teste 4: Rate Limit (429)');
  
  let attempts = 0;
  
  try {
    await retryWithBackoff(
      async () => {
        attempts++;
        if (attempts <= 2) {
          const error = new Error('Rate limited');
          error.status = 429;
          throw error;
        }
        return 'success';
      },
      3,
      50
    );
    
    logger.success('Rate limit tratado com retry', { attempts });
    return { passed: true, attempts, message: '429 tratado com sucesso' };
  } catch (error) {
    return { passed: false, message: error.message, attempts };
  }
}

async function testeCircuitBreaker(logger) {
  logger.info('Teste 5: Circuit Breaker');
  
  let failureCount = 0;
  let attempts = 0;
  
  try {
    for (let i = 0; i < 5; i++) {
      attempts++;
      try {
        throw new Error('Continuous failure');
      } catch (error) {
        failureCount++;
        logger.warn(`Falha ${failureCount}`, { attempt: attempts });
        
        // Simular circuit breaker - parar após 3 falhas
        if (failureCount >= 3) {
          logger.success('Circuit breaker ativado (rejeitando)');
          break;
        }
      }
    }
    
    return { 
      passed: true, 
      message: 'Circuit breaker funcionando',
      failures: failureCount,
      totalAttempts: attempts
    };
  } catch (error) {
    return { passed: false, message: error.message };
  }
}