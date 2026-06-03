import { buildDocument, section, kpiGrid, fmt, fmtMoney, esc, badge } from './_shared.js';

export function buildPrevisaoReport(data, pageMeta) {
  const k = data.previsaoKpis || data.kpis || {};
  const previsoes = data.previsoes || [];

  const proxMes   = k.previsao_proximo_mes;
  const confKpi   = k.confiabilidade;
  const intervalo = k.intervalo_confianca;
  const ultimaAt  = k.ultima_atualizacao;

  const kpis = kpiGrid([
    {
      label: 'Previsão — Próx. Mês',
      value: proxMes?.formatado ?? (proxMes?.valor != null ? fmtMoney(proxMes.valor) : '—'),
      sub: proxMes?.variacao ? proxMes.variacao + ' vs mês anterior' : undefined,
    },
    {
      label: 'Confiabilidade',
      value: confKpi?.formatado ?? (confKpi?.valor != null ? fmt(confKpi.valor, 1) + '%' : '—'),
      sub: confKpi?.status,
      subVariant: confKpi?.valor >= 85 ? 'green' : 'red',
    },
    {
      label: 'Intervalo de Confiança',
      value: intervalo?.formatado ?? (intervalo?.valor != null ? '±' + fmt(intervalo.valor, 1) + '%' : '—'),
      sub: intervalo?.status,
    },
    {
      label: 'Última Atualização',
      value: ultimaAt?.data ?? '—',
      sub: ultimaAt?.hora,
    },
  ]);

  const previsaoTableHTML = previsoes.length
    ? `<table>
        <thead>
          <tr>
            <th>Período</th>
            <th style="text-align:right">Previsão</th>
            <th style="text-align:right">Mínimo</th>
            <th style="text-align:right">Máximo</th>
            <th style="text-align:right">Confiança</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${previsoes.map(p => {
            const conf = Number(p.confiabilidade) || 0;
            const confBadge = badge(fmt(conf, 1) + '%', conf >= 85 ? 'green' : 'yellow');
            return `<tr>
              <td style="font-weight:600">${esc(p.periodo)}</td>
              <td style="text-align:right;font-weight:700">${p.valor_previsao != null ? fmtMoney(p.valor_previsao) : '—'}</td>
              <td style="text-align:right;color:#718096">${p.valor_minimo != null ? fmtMoney(p.valor_minimo) : '—'}</td>
              <td style="text-align:right;color:#718096">${p.valor_maximo != null ? fmtMoney(p.valor_maximo) : '—'}</td>
              <td style="text-align:right">${confBadge}</td>
              <td>${badge(esc(p.status || '—'), 'blue')}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>`
    : '<p class="note">Nenhuma previsão cadastrada no período.</p>';

  // Planejamentos vinculados
  const planejamentos = data.planejamentos || [];
  const planejamentosHTML = planejamentos.length
    ? `<table>
        <thead><tr><th>Título</th><th>Confiabilidade</th><th>Status</th><th>Descrição</th></tr></thead>
        <tbody>${planejamentos.map(p => `<tr>
          <td style="font-weight:600">${esc(p.titulo)}</td>
          <td>${p.confiabilidade != null ? fmt(p.confiabilidade, 1) + '%' : '—'}</td>
          <td>${badge(esc(p.status || '—'), 'blue')}</td>
          <td style="font-size:11px;color:#718096;max-width:300px">${esc(p.descricao ?? '')}</td>
        </tr>`).join('')}</tbody>
      </table>`
    : '<p class="note">Nenhum planejamento vinculado às previsões.</p>';

  const body = [
    section('Indicadores de Previsão', kpis),
    section('Detalhes das Previsões por Período', previsaoTableHTML),
    section('Planejamentos Associados', planejamentosHTML),
  ].join('');

  return buildDocument(
    pageMeta?.title || 'Previsão de Vendas',
    pageMeta?.description || 'Projeções e intervalos de confiança por período',
    pageMeta,
    body,
  );
}
