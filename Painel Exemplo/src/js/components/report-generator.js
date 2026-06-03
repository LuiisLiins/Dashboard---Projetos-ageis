import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { buildOverviewReport }    from './reports/overview.js';
import { buildEstrategicoReport } from './reports/estrategico.js';
import { buildOperacionalReport } from './reports/operacional.js';
import { buildFinanceiroReport }  from './reports/financeiro.js';
import { buildComercialReport }   from './reports/comercial.js';
import { buildClientesReport }    from './reports/clientes.js';
import { buildEstoqueReport }     from './reports/estoque.js';
import { buildPrevisaoReport }    from './reports/previsao.js';
import { buildMetasReport }       from './reports/metas.js';
import { buildLogsReport }        from './reports/logs.js';
import { buildEmpresaReport }     from './reports/empresa.js';

const BUILDERS = {
  overview:    buildOverviewReport,
  index:       buildOverviewReport,
  estrategico: buildEstrategicoReport,
  operacional: buildOperacionalReport,
  financeiro:  buildFinanceiroReport,
  comercial:   buildComercialReport,
  clientes:    buildClientesReport,
  estoque:     buildEstoqueReport,
  previsao:    buildPrevisaoReport,
  metas:       buildMetasReport,
  logs:        buildLogsReport,
  empresa:     buildEmpresaReport,
};

function buildHTML(pageKey, data, pageMeta) {
  const builder = BUILDERS[pageKey];
  if (builder) return builder(data, pageMeta);

  // Fallback genérico: mostra todos os KPIs encontrados
  const { buildDocument, section, kpiGrid, fmt, fmtMoney, esc } = require('./reports/_shared.js');
  const k = data.kpis || {};
  const items = Object.entries(k).map(([key, val]) => ({
    label: key.replace(/_/g, ' '),
    value: val && typeof val === 'object' ? (val.formatado ?? val.valor ?? '—') : (val ?? '—'),
  }));
  const body = items.length
    ? section('Indicadores', kpiGrid(items))
    : '<p style="color:#718096;font-size:13px">Nenhum dado disponível para este relatório.</p>';
  return buildDocument(pageMeta?.title || pageKey, pageMeta?.description || '', pageMeta, body);
}

async function renderToPDF(html) {
  // Usar iframe para isolar completamente o CSS do relatório do CSS da página
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:940px;height:1px;border:none;visibility:hidden;';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  doc.open();
  doc.write(html);
  doc.close();

  // Aguardar estilos e fontes carregarem
  await new Promise(r => setTimeout(r, 400));

  // Ajustar altura ao conteúdo real para captura completa
  const scrollH = doc.documentElement.scrollHeight;
  iframe.style.height = scrollH + 'px';

  // Um frame extra para reflow
  await new Promise(r => requestAnimationFrame(r));

  try {
    const pageEl = doc.querySelector('.page') || doc.body;

    const canvas = await html2canvas(pageEl, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 940,
      windowWidth: 940,
      scrollY: 0,
    });

    const A4_W = 210;
    const A4_H = 297;
    const pdf  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const imgData = canvas.toDataURL('image/png');
    const imgW    = A4_W;
    const imgH    = (canvas.height * imgW) / canvas.width;

    let y = 0;
    let remaining = imgH;

    while (remaining > 0) {
      pdf.addImage(imgData, 'PNG', 0, y, imgW, imgH);
      remaining -= A4_H;
      y -= A4_H;
      if (remaining > 0) pdf.addPage();
    }

    return pdf.output('blob');
  } finally {
    document.body.removeChild(iframe);
  }
}

export async function generateReport(pageKey, data, pageMeta, format) {
  const html = buildHTML(pageKey, data, pageMeta);
  const slug = pageKey || 'relatorio';
  const date = new Date().toISOString().slice(0, 10);

  if (format === 'pdf') {
    const blob = await renderToPDF(html);
    const url  = URL.createObjectURL(blob);
    window.open(url, '_blank');
  } else {
    // Word (.doc via HTML)
    const blob = new Blob(['﻿' + html], { type: 'application/msword;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `relatorio-${slug}-${date}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
