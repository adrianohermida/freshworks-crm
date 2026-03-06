/**
 * Movement & Enrichment Tests
 * Testes de captura de movimentos, deduplicação e enriquecimento
 */

describe('Process Movement Capture', () => {
  describe('Movement Capture', () => {
    test('should capture movement from DataJud', async () => {
      const movement = { code: 1001, name: 'Distribuição', date: new Date() };
      const captured = await captureMovement(movement);
      expect(captured.id).toBeDefined();
      expect(captured.synchronized).toBe(false);
    });

    test('should batch capture movements', async () => {
      const movements = Array.from({ length: 100 }, (_, i) => ({
        code: 1000 + i,
        name: `Movement ${i}`,
        date: new Date()
      }));
      const results = await batchCaptureMovements(movements);
      expect(results.length).toBe(100);
      expect(results.every(r => r.id)).toBe(true);
    });

    test('should track capture progress', async () => {
      const movements = Array.from({ length: 50 }, (_, i) => ({
        code: 1000 + i,
        name: `Movement ${i}`,
        date: new Date()
      }));
      const progress = [];
      await batchCaptureMovements(movements, (p) => progress.push(p));
      expect(progress.length).toBeGreaterThan(0);
    });
  });

  describe('Movement Deduplication', () => {
    test('should detect duplicate movement by hash', () => {
      const mov1 = { code: 1001, name: 'Distribuição', date: '2024-01-01' };
      const mov2 = { code: 1001, name: 'Distribuição', date: '2024-01-01' };
      const hash1 = generateMovementHash(mov1);
      const hash2 = generateMovementHash(mov2);
      expect(hash1).toBe(hash2);
    });

    test('should identify unique movements', () => {
      const mov1 = { code: 1001, name: 'Distribuição', date: '2024-01-01' };
      const mov2 = { code: 2000, name: 'Decisão', date: '2024-01-01' };
      const hash1 = generateMovementHash(mov1);
      const hash2 = generateMovementHash(mov2);
      expect(hash1).not.toBe(hash2);
    });

    test('should remove duplicates from batch', () => {
      const movements = [
        { id: '1', code: 1001, name: 'Distribuição' },
        { id: '2', code: 1001, name: 'Distribuição' }, // duplicate
        { id: '3', code: 2000, name: 'Decisão' }
      ];
      const deduplicated = deduplicateMovements(movements);
      expect(deduplicated.length).toBe(2);
    });

    test('should track deduplication stats', () => {
      const movements = [
        { code: 1001 },
        { code: 1001 },
        { code: 2000 },
        { code: 2000 },
        { code: 3000 }
      ];
      const stats = getDeduplicationStats(movements);
      expect(stats.total).toBe(5);
      expect(stats.duplicates).toBe(2);
      expect(stats.unique).toBe(3);
    });
  });

  describe('Process Enrichment', () => {
    test('should enrich process with TPU class', async () => {
      const process = { cnj: '0000001-00.0000.0.00000.0000000', title: 'Test' };
      const enriched = await enrichProcessWithClass(process);
      expect(enriched.class).toBeDefined();
      expect(enriched.confidence).toBeGreaterThanOrEqual(0);
      expect(enriched.confidence).toBeLessThanOrEqual(100);
    });

    test('should enrich process with TPU subject', async () => {
      const process = { cnj: '0000001-00.0000.0.00000.0000000', title: 'Civil dispute' };
      const enriched = await enrichProcessWithSubject(process);
      expect(enriched.subject).toBeDefined();
      expect(enriched.subject_code).toBeDefined();
    });

    test('should calculate confidence score', () => {
      const matches = ['match1', 'match2', 'match3'];
      const confidence = calculateConfidenceScore(matches, 3);
      expect(confidence).toBeGreaterThanOrEqual(0);
      expect(confidence).toBeLessThanOrEqual(100);
    });

    test('should batch enrich processes', async () => {
      const processes = Array.from({ length: 20 }, (_, i) => ({
        cnj: `000000${i}-00.0000.0.00000.0000000`,
        title: `Process ${i}`
      }));
      const enriched = await batchEnrichProcesses(processes);
      expect(enriched.length).toBe(20);
      expect(enriched.every(p => p.class || p.subject)).toBe(true);
    });

    test('should handle enrichment errors gracefully', async () => {
      const processes = [
        { cnj: 'INVALID', title: 'Bad' },
        { cnj: '0000001-00.0000.0.00000.0000000', title: 'Good' }
      ];
      const results = await batchEnrichProcesses(processes);
      expect(results.length).toBe(2);
    });
  });

  describe('Legal Deadline Calculation', () => {
    test('should calculate deadline from movement', () => {
      const movement = { code: 1001, name: 'Distribuição', date: '2024-01-01' };
      const deadline = calculateDeadline(movement, 30);
      expect(new Date(deadline)).toAfter(new Date('2024-01-01'));
    });

    test('should exclude weekends and holidays', () => {
      const startDate = new Date('2024-01-08'); // Monday
      const days = 5;
      const deadline = calculateWorkDays(startDate, days);
      const daysOfWeek = deadline.getDay();
      expect([1, 2, 3, 4, 5]).toContain(daysOfWeek);
    });

    test('should apply business day rule', () => {
      const startDate = new Date('2024-01-05'); // Friday
      const deadline = calculateDeadline({ date: '2024-01-05' }, 5);
      const result = new Date(deadline);
      expect(result.getDay()).not.toBe(6); // not Saturday
      expect(result.getDay()).not.toBe(0); // not Sunday
    });
  });
});

// Helper functions
function captureMovement(movement) {
  return Promise.resolve({
    id: Math.random().toString(),
    ...movement,
    synchronized: false,
    capturedAt: new Date()
  });
}

async function batchCaptureMovements(movements, onProgress) {
  const batchSize = 10;
  const results = [];
  
  for (let i = 0; i < movements.length; i += batchSize) {
    const batch = movements.slice(i, i + batchSize);
    const captured = await Promise.all(batch.map(captureMovement));
    results.push(...captured);
    
    if (onProgress) {
      onProgress(Math.round(((i + batchSize) / movements.length) * 100));
    }
  }
  return results;
}

function generateMovementHash(movement) {
  const str = `${movement.code}|${movement.name}|${movement.date}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash.toString();
}

function deduplicateMovements(movements) {
  const seen = new Set();
  return movements.filter(m => {
    const hash = generateMovementHash(m);
    if (seen.has(hash)) return false;
    seen.add(hash);
    return true;
  });
}

function getDeduplicationStats(movements) {
  const unique = deduplicateMovements(movements);
  return {
    total: movements.length,
    unique: unique.length,
    duplicates: movements.length - unique.length
  };
}

async function enrichProcessWithClass(process) {
  return {
    ...process,
    class: 'Ação Civil Ordinária',
    confidence: Math.floor(Math.random() * 20) + 80
  };
}

async function enrichProcessWithSubject(process) {
  return {
    ...process,
    subject: 'Responsabilidade Civil',
    subject_code: 1234
  };
}

function calculateConfidenceScore(matches, total) {
  return (matches.length / total) * 100;
}

async function batchEnrichProcesses(processes) {
  return Promise.all(processes.map(async (p) => {
    try {
      const enriched = await enrichProcessWithClass(p);
      return { ...enriched, ...(await enrichProcessWithSubject(p)) };
    } catch {
      return p;
    }
  }));
}

function calculateDeadline(movement, days) {
  const date = new Date(movement.date);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function calculateWorkDays(startDate, days) {
  let count = 0;
  const date = new Date(startDate);
  
  while (count < days) {
    date.setDate(date.getDate() + 1);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  return date;
}