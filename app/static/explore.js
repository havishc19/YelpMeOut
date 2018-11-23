import {getData_Traffic, changeData} from './trafficChart.js' 
import {getData_Ratings} from './ratings.js' 
import {getData_BusinesssPopularity} from './businessPopularity.js'

window.changeData1 = function(timerange){
    changeData(timerange);
}

$(document).ready(function(){
  getData_Traffic("12:00 - 13:00");
  getData_Ratings();
  getData_BusinesssPopularity();
})
