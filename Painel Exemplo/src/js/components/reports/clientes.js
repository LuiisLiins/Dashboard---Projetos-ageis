import { buildDocument, section, kpiGrid, fmt, fmtMoney, esc, statusBadge } from './_shared.js';

export function buildClientesReport(data, pageMeta) {
  const k = data.kpis || {};

  const kpis = kpiGrid([
    { label: 'Clientes Ativos',   value: k.clientes_ativos != null ? fmt(k.clientes_ativos) : '—', sub: '+12% este ano', subVariant: 'green' },
    { label: 'Novos (Mês)',       value: k.novos_clientes != null ? fmt(k.novos_clientes) : '—', sub: '+5% vs meta', subVariant: 'green' },
    { label: 'CAC Médio',         value: k.cac_medio != null ? fmtMoney(k.cac_medio) : '—', sub: 'LTV/CAC: 3,5x' },
    { label: 'Churn Rate',        value: k.churn_rate != null ? fmt(k.churn_rate, 1) + '%' : '—', sub: '+0,5% este mês', subVariant: 'red' },
  ]);

  // Lista de clientes (passada pelo blade da página)
  const clientes = data.clientes || [];
  const clientesHTML = clientes.length
    ? `<table>
        <thead><tr><th>Nome</th><th>Email</th><th>Telefone</th><th>Status</th><th>Cadastro</th></tr></thead>
        <tbody>${clientes.map(c => `<tr>
          <td style="font-weight:600">${esc(c.nome)}</td>
          <td>${esc(c.email)}</td>
          <td>${esc(c.telefone)}</td>
          <td>${statusBadge(c.status)}</td>
          <td>${esc(c.data)}</td>
        </tr>`).join('')}</tbody>
      </table>`
    : '<p class="note">Lista de clientes não disponível.</p>';

  // Lista de vendedores
  const vendedores = data.vendedores || [];
  const vendedoresHTML = vendedores.length
    ? `<table>
        <thead><tr><th>Nome</th><th>Email</th><th>Telefone</th><th>Status</th><th>Cadastro</th></tr></thead>
        <tbody>${vendedores.map(v => `<tr>
          <td style="font-weight:600">${esc(v.nome)}</td>
          <td>${esc(v.email)}</td>
          <td>${esc(v.telefone)}</td>
          <td>${statusBadge(v.status)}</td>
          <td>${esc(v.data)}</td>
        </tr>`).join('')}</tbody>
      </table>`
    : '<p class="note">Lista de vendedores não disponível.</p>';

  // Segmentos, se disponíveis
  const segmentos = data.segmentos || [];
  const segmentosHTML = segmentos.length
    ? `<table>
        <thead><tr><th>Segmento</th><th style="text-align:right">Qtd.</th><th style="text-align:right">%</th></tr></thead>
        <tbody>${segmentos.map(s => `<tr>
          <td>${esc(s.nome || s.label)}</td>
          <td style="text-align:right">${fmt(s.qtd ?? s.count)}</td>
          <td style="text-align:right">${s.pct != null ? fmt(s.pct, 1) + '%' : '—'}</td>
        </tr>`).join('')}</tbody>
      </table>`
    : '<p class="note">Dados de segmentação não disponíveis.</p>';

  const body = [
    section('Indicadores de Clientes', kpis),
    section('Lista de Clientes', clientesHTML),
    section('Lista de Vendedores', vendedoresHTML),
    section('Segmentos de Clientes', segmentosHTML),
  ].join('');

  return buildDocument(
    pageMeta?.title || 'Dashboard Clientes',
    pageMeta?.description || 'Base de clientes, CAC, churn e segmentação',
    pageMeta,
    body,
  );
}
