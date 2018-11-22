dataGlobal = [];

function updateCharts() {
  var sel = document.getElementById('cuisinelist');
  var cuisine = sel.value;
  document.getElementById('title').innerHTML = "<center><h3>Top 10 positive and negative features for " + cuisine + " restaurants</h3></center>";
  var data = [];
  data = data.concat(getDataPositive(dataGlobal, cuisine));
  data = data.concat(getDataNegative(dataGlobal, cuisine));
  console.log(data);
  renderChart(data, "graphic1");
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

var margin = {top: 20, right: 30, bottom: 40, left: 30},
    width = 1160 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], 0.1);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(0)
    .tickPadding(6);

var svg = d3.select("#"+div_id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(data, function(d) { return d.value; })).nice();
  y.domain(data.map(function(d) { return d.name; }));

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
      .attr("x", function(d) { return x(Math.min(0, d.value)); })
      .attr("y", function(d) { return y(d.name); })
      .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
      .attr("height", y.rangeBand());

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + x(0) + ",0)")
      .call(yAxis);

function type(d) {
  d.value = +d.value;
  return d;
}
}

function getDataPositive(data, cuisine) {
  console.log(data);
  var count = 10;
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
  for(var i=0; i<tempdata.length && i<count; i++) {
    data = data.concat([{"name": tempdata[i][0], "value": tempdata[i][1]}]);
  }
  return data
}

function getDataNegative(data, cuisine) {
  var index = 0;
  var count = 10;
  for(var i=0; i<data.length; i++) {
    if(data[i]["cuisine"] == cuisine) {
      index = i;
      break;
    }
  }
  tempdata = data[index]["negative"]
  var data = []
  for(var i=0; i<tempdata.length && i<count; i++) {
    data = data.concat([{"name": tempdata[i][0], "value": -1*tempdata[i][1]}]);
  }
  return data
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
