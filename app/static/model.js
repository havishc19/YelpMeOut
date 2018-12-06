function CreateCheckBoxList(checkboxlistItems) {
  var table = $('<table class="predict_table"></table>');
  var counter = 0;
  $(checkboxlistItems).each(function () {
      table.append($('<tr></tr>').append($('<td style="width: 140px"></td>').append($('<input>').attr({
          type: 'checkbox', name: 'chklistitem', value: this[0].valueOf(), id: 'chklistitem' + counter, 'class': 'chkListItem'
      })).append(
      $('<label style="padding-left: 5px">').attr({
          for: 'chklistitem' + counter++,
          'class': 'state'
      }).text(this[0].valueOf()))).append($('<td style="width: 140px"></td>').append($('<input>').attr({
          type: 'checkbox', name: 'chklistitem', value: this[1].valueOf(), id: 'chklistitem' + counter, 'class': 'chkListItem'
      })).append(
      $('<label style="padding-left: 5px">').attr({
          for: 'chklistitem' + counter++,
          'class': 'state'
      }).text(this[1].valueOf()))).append($('<td style="width: 140px"></td>').append($('<input>').attr({
          type: 'checkbox', name: 'chklistitem', value: this[2].valueOf(), id: 'chklistitem' + counter, 'class': 'chkListItem'
      })).append(
      $('<label style="padding-left: 5px">').attr({
          for: 'chklistitem' + counter++,
          'class': 'state'
      }).text(this[2].valueOf())))
    );
  });

  $('#dvCheckBoxListControl').append(table);
}

  function GetSelectedCheckBoxes() {
    var allVals = [];
    $('.chkListItem:checked').each(function () {
        allVals.push(this.value);
    });
    var dataaa = {"data":allVals}
    $.ajax({
      type:"POST",
      url:"/getRating",
      data: JSON.stringify(dataaa),
      contentType: 'application/json',
      success: function(res) {
        chart.load({
            columns: [['Rating', parseFloat(JSON.parse(res)["result"]) ]]
        });
        // $('#result').text(String(JSON.parse(res)["result"]));
    }.bind(this),
    error: function(xhr, status, err) {
        console.error(xhr, status, err.toString());
    }.bind(this)
    });
  }

  $(document).ready(function() {
    $("#mybtn").click(function(){
        GetSelectedCheckBoxes();
    });
  });

 function autorun()
 {
  CreateCheckBoxList([['Wifi', 'Food', 'Service'],
   ['Timely', 'Price', 'Parking'],
   ['Valet', 'Cuisine', 'Ambience'],
   ['Night', 'Alcohol', 'Dessert'],
   ['Atmosphere', 'Staff', 'Hygiene'],
   ['Delivery', 'Seating', 'Spacious'],
   ['Lighting', 'Rooftop', 'Music'],
   ['Reservation', 'Birthday', 'Smoking'],
   ['Bar', 'Outdoor', 'Brewery'],
   ['Pet-friendly', 'Dance', 'Vegan-friendly']]);
 }

 if (document.addEventListener) document.addEventListener("DOMContentLoaded", autorun, false);
 else if (document.attachEvent) document.attachEvent("onreadystatechange", autorun);
 else window.onload = autorun;

var chart = c3.generate({
    bindto: '#gauge',
    data: {
        columns: [
            ['Rating', 0]
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

// setTimeout(function () {
//     chart.load({
//         columns: [['Rating', 0.9]]
//     });
// }, 1000);

// setTimeout(function () {
//     chart.load({
//         columns: [['Rating', 1.4]]
//     });
// }, 2000);

// setTimeout(function () {
//     chart.load({
//         columns: [['Rating', 5]]
//     });
// }, 3000);

// setTimeout(function () {
//     chart.load({
//         columns: [['Rating', 4.3]]
//     });
// }, 4000);

// setTimeout(function () {
//     chart.load({
//         columns: [['Rating', 3.3]]
//     });
// }, 5000);


// setTimeout(function () {
//     chart.load({
//         columns: [['Rating', 0.9]]
//     });
// }, 1000);

