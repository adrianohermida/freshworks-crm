import test from 'node:test';
import assert from 'node:assert/strict';

function paginate<T>(items: T[], page: number, size: number): { data: T[]; total: number; page: number; size: number } {
  const safePage = Math.max(0, Number.isFinite(page) ? Math.floor(page) : 0);
  const safeSize = Math.max(1, Number.isFinite(size) ? Math.floor(size) : 10);
  const start = safePage * safeSize;
  return {
    data: items.slice(start, start + safeSize),
    total: items.length,
    page: safePage,
    size: safeSize,
  };
}

test('paginate retorna primeira página corretamente', () => {
  const result = paginate([1, 2, 3, 4, 5], 0, 2);
  assert.deepEqual(result.data, [1, 2]);
  assert.equal(result.total, 5);
  assert.equal(result.page, 0);
  assert.equal(result.size, 2);
});

test('paginate retorna página intermediária corretamente', () => {
  const result = paginate([1, 2, 3, 4, 5], 1, 2);
  assert.deepEqual(result.data, [3, 4]);
});

test('paginate trata parâmetros inválidos com fallback seguro', () => {
  const result = paginate([1, 2, 3], -10, 0);
  assert.deepEqual(result.data, [1]);
  assert.equal(result.page, 0);
  assert.equal(result.size, 1);
});
