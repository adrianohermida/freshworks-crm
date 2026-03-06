export const TRIBUNAIS = [
  // Tribunais Superiores
  { alias: 'tst', nome: 'Tribunal Superior do Trabalho', categoria: 'superior', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tst/_search' },
  { alias: 'tse', nome: 'Tribunal Superior Eleitoral', categoria: 'superior', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tse/_search' },
  { alias: 'stj', nome: 'Superior Tribunal de Justiça', categoria: 'superior', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_stj/_search' },
  { alias: 'stm', nome: 'Tribunal Superior Militar', categoria: 'superior', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_stm/_search' },
  
  // Justiça Federal
  { alias: 'trf1', nome: 'Tribunal Regional Federal 1ª Região', categoria: 'federal', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf1/_search' },
  { alias: 'trf2', nome: 'Tribunal Regional Federal 2ª Região', categoria: 'federal', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf2/_search' },
  { alias: 'trf3', nome: 'Tribunal Regional Federal 3ª Região', categoria: 'federal', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf3/_search' },
  { alias: 'trf4', nome: 'Tribunal Regional Federal 4ª Região', categoria: 'federal', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf4/_search' },
  { alias: 'trf5', nome: 'Tribunal Regional Federal 5ª Região', categoria: 'federal', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf5/_search' },
  { alias: 'trf6', nome: 'Tribunal Regional Federal 6ª Região', categoria: 'federal', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trf6/_search' },
  
  // Justiça Estadual
  { alias: 'tjac', nome: 'Tribunal de Justiça do Acre', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjac/_search' },
  { alias: 'tjal', nome: 'Tribunal de Justiça de Alagoas', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjal/_search' },
  { alias: 'tjam', nome: 'Tribunal de Justiça do Amazonas', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjam/_search' },
  { alias: 'tjap', nome: 'Tribunal de Justiça do Amapá', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjap/_search' },
  { alias: 'tjba', nome: 'Tribunal de Justiça da Bahia', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjba/_search' },
  { alias: 'tjce', nome: 'Tribunal de Justiça do Ceará', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjce/_search' },
  { alias: 'tjdft', nome: 'TJ do Distrito Federal e Territórios', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjdft/_search' },
  { alias: 'tjes', nome: 'Tribunal de Justiça do Espírito Santo', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjes/_search' },
  { alias: 'tjgo', nome: 'Tribunal de Justiça do Goiás', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjgo/_search' },
  { alias: 'tjma', nome: 'Tribunal de Justiça do Maranhão', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjma/_search' },
  { alias: 'tjmg', nome: 'Tribunal de Justiça de Minas Gerais', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjmg/_search' },
  { alias: 'tjms', nome: 'TJ do Mato Grosso de Sul', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjms/_search' },
  { alias: 'tjmt', nome: 'Tribunal de Justiça do Mato Grosso', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjmt/_search' },
  { alias: 'tjpa', nome: 'Tribunal de Justiça do Pará', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjpa/_search' },
  { alias: 'tjpb', nome: 'Tribunal de Justiça da Paraíba', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjpb/_search' },
  { alias: 'tjpe', nome: 'Tribunal de Justiça de Pernambuco', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjpe/_search' },
  { alias: 'tjpi', nome: 'Tribunal de Justiça do Piauí', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjpi/_search' },
  { alias: 'tjpr', nome: 'Tribunal de Justiça do Paraná', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjpr/_search' },
  { alias: 'tjrj', nome: 'Tribunal de Justiça do Rio de Janeiro', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjrj/_search' },
  { alias: 'tjrn', nome: 'TJ do Rio Grande do Norte', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjrn/_search' },
  { alias: 'tjro', nome: 'Tribunal de Justiça de Rondônia', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjro/_search' },
  { alias: 'tjrr', nome: 'Tribunal de Justiça de Roraima', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjrr/_search' },
  { alias: 'tjrs', nome: 'Tribunal de Justiça do Rio Grande do Sul', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjrs/_search' },
  { alias: 'tjsc', nome: 'Tribunal de Justiça de Santa Catarina', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjsc/_search' },
  { alias: 'tjse', nome: 'Tribunal de Justiça de Sergipe', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjse/_search' },
  { alias: 'tjsp', nome: 'Tribunal de Justiça de São Paulo', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjsp/_search' },
  { alias: 'tjto', nome: 'Tribunal de Justiça do Tocantins', categoria: 'estadual', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjto/_search' },
  
  // Justiça do Trabalho
  { alias: 'trt1', nome: 'Tribunal Regional do Trabalho 1ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt1/_search' },
  { alias: 'trt2', nome: 'Tribunal Regional do Trabalho 2ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt2/_search' },
  { alias: 'trt3', nome: 'Tribunal Regional do Trabalho 3ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt3/_search' },
  { alias: 'trt4', nome: 'Tribunal Regional do Trabalho 4ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt4/_search' },
  { alias: 'trt5', nome: 'Tribunal Regional do Trabalho 5ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt5/_search' },
  { alias: 'trt6', nome: 'Tribunal Regional do Trabalho 6ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt6/_search' },
  { alias: 'trt7', nome: 'Tribunal Regional do Trabalho 7ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt7/_search' },
  { alias: 'trt8', nome: 'Tribunal Regional do Trabalho 8ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt8/_search' },
  { alias: 'trt9', nome: 'Tribunal Regional do Trabalho 9ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt9/_search' },
  { alias: 'trt10', nome: 'Tribunal Regional do Trabalho 10ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt10/_search' },
  { alias: 'trt11', nome: 'Tribunal Regional do Trabalho 11ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt11/_search' },
  { alias: 'trt12', nome: 'Tribunal Regional do Trabalho 12ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt12/_search' },
  { alias: 'trt13', nome: 'Tribunal Regional do Trabalho 13ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt13/_search' },
  { alias: 'trt14', nome: 'Tribunal Regional do Trabalho 14ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt14/_search' },
  { alias: 'trt15', nome: 'Tribunal Regional do Trabalho 15ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt15/_search' },
  { alias: 'trt16', nome: 'Tribunal Regional do Trabalho 16ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt16/_search' },
  { alias: 'trt17', nome: 'Tribunal Regional do Trabalho 17ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt17/_search' },
  { alias: 'trt18', nome: 'Tribunal Regional do Trabalho 18ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt18/_search' },
  { alias: 'trt19', nome: 'Tribunal Regional do Trabalho 19ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt19/_search' },
  { alias: 'trt20', nome: 'Tribunal Regional do Trabalho 20ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt20/_search' },
  { alias: 'trt21', nome: 'Tribunal Regional do Trabalho 21ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt21/_search' },
  { alias: 'trt22', nome: 'Tribunal Regional do Trabalho 22ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt22/_search' },
  { alias: 'trt23', nome: 'Tribunal Regional do Trabalho 23ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt23/_search' },
  { alias: 'trt24', nome: 'Tribunal Regional do Trabalho 24ª Região', categoria: 'trabalho', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_trt24/_search' },
  
  // Justiça Eleitoral
  { alias: 'tre-ac', nome: 'Tribunal Regional Eleitoral do Acre', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ac/_search' },
  { alias: 'tre-al', nome: 'Tribunal Regional Eleitoral de Alagoas', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-al/_search' },
  { alias: 'tre-am', nome: 'Tribunal Regional Eleitoral do Amazonas', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-am/_search' },
  { alias: 'tre-ap', nome: 'Tribunal Regional Eleitoral do Amapá', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ap/_search' },
  { alias: 'tre-ba', nome: 'Tribunal Regional Eleitoral da Bahia', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ba/_search' },
  { alias: 'tre-ce', nome: 'Tribunal Regional Eleitoral do Ceará', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ce/_search' },
  { alias: 'tre-dft', nome: 'Tribunal Regional Eleitoral do Distrito Federal', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-dft/_search' },
  { alias: 'tre-es', nome: 'Tribunal Regional Eleitoral do Espírito Santo', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-es/_search' },
  { alias: 'tre-go', nome: 'Tribunal Regional Eleitoral do Goiás', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-go/_search' },
  { alias: 'tre-ma', nome: 'Tribunal Regional Eleitoral do Maranhão', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ma/_search' },
  { alias: 'tre-mg', nome: 'Tribunal Regional Eleitoral de Minas Gerais', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-mg/_search' },
  { alias: 'tre-ms', nome: 'Tribunal Regional Eleitoral do Mato Grosso de Sul', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ms/_search' },
  { alias: 'tre-mt', nome: 'Tribunal Regional Eleitoral do Mato Grosso', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-mt/_search' },
  { alias: 'tre-pa', nome: 'Tribunal Regional Eleitoral do Pará', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-pa/_search' },
  { alias: 'tre-pb', nome: 'Tribunal Regional Eleitoral da Paraíba', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-pb/_search' },
  { alias: 'tre-pe', nome: 'Tribunal Regional Eleitoral de Pernambuco', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-pe/_search' },
  { alias: 'tre-pi', nome: 'Tribunal Regional Eleitoral do Piauí', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-pi/_search' },
  { alias: 'tre-pr', nome: 'Tribunal Regional Eleitoral do Paraná', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-pr/_search' },
  { alias: 'tre-rj', nome: 'Tribunal Regional Eleitoral do Rio de Janeiro', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-rj/_search' },
  { alias: 'tre-rn', nome: 'Tribunal Regional Eleitoral do Rio Grande do Norte', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-rn/_search' },
  { alias: 'tre-ro', nome: 'Tribunal Regional Eleitoral de Rondônia', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-ro/_search' },
  { alias: 'tre-rr', nome: 'Tribunal Regional Eleitoral de Roraima', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-rr/_search' },
  { alias: 'tre-rs', nome: 'Tribunal Regional Eleitoral do Rio Grande do Sul', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-rs/_search' },
  { alias: 'tre-sc', nome: 'Tribunal Regional Eleitoral de Santa Catarina', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-sc/_search' },
  { alias: 'tre-se', nome: 'Tribunal Regional Eleitoral de Sergipe', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-se/_search' },
  { alias: 'tre-sp', nome: 'Tribunal Regional Eleitoral de São Paulo', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-sp/_search' },
  { alias: 'tre-to', nome: 'Tribunal Regional Eleitoral do Tocantins', categoria: 'eleitoral', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tre-to/_search' },
  
  // Justiça Militar
  { alias: 'tjmmg', nome: 'Tribunal Justiça Militar de Minas Gerais', categoria: 'militar', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjmmg/_search' },
  { alias: 'tjmrs', nome: 'Tribunal Justiça Militar do Rio Grande do Sul', categoria: 'militar', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjmrs/_search' },
  { alias: 'tjmsp', nome: 'Tribunal Justiça Militar de São Paulo', categoria: 'militar', url: 'https://api-publica.datajud.cnj.jus.br/api_publica_tjmsp/_search' }
];

export function agruparTribunaisPorCategoria() {
  const agrupado = {};
  
  TRIBUNAIS.forEach(tribunal => {
    if (!agrupado[tribunal.categoria]) {
      agrupado[tribunal.categoria] = [];
    }
    agrupado[tribunal.categoria].push(tribunal);
  });
  
  return agrupado;
}

export function getTribunalByAlias(alias) {
  return TRIBUNAIS.find(t => t.alias === alias);
}

export function getTotalTribunais() {
  return TRIBUNAIS.length;
}