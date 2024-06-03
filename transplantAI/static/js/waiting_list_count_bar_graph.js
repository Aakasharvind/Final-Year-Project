// Total Transplants
var ctx = document.getElementById("waiting_list_count_bar_graph");

var myBarChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ["2016", "2017", "2018"],
    datasets: [
        {
            label: "Kidney",
            lineTension: 0.3,
            backgroundColor: "rgba(208, 85, 92, 1)",
            data: [9094, 11395, 12758],
        },
        {
            label: "Liver",
            lineTension: 0.3,
            backgroundColor: "rgba(83, 75, 79, 1)",
            data: [2669, 3419, 4173],
        },
        {
            label: "Heart",
            lineTension: 0.3,
            backgroundColor: "rgba(227, 27, 35, 1)",
            data: [181, 307, 425],
        },
        {
            label: "Lung",
            lineTension: 0.3,
            backgroundColor: "rgba(52, 95, 114, 1)",
            data: [14, 44, 75],
        }
    ],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'year'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          callback: function(value, index, values) {
            return '' + number_format(value);
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          let datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': ' + number_format(tooltipItem.yLabel);
        }
      }
    }
  }
});