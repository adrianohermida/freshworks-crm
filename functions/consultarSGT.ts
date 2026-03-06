import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Consulta WebService SGT (Sistema de Gestão de Tabelas Processuais Unificadas)
 * WSDL: https://www.cnj.jus.br/sgt/sgt_ws.php?wsdl
 * 
 * Tipos de tabela: A=Assuntos, M=Movimentos, C=Classes
 * Tipos de pesquisa: G=Glossário, N=Nome, C=Código
 */

const SGT_WSDL = 'https://www.cnj.jus.br/sgt/sgt_ws.php?wsdl';

async function parseSoapResponse(xmlText) {
  // Simple XML parser para extrair valores SOAP
  // Em produção, usar uma biblioteca XML adequada
  const bodyMatch = xmlText.match(/<soap:Body>([\s\S]*?)<\/soap:Body>/);
  if (!bodyMatch) throw new Error('Resposta SOAP inválida');
  
  const body = bodyMatch[1];
  
  // Trata resposta de erro SOAP
  if (body.includes('soap:Fault')) {
    const faultMatch = body.match(/<faultstring>(.*?)<\/faultstring>/);
    throw new Error(`SGT Fault: ${faultMatch ? faultMatch[1] : 'Erro desconhecido'}`);
  }
  
  return body;
}

async function callSGTService(soapAction, soapBody) {
  const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://www.cnj.jus.br/">
  <soap:Body>
    ${soapBody}
  </soap:Body>
</soap:Envelope>`;

  try {
    const response = await fetch(SGT_WSDL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': soapAction,
      },
      body: soapEnvelope,
    });

    if (!response.ok) {
      throw new Error(`SGT HTTP ${response.status}`);
    }

    const text = await response.text();
    return await parseSoapResponse(text);
  } catch (error) {
    console.error('[callSGTService]', error.message);
    throw error;
  }
}

/**
 * Pesquisa em tabelas públicas SGT
 * 
 * @param {string} tipoTabela - 'A' (Assuntos), 'M' (Movimentos), 'C' (Classes)
 * @param {string} tipoPesquisa - 'G' (Glossário), 'N' (Nome), 'C' (Código)
 * @param {string} valorPesquisa - Valor a pesquisar
 * @returns {Promise<Array>} Array de itens encontrados
 */
async function pesquisarItemPublico(tipoTabela, tipoPesquisa, valorPesquisa) {
  const soapBody = `
    <tns:pesquisarItemPublicoWS>
      <tipoTabela>${tipoTabela}</tipoTabela>
      <tipoPesquisa>${tipoPesquisa}</tipoPesquisa>
      <valorPesquisa>${valorPesquisa}</valorPesquisa>
    </tns:pesquisarItemPublicoWS>
  `;
  
  const response = await callSGTService(
    'http://www.cnj.jus.br/pesquisarItemPublicoWS',
    soapBody
  );
  
  // Parse response - simplificado, ajustar conforme estrutura real
  return response;
}

/**
 * Retorna detalhes de um item específico
 * 
 * @param {number} seqItem - Código do item
 * @param {string} tipoItem - 'A' (Assuntos), 'M' (Movimentos), 'C' (Classes)
 * @returns {Promise<Object>} Array com detalhes do item
 */
async function getDetalhesItem(seqItem, tipoItem) {
  const soapBody = `
    <tns:getArrayDetalhesItemPublicoWS>
      <seqItem>${seqItem}</seqItem>
      <tipoItem>${tipoItem}</tipoItem>
    </tns:getArrayDetalhesItemPublicoWS>
  `;
  
  const response = await callSGTService(
    'http://www.cnj.jus.br/getArrayDetalhesItemPublicoWS',
    soapBody
  );
  
  return response;
}

/**
 * Retorna lista de itens filhos (hierarquia)
 * 
 * @param {number} seqItem - Código do item pai
 * @param {string} tipoItem - 'A' (Assuntos), 'M' (Movimentos), 'C' (Classes)
 * @returns {Promise<Array>} Lista de itens filhos
 */
async function getFilhosItem(seqItem, tipoItem) {
  const soapBody = `
    <tns:getArrayFilhosItemPublicoWS>
      <seqItem>${seqItem}</seqItem>
      <tipoItem>${tipoItem}</tipoItem>
    </tns:getArrayFilhosItemPublicoWS>
  `;
  
  const response = await callSGTService(
    'http://www.cnj.jus.br/getArrayFilhosItemPublicoWS',
    soapBody
  );
  
  return response;
}

/**
 * Retorna encadeamento de pais de um item
 * 
 * @param {number} seqItem - Código do item
 * @param {string} tipoItem - 'A' (Assuntos), 'M' (Movimentos), 'C' (Classes)
 * @returns {Promise<string>} String com encadeamento (ex: "Família > Divórcio")
 */
async function getPaisItem(seqItem, tipoItem) {
  const soapBody = `
    <tns:getStringPaisItemPublicoWS>
      <seqItem>${seqItem}</seqItem>
      <tipoItem>${tipoItem}</tipoItem>
    </tns:getStringPaisItemPublicoWS>
  `;
  
  const response = await callSGTService(
    'http://www.cnj.jus.br/getStringPaisItemPublicoWS',
    soapBody
  );
  
  return response;
}

/**
 * Retorna complementos tabelados de um movimento
 * 
 * @param {number} codMovimento - Código do movimento (opcional, vazio = todos)
 * @returns {Promise<Array>} Lista de complementos
 */
async function getComplementosMovimento(codMovimento = '') {
  const soapBody = `
    <tns:getComplementoMovimentoWS>
      <codMovimento>${codMovimento}</codMovimento>
    </tns:getComplementoMovimentoWS>
  `;
  
  const response = await callSGTService(
    'http://www.cnj.jus.br/getComplementoMovimentoWS',
    soapBody
  );
  
  return response;
}

/**
 * Retorna data da última versão das tabelas SGT
 * 
 * @returns {Promise<string>} Data da última atualização
 */
async function getDataUltimaVersao() {
  const soapBody = `<tns:getDataUltimaVersao />`;
  
  const response = await callSGTService(
    'http://www.cnj.jus.br/getDataUltimaVersao',
    soapBody
  );
  
  return response;
}

// Endpoint Backend
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { acao, tipoTabela, tipoPesquisa, valorPesquisa, seqItem, tipoItem, codMovimento } = await req.json();

    let resultado;

    switch (acao) {
      case 'pesquisar':
        resultado = await pesquisarItemPublico(tipoTabela, tipoPesquisa, valorPesquisa);
        break;
      case 'detalhes':
        resultado = await getDetalhesItem(seqItem, tipoItem);
        break;
      case 'filhos':
        resultado = await getFilhosItem(seqItem, tipoItem);
        break;
      case 'pais':
        resultado = await getPaisItem(seqItem, tipoItem);
        break;
      case 'complementos':
        resultado = await getComplementosMovimento(codMovimento);
        break;
      case 'versao':
        resultado = await getDataUltimaVersao();
        break;
      default:
        return Response.json({ error: 'Ação inválida' }, { status: 400 });
    }

    return Response.json({
      success: true,
      acao,
      resultado,
    });
  } catch (error) {
    console.error('[consultarSGT]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});