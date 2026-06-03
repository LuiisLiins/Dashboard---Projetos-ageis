import { buildDocument, section, kpiGrid, fmt, esc, statusBadge, badge } from './_shared.js';

export function buildMetasReport(data, pageMeta) {
  const goals = data.goals || [];

  const total     = goals.length;
  const concluido = goals.filter(g => g.status === 'completed').length;
  const noRisco   = goals.filter(g => g.status === 'at-risk').length;
  const noPrazo   = goals.filter(g => g.status === 'on-track').length;
  const taxaConclusao = total ? Math.round((concluido / total) * 100) : 0;

  const kpis = kpiGrid([
    { label: 'Metas Cadastradas', value: total },
    { label: 'No Prazo',          value: noPrazo, subVariant: 'green' },
    { label: 'Em Risco',          value: noRisco, subVariant: 'red' },
    { label: 'Taxa de Conclusão', value: taxaConclusao + '%', sub: concluido + ' concluída(s)' },
  ]);

  const CATEGORIES = { financeiro: 'Financeiro', comercial: 'Comercial', estoque: 'Estoque', operacional: 'Operacional' };

  const goalsHTML = goals.length
    ? `<table>
        <thead>
          <tr>
            <th>Meta</th>
            <th>Categoria</th>
            <th style="text-align:right">Atual</th>
            <th style="text-align:right">Meta</th>
            <th style="text-align:right">Progresso</th>
            <th>Status</th>
            <th>Prazo</th>
          </tr>
        </thead>
        <tbody>
          ${goals.map(g => {
            const pct = Math.min(100, Number(g.progress) || 0);
            const barColor = g.status === 'completed' ? '#276749' : g.status === 'at-risk' ? '#9b2c2c' : '#2a4365';
            return `<tr>
              <td style="font-weight:600">${esc(g.title)}</td>
              <td>${badge(CATEGORIES[g.category] || esc(g.category || '—'), 'blue')}</td>
              <td style="text-align:right">${g.current != null ? esc(String(g.current)) : '—'}</td>
              <td style="text-align:right">${g.target != null ? esc(String(g.target)) : '—'}</td>
              <td style="min-width:100px">
                <div style="display:flex;align-items:center;gap:6px">
                  <div class="progress-track" style="flex:1"><div class="progress-fill" style="width:${pct}%;background:${barColor}"></div></div>
                  <span style="font-size:11px;font-weight:700;color:${barColor}">${pct}%</span>
                </div>
              </td>
              <td>${statusBadge(g.status)}</td>
              <td style="font-size:11px">${esc(g.deadline ?? '—')}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>`
    : '<p class="note">Nenhuma meta cadastrada.</p>';

  // Agrupamento por categoria
  const porCategoria = goals.reduce((acc, g) => {
    const cat = CATEGORIES[g.category] || g.category || 'Outros';
    if (!acc[cat]) acc[cat] = { total: 0, concluido: 0, risco: 0 };
    acc[cat].total++;
    if (g.status === 'completed') acc[cat].concluido++;
    if (g.status === 'at-risk') acc[cat].risco++;
    return acc;
  }, {});

  const catHTML = Object.keys(porCategoria).length
    ? `<table>
        <thead><tr><th>Categoria</th><th style="text-align:right">Total</th><th style="text-align:right">Concluídas</th><th style="text-align:right">Em Risco</th></tr></thead>
        <tbody>${Object.entries(porCategoria).map(([cat, v]) => `<tr>
          <td>${badge(cat, 'blue')}</td>
          <td style="text-align:right">${v.total}</td>
          <td style="text-align:right;color:#276749">${v.concluido}</td>
          <td style="text-align:right;color:#9b2c2c">${v.risco}</td>
        </tr>`).join('')}</tbody>
      </table>`
    : '';

  const body = [
    section('Resumo de Metas e OKRs', kpis),
    section('Todas as Metas', goalsHTML),
    catHTML ? section('Distribuição por Categoria', catHTML) : '',
  ].join('');

  return buildDocument(
    pageMeta?.title || 'Gestão de Metas e OKRs',
    pageMeta?.description || 'Acompanhamento de objetivos e resultados-chave',
    pageMeta,
    body,
  );
}
