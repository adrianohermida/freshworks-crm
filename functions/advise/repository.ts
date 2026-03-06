/**
 * Repositório para persistência no banco de dados
 */
export class AdviseRepository {
  constructor(base44Service) {
    this.base44 = base44Service;
  }

  async salvarIntimacoes(intimacoes) {
    if (!intimacoes?.length) return [];
    
    const dados = intimacoes.map(item => ({
      idIntimacao: item.idIntimacao || item.id,
      numeroProcesso: item.numeroProcesso,
      tipo: item.tipo || 'aviso',
      descricao: item.descricao || '',
      dataIntimacao: item.dataIntimacao,
      statusIntimacao: item.status || 'pendente',
      lido: false,
      dataSincronizacao: new Date().toISOString()
    }));

    return this.base44.asServiceRole.entities.IntimacaoAdvise.bulkCreate(dados);
  }

  async salvarProcessos(processos) {
    if (!processos?.length) return [];
    
    const dados = processos.map(item => ({
      idProcessoAdvise: item.idProcesso || item.id,
      numeroProcesso: item.numeroProcesso,
      numeroCNJ: item.flNumUnicaCNJ || false,
      statusProcesso: item.status || 'ativo',
      dataSincronizacao: new Date().toISOString()
    }));

    return this.base44.asServiceRole.entities.ProcessoAdvise.bulkCreate(dados);
  }

  async salvarPublicacoes(publicacoes) {
    if (!publicacoes?.length) return [];
    
    const dados = publicacoes.map(item => ({
      idPublicacaoAdvise: item.id || item.idPublicacaoCliente,
      numeroProcesso: item.numeroProcesso || item.processos?.[0]?.numeroProcesso,
      numeroCNJ: item.numeroCNJ || false,
      dataPublicacao: item.dataPublicacao || item.dataHoraMovimento,
      conteudo: item.conteudo || '',
      lido: false,
      statusSincronizacao: 'importado',
      dataSincronizacao: new Date().toISOString()
    }));

    return this.base44.asServiceRole.entities.PublicacaoAdvise.bulkCreate(dados);
  }

  async salvarFontes(fontes) {
    if (!fontes?.length) return [];
    
    const dados = fontes.map(fonte => ({
      idFonte: fonte.id || fonte.idFonteXTipoPesquisa,
      nomeFonte: fonte.nomeFonte || fonte.nome || 'Fonte Desconhecida',
      descricao: fonte.descricao || '',
      ativa: true,
      ultimaSincronizacao: new Date().toISOString()
    }));

    return this.base44.asServiceRole.entities.FonteIntimacao.bulkCreate(dados);
  }
}