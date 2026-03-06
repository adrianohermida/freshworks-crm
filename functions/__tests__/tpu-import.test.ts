/**
 * TPU Import Tests
 * Testes de importação, validação e processamento em lote
 */

describe('TPU Import Manager', () => {
  describe('File Validation', () => {
    test('should accept CSV files', () => {
      const file = { name: 'data.csv', size: 1024 };
      expect(validateFileType(file)).toBe(true);
    });

    test('should accept Excel files', () => {
      const file = { name: 'data.xlsx', size: 1024 };
      expect(validateFileType(file)).toBe(true);
    });

    test('should reject invalid file types', () => {
      const file = { name: 'data.txt', size: 1024 };
      expect(validateFileType(file)).toBe(false);
    });

    test('should reject files over 10MB', () => {
      const file = { name: 'data.csv', size: 11 * 1024 * 1024 };
      expect(validateFileSize(file)).toBe(false);
    });

    test('should accept files under 10MB', () => {
      const file = { name: 'data.csv', size: 5 * 1024 * 1024 };
      expect(validateFileSize(file)).toBe(true);
    });
  });

  describe('Data Validation', () => {
    test('should validate required fields for classes', () => {
      const data = { codigo: 1, nome: 'Test', descricao: '' };
      expect(validateClassSchema(data)).toBe(true);
    });

    test('should reject missing required fields', () => {
      const data = { codigo: 1 }; // missing nome
      expect(validateClassSchema(data)).toBe(false);
    });

    test('should detect duplicate codes', () => {
      const data = [
        { codigo: 1, nome: 'A' },
        { codigo: 1, nome: 'B' }
      ];
      expect(hasDuplicates(data, 'codigo')).toBe(true);
    });

    test('should validate unique codes', () => {
      const data = [
        { codigo: 1, nome: 'A' },
        { codigo: 2, nome: 'B' }
      ];
      expect(hasDuplicates(data, 'codigo')).toBe(false);
    });
  });

  describe('Batch Processing', () => {
    test('should process small batches (< 1000 records)', async () => {
      const data = Array.from({ length: 500 }, (_, i) => ({
        codigo: i + 1,
        nome: `Test ${i}`
      }));
      const result = await processBatch(data, 'classes');
      expect(result.success).toBe(true);
      expect(result.imported).toBe(500);
    });

    test('should process large batches (> 1000 records)', async () => {
      const data = Array.from({ length: 5000 }, (_, i) => ({
        codigo: i + 1,
        nome: `Test ${i}`
      }));
      const result = await processBatch(data, 'classes');
      expect(result.success).toBe(true);
      expect(result.imported).toBe(5000);
    });

    test('should report errors for failed imports', async () => {
      const data = [
        { codigo: 1, nome: 'Valid' },
        { codigo: 2 }, // missing nome
        { codigo: 3, nome: 'Valid 2' }
      ];
      const result = await processBatch(data, 'classes');
      expect(result.errors.length).toBe(1);
      expect(result.imported).toBe(2);
    });

    test('should track import progress', async () => {
      const data = Array.from({ length: 100 }, (_, i) => ({
        codigo: i + 1,
        nome: `Test ${i}`
      }));
      const progressTracker = [];
      await processBatch(data, 'classes', (progress) => {
        progressTracker.push(progress);
      });
      expect(progressTracker.length).toBeGreaterThan(0);
      expect(progressTracker[progressTracker.length - 1]).toBe(100);
    });
  });

  describe('Schema Validation', () => {
    test('should validate classes schema', () => {
      const schema = getSchemaDefinition('classes');
      expect(schema.required).toContain('codigo');
      expect(schema.required).toContain('nome');
    });

    test('should validate movements schema', () => {
      const schema = getSchemaDefinition('movements');
      expect(schema.required).toContain('codigo');
      expect(schema.required).toContain('categoria');
    });

    test('should validate subjects schema', () => {
      const schema = getSchemaDefinition('subjects');
      expect(schema.required).toContain('codigo');
      expect(schema.required).toContain('ramo_direito');
    });
  });
});

// Helper functions
function validateFileType(file) {
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  return ['.csv', '.xlsx'].includes(ext);
}

function validateFileSize(file) {
  return file.size <= 10 * 1024 * 1024;
}

function validateClassSchema(data) {
  return data.codigo !== undefined && data.nome !== undefined;
}

function hasDuplicates(data, field) {
  const seen = new Set();
  for (const item of data) {
    if (seen.has(item[field])) return true;
    seen.add(item[field]);
  }
  return false;
}

async function processBatch(data, type, onProgress) {
  const batchSize = 100;
  let imported = 0;
  const errors = [];

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    for (const item of batch) {
      try {
        if (validateByType(item, type)) {
          imported++;
        }
      } catch (err) {
        errors.push(`Row ${i + batch.indexOf(item)}: ${err.message}`);
      }
    }
    if (onProgress) {
      onProgress(Math.round((i / data.length) * 100));
    }
  }

  if (onProgress) onProgress(100);

  return {
    success: errors.length === 0,
    imported,
    errors,
    total: data.length
  };
}

function validateByType(item, type) {
  const schemas = {
    classes: validateClassSchema,
    movements: (d) => d.codigo && d.nome && d.categoria,
    subjects: (d) => d.codigo && d.nome && d.ramo_direito
  };
  return schemas[type]?.(item) ?? false;
}

function getSchemaDefinition(type) {
  const schemas = {
    classes: { required: ['codigo', 'nome', 'categoria'] },
    movements: { required: ['codigo', 'nome', 'categoria'] },
    subjects: { required: ['codigo', 'nome', 'ramo_direito'] }
  };
  return schemas[type];
}