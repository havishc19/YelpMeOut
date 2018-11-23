dataGlobal = [];

datawords = [
            [  
               "custom servic"
            ],
            [  
               "food servic"
            ],
            [  
               "servic terribl"
            ],
            [  
               "long time"
            ],
            [  
               "main cours"
            ],
            [  
               "took hour"
            ],
            [  
               "mediocr food"
            ],
            [  
               "onion soup"
            ],
            [  
               "worst servic"
            ],
            [  
               "saturday night"
            ],
            [  
               "sever time"
            ],
            [  
               "servic bad"
            ],
            [  
               "horribl servic"
            ],
            [  
               "bad servic"
            ],
            [  
               "credit card"
            ],
            [  
               "egg benedict"
            ]
         ]

function updateCharts(data) {
  var sel = document.getElementById('dropdownList');
  var cuisine = sel.value;
  
  var index = 0;
  for(var i=0; i<dataGlobal.length; i++) {
    if(dataGlobal[i]["key"] == cuisine) {
      index = i;
      break;
    }
  }

  tempdata = dataGlobal[index]["value"]
  
  renderGraph(tempdata);
}

function getList(data) {
  inputList = [];
  for(var i=0; i<data.length; i++) {
    inputList.push(data[i]["key"]);
  }
  return inputList;
}

function populateSelectOptions(data) {
  inputList = getList(data)
  //console.log(inputList)
  var sel = document.getElementById('dropdownList');
  for(var i = 0; i < inputList.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = inputList[i];
      opt.value = inputList[i];
      sel.appendChild(opt);
  }
}


var renderGraph = function(data){
  var arr = []
  for(var i in data) {
    arr.push(
       {
           date: new Date(data[i][1]),
          //date: data[i][1],  
          value: +data[i][0] 
       });
  }

  data = arr
  // console.log("update")
  // console.log(data)

  var svgWidth = 900, svgHeight = 400;
  var margin = { top: 20, right: 20, bottom: 40, left: 50 };
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;


  var svg = d3.select('svg')
   .attr("width", svgWidth)
   .attr("height", svgHeight);

  const tooltip = d3.select('#tooltip');
  //const tooltipLine = svg.append('line');

  //svg.call(tip);

  svg.selectAll("*").remove();

  var g = svg.append("g")
   .attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")"
   );

  var x = d3.scaleTime().rangeRound([0, width]);
  var y = d3.scaleLinear().rangeRound([height, 0]);

  var line = d3.line()
   .curve(d3.curveMonotoneX)  
   .x(function(d) { return x(d.date)})
   .y(function(d) { //if(d.value < 3 )
                      //return y(3); 
                    return y(d.value)})
   x.domain(d3.extent(data, function(d) { return d.date }));
   //y.domain(d3.extent(data, function(d) { return d.value }));
   y.domain([1, d3.max(data, function(d){
                                        return d.value;
                                    })])

  g.append("g")
   .attr("transform", "translate(0," + height + ")")
   .call(d3.axisBottom(x))
   .select(".domain")

  g.append("g")
   .call(d3.axisLeft(y))
   .append("text")
   .attr("fill", "#000")
   .attr("transform", "rotate(-90)")
   .attr("y", 6)
   .attr("dy", "0.71em")
   //.yDomain([0, 5])
   .attr("text-anchor", "end")
   .text("Rating");

  g.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("stroke-width", 1.5)
  .attr("d", line)
  .attr("class", "line")
  .text("Time");

  var bisectDate = d3.bisector(function(d) { return d.date; }).left;

  var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

  focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);

  focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", width)
        .attr("x2", width);

  focus.append("circle")
      .attr("r", 4);

  focus.append("text")
      .attr("x", 15)
      .attr("dy", ".31em");

  svg.append("rect")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null);
        if (tooltip) tooltip.style("display", 'none'); })
        .on("mouseout", function() { focus.style("display", "none");
        if (tooltip) tooltip.style("display", 'none'); })
        .on("mousemove", mousemove);

    function getIndex(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      //console.log(x0)
      focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
      // focus.select("text").text(function() { 
      //   return d.value; });
      focus.select(".x-hover-line").attr("y2", height - y(d.value));
      focus.select(".y-hover-line").attr("x2", width + width);

      var index = getIndex(datawords.length)

      tooltip.html(

        function() { 
          if (d.value <3.6) {
              // var tmp = d.date.split(' ')
              // var date = tmp[1] + " " + tmp[2]
              var tmp = d.date.toString().split(' ')
              var val = tmp[1] + "," + tmp[2]
              return val + "- " + datawords[index][0];
          } else { 
              return "good response";
          }
        })

        .style('display', 'block')
        .style('left', d3.event.pageX + 20)
        .style('top', d3.event.pageY - 20);

    }

}

$(document).ready(function(){

	$.ajax({
		url: '/getRatingData',
		dataType: 'json',
		success: function( resp ) {
      console.log("hi");
			//console.log(resp);
      dataGlobal = resp.data;
      populateSelectOptions(resp.data);
      updateCharts(resp.data);
		},
		error: function( req, status, err ) {
			console.log( 'something went wrong', status, err );
		}
	});
})


