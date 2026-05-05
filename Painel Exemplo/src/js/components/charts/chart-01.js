import ApexCharts from "apexcharts";

// ===== chartOne
const chart01 = () => {
  const chartOneOptions = {
    series: [
      {
        name: "Vendas",
        data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
      },
    ],
    colors: ["#465fff"],
    chart: {
      id: "chartOne",
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
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
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",

      markers: {
        radius: 99,
      },
    },
    yaxis: {
      title: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
  };

  const chartSelector = document.querySelectorAll("#chartOne");

  if (chartSelector.length) {
    const chartFour = new ApexCharts(
      document.querySelector("#chartOne"),
      chartOneOptions,
    );
    chartFour.render();
    
    window.addEventListener('dashboardDataFetched', (e) => {
      const apiData = e.detail;
      const page = document.querySelector('[x-data]').getAttribute('x-data');
      
      if (page.includes('overview') && apiData.charts?.evolucao_receita) {
        chartFour.updateSeries([{
          name: 'Receita',
          data: apiData.charts.evolucao_receita.series
        }]);
        chartFour.updateOptions({
          xaxis: { categories: apiData.charts.evolucao_receita.categories }
        });
      }
      else if (page.includes('estrategico') && apiData.charts?.receita_vs_lucro) {
        chartFour.updateSeries([{
          name: 'Receita',
          data: apiData.charts.receita_vs_lucro.series_receita
        }]);
        chartFour.updateOptions({
          xaxis: { categories: apiData.charts.receita_vs_lucro.categories }
        });
      }
      else if (page.includes('operacional') && apiData.charts?.fluxo_diario) {
        chartFour.updateSeries([{
          name: 'Fluxo',
          data: apiData.charts.fluxo_diario.series
        }]);
        chartFour.updateOptions({
          xaxis: { categories: apiData.charts.fluxo_diario.categories }
        });
      }
      else if (page.includes('financeiro') && apiData.charts?.receitas_vs_despesas) {
        chartFour.updateSeries([{
          name: 'Valor',
          data: [apiData.charts.receitas_vs_despesas.receitas, apiData.charts.receitas_vs_despesas.despesas]
        }]);
        chartFour.updateOptions({
          xaxis: { categories: ['Receitas', 'Despesas'] }
        });
      }
      else if (page.includes('clientes') && apiData.charts?.perfil_regional) {
        chartFour.updateSeries([{
          name: 'Clientes',
          data: Object.values(apiData.charts.perfil_regional)
        }]);
        chartFour.updateOptions({
          xaxis: { categories: Object.keys(apiData.charts.perfil_regional) }
        });
      }
      else if (page.includes('estoque') && apiData.charts?.curva_abc) {
        chartFour.updateSeries([{
          name: 'Itens',
          data: Object.values(apiData.charts.curva_abc)
        }]);
        chartFour.updateOptions({
          xaxis: { categories: Object.keys(apiData.charts.curva_abc) }
        });
      }
    });
  }
};

export default chart01;
