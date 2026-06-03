import ApexCharts from "apexcharts";

// ===== chartThree
const chart03 = () => {
  const chartThreeOptions = {
    series: [
      {
        name: "Vendas",
        data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
      },
      {
        name: "Receita",
        data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
      },
    ],
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      id: "chartThree",
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    fill: {
      gradient: {
        enabled: true,
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    stroke: {
      curve: "straight",
      width: ["2", "2"],
    },

    markers: {
      size: 0,
    },
    labels: {
      show: false,
      position: "top",
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: false,
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const chartSelector = document.querySelectorAll("#chartThree");

  if (chartSelector.length) {
    const chartThree = new ApexCharts(
      document.querySelector("#chartThree"),
      chartThreeOptions,
    );
    chartThree.render();

    window.addEventListener('dashboardDataFetched', (e) => {
      const apiData = e.detail;
      const page = document.querySelector('[x-data]').getAttribute('x-data');
      
      if (page.includes('overview') && apiData.charts?.evolucao_receita) {
        chartThree.updateSeries([{
          name: 'Receita',
          data: apiData.charts.evolucao_receita.series
        }]);

        const formatCategoryDate = (val) => {
          if (typeof val === 'string' && val.match(/^\d{4}-\d{2}/)) {
             const parts = val.split('-');
             const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
             const mIndex = parseInt(parts[1], 10) - 1;
             if (mIndex >= 0 && mIndex < 12) {
                 return `${months[mIndex]}/${parts[0].slice(-2)}`;
             }
          }
          return val;
        };

        chartThree.updateOptions({
          xaxis: { categories: apiData.charts.evolucao_receita.categories.map(formatCategoryDate) }
        });
      }
      else if (page.includes('comercial') && apiData.charts?.funil_vendas) {
        chartThree.updateSeries([{
          name: 'Funil',
          data: Object.values(apiData.charts.funil_vendas)
        }]);
        chartThree.updateOptions({
          xaxis: { categories: Object.keys(apiData.charts.funil_vendas) }
        });
      }
      else if (page.includes('clientes') && apiData.charts?.crescimento_base) {
        // Exemplo, caso exista 'crescimento_base'
      }
    });
  }
};

export default chart03;
