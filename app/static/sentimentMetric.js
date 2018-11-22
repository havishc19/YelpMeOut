dataGlobal = [];

function updateCharts() {
  var sel = document.getElementById('cuisinelist');
  var cuisine = sel.value;
  renderChartPositive(dataGlobal, cuisine);
  renderChartNegative(dataGlobal, cuisine);
}

function getCuisines(data) {
  cuisines = [];
  for(var i=0; i<data.length; i++) {
    cuisines.push(data[i]["cuisine"]);
  }
  return cuisines;
}

function populateSelectOptions(data) {
  cuisines = getCuisines(data)
  var sel = document.getElementById('cuisinelist');
  for(var i = 0; i < cuisines.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = cuisines[i];
      opt.value = cuisines[i];
      sel.appendChild(opt);
  }
}

function renderChart(data, div_id) {
  //clear the div_id
  document.getElementById(div_id).innerHTML = "";

  //sort bars based on value
  data = data.sort(function (a, b) {
      return d3.ascending(a.value, b.value);
  })

  //set up svg using margin conventions - we'll need plenty of room on the left for labels
  var margin = {
      top: 15,
      right: 25,
      bottom: 15,
      left: 120
  };

  var width = 960 - margin.left - margin.right,
      height = 1000 - margin.top - margin.bottom;

  var svg = d3.select("#"+div_id).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scale.linear()
      .range([0, width-20])
      .domain([0, d3.max(data, function (d) {
          return d.value;
      })]);

  var y = d3.scale.ordinal()
      .rangeRoundBands([height, 0], .1)
      .domain(data.map(function (d) {
          return d.name;
      }));

  //make y axis to show bar names
  var yAxis = d3.svg.axis()
      .scale(y)
      //no tick marks
      .tickSize(0)
      .orient("left");

  var gy = svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

  var bars = svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("g")

  //append rects
  bars.append("rect")
      .attr("class", "bar")
      .attr("y", function (d) {
          return y(d.name);
      })
      .attr("height", y.rangeBand())
      .attr("x", 0)
      .attr("width", function (d) {
          return x(d.value);
      });

  //add a value label to the right of each bar
  bars.append("text")
      .attr("class", "label")
      //y position of the label is halfway down the bar
      .attr("y", function (d) {
          return y(d.name) + y.rangeBand() / 2 + 4;
      })
      //x position is 3 pixels to the right of the bar
      .attr("x", function (d) {
          return x(d.value) + 3;
      })
      .text(function (d) {
          return d.value;
      });
}

function renderChartPositive(data, cuisine) {
  console.log(data);
  var index = 0;
  for(var i=0; i<data.length; i++) {
    if(data[i]["cuisine"] == cuisine) {
      index = i;
      break;
    }
  }
  console.log(data[index]);
  tempdata = data[index]["positive"]
  var data = []
  for(var i=0; i<tempdata.length; i++) {
    data = data.concat([{"name": tempdata[i][0], "value": tempdata[i][1]}]);
  }
  renderChart(data, "graphic1");
}

function renderChartNegative(data, cuisine) {
  var index = 0;
  for(var i=0; i<data.length; i++) {
    if(data[i]["cuisine"] == cuisine) {
      index = i;
      break;
    }
  }
  tempdata = data[index]["negative"]
  var data = []
  for(var i=0; i<tempdata.length; i++) {
    data = data.concat([{"name": tempdata[i][0], "value": tempdata[i][1]}]);
  }
  renderChart(data, "graphic2");
}       

$(document).ready(function(){
  $.ajax({
    url: '/getSentimentData',
    dataType: 'json',
    success: function( resp ) {
      console.log(resp);
            dataGlobal = resp.data;
            populateSelectOptions(resp.data);
            updateCharts(resp.data);
            console.log("ho gya");
    },
    error: function( req, status, err ) {
      console.log( 'something went wrong', status, err );
    }
  });
})
