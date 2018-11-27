var barChartData = {
    labels: ["Easy to learn", "Easy to use", "Usefulness of metrics", "Likely to use in future"],
    datasets: [{
        label: 'Yes',
        backgroundColor: window.chartColors.blue,
        data: [
            12, 13, 10, 13
        ]
    }, {
        label: 'No',
        backgroundColor: window.chartColors.green,
        data: [
            5, 4, 7, 4
        ]
    }]

};
window.onload = function() {
    var ctx = document.getElementById('myChart1').getContext('2d');
    window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            title: {
                display: true,
                text: 'App Usablity'
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            responsive: true,
            scales: {
                xAxes: [{
                    stacked: true,
                    barPercentage: 0.4
                }],
                yAxes: [{
                    stacked: true,
                    scaleLabel: {
                        display: true,
                        labelString: "Votes"
                    }
                }]
            }
        }
    });
};
