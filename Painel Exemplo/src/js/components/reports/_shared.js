export function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function fmt(value, decimals = 0) {
  if (value === null || value === undefined) return '—';
  const n = Number(value);
  if (isNaN(n)) return String(value);
  return n.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function fmtMoney(value) {
  if (value === null || value === undefined) return '—';
  const n = Number(value);
  if (isNaN(n)) return String(value);
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function badge(text, variant = 'gray') {
  const cls = {
    green:  'background:#c6f6d5;color:#22543d',
    yellow: 'background:#fefcbf;color:#744210',
    red:    'background:#fed7d7;color:#742a2a',
    blue:   'background:#bee3f8;color:#2a4365',
    gray:   'background:#e2e8f0;color:#2d3748',
  }[variant] || 'background:#e2e8f0;color:#2d3748';
  return `<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;${cls}">${esc(text)}</span>`;
}

export function statusBadge(status) {
  const map = {
    'OK': ['OK', 'green'], 'Ativo': ['Ativo', 'green'], 'Concluído': ['Concluído', 'green'],
    'on-track': ['No Prazo', 'green'], 'completed': ['Concluído', 'green'],
    'Baixo': ['Baixo', 'yellow'], 'at-risk': ['Em Risco', 'yellow'], 'Em Progresso': ['Em Progresso', 'yellow'],
    'Crítico': ['Crítico', 'red'], 'Inativo': ['Inativo', 'red'], 'Pendente': ['Pendente', 'red'],
    'Indisponível': ['Indisponível', 'gray'], 'Resolvido': ['Resolvido', 'green'],
    'info': ['Info', 'blue'], 'success': ['Sucesso', 'green'], 'error': ['Erro', 'red'], 'warning': ['Aviso', 'yellow'],
  };
  const [label, variant] = map[status] || [status ?? '—', 'gray'];
  return badge(label, variant);
}

export const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1a202c; background: #fff; }
  .page { max-width: 940px; margin: 0 auto; padding: 40px 48px; }
  @media print { .page { padding: 0; } }

  .rpt-header { display: flex; align-items: flex-start; justify-content: space-between; padding-bottom: 18px; border-bottom: 2px solid #2d3748; margin-bottom: 28px; }
  .rpt-header-brand { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: #4a5568; }
  .rpt-header-title { font-size: 24px; font-weight: 700; color: #1a202c; margin-top: 4px; }
  .rpt-header-desc { font-size: 13px; color: #718096; margin-top: 3px; }
  .rpt-header-meta { text-align: right; font-size: 11px; color: #a0aec0; line-height: 1.6; }
  .rpt-header-meta strong { display: block; font-size: 12px; color: #4a5568; font-weight: 600; }

  .section { margin-bottom: 32px; }
  .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #718096; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }

  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .kpi-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; }
  .kpi-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #a0aec0; margin-bottom: 5px; }
  .kpi-value { font-size: 20px; font-weight: 700; color: #1a202c; line-height: 1.2; }
  .kpi-sub { font-size: 11px; color: #718096; margin-top: 3px; }
  .kpi-sub-green { color: #276749; }
  .kpi-sub-red { color: #9b2c2c; }

  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { background: #f7fafc; text-align: left; padding: 8px 10px; font-weight: 700; color: #4a5568; border-bottom: 2px solid #e2e8f0; white-space: nowrap; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
  td { padding: 8px 10px; border-bottom: 1px solid #edf2f7; color: #2d3748; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:nth-child(even) td { background: #f9fafb; }

  .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 32px; }
  .dl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #a0aec0; margin-bottom: 3px; }
  .dv { font-size: 13px; color: #1a202c; }

  .progress-track { background: #e2e8f0; border-radius: 999px; height: 6px; width: 100%; overflow: hidden; margin-top: 4px; }
  .progress-fill { height: 100%; border-radius: 999px; background: #3b82f6; }

  .rpt-footer { margin-top: 40px; padding-top: 14px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #a0aec0; display: flex; justify-content: space-between; }

  .note { font-size: 11px; color: #a0aec0; font-style: italic; margin-top: 6px; }
  .mono { font-family: 'Courier New', monospace; }
`;

export function getCompanyName() {
  try {
    const s = localStorage.getItem('empresa_data');
    if (s) return JSON.parse(s).nome_fantasia || 'Dashboard';
  } catch (_) {}
  return 'Dashboard';
}

export function buildDocument(title, description, pageMeta, bodyHTML) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const company = getCompanyName();
  const level = pageMeta?.levelLabel ? `<br>${esc(pageMeta.levelLabel)} · ${esc(pageMeta.audience || '')}` : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Relatório — ${esc(title)}</title>
<style>${CSS}</style></head>
<body><div class="page">
  <div class="rpt-header">
    <div>
      <div class="rpt-header-brand">${esc(company)}</div>
      <div class="rpt-header-title">${esc(title)}</div>
      <div class="rpt-header-desc">${esc(description || '')}${level}</div>
    </div>
    <div class="rpt-header-meta">
      <strong>Relatório gerado em</strong>
      ${dateStr}<br>${timeStr}
    </div>
  </div>
  ${bodyHTML}
  <div class="rpt-footer">
    <span>Gerado automaticamente pelo sistema de dashboard</span>
    <span>${dateStr} às ${timeStr}</span>
  </div>
</div></body></html>`;
}

export function kpiGrid(items) {
  // items: [{ label, value, sub, subVariant }]
  const cols = items.length <= 2 ? 2 : items.length === 3 ? 3 : 4;
  const cards = items.map(({ label, value, sub, subVariant }) => `
    <div class="kpi-card">
      <div class="kpi-label">${esc(label)}</div>
      <div class="kpi-value">${esc(String(value ?? '—'))}</div>
      ${sub ? `<div class="kpi-sub ${subVariant === 'green' ? 'kpi-sub-green' : subVariant === 'red' ? 'kpi-sub-red' : ''}">${esc(sub)}</div>` : ''}
    </div>`).join('');
  return `<div class="kpi-grid" style="grid-template-columns:repeat(${cols},1fr)">${cards}</div>`;
}

export function section(title, html) {
  return `<div class="section"><div class="section-title">${esc(title)}</div>${html}</div>`;
}
