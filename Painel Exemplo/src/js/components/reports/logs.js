import { buildDocument, section, kpiGrid, fmt, esc, statusBadge } from './_shared.js';

export function buildLogsReport(data, pageMeta) {
  const k = data.logsKpis || data.kpis || {};
  const atividades = data.atividades || [];

  const total   = k.total ?? atividades.length;
  const sucesso = k.sucesso ?? atividades.filter(a => a.tipo === 'success').length;
  const erro    = k.erro    ?? atividades.filter(a => a.tipo === 'error').length;
  const aviso   = k.aviso   ?? atividades.filter(a => a.tipo === 'warning').length;

  const kpis = kpiGrid([
    { label: 'Total de Eventos',  value: fmt(total) },
    { label: 'Com Sucesso',       value: fmt(sucesso), sub: total ? ((sucesso / total) * 100).toFixed(1) + '% do total' : undefined, subVariant: 'green' },
    { label: 'Erros',             value: fmt(erro),    sub: total ? ((erro / total) * 100).toFixed(1) + '% do total' : undefined, subVariant: 'red' },
    { label: 'Avisos',            value: fmt(aviso),   sub: total ? ((aviso / total) * 100).toFixed(1) + '% do total' : undefined },
  ]);

  const TIPO_LABEL = { success: 'Sucesso', error: 'Erro', warning: 'Aviso', info: 'Info' };

  const logsHTML = atividades.length
    ? `<table>
        <thead>
          <tr>
            <th>Data / Hora</th>
            <th>Tipo</th>
            <th>Usuário</th>
            <th>Ação → Alvo</th>
            <th>Recurso</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${atividades.map(log => {
            const ts = log.created_at
              ? new Date(log.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' })
              : '—';
            return `<tr>
              <td class="mono" style="font-size:11px;white-space:nowrap">${esc(ts)}</td>
              <td>${statusBadge(log.tipo)}</td>
              <td style="font-weight:600">${esc(log.usuario_nome ?? '—')}</td>
              <td style="max-width:220px;overflow:hidden">${esc(log.acao ?? '')}${log.alvo ? ' → ' + esc(log.alvo) : ''}</td>
              <td class="mono" style="font-size:11px;color:#718096">${esc(log.recurso ?? '—')}</td>
              <td>${statusBadge(log.status)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>`
    : '<p class="note">Nenhum evento registrado.</p>';

  // Distribuição por tipo
  const porTipo = atividades.reduce((acc, a) => {
    acc[a.tipo] = (acc[a.tipo] || 0) + 1; return acc;
  }, {});
  const tipoHTML = Object.keys(porTipo).length
    ? `<table>
        <thead><tr><th>Tipo</th><th style="text-align:right">Qtd.</th><th style="text-align:right">%</th></tr></thead>
        <tbody>${Object.entries(porTipo).map(([t, qty]) => `<tr>
          <td>${statusBadge(t)}</td>
          <td style="text-align:right">${qty}</td>
          <td style="text-align:right">${atividades.length ? ((qty / atividades.length) * 100).toFixed(1) + '%' : '—'}</td>
        </tr>`).join('')}</tbody>
      </table>`
    : '';

  const body = [
    section('Resumo de Eventos', kpis),
    section('Registro de Eventos', logsHTML),
    tipoHTML ? section('Distribuição por Tipo', tipoHTML) : '',
  ].join('');

  return buildDocument(
    pageMeta?.title || 'Logs de Sistema',
    pageMeta?.description || 'Registro de eventos e auditoria do sistema',
    pageMeta,
    body,
  );
}
