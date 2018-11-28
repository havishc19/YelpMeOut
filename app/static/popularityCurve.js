dataGlobal = [];



function updateCharts_popularity(data) {
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
  
  renderGraph_popularity(tempdata);
}

function getList(data) {
  inputList = [];
  for(var i=0; i<data.length; i++) {
    inputList.push(data[i]["key"]);
  }
  return inputList;
}

function populateSelectOptions_popularity(data) {
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


var renderGraph_popularity = function(data){
  var arr = []
  for(var i in data) {
    arr.push(
       {
           date: new Date(data[i][1]),
          //date: data[i][1],  
          value: +data[i][0] .toFixed(2)
       });
  }

  data = arr
  // console.log("update")
  // console.log(data)

  // const tooltip = d3.select('#tooltip');
  //const tooltipLine = svg.append('line');

  //svg.call(tip);
  var labels = [];
  var value = [];
  var sum = 0;
  for(var i=0; i<data.length; i++) {

    var d = new Date(data[i].date);
    // console.log(d, "d");
    var str = $.datepicker.formatDate('yy-mm-dd', d);

    labels.push(str);
    value.push(data[i].value);
    sum += data[i].value;
  }
  var average = (sum/value.length).toFixed(2);
  document.getElementById("layout123").innerHTML = "<canvas id=\"popularity-canvas\", style=\"width: 75%; height: 50%\"></canvas>";
  new Chart(document.getElementById("popularity-canvas"), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{ 
          data: value,
          borderColor: "#3e95cd",
          fill: true,
          label: "Rating"
        }
      ]
    },
    options: {
      responsive: true,
      legend: {
          display: false
      },
    scales: {
        yAxes: [{
            ticks: {
                min: 0
            }
        }],
        xAxes: [{
            type: 'time',
            time: {
                displayFormats: {
                    quarter: 'YY MM DD'
                }
            }
        }]
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
   hover: {
      mode: 'nearest',
      intersect: true
    },
    // annotation: {
    //   annotations: [{
    //     type: 'line',
    //     mode: 'horizontal',
    //     scaleID: 'y-axis-0',
    //     value: average,
    //     borderColor: 'tomato',
    //     borderWidth: 1,
    //     label: {
    //       content: "Average Rating: " + average,
    //       enabled: true,
    //       position: 'bottom'
    //     }
    //   }],
    //   drawTime: "afterDraw"
    // }
  }
  });
}

$(document).ready(function(){

	$.ajax({
		url: '/getRatingData',
		dataType: 'json',
		success: function( resp ) {
      console.log("hi");
			//console.log(resp);
      dataGlobal = resp.data;
      populateSelectOptions_popularity(resp.data);
      updateCharts_popularity(resp.data);
		},
		error: function( req, status, err ) {
			console.log( 'something went wrong', status, err );
		}
	});
})


