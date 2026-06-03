import { buildDocument, section, kpiGrid, fmt, fmtMoney, esc, statusBadge } from './_shared.js';

export function buildOverviewReport(data, pageMeta) {
  const k = data.kpis || {};

  const kpis = kpiGrid([
    { label: 'Receita do Mês',    value: k.receita_total != null ? fmtMoney(k.receita_total) : '—' },
    { label: 'Novos Clientes',    value: k.novos_clientes ?? 142 },
    { label: 'Vendas do Dia',     value: k.vendas_dia ?? 24 },
    { label: 'Alertas Ativos',    value: k.alertas_ativos ?? '—' },
  ]);

  const inbox = (data.inboxItems || []);
  const inboxHTML = inbox.length ? `
    <table>
      <thead><tr><th>Tipo</th><th>Título</th><th>Descrição</th><th>Hora</th></tr></thead>
      <tbody>${inbox.map(i => `
        <tr>
          <td>${statusBadge(i.type)}</td>
          <td style="font-weight:600">${esc(i.title)}</td>
          <td>${esc(i.desc)}</td>
          <td>${esc(i.time)}</td>
        </tr>`).join('')}
      </tbody>
    </table>` : '<p class="note">Nenhum item na caixa de entrada.</p>';

  const feed = (data.activityFeed || []);
  const feedHTML = feed.length ? `
    <table>
      <thead><tr><th>Usuário</th><th>Ação</th><th>Alvo</th><th>Tempo</th></tr></thead>
      <tbody>${feed.map(a => `
        <tr>
          <td style="font-weight:600">${esc(a.user)}</td>
          <td>${esc(a.action)}</td>
          <td>${esc(a.target)}</td>
          <td>${esc(a.time)}</td>
        </tr>`).join('')}
      </tbody>
    </table>` : '<p class="note">Sem atividades recentes.</p>';

  const body = [
    section('Indicadores do Período', kpis),
    section('Caixa de Entrada', inboxHTML),
    section('Feed de Atividades', feedHTML),
  ].join('');

  return buildDocument(
    pageMeta?.title || 'Visão Geral',
    pageMeta?.description || 'Hub central de acompanhamento',
    pageMeta,
    body,
  );
}
