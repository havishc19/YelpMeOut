// var barChartData = {
//     labels: ["Easy to learn", "Easy to use", "Usefulness of metrics", "Likely to use in future"],
//     datasets: [{
//         label: 'Yes',
//         backgroundColor: window.chartColors.blue,
//         data: [
//             12, 13, 10, 13
//         ]
//     }, {
//         label: 'No',
//         backgroundColor: window.chartColors.green,
//         data: [
//             5, 4, 7, 4
//         ]
//     }]

// };


var barChartData = {
  labels: ["Easy to learn", "Easy to use", "Usefulness of metrics", "Likely to use in future"],
  datasets: [
    {
      label: "Businessmen",
      backgroundColor: "#2f98e8",
      borderColor: "#2f98e8",
      borderWidth: 1,
      data: [80, 60, 90, 80]
    },
    {
      label: "Entrepreneur",
      backgroundColor: "#42b8b8",
      borderColor: "#42b8b8",
      borderWidth: 1,
      data: [80, 80, 100, 80]
    }
  ]
};

var chartOptions = {
  responsive: true,
  legend: {
    position: "bottom"
  },
  scales: {
    xAxes: [{
        barPercentage: 0.9,
        categoryPercentage: 0.4
    }],
    yAxes: [{
      ticks: {
        beginAtZero: true,
        callback: function(value, index, values) {
                        return value + '%';
                    }
      }
    }]
  }
}

window.onload = function() {
  var ctx = document.getElementById("canvas").getContext("2d");
  window.myBar = new Chart(ctx, {
    type: "bar",
    data: barChartData,
    options: chartOptions
  });
};





// window.onload = function() {
//     var ctx = document.getElementById('myChart1').getContext('2d');
//     window.myBar = new Chart(ctx, {
//         type: 'bar',
//         data: barChartData,
//         options: {
//             title: {
//                 display: true,
//                 text: 'App Ussablity'
//             },
//             tooltips: {
//                 mode: 'index',
//                 intersect: false
//             },
//             responsive: true,
//             scales: 
//                 xAxes: [{
//                     stacked: true,
//                     barPercentage: 0.4
//                 }],
//                 yAxes: [{
//                     stacked: true,
//                     scaleLabel: {
//                         display: true,
//                         labelString: "Votes"
//                     }
//                 }]
//             }
//         }
//     });
// };
