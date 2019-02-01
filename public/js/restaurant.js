// Display Waiting Tables
const displayWaiting = (dbData) =>{
  for(let i=0 ; i < dbData.length; i++){
    $card = getCard('W', i, dbData[i]);
    $("#waiting").append($card);
  }
};

// Display Tables Served
const displayTables = (dbData) =>{
  for(let i=0 ; i < dbData.length; i++){
    $card = getCard('T',i,dbData[i]);
    $("#tables").append($card);
  }
};

// Makes a card for display
const getCard = (mode, num, dbData) => {
  $card = $("<div class='card'>");
  $card.attr("id","C"+dbData.id)
  $cardHeader = $("<div class='card-header'>");
  $cardHeader.attr("id",dbData.id);

  $cardBody = $("<div class='card-body'>");

  
  if(mode === 'W'){
    $cardHeader.html(`Waiting : ${num+1}`);
    $cardBody.append(`
    Name : ${dbData.name},
    Email: ${dbData.email},
    Phone: ${dbData.phone}
  `);
  }else{
    $cardHeader.html(`Table : ${num+1}  <span align='right'><i class="fa fa-check-double"></i><span>`);
    $cardBody.append(`
     ${dbData.name}
  `);
  }
  
  $card.append($cardHeader,$cardBody);
   
  return $card;
 }

// On Start
// API call to get tables waited
  $.ajax({
    url: "/api/tables/",
    method: "GET"
  }).then(function (data) {
      if (data) {
            $("#message").hide();
          displayTables(data);
          $("#tables").show();
        }
    else {
      $("#message").text("Oops ! ");
      $("#tables").hide();
          $("#message").show();
    }
  });

  // API call to get tables waiting
  $.ajax({
    url: "/api/waitlist/",
    method: "GET"
  }).then(function (data) {
      if (data) {
            $("#message").hide();
          displayWaiting(data);
          $("#waiting").show();
        }
    else {
      $("#message").text("Oops ! ");
      $("#waiting").hide();
          $("#message").show();
    }
  });


  
// // Get reservation details and post
$("#reservation").on("click",function(){
  event.preventDefault();
      var newTable = {
        name: $("#name").val().trim(),
        email: $("#email").val().trim(),
        phone: $("#phone").val().trim()        
      };
      console.log("POST DATA");
      // Save Data
      $.ajax({
        url: "/api/reserve",
        method: "POST",
        data: newTable
      })
        .then(function (data) {
          alert("Table Reserved!");
          $("input").clear();
        });
});  

//Click on card
$(document).on("click",".fa-check-double",function(){
  let tableId= $(this).closest("div").attr("id");
  /*var newTable = {
    name: $("#name").val().trim(),
    email: $("#email").val().trim(),
    phone: $("#phone").val().trim()        
  };*/
  console.log("CLEAR TABLE : " + tableId);
  // Delete Table
  $.ajax({
    url: "/api/delete",
    method: "POST",
    data: {tableId}
  })
    .then(function (data) {
      alert("Table Cleared!" + tableId);
      $("#C"+tableId).remove();
    });
});

$(document).ready("on",function(){
  
});