import { buildDocument, section, kpiGrid, fmt, fmtMoney, esc, statusBadge } from './_shared.js';

export function buildEstoqueReport(data, pageMeta) {
  const k = data.kpis || {};

  const valorEstoque = k.valor_estoque?.valor ?? k.valor_estoque;
  const giroEstoque  = k.giro_estoque?.formatado ?? (k.giro_estoque != null ? fmt(k.giro_estoque, 1) + 'x' : '—');
  const ruptura      = k.risco_ruptura?.formatado ?? (k.risco_ruptura != null ? fmt(k.risco_ruptura) + ' itens' : '—');
  const prazo        = k.prazo_medio_reposicao?.formatado ?? (k.prazo_medio_reposicao != null ? fmt(k.prazo_medio_reposicao) + ' dias' : '—');

  const kpis = kpiGrid([
    { label: 'Valor em Estoque',      value: valorEstoque != null ? fmtMoney(valorEstoque) : '—' },
    { label: 'Giro de Estoque',       value: giroEstoque, sub: k.giro_estoque?.status },
    { label: 'Risco de Ruptura',      value: ruptura, sub: k.risco_ruptura?.status, subVariant: 'red' },
    { label: 'Prazo Médio Reposição', value: prazo, sub: k.prazo_medio_reposicao?.status },
  ]);

  // Legenda de status
  const legendaHTML = `
    <table>
      <thead><tr><th>Status</th><th>Regra</th></tr></thead>
      <tbody>
        <tr><td>${statusBadge('OK')}</td><td>Quantidade acima de 2× o mínimo</td></tr>
        <tr><td>${statusBadge('Baixo')}</td><td>Quantidade entre 1× e 2× o mínimo</td></tr>
        <tr><td>${statusBadge('Crítico')}</td><td>Quantidade igual ou abaixo do mínimo</td></tr>
        <tr><td>${statusBadge('Indisponível')}</td><td>Definido manualmente — independe da quantidade</td></tr>
      </tbody>
    </table>`;

  // Lista de produtos
  const produtos = data.produtos || [];
  const total = produtos.reduce((acc, p) => acc + (Number(p.quantidade) * Number(p.preco_unitario || 0)), 0);
  const produtosHTML = produtos.length
    ? `<table>
        <thead><tr><th>Produto</th><th>SKU</th><th>Categoria</th><th style="text-align:right">Qtd.</th><th style="text-align:right">V. Unit.</th><th style="text-align:right">V. Total</th><th>Status</th></tr></thead>
        <tbody>
          ${produtos.map(p => `<tr>
            <td style="font-weight:600">${esc(p.nome)}</td>
            <td class="mono" style="font-size:11px">${esc(p.sku)}</td>
            <td>${esc(p.categoria)}</td>
            <td style="text-align:right">${fmt(p.quantidade)}</td>
            <td style="text-align:right">${fmtMoney(p.preco_unitario)}</td>
            <td style="text-align:right;font-weight:600">${fmtMoney(Number(p.quantidade) * Number(p.preco_unitario || 0))}</td>
            <td>${statusBadge(p.status)}</td>
          </tr>`).join('')}
          <tr style="background:#f7fafc">
            <td colspan="5" style="font-weight:700;text-align:right">Total em estoque</td>
            <td style="text-align:right;font-weight:700">${fmtMoney(total)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>`
    : '<p class="note">Lista de produtos não disponível.</p>';

  // Sumário por status
  const sumario = produtos.length ? (() => {
    const counts = produtos.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1; return acc;
    }, {});
    return `<table>
      <thead><tr><th>Status</th><th style="text-align:right">Qtd. de Produtos</th><th style="text-align:right">%</th></tr></thead>
      <tbody>${Object.entries(counts).map(([st, qty]) => `<tr>
        <td>${statusBadge(st)}</td>
        <td style="text-align:right">${qty}</td>
        <td style="text-align:right">${((qty / produtos.length) * 100).toFixed(1)}%</td>
      </tr>`).join('')}</tbody>
    </table>`;
  })() : '<p class="note">Dados não disponíveis.</p>';

  const body = [
    section('Indicadores de Estoque', kpis),
    section('Critérios de Status por Quantidade', legendaHTML),
    section('Lista de Produtos', produtosHTML),
    section('Resumo por Status', sumario),
  ].join('');

  return buildDocument(
    pageMeta?.title || 'Dashboard Estoque',
    pageMeta?.description || 'Inventário, giro e análise de ruptura',
    pageMeta,
    body,
  );
}
