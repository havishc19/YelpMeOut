function renderHeatmap(data, usjson, business_type) {
  $("#business-heatmap").remove();
  var freq_map = d3.map();
  var name_map = d3.map();
  var display_freq_map = d3.map();
  var us = usjson;

  for(var i=0; i<data.length; i++) {
    freq_map.set(data[i].code, data[i].count);
    name_map.set(data[i].code, data[i].state);
    if(data[i].count == -1) {
      display_freq_map.set(data[i].code, "No data available");
    } else {
      display_freq_map.set(data[i].code, data[i].count);
    }
  }
  
  
  var margin = {top: 100, right: 90, bottom: 30, left: 300},
      width = 1160 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  var svg = d3.select("#graph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "business-heatmap")
            .append("g");

  var x = d3.scale.linear()
      .domain([1, 100])
      .rangeRound([600, 900]);

  var labels = ["No data", 0,10,20,30,40,50,60,70,80,90,100];
  var color = d3.scale.threshold().domain([ "No data",0, 10,20,30,40,50,60,70,80,90]).range(["#D0F6F5","85DFDC", "#79D7D3", "#6ECECA", "#62C6C2", "#57BDB9", "#4BB5B0", "#3FACA8", "#34A49F", "#289B96", "#1D938E", "#19716D"]);
  // var color = d3.scale.threshold().domain([ "No data", 0,10,20,30,40,50,60,70,80,90]).range(["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b", "#3a000f"])

  var div = d3.select("#graph")
          .append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

  var g = svg.append("g")
      .attr("class", "key")
      .attr("transform", "translate(0,20)");

  g.selectAll("rect")
      .data(color.domain())
      .enter()
      .append("rect")
      .attr("height", 25)
      .attr("x", -30)
      .attr("y", function(d, i) { return 25*i})
      .attr("width", 29)
      .attr("fill", function(d) { 
        if(d == "No data") {
          return "#BBF2F0";
        } else {
          return color(d); 
        }
      })
      .attr("transform", "translate(900, 0)");

  g.append("text")
      .attr("class", "caption")
      .attr("x", x.range()[0] + 250)
      .attr("y", -6)
      .attr("fill", "#000")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text("Frequency");

  g.selectAll("text")
    .data(labels)
    .enter()
    .append("text")
    .attr("x", 0)
    .attr("y", function(d, i) { return 25*i})
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .text(function(d, i) { 
      console.log(d, i);
      if(i == 1) {
        return "No Data Available";
      } else {
        return (i-2)*10;
      }
    })
    .attr("transform", "translate(910, 0)");  

  svg.append("g")
      .attr("class", "counties")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .enter().append("path")
      .attr("fill", function(d) { 
        if(freq_map.get(d.id) == -1) {  
          return "#D0F6F5"; 
        } else if (freq_map.get(d.id)/100 > 100) {
          return color(d.restaurant_count = 100); 
        } else {
          return color(d.restaurant_count = freq_map.get(d.id)/100);
        }
      })
      .attr("d", d3.geo.path())
      .attr("transform", "translate(0, 100)")
      .on('mousemove', function (d) {
        console.log(d);
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html("State: " + name_map.get(d.id) + "&#10" + business_type + ": " + display_freq_map.get(d.id))
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
         })
      .on("mouseout", function(d) {
         div.transition()
         .duration(500)
         .style("opacity", 0);
       });
}


var trigger_renderChart = function(business_type){
  $.ajax({
    url: '/getHeatmapData',
    dataType: 'json',
    data: {'businessType': business_type},
    success: function( resp ) {
        $.ajax({
          url: '/getUSjson',
          dataType: 'json',
          success: function(resp2) {
            renderHeatmap(resp.data, resp2, business_type);
          },
          error: function(req, status, err) {
            console.log('something went wrong', status, err);
          }
        });
    },
    error: function( req, status, err ) {
      console.log( 'something went wrong', status, err );
    }
  });
}

window.changeData_heatmap = function(business_type){
  console.log(business_type);
  $('#business-type').html(business_type);
  trigger_renderChart(business_type);
}


$(document).ready(function(){
  trigger_renderChart("Restaurants");
})
