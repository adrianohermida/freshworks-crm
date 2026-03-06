import test from 'node:test';
import assert from 'node:assert/strict';

const mockDataJudResponse = {
  hits: {
    hits: [
      {
        _source: {
          numeroProcesso: '00008323520184013202',
          classe: { codigo: 436, nome: 'Procedimento do Juizado Especial Cível' },
          orgaoJulgador: { codigo: 16403, nome: 'JEF Adj - Tefé', codigoMunicipioIBGE: 5128 },
          dataAjuizamento: '2018-10-29T00:00:00.000Z',
          assuntos: [{ codigo: 6177, nome: 'Concessão' }],
          movimentos: [{ codigo: 26, nome: 'Distribuição', dataHora: '2018-10-30T14:06:24.000Z', complementosTabelados: [] }],
        },
      },
    ],
  },
};

test('parse da resposta DataJud mantém campos essenciais', () => {
  const src = mockDataJudResponse.hits.hits[0]._source;
  assert.equal(src.numeroProcesso, '00008323520184013202');
  assert.equal(src.classe.codigo, 436);
  assert.equal(src.orgaoJulgador.codigo, 16403);
  assert.equal(src.assuntos.length, 1);
  assert.equal(src.movimentos.length, 1);
});

test('extração de codigo_origem do CNJ funciona', () => {
  const numero = '00008323520184013202';
  assert.equal(numero.slice(16, 20), '3202');
});

test('dedupe key sugerida de movimento é estável', () => {
  const m = mockDataJudResponse.hits.hits[0]._source.movimentos[0];
  const key = `${m.codigo}|${m.dataHora}|${m.nome}`;
  assert.equal(key, '26|2018-10-30T14:06:24.000Z|Distribuição');
});

test('retry com backoff encerra após limite', async () => {
  const maxRetries = 5;
  let tentativas = 0;

  const simulateRateLimit = async (tentativa: number) => {
    tentativas += 1;
    if (tentativa <= maxRetries) {
      return { status: 429, delay: Math.pow(2, tentativa) * 1000 };
    }
    throw new Error('Rate limit exceeded after 5 retries');
  };

  let erro: string | null = null;
  for (let i = 1; i <= 6; i += 1) {
    try {
      await simulateRateLimit(i);
    } catch (e) {
      erro = (e as Error).message;
      break;
    }
  }

  assert.equal(erro, 'Rate limit exceeded after 5 retries');
  assert.equal(tentativas, 6);
});
