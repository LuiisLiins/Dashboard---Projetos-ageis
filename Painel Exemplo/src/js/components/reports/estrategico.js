import { buildDocument, section, kpiGrid, fmt, fmtMoney, esc } from './_shared.js';

export function buildEstrategicoReport(data, pageMeta) {
  const k = data.kpis || {};

  const kpis = kpiGrid([
    { label: 'Receita Acumulada (YTD)', value: k.receita_ytd != null ? fmtMoney(k.receita_ytd) : '—', sub: '+18% YTD', subVariant: 'green' },
    { label: 'Ticket Médio Geral',      value: k.ticket_medio_geral != null ? fmtMoney(k.ticket_medio_geral) : '—', sub: '+5,2% vs ano passado', subVariant: 'green' },
    { label: 'Taxa de Crescimento',     value: k.taxa_crescimento != null ? fmt(k.taxa_crescimento, 1) + '%' : '—', sub: 'Meta: 20%' },
    { label: 'ROI',                     value: k.roi != null ? fmt(k.roi, 1) + '%' : '—', sub: 'Excelente' },
  ]);

  // OKRs
  const okrs = data.okrs || k.okrs;
  const okrNames = {
    receita_pct:    'Receita',
    crescimento_pct: 'Crescimento',
    satisfacao_pct: 'Satisfação',
    market_pct:     'Participação de Mercado',
  };
  const okrHTML = okrs
    ? `<table>
        <thead><tr><th>Objetivo</th><th>Progresso</th><th>Barra</th></tr></thead>
        <tbody>${Object.entries(okrs).map(([k, v]) => {
          const pct = Math.min(100, Number(v) || 0);
          return `<tr>
            <td>${esc(okrNames[k] || k.replace(/_/g, ' '))}</td>
            <td style="font-weight:700">${fmt(v, 1)}%</td>
            <td style="width:160px">
              <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
            </td>
          </tr>`;
        }).join('')}
        </tbody>
      </table>`
    : '<p class="note">Dados de OKRs não disponíveis no momento.</p>';

  // Análise estratégica (campo livre de texto, se existir)
  const analise = data.analise_estrategica;
  const analiseHTML = analise
    ? `<p style="line-height:1.7;color:#2d3748">${esc(analise)}</p>`
    : '<p class="note">Análise estratégica não disponível.</p>';

  const body = [
    section('Indicadores Estratégicos', kpis),
    section('OKRs do Período — Atingimento de Objetivos-Chave', okrHTML),
    section('Análise Estratégica', analiseHTML),
  ].join('');

  return buildDocument(
    pageMeta?.title || 'Dashboard Estratégico',
    pageMeta?.description || 'Visão consolidada de desempenho estratégico',
    pageMeta,
    body,
  );
}
