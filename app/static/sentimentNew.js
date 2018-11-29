var dataGlobal = [];

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

function updateCharts(data) {
  // document.getElementById("graph").innerHTML = "<canvas id=\"canvas\"></canvas>";
  var sel = document.getElementById('cuisinelist');
  // var cuisine = sel.value;
  var cuisine = "your"
  document.getElementById('title').innerHTML = "<center><h3>Most Popular Opinions for " + cuisine + " Restaurant</h3></center> <span class=\"title\" x=\"600\" y=\"40\" text-anchor=\"middle\" style=\"font-size: 70%;margin-bottom: 10px; font-style: italic;font-family:\"Times New Roman\", Times, serif;\">Don't know what's not working out? Look below and see the most popular complaints consumers have. Dont worry, we have included the compliments too. Keep up the good work</span>";
  var data = [];
  data = data.concat(getDataPositive(dataGlobal, cuisine));
  data = data.concat(getDataNegative(dataGlobal, cuisine));
  console.log(data);
  var features = [];
  var labels = [];
  var plotDataPositive = [];
  var plotDataNegative = [];
  for(var i=0; i<data.length; i++) {
  	features.push(data[i].name);
  	labels.push(data[i].name);
  	if(data[i].value < 0) {
  		plotDataNegative.push(data[i].value);
  		plotDataPositive.push(0);
  	} else {
  		plotDataPositive.push(data[i].value);
  		plotDataNegative.push(0);
  	}
  }
	var color = Chart.helpers.color;
	var horizontalBarChartData = {
		labels: labels,
		datasets: [{
			label: 'Positive features',
			backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
			borderColor: window.chartColors.blue,
			borderWidth: 1,
			data: plotDataPositive
		}, {
			label: 'Negative features',
			backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
			borderColor: window.chartColors.red,
			data: plotDataNegative
		}]
	};

	var ctx = document.getElementById('sentiment-canvas').getContext('2d');
	window.myHorizontalBar = new Chart(ctx, {
		type: 'horizontalBar',
		data: horizontalBarChartData,
		options: {
			elements: {
				rectangle: {
					borderWidth: 2,
				}
			},
			responsive: true,
			legend: {
				position: 'right',
			}
		}
	});
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

var colorNames = Object.keys(window.chartColors);
$(document).ready(function(){
  $.ajax({
    url: '/getSentimentData',
    dataType: 'json',
    success: function( resp ) {
      console.log(resp);
            dataGlobal = resp.data;
            // populateSelectOptions(resp.data);
            updateCharts(resp.data);
            console.log("ho gya");
    },
    error: function( req, status, err ) {
      console.log( 'something went wrong', status, err );
    }
  });
})
