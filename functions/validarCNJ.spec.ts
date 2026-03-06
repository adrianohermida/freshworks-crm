import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ehCNJValido,
  limparCNJ,
  formatarCNJ,
  extrairCamposCNJ,
  calcularDigitoVerificador,
} from '../utils/validarCNJ.ts';

test('limparCNJ remove pontuação e mantém até 20 dígitos', () => {
  assert.equal(limparCNJ('0000832-35.2018.4.01.3202'), '00008323520184013202');
  assert.equal(limparCNJ('00008323520184013202123').length, 20);
});

test('formatarCNJ formata corretamente quando possui 20 dígitos', () => {
  assert.equal(formatarCNJ('00008323520184013202'), '0000832-35.2018.4.01.3202');
  assert.equal(formatarCNJ('123'), '123');
});

test('ehCNJValido valida CNJ conhecido e rejeita inválido', () => {
  assert.equal(ehCNJValido('00008323520184013202'), true);
  assert.equal(ehCNJValido('00008323520184013203'), false);
  assert.equal(ehCNJValido('123456789'), false);
});

test('extrairCamposCNJ devolve estrutura esperada', () => {
  const result = extrairCamposCNJ('00008323520184013202');
  assert.equal(result.numeroProcesso, '0000832');
  assert.equal(result.digitoVerificador, 35);
  assert.equal(result.anoAjuizamento, 2018);
  assert.equal(result.segmentoJudicial, 4);
  assert.equal(result.tribunal, 1);
  assert.equal(result.codigoOrigem, '3202');
  assert.equal(result.ehValido, true);
});

test('calcularDigitoVerificador mantém valor esperado do caso de referência', () => {
  assert.equal(calcularDigitoVerificador(832, 2018, 4, 1, 3202), 35);
});
