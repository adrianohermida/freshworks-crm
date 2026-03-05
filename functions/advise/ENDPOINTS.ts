# Endpoints Advise Integration

## 📋 Publicações

### `publicacoes.consultar` - Sincronizar Publicações
```js
{
  "action": "publicacoes.consultar",
  "payload": {
    "diasAtras": 1,              // (opcional) dias para buscar (default: 1)
    "lido": false,               // (opcional) true=lidas, false=não lidas (default: false)
    "dataInicio": "01/03/2026",  // (opcional) DD/MM/YYYY, sobrescreve diasAtras
    "dataFim": "03/03/2026",     // (opcional) DD/MM/YYYY
    "registrosPorPagina": 50,    // (opcional, default: 50)
    "paginaAtual": 1             // (opcional, default: 1)
  }
}
```

**Período Padrão**: Últimas 24 horas
**Lido Padrão**: `false` (não lidas)

---

## 🔔 Intimações

### `intimacoes.consultar` - Sincronizar Intimações
```js
{
  "action": "intimacoes.consultar",
  "payload": {
    "diasAtras": 7,              // (opcional) dias para buscar (default: 7)
    "lido": false,               // (opcional) true=lidas, false=não lidas (default: false)
    "dataInicio": "01/03/2026",  // (opcional) DD/MM/YYYY, sobrescreve diasAtras
    "dataFim": "03/03/2026",     // (opcional) DD/MM/YYYY
    "registrosPorPagina": 50,    // (opcional, default: 50)
    "paginaAtual": 1             // (opcional, default: 1)
  }
}
```

**Período Padrão**: Últimos 7 dias
**Lido Padrão**: `false` (não lidas)

---

## ⚖️ Processos

### `processos.consultar` - Sincronizar Andamentos
```js
{
  "action": "processos.consultar",
  "payload": {
    "horasAtras": 24,            // (opcional) horas para buscar (default: 24)
    "lido": false,               // (opcional) true=lidos, false=não lidos (default: false)
    "dataInicio": "01/03/2026",  // (opcional) DD/MM/YYYY, sobrescreve horasAtras
    "dataFim": "03/03/2026",     // (opcional) DD/MM/YYYY
    "registrosPorPagina": 50,    // (opcional, default: 50)
    "paginaAtual": 1             // (opcional, default: 1)
  }
}
```

**Período Padrão**: Últimas 24 horas
**Lido Padrão**: `false` (não lidos)

---

## 📝 Exemplos de Uso

### Buscar publicações não lidas dos últimos 7 dias
```js
await base44.functions.invoke('adviseIntegration', {
  action: 'publicacoes.consultar',
  payload: { diasAtras: 7, lido: false }
})
```

### Buscar intimações lidas
```js
await base44.functions.invoke('adviseIntegration', {
  action: 'intimacoes.consultar',
  payload: { lido: true }
})
```

### Buscar andamentos em período específico
```js
await base44.functions.invoke('adviseIntegration', {
  action: 'processos.consultar',
  payload: {
    dataInicio: '01/03/2026',
    dataFim: '03/03/2026',
    lido: false
  }
})
```

---

## 📊 Parâmetro `lido` - Significado

| Valor | Significado | Exemplo |
|-------|-------------|---------|
| `false` | Busca registros **NÃO LIDOS** | publicações novas, intimações não vistas |
| `true` | Busca registros **LIDOS** | publicações já consultadas |
| (omitido) | Padrão = `false` (não lidos) | - |

---

## 🔄 Respostas

Todas as consultas retornam:
```js
{
  "success": true,
  "action": "publicacoes.consultar",
  "data": {
    "publicacoes": [...],  // Array de registros
    "periodo": {
      "dataInicio": "01/03/2026",
      "dataFim": "03/03/2026",
      "diasBuscados": 1,
      "periodoBuscaFormatado": "01/03/2026 a 03/03/2026 (últimos 1 dias)"
    },
    "message": "Publicações sincronizadas: 5 registros - Período: ..."
  },
  "timestamp": "2026-03-03T..."
}
``