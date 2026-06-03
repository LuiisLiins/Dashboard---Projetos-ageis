import { buildDocument, section, kpiGrid, fmt, fmtMoney, esc } from './_shared.js';

export function buildFinanceiroReport(data, pageMeta) {
  const k = data.kpis || {};

  const receitas  = k.total_receitas ?? k.receita_total;
  const despesas  = k.total_despesas ?? k.despesas_totais;
  const lucro     = k.lucro_liquido;
  const inadimp   = k.valor_inadimplencia;
  const margem    = lucro != null && receitas ? ((Number(lucro) / Number(receitas)) * 100).toFixed(1) : null;

  const kpis = kpiGrid([
    { label: 'Receitas',       value: receitas != null ? fmtMoney(receitas) : '—', sub: '+8,4% YTD', subVariant: 'green' },
    { label: 'Despesas',       value: despesas != null ? fmtMoney(despesas) : '—', sub: '+2,1% YTD', subVariant: 'red' },
    { label: 'Lucro Líquido',  value: lucro != null ? fmtMoney(lucro) : '—', sub: margem ? `Margem ${margem}%` : undefined },
    { label: 'Inadimplência',  value: inadimp != null ? fmtMoney(inadimp) : '—', sub: 'R$ 18.250 em aberto', subVariant: 'red' },
  ]);

  // Demonstrativo de resultado
  const dre = [
    ['(+) Receita Bruta',        receitas],
    ['(-) Despesas Totais',       despesas],
    ['(=) Lucro Bruto',          receitas != null && despesas != null ? Number(receitas) - Number(despesas) : null],
    ['(=) Lucro Líquido',        lucro],
  ];
  const dreHTML = `
    <table>
      <thead><tr><th>Item</th><th style="text-align:right">Valor</th></tr></thead>
      <tbody>${dre.map(([label, val]) => {
        const isResult = label.startsWith('(=)');
        return `<tr>
          <td style="${isResult ? 'font-weight:700' : ''}">${esc(label)}</td>
          <td style="text-align:right;font-weight:${isResult ? 700 : 400}">${val != null ? fmtMoney(val) : '—'}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;

  // Dados mensais, se disponíveis
  const mensal = data.receitas_mensais || data.charts?.financeiro_mensal || [];
  const mensalHTML = Array.isArray(mensal) && mensal.length
    ? `<table>
        <thead><tr><th>Mês</th><th style="text-align:right">Receita</th><th style="text-align:right">Despesa</th><th style="text-align:right">Lucro</th></tr></thead>
        <tbody>${mensal.map(m => `<tr>
          <td>${esc(m.mes || m.label)}</td>
          <td style="text-align:right">${fmtMoney(m.receita)}</td>
          <td style="text-align:right">${fmtMoney(m.despesa)}</td>
          <td style="text-align:right;font-weight:600">${fmtMoney(m.lucro ?? (Number(m.receita) - Number(m.despesa)))}</td>
        </tr>`).join('')}</tbody>
      </table>`
    : '<p class="note">Dados mensais detalhados não disponíveis.</p>';

  const body = [
    section('Indicadores Financeiros', kpis),
    section('Demonstrativo de Resultado (DRE)', dreHTML),
    section('Comparativo Mensal — Receitas vs Despesas', mensalHTML),
  ].join('');

  return buildDocument(
    pageMeta?.title || 'Dashboard Financeiro',
    pageMeta?.description || 'Análise financeira consolidada',
    pageMeta,
    body,
  );
}
