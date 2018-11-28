var chart = c3.generate({
    bindto: '#gauge',
    data: {
        columns: [
            ['Rating', 4.4]
        ],
        type: 'gauge',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },
    gauge: {
       label: {
           format: function(value, ratio) {
               return value;
           },
           show: true // to turn off the min/max labels.
       },
   min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
        max: 5, // 100 is default
        // units: 'value',
//    width: 39 // for adjusting arc thickness
    },
    color: {
        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
        threshold: {
            unit: 'value',
            max: 5,
           unit: 'value', // percentage is default
//            max: 200, // 100 is default
            values: [2,3,4]
        }
    },
    size: {
        height: 180
    }
});

setTimeout(function () {
    chart.load({
        columns: [['Rating', 0.9]]
    });
}, 1000);

setTimeout(function () {
    chart.load({
        columns: [['Rating', 1.4]]
    });
}, 2000);

setTimeout(function () {
    chart.load({
        columns: [['Rating', 5]]
    });
}, 3000);

setTimeout(function () {
    chart.load({
        columns: [['Rating', 4.3]]
    });
}, 4000);

setTimeout(function () {
    chart.load({
        columns: [['Rating', 3.3]]
    });
}, 5000);


setTimeout(function () {
    chart.load({
        columns: [['Rating', 0.9]]
    });
}, 1000);

