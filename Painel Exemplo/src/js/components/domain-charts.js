import ApexCharts from "apexcharts";

const chartDefinitions = {
  financeRevenueChart: {
    series: [
      {
        name: "Receita",
        data: [92, 98, 101, 105, 112, 118, 121, 125, 123, 129, 134, 140],
      },
      {
        name: "Margem",
        data: [24, 26, 25, 27, 29, 31, 32, 34, 33, 35, 36, 38],
      },
    ],
    colors: ["#12B76A", "#2A31D8"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 320,
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: [3, 3] },
    fill: {
      gradient: {
        enabled: true,
        opacityFrom: 0.28,
        opacityTo: 0.02,
      },
    },
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: {
      categories: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter(value) {
          return `${value}M`;
        },
      },
    },
    grid: {
      borderColor: "#E4E7EC",
      strokeDashArray: 4,
    },
  },
  commercialPipelineChart: {
    series: [
      {
        name: "Pipeline",
        data: [148, 116, 79, 51, 32],
      },
      {
        name: "Fechadas",
        data: [104, 82, 56, 34, 21],
      },
    ],
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 320,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "42%",
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: {
      categories: [
        "Prospeccao",
        "Qualificacao",
        "Proposta",
        "Negociacao",
        "Fechamento",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: {
      borderColor: "#E4E7EC",
      strokeDashArray: 4,
    },
  },
  operationsEfficiencyChart: {
    series: [
      {
        name: "OEE",
        data: [72, 74, 76, 78, 77, 79, 81, 80, 82, 83, 84, 85],
      },
      {
        name: "Meta",
        data: [78, 78, 78, 79, 79, 79, 80, 80, 80, 80, 81, 81],
      },
    ],
    colors: ["#F79009", "#344054"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 320,
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: [3, 2], dashArray: [0, 6] },
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: {
      categories: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter(value) {
          return `${value}%`;
        },
      },
      min: 65,
      max: 90,
    },
    grid: {
      borderColor: "#E4E7EC",
      strokeDashArray: 4,
    },
  },
  logisticsDeliveryChart: {
    series: [
      {
        name: "Pedidos expedidos",
        data: [182, 194, 201, 198, 210, 224, 230, 226, 238, 245, 251, 264],
      },
      {
        name: "No prazo",
        data: [168, 181, 186, 187, 196, 209, 214, 211, 225, 233, 239, 252],
      },
    ],
    colors: ["#F79009", "#0BA5EC"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 320,
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: [3, 3] },
    fill: {
      gradient: {
        enabled: true,
        opacityFrom: 0.24,
        opacityTo: 0.02,
      },
    },
    dataLabels: { enabled: false },
    legend: { position: "top", horizontalAlign: "left" },
    xaxis: {
      categories: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: {
      borderColor: "#E4E7EC",
      strokeDashArray: 4,
    },
  },
};

const renderConfiguredChart = (elementId, options) => {
  const element = document.querySelector(`#${elementId}`);

  if (!element) {
    return;
  }

  const chart = new ApexCharts(element, options);
  chart.render();
};

const initDomainCharts = () => {
  Object.entries(chartDefinitions).forEach(([elementId, options]) => {
    renderConfiguredChart(elementId, options);
  });
};

export default initDomainCharts;
