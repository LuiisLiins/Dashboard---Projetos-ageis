import { buildDocument, section, kpiGrid, fmt, fmtMoney, esc, statusBadge } from './_shared.js';

export function buildComercialReport(data, pageMeta) {
  const k = data.kpis || {};

  const kpis = kpiGrid([
    { label: 'Total de Vendas',        value: k.total_vendas != null ? fmtMoney(k.total_vendas) : '—', sub: '+15% YTD', subVariant: 'green' },
    { label: 'Top Vendedor',           value: k.top_vendedor || '—', sub: 'R$ 120k fechados' },
    { label: 'Ticket Médio',           value: k.ticket_medio != null ? fmtMoney(k.ticket_medio) : '—', sub: '+2,3% vs meta', subVariant: 'green' },
    { label: 'Taxa de Conversão',      value: k.taxa_conversao != null ? fmt(k.taxa_conversao, 1) + '%' : '—', sub: 'Atenção ao funil' },
  ]);

  // Funil de vendas, se disponível
  const funil = data.funil || data.pipeline || [];
  const funilHTML = funil.length
    ? `<table>
        <thead><tr><th>Etapa</th><th style="text-align:right">Qtd.</th><th style="text-align:right">Valor</th><th>Conversão</th></tr></thead>
        <tbody>${funil.map(f => `<tr>
          <td style="font-weight:600">${esc(f.etapa || f.label)}</td>
          <td style="text-align:right">${fmt(f.qtd ?? f.count)}</td>
          <td style="text-align:right">${f.valor != null ? fmtMoney(f.valor) : '—'}</td>
          <td>${f.conversao != null ? fmt(f.conversao, 1) + '%' : '—'}</td>
        </tr>`).join('')}</tbody>
      </table>`
    : '<p class="note">Dados do funil de vendas não disponíveis.</p>';

  // Vendas por vendedor, se disponível
  const porVendedor = data.vendas_por_vendedor || [];
  const vendedoresHTML = porVendedor.length
    ? `<table>
        <thead><tr><th>Vendedor</th><th style="text-align:right">Vendas</th><th style="text-align:right">Valor Total</th><th style="text-align:right">Ticket Médio</th><th>Meta</th></tr></thead>
        <tbody>${porVendedor.map(v => `<tr>
          <td style="font-weight:600">${esc(v.nome)}</td>
          <td style="text-align:right">${fmt(v.qtd_vendas ?? v.vendas)}</td>
          <td style="text-align:right">${fmtMoney(v.valor_total ?? v.total)}</td>
          <td style="text-align:right">${v.ticket_medio != null ? fmtMoney(v.ticket_medio) : '—'}</td>
          <td>${v.meta_atingida != null ? fmt(v.meta_atingida, 1) + '%' : '—'}</td>
        </tr>`).join('')}</tbody>
      </table>`
    : '<p class="note">Dados por vendedor não disponíveis.</p>';

  // Realizado vs Meta mensal
  const mensal = data.vendas_mensais || [];
  const mensalHTML = mensal.length
    ? `<table>
        <thead><tr><th>Mês</th><th style="text-align:right">Realizado</th><th style="text-align:right">Meta</th><th>Atingimento</th></tr></thead>
        <tbody>${mensal.map(m => {
          const pct = m.meta ? ((Number(m.realizado) / Number(m.meta)) * 100).toFixed(1) : null;
          return `<tr>
            <td>${esc(m.mes || m.label)}</td>
            <td style="text-align:right">${fmtMoney(m.realizado)}</td>
            <td style="text-align:right">${fmtMoney(m.meta)}</td>
            <td style="font-weight:600;${pct >= 100 ? 'color:#276749' : 'color:#9b2c2c'}">${pct ? pct + '%' : '—'}</td>
          </tr>`;
        }).join('')}</tbody>
      </table>`
    : '<p class="note">Comparativo mensal não disponível.</p>';

  const body = [
    section('Indicadores Comerciais', kpis),
    section('Pipeline de Vendas — Funil por Etapa', funilHTML),
    section('Desempenho por Vendedor', vendedoresHTML),
    section('Realizado vs Meta — Evolução Mensal', mensalHTML),
  ].join('');

  return buildDocument(
    pageMeta?.title || 'Dashboard Comercial',
    pageMeta?.description || 'Análise de vendas, funil e desempenho comercial',
    pageMeta,
    body,
  );
}
