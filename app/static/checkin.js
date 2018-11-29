var flag = 0;
var globalData = [];
var toggleDayMap = {0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true}
var chart;
window.toggleLine = function(day){
    toggleDayMap[day] = !toggleDayMap[day];
    renderChart_checkin(globalData);
}

$("#toggleDisplay").click(function(){
    console.log(chart);
    if(flag % 2 == 0)
        chart.transform('bar');
    else
        chart.transform('line');
    flag += 1;
});

function parseData(data){
    var colData = [];
    if(toggleDayMap[0])
        colData.push(["Mon"].concat(data["Mon"]));
    if(toggleDayMap[1])
        colData.push(["Tue"].concat(data["Tue"]));
    if(toggleDayMap[2])
        colData.push(["Wed"].concat(data["Wed"]));
    if(toggleDayMap[3])
        colData.push(["Thurs"].concat(data["Thu"]));
    if(toggleDayMap[4])
        colData.push(["Fri"].concat(data["Fri"]));
    if(toggleDayMap[5])
        colData.push(["Sat"].concat(data["Sat"]));
    if(toggleDayMap[6])
        colData.push(["Sun"].concat(data["Sun"]));
    // [ ["Mon"].concat(data["Mon"]), ["Tue"].concat(data["Tue"]), ["Wed"].concat(data["Wed"]), ["Thurs"].concat(data["Thu"]), ["Fri"].concat(data["Fri"]), ["Sat"].concat(data["Sat"]), ["Sun"].concat(data["Sun"]) ]
    return colData;
}

function renderChart_checkin(data){
    
    var colData = parseData(data);
    chart = c3.generate({
          bindto: '#chart',
          data: {
            columns: colData,
            type: 'line'
          }
      });   
    chart.resize({height:450});
    chart.axis.labels({y: 'Avg Customer count ', x: 'Time [24 hour format]'});
    // setTimeout(function () {
    //     chart.transform('bar');
    // }, 4000);
    // setTimeout(function () {
    //     chart.transform('line');
    // }, 8000);
}



export function getData_Checkin(){
      $("#loading1").show();
      $.ajax({
      url: '/getCheckinData',
      dataType: 'json',
      success: function( resp ) {
        console.log(resp);
        globalData = resp.data;
        renderChart_checkin(resp.data);
        $("#loading1").hide();
      },
      error: function( req, status, err ) {
        console.log( 'something went wrong', status, err );
        $("#loading1").hide();
      }
    });
}
