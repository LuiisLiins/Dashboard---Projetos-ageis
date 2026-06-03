import { buildDocument, section, kpiGrid, fmt, esc } from './_shared.js';

export function buildOperacionalReport(data, pageMeta) {
  const k = data.kpis || {};

  const kpis = kpiGrid([
    { label: 'Pedidos em Andamento', value: k.em_andamento != null ? fmt(k.em_andamento) : '—', sub: 'Em execução nas linhas' },
    { label: 'Concluídos Hoje',      value: k.concluidos_hoje != null ? fmt(k.concluidos_hoje) : '—', sub: '+12% vs ontem', subVariant: 'green' },
    { label: 'Pendências',           value: k.pendencias != null ? fmt(k.pendencias) : '—', sub: 'Exigem atenção', subVariant: 'red' },
    { label: 'TMA — Tempo Médio',    value: k.tma_horas != null ? fmt(k.tma_horas, 1) + 'h' : '—', sub: '-5min vs semana passada', subVariant: 'green' },
  ]);

  // Tabela de pedidos, se disponível
  const pedidos = data.pedidos || [];
  const pedidosHTML = pedidos.length
    ? `<table>
        <thead><tr><th>#</th><th>Pedido</th><th>Cliente</th><th>Status</th><th>Data</th></tr></thead>
        <tbody>${pedidos.map(p => `<tr>
          <td class="mono">${esc(p.id)}</td>
          <td>${esc(p.descricao || p.nome)}</td>
          <td>${esc(p.cliente)}</td>
          <td>${esc(p.status)}</td>
          <td>${esc(p.data)}</td>
        </tr>`).join('')}</tbody>
      </table>`
    : '<p class="note">Lista de pedidos não disponível neste relatório.</p>';

  // Eficiência operacional, se disponível
  const eficiencia = data.eficiencia_mensal || [];
  const eficienciaHTML = eficiencia.length
    ? `<table>
        <thead><tr><th>Mês</th><th>OEE (%)</th><th>Meta (%)</th><th>Variação</th></tr></thead>
        <tbody>${eficiencia.map(e => {
          const diff = (Number(e.oee) - Number(e.meta)).toFixed(1);
          const cor = diff >= 0 ? 'color:#276749' : 'color:#9b2c2c';
          return `<tr>
            <td>${esc(e.mes)}</td>
            <td style="font-weight:700">${fmt(e.oee, 1)}%</td>
            <td>${fmt(e.meta, 1)}%</td>
            <td style="${cor}">${diff >= 0 ? '+' : ''}${diff}%</td>
          </tr>`;
        }).join('')}</tbody>
      </table>`
    : '<p class="note">Dados de eficiência mensal não disponíveis.</p>';

  const body = [
    section('Indicadores Operacionais', kpis),
    section('Pedidos do Período', pedidosHTML),
    section('Eficiência Operacional vs Meta (OEE)', eficienciaHTML),
  ].join('');

  return buildDocument(
    pageMeta?.title || 'Dashboard Operacional',
    pageMeta?.description || 'Monitoramento de pedidos e eficiência operacional',
    pageMeta,
    body,
  );
}
