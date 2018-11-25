function CreateCheckBoxList(checkboxlistItems) {
  var table = $('<table style="margin-left: 100px"></table>');
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

        $('#result').text(String(JSON.parse(res)["result"]));
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
