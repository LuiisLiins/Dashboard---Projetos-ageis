import ApexCharts from "apexcharts";

const FONT = "Outfit, sans-serif";
const GRID = { borderColor: "#E4E7EC", strokeDashArray: 4 };
// Opções base aplicadas a todos os gráficos para evitar loop de resize no hover
const BASE_CHART = { fontFamily: FONT, toolbar: { show: false }, parentHeightOffset: 0, redrawOnWindowResize: true };

// ── Instâncias dos gráficos (para updateSeries posterior) ──
const charts = {};

// ── Definições iniciais (dados de placeholder até a API responder) ──
const MONTHS_PT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const EMPTY12 = Array(12).fill(0);

const chartDefinitions = {
  // ─── ANALYTICS ───────────────────────────────────────────────
  analyticsTendencias: {
    series: [{ name: "Receita", type: "bar", data: EMPTY12 }, { name: "Média Móvel", type: "line", data: EMPTY12 }],
    colors: ["#465FFF", "#F79009"],
    chart: { ...BASE_CHART, type: "line", height: 320 },
    plotOptions: { bar: { columnWidth: "50%", borderRadius: 4, borderRadiusApplication: "end" } },
    dataLabels: { enabled: false },
    stroke: { width: [0, 3], curve: "smooth" },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: { categories: MONTHS_PT, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (v) => `R$${(v / 1000).toFixed(0)}k` } },
    grid: GRID,
    tooltip: { shared: true, y: { formatter: (v) => `R$ ${(v ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` } },
  },
  analyticsCrescimento: {
    series: [{ name: "Crescimento %", data: EMPTY12 }],
    colors: ["#12B76A"],
    chart: { ...BASE_CHART, type: "bar", height: 160 },
    plotOptions: { bar: { columnWidth: "55%", borderRadius: 3, borderRadiusApplication: "end", colors: { ranges: [{ from: -9999, to: 0, color: "#F04438" }] } } },
    dataLabels: { enabled: false },
    xaxis: { categories: MONTHS_PT, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (v) => `${v}%` } },
    grid: GRID, legend: { show: false },
    tooltip: { y: { formatter: (v) => `${v}%` } },
  },
  analyticsPorPeriodo: {
    series: [{ name: "Mês Atual", data: [0,0,0,0] }, { name: "Mês Anterior", data: [0,0,0,0] }],
    colors: ["#465FFF", "#98A2B3"],
    chart: { ...BASE_CHART, type: "bar", height: 320 },
    plotOptions: { bar: { columnWidth: "55%", borderRadius: 4, borderRadiusApplication: "end" } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: { categories: ["Sem. 1","Sem. 2","Sem. 3","Sem. 4"], axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (v) => `R$${(v / 1000).toFixed(0)}k` } },
    grid: GRID,
    tooltip: { y: { formatter: (v) => `R$ ${(v ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` } },
  },
  analyticsComparacaoAnos: {
    series: [
      { name: String(new Date().getFullYear() - 2), data: Array(12).fill(0) },
      { name: String(new Date().getFullYear() - 1), data: Array(12).fill(0) },
      { name: String(new Date().getFullYear()),     data: Array(12).fill(0) },
    ],
    colors: ["#98A2B3", "#9CB9FF", "#465FFF"],
    chart: { ...BASE_CHART, type: "line", height: 320 },
    stroke: { width: [2, 2, 3], curve: "smooth", dashArray: [5, 3, 0] },
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: { categories: MONTHS_PT, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (v) => `R$${(v / 1000).toFixed(0)}k` } },
    grid: GRID,
    tooltip: { shared: true, y: { formatter: (v) => `R$ ${(v ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` } },
  },
  analyticsSazonalidade: {
    series: [{ name: "Índice", type: "bar", data: Array(12).fill(1) }, { name: "Pedidos", type: "line", data: Array(12).fill(0) }],
    colors: ["#9B5CDB", "#F79009"],
    chart: { ...BASE_CHART, type: "line", height: 320 },
    plotOptions: { bar: { columnWidth: "55%", borderRadius: 4, borderRadiusApplication: "end" } },
    dataLabels: { enabled: false },
    stroke: { width: [0, 3], curve: "smooth" },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: { categories: MONTHS_PT, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: [
      { title: { text: "Índice de Sazonalidade" }, labels: { formatter: (v) => (v ?? 0).toFixed(2) } },
      { opposite: true, title: { text: "Pedidos" }, labels: { formatter: (v) => Math.round(v ?? 0) } },
    ],
    grid: GRID,
    annotations: { yaxis: [{ y: 1, borderColor: "#667085", borderWidth: 1, strokeDashArray: 4, label: { text: "Média (1.0)", style: { fontSize: "11px", color: "#667085" } } }] },
    tooltip: { shared: true },
  },
  analyticsSegmentacao: {
    series: [1, 1, 1, 1],
    labels: ["Novos (0-3m)", "Recentes (3-6m)", "Estabelecidos", "Inativos (12m+)"],
    colors: ["#12B76A", "#0BA5EC", "#9B5CDB", "#98A2B3"],
    chart: { ...BASE_CHART, type: "donut", height: 320 },
    dataLabels: { enabled: true, formatter: (v) => `${(v ?? 0).toFixed(1)}%` },
    legend: { position: "bottom" },
    stroke: { width: 0 },
    plotOptions: { pie: { donut: { size: "68%", labels: { show: true, total: { show: true, label: "Clientes", fontSize: "13px", color: "#6B7280", formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0) } } } } },
    tooltip: { y: { formatter: (v) => `${v} clientes` } },
  },
  analyticsClientesCrescimento: {
    series: [{ name: "Novos Clientes", data: EMPTY12 }],
    colors: ["#12B76A"],
    chart: { ...BASE_CHART, type: "area", height: 200 },
    stroke: { curve: "smooth", width: [2] },
    fill: { type: "gradient", gradient: { opacityFrom: 0.20, opacityTo: 0.02 } },
    dataLabels: { enabled: false },
    xaxis: { categories: MONTHS_PT, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (v) => Math.round(v ?? 0) } },
    grid: GRID, legend: { show: false },
  },

  // ─── OVERVIEW ────────────────────────────────────────────────
  overviewReceitasDespesas: {
    series: [
      { name: "Receitas", data: EMPTY12 },
      { name: "Despesas", data: EMPTY12 },
    ],
    colors: ["#12B76A", "#F04438"],
    chart: { ...BASE_CHART, type: "bar", height: 280 },
    plotOptions: { bar: { horizontal: false, columnWidth: "50%", borderRadius: 4, borderRadiusApplication: "end" } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: { categories: MONTHS_PT, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (v) => `R$${(v / 1000).toFixed(0)}k` } },
    grid: GRID,
    tooltip: { y: { formatter: (v) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` } },
  },

  overviewPedidosStatus: {
    series: [
      { name: "Concluídos", data: EMPTY12 },
      { name: "Pendentes",  data: EMPTY12 },
    ],
    colors: ["#12B76A", "#F79009"],
    chart: { ...BASE_CHART, type: "area", height: 280 },
    stroke: { curve: "smooth", width: [2, 2] },
    fill: { type: "gradient", gradient: { opacityFrom: 0.18, opacityTo: 0.02 } },
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: { categories: MONTHS_PT, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (v) => Math.round(v) } },
    grid: GRID,
  },

  overviewClientesMensais: {
    series: [{ name: "Novos Clientes", data: EMPTY12 }],
    colors: ["#0BA5EC"],
    chart: { ...BASE_CHART, type: "area", height: 280 },
    stroke: { curve: "smooth", width: [3] },
    fill: { type: "gradient", gradient: { opacityFrom: 0.22, opacityTo: 0.02 } },
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: { categories: MONTHS_PT, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (v) => Math.round(v) } },
    grid: GRID,
  },

  // ─── FINANCEIRO ──────────────────────────────────────────────
  financeStackedChart: {
    series: [
      { name: "Receitas", data: EMPTY12 },
      { name: "Despesas", data: EMPTY12 },
    ],
    colors: ["#12B76A", "#F04438"],
    chart: { ...BASE_CHART, type: "bar", height: 310 },
    plotOptions: { bar: { horizontal: false, columnWidth: "46%", borderRadius: 5, borderRadiusApplication: "end" } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 3, colors: ["transparent"] },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: { categories: MONTHS_PT, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (v) => `R$${(v / 1000).toFixed(0)}k` } },
    grid: GRID,
    tooltip: { y: { formatter: (v) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` } },
  },

  financeDonutChart: {
    series: [1],
    labels: ["Carregando…"],
    colors: ["#E4E7EC"],
    chart: { ...BASE_CHART, type: "donut", height: 310 },
    dataLabels: { enabled: false },
    legend: { position: "bottom", horizontalAlign: "center" },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            total: { show: true, label: "Despesas", fontSize: "13px", color: "#6B7280", formatter: () => "" },
          },
        },
      },
    },
    tooltip: { y: { formatter: (v) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` } },
  },

  // ─── COMERCIAL ───────────────────────────────────────────────
  commercialFunnelChart: {
    series: [
      { name: "Pipeline", data: [0, 0, 0, 0, 0] },
      { name: "Fechadas", data: [0, 0, 0, 0, 0] },
    ],
    colors: ["#465FFF", "#9CB9FF"],
    chart: { ...BASE_CHART, type: "bar", height: 310 },
    plotOptions: { bar: { horizontal: true, barHeight: "55%", borderRadius: 5, borderRadiusApplication: "end" } },
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: {
      categories: ["Prospecção", "Qualificação", "Proposta", "Negociação", "Fechamento"],
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    grid: GRID,
  },

  commercialTrendChart: {
    series: [
      { name: "Realizado", data: EMPTY12 },
      { name: "Meta", data: EMPTY12 },
    ],
    colors: ["#465FFF", "#98A2B3"],
    chart: { ...BASE_CHART, type: "area", height: 310 },
    stroke: { curve: "smooth", width: [3, 2], dashArray: [0, 5] },
    fill: {
      type: ["gradient", "solid"],
      gradient: { opacityFrom: 0.25, opacityTo: 0.02 },
      opacity: [1, 0],
    },
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: { categories: MONTHS_PT, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (v) => `R$${(v / 1000).toFixed(0)}k` } },
    grid: GRID,
  },

  // ─── ESTOQUE ─────────────────────────────────────────────────
  stockMovementChart: {
    series: [
      { name: "Entradas", data: EMPTY12 },
      { name: "Saídas",   data: EMPTY12 },
    ],
    colors: ["#F79009", "#12B76A"],
    chart: { ...BASE_CHART, type: "area", height: 310 },
    stroke: { curve: "smooth", width: [3, 3] },
    fill: { gradient: { enabled: true, opacityFrom: 0.22, opacityTo: 0.02 } },
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: { categories: MONTHS_PT, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (v) => `${v}` } },
    grid: GRID,
  },

  stockAbcChart: {
    series: [1],
    labels: ["Carregando…"],
    colors: ["#E4E7EC"],
    chart: { ...BASE_CHART, type: "donut", height: 310 },
    dataLabels: { enabled: false },
    legend: { position: "bottom", horizontalAlign: "center" },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            total: { show: true, label: "Curva ABC", fontSize: "13px", color: "#6B7280", formatter: () => "" },
          },
        },
      },
    },
    tooltip: { y: { formatter: (v) => `${v} produtos` } },
  },

  // ─── OPERACIONAL ─────────────────────────────────────────────
  opsFlowChart: {
    series: [
      { name: "Concluídos", data: EMPTY12 },
      { name: "Pendentes",  data: EMPTY12 },
    ],
    colors: ["#9B5CDB", "#F04438"],
    chart: { ...BASE_CHART, type: "bar", height: 310, stacked: true },
    plotOptions: { bar: { horizontal: false, columnWidth: "42%", borderRadius: 4, borderRadiusApplication: "end" } },
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: { categories: MONTHS_PT, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (v) => `${v}` } },
    grid: GRID,
  },

  opsEfficiencyChart: {
    series: [
      { name: "Eficiência %", data: EMPTY12 },
      { name: "Meta",         data: Array(12).fill(80) },
    ],
    colors: ["#9B5CDB", "#344054"],
    chart: { ...BASE_CHART, type: "line", height: 310 },
    stroke: { curve: "smooth", width: [3, 2], dashArray: [0, 6] },
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "left" },
    markers: { size: [4, 0], strokeWidth: 0 },
    xaxis: { categories: MONTHS_PT, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (v) => `${v}%` }, min: 0, max: 100 },
    grid: GRID,
    tooltip: { y: { formatter: (v) => `${v}%` } },
  },

  // ─── ESTRATÉGICO ─────────────────────────────────────────────
  strategyMixedChart: {
    series: [
      { name: "Receita",  type: "bar",  data: EMPTY12 },
      { name: "Lucro",    type: "bar",  data: EMPTY12 },
      { name: "Margem %", type: "line", data: EMPTY12 },
    ],
    colors: ["#2A31D8", "#9CB9FF", "#F79009"],
    chart: { ...BASE_CHART, type: "bar", height: 310 },
    stroke: { width: [0, 0, 3], curve: "smooth" },
    plotOptions: { bar: { horizontal: false, columnWidth: "42%", borderRadius: 4, borderRadiusApplication: "end" } },
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: { categories: MONTHS_PT, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: [
      { labels: { formatter: (v) => `R$${(v / 1000).toFixed(0)}k` } },
      { opposite: true, labels: { formatter: (v) => `${v}%` }, min: 0, max: 60 },
    ],
    grid: GRID,
  },

  strategyOkrChart: {
    series: [0, 0, 0, 0],
    chart: { ...BASE_CHART, type: "radialBar", height: 310 },
    colors: ["#2A31D8", "#9CB9FF", "#12B76A", "#F79009"],
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: { margin: 5, size: "30%", background: "transparent" },
        track: { background: "#E4E7EC", strokeWidth: "97%", margin: 5 },
        dataLabels: {
          name: { show: false },
          value: { show: false },
          total: {
            show: true, label: "OKRs", fontSize: "15px", fontWeight: "700",
            color: "#1D2939",
            formatter: function (w) {
              const avg = w.globals.series.reduce((a, b) => a + b, 0) / (w.globals.series.length || 1);
              return Math.round(avg) + "%";
            },
          },
        },
      },
    },
    labels: ["Receita", "Crescimento", "Conclusão", "Novos Cli."],
    legend: {
      show: true, floating: false, position: "bottom",
      labels: { useSeriesColors: true },
      formatter: (label, opts) => `${label}: ${opts.w.globals.series[opts.seriesIndex]}%`,
      itemMargin: { vertical: 4, horizontal: 8 },
    },
  },

  // ─── CLIENTES ────────────────────────────────────────────────
  clientsGrowthChart: {
    series: [
      { name: "Novos Clientes", data: EMPTY12 },
    ],
    colors: ["#0BA5EC"],
    chart: { ...BASE_CHART, type: "area", height: 310 },
    stroke: { curve: "smooth", width: [3] },
    fill: { gradient: { enabled: true, opacityFrom: 0.22, opacityTo: 0.02 } },
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: { categories: MONTHS_PT, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: (v) => `${v}` } },
    grid: GRID,
  },

  clientsSegmentChart: {
    series: [1],
    labels: ["Carregando…"],
    colors: ["#E4E7EC"],
    chart: { ...BASE_CHART, type: "donut", height: 310 },
    dataLabels: { enabled: false },
    legend: { position: "bottom", horizontalAlign: "center" },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: { show: true, label: "Regiões", fontSize: "13px", color: "#6B7280", formatter: () => "" },
          },
        },
      },
    },
    tooltip: { y: { formatter: (v) => `${v} clientes` } },
  },
};

// ── Render ─────────────────────────────────────────────────────
const renderChart = (elementId, options) => {
  const el = document.querySelector(`#${elementId}`);
  if (!el) return;
  const chart = new ApexCharts(el, options);
  chart.render();
  charts[elementId] = chart;
};

// ── Atualizar com dados reais da API ──────────────────────────
const updateWithRealData = (api) => {
  const c = api.charts || {};

  // FINANCEIRO ─────────────────────────────────────────────────
  if (charts.financeStackedChart && c.mensal?.receitas) {
    charts.financeStackedChart.updateSeries([
      { name: "Receitas", data: c.mensal.receitas },
      { name: "Despesas", data: c.mensal.despesas },
    ]);
    charts.financeStackedChart.updateOptions({ xaxis: { categories: c.mensal.labels } }, false, false);
  }
  if (charts.financeDonutChart && c.despesas_por_categoria) {
    const entries = Object.entries(c.despesas_por_categoria);
    if (entries.length) {
      const COLORS_DONUT = ["#F04438","#F79009","#2A31D8","#0BA5EC","#12B76A","#98A2B3"];
      charts.financeDonutChart.updateOptions({
        labels: entries.map(([k]) => k),
        colors: COLORS_DONUT.slice(0, entries.length),
      }, false, false);
      charts.financeDonutChart.updateSeries(entries.map(([, v]) => parseFloat(v)));
    }
  }

  // COMERCIAL ──────────────────────────────────────────────────
  if (charts.commercialFunnelChart && c.funil_pipeline) {
    charts.commercialFunnelChart.updateSeries([
      { name: "Pipeline", data: c.funil_pipeline },
      { name: "Fechadas", data: c.funil_fechadas || [] },
    ]);
    if (c.funil_labels) {
      charts.commercialFunnelChart.updateOptions({ xaxis: { categories: c.funil_labels } }, false, false);
    }
  }
  if (charts.commercialTrendChart && c.mensal?.vendas) {
    // Calcula meta como 10% acima da média dos últimos meses
    const avg = c.mensal.vendas.reduce((a, b) => a + b, 0) / (c.mensal.vendas.length || 1);
    const meta = c.mensal.vendas.map(() => Math.round(avg * 1.1));
    charts.commercialTrendChart.updateSeries([
      { name: "Realizado", data: c.mensal.vendas },
      { name: "Meta",      data: meta },
    ]);
    charts.commercialTrendChart.updateOptions({ xaxis: { categories: c.mensal.labels } }, false, false);
  }

  // ESTOQUE ────────────────────────────────────────────────────
  if (charts.stockMovementChart && c.movimento?.entradas) {
    charts.stockMovementChart.updateSeries([
      { name: "Entradas", data: c.movimento.entradas },
      { name: "Saídas",   data: c.movimento.saidas },
    ]);
    charts.stockMovementChart.updateOptions({ xaxis: { categories: c.movimento.labels } }, false, false);
  }
  if (charts.stockAbcChart && c.curva_abc) {
    const entries = Object.entries(c.curva_abc);
    if (entries.length) {
      charts.stockAbcChart.updateOptions({
        labels: entries.map(([k]) => k),
        colors: ["#F79009","#FEC84B","#FEF0C7","#E4E7EC"].slice(0, entries.length),
      }, false, false);
      charts.stockAbcChart.updateSeries(entries.map(([, v]) => parseInt(v)));
    }
  }

  // OPERACIONAL ────────────────────────────────────────────────
  if (charts.opsFlowChart && c.mensal?.concluidos) {
    charts.opsFlowChart.updateSeries([
      { name: "Concluídos", data: c.mensal.concluidos },
      { name: "Pendentes",  data: c.mensal.pendentes },
    ]);
    charts.opsFlowChart.updateOptions({ xaxis: { categories: c.mensal.labels } }, false, false);
  }
  if (charts.opsEfficiencyChart && c.eficiencia) {
    charts.opsEfficiencyChart.updateSeries([
      { name: "Eficiência %", data: c.eficiencia },
      { name: "Meta",         data: Array(c.eficiencia.length).fill(80) },
    ]);
    if (c.mensal?.labels) {
      charts.opsEfficiencyChart.updateOptions({ xaxis: { categories: c.mensal.labels } }, false, false);
    }
  }

  // ESTRATÉGICO ────────────────────────────────────────────────
  if (charts.strategyMixedChart && c.receita_vs_lucro) {
    const r = c.receita_vs_lucro;
    const margem = (r.series_margem && r.series_margem.length)
      ? r.series_margem
      : r.series_receita.map((rec, i) => {
          const luc = r.series_lucro?.[i] ?? 0;
          return rec > 0 ? Math.round((luc / rec) * 1000) / 10 : 0;
        });
    charts.strategyMixedChart.updateSeries([
      { name: "Receita",  type: "bar",  data: r.series_receita },
      { name: "Lucro",    type: "bar",  data: r.series_lucro },
      { name: "Margem %", type: "line", data: margem },
    ]);
    const cats = (r.categories || []).map(m => MONTHS_PT[(parseInt(m) - 1)] ?? m);
    charts.strategyMixedChart.updateOptions({ xaxis: { categories: cats } }, false, false);
  }
  if (charts.strategyOkrChart && c.okrs) {
    charts.strategyOkrChart.updateSeries([
      c.okrs.receita_pct ?? 0,
      c.okrs.crescimento_pct ?? 0,
      c.okrs.satisfacao_pct ?? 0,
      c.okrs.market_pct ?? 0,
    ]);
  }

  // ANALYTICS ──────────────────────────────────────────────────
  if (charts.analyticsTendencias && c.tendencias) {
    const t = c.tendencias;
    charts.analyticsTendencias.updateSeries([
      { name: "Receita",     type: "bar",  data: t.receita },
      { name: "Média Móvel", type: "line", data: t.media_movel },
    ]);
    charts.analyticsTendencias.updateOptions({ xaxis: { categories: t.labels } }, false, false);
  }
  if (charts.analyticsCrescimento && c.tendencias?.crescimento) {
    charts.analyticsCrescimento.updateSeries([{ name: "Crescimento %", data: c.tendencias.crescimento }]);
    charts.analyticsCrescimento.updateOptions({ xaxis: { categories: c.tendencias.labels } }, false, false);
  }
  if (charts.analyticsPorPeriodo && c.por_periodo) {
    const pp = c.por_periodo;
    charts.analyticsPorPeriodo.updateSeries([
      { name: pp.mes_atual    || "Mês Atual",    data: pp.atual },
      { name: pp.mes_anterior || "Mês Anterior", data: pp.anterior },
    ]);
    charts.analyticsPorPeriodo.updateOptions({ xaxis: { categories: pp.labels } }, false, false);
  }
  if (charts.analyticsComparacaoAnos && c.comparacao_anos) {
    const ca = c.comparacao_anos;
    const anos = Object.entries(ca.anos).map(([year, data]) => ({ name: year, data }));
    charts.analyticsComparacaoAnos.updateSeries(anos);
    charts.analyticsComparacaoAnos.updateOptions({ xaxis: { categories: ca.labels } }, false, false);
  }
  if (charts.analyticsSazonalidade && c.sazonalidade) {
    const s = c.sazonalidade;
    charts.analyticsSazonalidade.updateSeries([
      { name: "Índice",  type: "bar",  data: s.indices },
      { name: "Pedidos", type: "line", data: s.pedidos },
    ]);
    charts.analyticsSazonalidade.updateOptions({ xaxis: { categories: s.labels } }, false, false);
  }
  if (charts.analyticsSegmentacao && c.segmentacao) {
    const seg = c.segmentacao;
    charts.analyticsSegmentacao.updateOptions({ labels: seg.labels }, false, false);
    charts.analyticsSegmentacao.updateSeries(seg.contagens);
  }
  if (charts.analyticsClientesCrescimento && c.segmentacao?.crescimento_mensal) {
    charts.analyticsClientesCrescimento.updateSeries([{ name: "Novos Clientes", data: c.segmentacao.crescimento_mensal }]);
    charts.analyticsClientesCrescimento.updateOptions({ xaxis: { categories: c.segmentacao.labels_crescimento } }, false, false);
  }

  // OVERVIEW ───────────────────────────────────────────────────
  if (charts.overviewReceitasDespesas && c.receitas_despesas) {
    const rd = c.receitas_despesas;
    charts.overviewReceitasDespesas.updateSeries([
      { name: "Receitas", data: rd.receitas },
      { name: "Despesas", data: rd.despesas },
    ]);
    charts.overviewReceitasDespesas.updateOptions({ xaxis: { categories: rd.labels } }, false, false);
  }
  if (charts.overviewPedidosStatus && c.pedidos_status) {
    const ps = c.pedidos_status;
    charts.overviewPedidosStatus.updateSeries([
      { name: "Concluídos", data: ps.concluidos },
      { name: "Pendentes",  data: ps.pendentes },
    ]);
    charts.overviewPedidosStatus.updateOptions({ xaxis: { categories: ps.labels } }, false, false);
  }
  if (charts.overviewClientesMensais && c.clientes_mensais) {
    const cm = c.clientes_mensais;
    charts.overviewClientesMensais.updateSeries([{ name: "Novos Clientes", data: cm.series }]);
    charts.overviewClientesMensais.updateOptions({ xaxis: { categories: cm.labels } }, false, false);
  }

  // CLIENTES ───────────────────────────────────────────────────
  if (charts.clientsGrowthChart && c.crescimento?.novos) {
    charts.clientsGrowthChart.updateSeries([{ name: "Novos Clientes", data: c.crescimento.novos }]);
    charts.clientsGrowthChart.updateOptions({ xaxis: { categories: c.crescimento.labels } }, false, false);
  }
  if (charts.clientsSegmentChart && c.perfil_regional) {
    const entries = Object.entries(c.perfil_regional);
    if (entries.length) {
      const COLORS_SEG = ["#0BA5EC","#2A31D8","#9B5CDB","#12B76A","#F79009","#98A2B3"];
      charts.clientsSegmentChart.updateOptions({
        labels: entries.map(([k]) => k),
        colors: COLORS_SEG.slice(0, entries.length),
      }, false, false);
      charts.clientsSegmentChart.updateSeries(entries.map(([, v]) => parseInt(v)));
    }
  }
};

// ── Init ───────────────────────────────────────────────────────
const initDomainCharts = () => {
  Object.entries(chartDefinitions).forEach(([id, opts]) => renderChart(id, opts));

  window.addEventListener("dashboardDataFetched", (e) => {
    updateWithRealData(e.detail);
  });
};

export default initDomainCharts;
