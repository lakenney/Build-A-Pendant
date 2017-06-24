
/*-------------------------------------------------------------------------------------------------
 * Build A Pendant
 *
 * Created by Lucille Kenney
 * These are the techniques I covered:
 *  ◦ DOM traversal
 *  ◦ DOM element creation, deletion or modification
 *  ◦ AJAX
 *  ◦ Creating and handling a data structure (JSON, custom objects, etc)
 *
 * This file should be viewed with a server for the AJAX JSON request to get the price of silver.
 * The chains select feature was added but will need further development.
 * Some of these functions were borrowed from a previous project I had created a while back but 
 * that had nothing to do with the DOM, DOM traversal, JSON or AJAX :)

-------------------------------------------------------------------------------------------------*/ 

// Set document ready
$(document).ready(function() {
var pendants = [ ];
loadData(pendants);
//console.log(pendants);

/*-------------------------------------------------------------------------------------------------
 * AJAX JSON REQUEST CALL TO https://www.quandl.com/resources/api-for-commodity-data, 
 * https://www.quandl.com/resources/api-for-commodity-data
-------------------------------------------------------------------------------------------------*/

var day = document.getElementById("date");
var usd = document.getElementById("usd");
var gdp = document.getElementById("gbp");
var euro = document.getElementById("euro");

//  Create the XHR, intitalize the connection with open()) 
//  and send the request  ... https://www.quandl.com/resources/api-for-commodity-data
var xhr = new XMLHttpRequest();

//SILVER, https://www.quandl.com/data/LBMA/SILVER-Silver-Price-London-Fixing
xhr.open("GET", "https://www.quandl.com/api/v1/datasets/LBMA/SILVER.json?auth_token=dCkdMBF2jDN6_XfYnkZe&rows=1"); 

xhr.send();


//  Add a listener function to respond to the HTTP response
xhr.addEventListener("readystatechange", function(){
//  Check here for new state and HTTP response code
//   and write the response to the DIV
    if(this.readyState == 4 && this.status == 200){
         //el.innerHTML = this.response;   
         var o = JSON.parse(this.response);
         //alert(this.response);
            var d = o.data[0][0];
            var u = o.data[0][1];
            var g = o.data[0][2];
            var e = o.data[0][3];

            if (d) {
                $(date).html(d);
            }
            if (usd) {
                $(usd).html(u);
            }
            if (gbp) {
                $(gbp).html(g);
            }
            if (euro) {
                $(euro).html(e);
            }

//"column_names":["Date","USD","GBP","EURO"]
//"data":[["2015-04-30",16.52,10.7099,14.7579
    }
});

  /*-------------------------------------------------------------------------------------------------
  Pendant globals and default setup
  -------------------------------------------------------------------------------------------------*/
  // Global variables
  var maxMessageLength = 16;
  var fontsize = 12;
  var how_many_left = 16;

  // Default setup
  changeMaxLength($('[name|=shapes]:checked').val(),$('[name|=size]:checked').val()), fontsize;
  /*-------------------------------------------------------------------------------------------------
  Pick a shape, metal and size
  -------------------------------------------------------------------------------------------------*/
  $('input:radio').change(function () {

    var c = document.getElementById("controls");
    var els = document.getElementsByTagName("input");
    var pen = new Array();
    //console.log(els);
    //console.log('This is the first input element: ' + els[0].value);

    for (var i = 0; i < els.length; i++) {    
        if (els[i].type == "radio" && els[i].checked == true) { 
          pen.push(els[i].value);
        }

      /*//var $this = $(this);
      var shapes =  $('[name|=shapes]:checked').val();
      var size =  $('[name|=size]:checked').val();
      var metals =  $('[name|=metals]:checked').val();
      //console.log('radio clicked');*/
    
    }

    // var imageURL = "images/" + shapes + "-" + size + "-" + metals + ".png";
    var imageURL = "images/" + pen[0] + "-" + pen[1] + "-" + pen[2] + ".png";
    //console.log(imageURL);

    // Place the concatenated image string into image src
    var newImage = "<img src='" + imageURL + "'></img";
    $('#pendant_c').html(newImage);
    console.log(newImage);

    // Call the pendent cost (shapes,size,metals) returned from round penny functon when a pendant change is made  
    //printCost(shapes,size,metals);
    printCost(pen[0],pen[1],pen[2]);
    console.log("I've changed");
    //console.log('[name|=shapes]:checked')

    // Call to change character maximum when a new shape and/or size is clicked
    changeMaxLength($('[name|=shapes]:checked').val(),$('[name|=size]:checked').val());

    // Pass selected pendant values to id on paypal form .val(shapes + ' ' + size + ' ' + metals);
    $('#paypalShapeSizeMetal').val(pen[0] + ' ' + pen[1] + ' ' + pen[2]);

   });

  /*-------------------------------------------------------------------------------------------------
  Pendant array loads pendant data with costs from pendant.js according to shape, size and metal 
  -------------------------------------------------------------------------------------------------*/
  function printCost(shape,size,metal) {
    var pendantCost = "";

    var len = pendants.length;
    for (var i = 0; i < len; i++) {
        if (pendants[i].shape == shape) {
            if (pendants[i].metal == metal) {
                if (pendants[i].size == size) {
                    pendantCost = (pendants[i].price);
                }
            }
        }
    }

    // Call the round penny function
    pendantCost = roundPenny(pendantCost);

    // Print the cost of the pendant
    $('#output').html(pendantCost);

    // Pass selected pendant cost value to id on paypal form
    $('#paypalPrice').val(pendantCost);

  }

  /*-------------------------------------------------------------------------------------------------
  Round pendant cost to the penny
  -------------------------------------------------------------------------------------------------*/ 
  function roundPenny(pendantCost){

    // Var holds pendant cost with trailing numbers
    var original = pendantCost;

    // round 'original' to two decimals
    result = Math.round(original*100)/100;

    // Return to printCost
    return result;
  }

  /*-------------------------------------------------------------------------------------------------
  changeMaxLength to be called from functions that 
  react to the pendant size changing, and the font size changing
  -------------------------------------------------------------------------------------------------*/
  function changeMaxLength(shape, size) {
  //var maxMessageLength = 16;

    // Assign a new message length when the pendant shape and the font size changes.
    // nested if statements that look at both the current pendant size and shape, and the 
    // current font size, and set maxMessageLength appropriately
    // call that function that sets the max length in two cases -- 
    //  1) if the font size is changed (in the Font Chooser) ... This one works!
    //  2) And when the pendant size changes -- input radio ... This is buggy!!!

    if(shape == "circle") {
      if (size == "sm") {
        // Max amount of 12pt characters that fit in the small circle
        if (fontsize == "12") {
          maxMessageLength = 2;
          $("#message").attr("maxlength","2");
          // Save new message
        }
        // Max amount of 24pt characters that fit in the small circle
        else if (fontsize == "24") {
          maxMessageLength = 1;
          $("#message").attr("maxlength","1");
        }
      } 

      else if (size == "md") {
        // Max amount of 12pt characters that fit in the medium circle
        if (fontsize == "12") {
          maxMessageLength = 3;
          $("#message").attr("maxlength","3");
        } 
        // Max amount of 24pt characters that fit in the medium circle
        else if (fontsize == "24") {
          maxMessageLength = 2;
          $("#message").attr("maxlength","2");
        }
      } 

      else if (size == "lg") {
        // Max amount of 12pt characters that fit in the large circle
        if (fontsize == "12") {
          maxMessageLength = 5;
          $("#message").attr("maxlength","5");
        }
        // Max amount of 24pt characters that fit in the large circle
        else if (fontsize == "24") {
          maxMessageLength = 3;
          $("#message").attr("maxlength","3");
        }
      }
    } 

    else if (shape == "square") {
      if (size == "sm") {
        // Max amount of 12pt characters that fit in the small square
        if (fontsize == "12") {
          maxMessageLength = 2;
          $("#message").attr("maxlength","2");
        } 
        // Max amount of 24pt characters that fit in the small square
        else if (fontsize == "24") {
          maxMessageLength = 1;
          $("#message").attr("maxlength","1");
        }
      } 

      else if (size == "md") {
        // Max amount of 12pt characters that fit in the medium square
        if (fontsize == "12") {
          maxMessageLength = 4;
          $("#message").attr("maxlength","4");
        } 
        // Max amount of 24pt characters that fit in the medium square
        else if (fontsize == "24") {
          maxMessageLength = 2;
          $("#message").attr("maxlength","2");
        }
      } 

      else if (size == "lg") {
        // Max amount of 12pt characters that fit in the large square
        if (fontsize == "12") {
          maxMessageLength = 5;
          $("#message").attr("maxlength","5");
        } 
        // Max amount of 24pt characters that fit in the large square
        else if (fontsize == "24") {
          maxMessageLength = 3;
          $("#message").attr("maxlength","3");
        }
      }
    } 

    else if (shape == "heart") {
      if (size == "sm") {
        // Max amount of 12pt characters that fit in the small heart
        if (fontsize == "12") {
          maxMessageLength = 2;
          $("#message").attr("maxlength","2");
        } 
        // Max amount of 24pt characters that fit in the small heart
        else if (fontsize == "24") {
          maxMessageLength = 1;
          $("#message").attr("maxlength","1");
        }
      } 

      else if (size == "md") {
        // Max amount of 12pt characters that fit in the medium heart
        if (fontsize == "12") {
          maxMessageLength = 3;
          $("#message").attr("maxlength","3");
        }
        // Max amount of 24pt characters that fit in the medium heart
        else if (fontsize == "24") {
          maxMessageLength = 1;
          $("#message").attr("maxlength","1");
        }
      } 

      else if (size == "lg") {
        // Max amount of 12pt characters that fit in the large heart
        if (fontsize == "12") {
          maxMessageLength = 5;
          $("#message").attr("maxlength","5");
        }
        // Max amount of 24pt characters that fit in the large heart
        else if (fontsize == "24") {
          maxMessageLength = 2;
          $("#message").attr("maxlength","2");
        }
      }
    } 

      // Get what's in textbox compare char length with max message and strip the difference
      newMessage = $('#message').val().substring(0, maxMessageLength);
      //console.log(newMessage);

      // Put new calculated message length into textbox and pendant
      $('#message').val(newMessage);

      // call calcMessage
      calcMessage();

          $('#message').attr("maxlength",maxMessageLength);
          $('#message-error').html("Max "+maxMessageLength.toString() +" characters");
    
  }

  /*-------------------------------------------------------------------------------------------------
  New Function
  -------------------------------------------------------------------------------------------------*/
  function calcMessage() {

    // Find out what is in the field
      var value = $('#message').val().toUpperCase();
      //console.log(value);

      // How many characters did the user type in
      how_many_characters = value.length;
      //console.log(how_many_characters);

      // Subtract the number of characters typed in from the max amount of char
      how_many_left = maxMessageLength - how_many_characters;

      // If number of characters is zero turn it red
      if(how_many_left == 0) {
        $('#message-error').css('color', 'red');
      }
      // If number of characters left is less than 2 turn it orange
      else if(how_many_left < 2){
        $('#message-error').css('color', 'orange');
      }
      else {
        $('#message-error').css('color', 'black');
      }

      // Concatenate message with how_many_left
      $('#message-error').html('You have ' + how_many_left + ' characters left');

    // Inject the message into the output div on the canvas
    $('#message-output').html(value);

    // Pass the message to paypal form
    //$('#paypalMessage').val(message-output.toString());
    //$('#paypalMessage').html(message-output);
    $('#paypalMessage').val(value);

  };

  /*-------------------------------------------------------------------------------------------------
  Message
  -------------------------------------------------------------------------------------------------*/
  // Created a function to determine message and message-error
  $('#message').keyup(function() {
    calcMessage();
    
  });

  /*-------------------------------------------------------------------------------------------------
  Font chooser
  -------------------------------------------------------------------------------------------------*/
  $("#fs").change(function() {
      //alert($(this).val());
      $('.changeMe').css("font-family", $(this).val());
  });

  $("#fontsize").change(function() {
      $('.changeMe').css("fontSize", $(this).val() + "px");
      fontsize = $(this).val();

    // Change maximum length message when a new font size is selected pass in shape and size
    changeMaxLength($('[name|=shapes]:checked').val(),$('[name|=size]:checked').val());
  
  });

/*-------------------------------------------------------------------------------------------------
SELECT A CHAIN AND LENGTH LISTS
-------------------------------------------------------------------------------------------------*/

  var sel1 = document.getElementById("firstSelect");
  var sel2 = document.getElementById("secondSelect");

  var selectList = {
    "chains": ["rice", "snake", "omega", "neoprene"]
  }
   
  var size = new Array()
  size["empty"] = ["Select a Length"]; 
  size["rice"] = ["18inch", "20inch", "22inch"]; 
  size["snake"] = ["16inch", "18inch", "20inch"]; 
  size["omega"] = ["16inch", "18inch"]; 
  size["neoprene"]= ["16inch", "18inch", "20inch"]; 
   
  for (var i = 0; i < selectList.chains.length; i++) {
    //create <option>
    var s = document.createElement("option");
    //create text node
    var t = document.createTextNode(selectList.chains[i]);
    // add text node to <option>
    s.appendChild(t);
    // set value="" on the <option>
    s.setAttribute("value", selectList.chains[i]);
    // add the new <option> to the <select>
    sel1.appendChild(s);
  }
  // This part will react to user selections on our drop-down list
  // and write to the page
  sel1.addEventListener("change", function(e) {
    //get the selected value from "chains"     
    var val = this.value;
    //console.log("This should be the value from Chains" + this.value);
    var s = document.createElement("option");           sel2.innerHTML = "";
      for (var i = 0; i < size[this.value].length; i++) {
      //console.log("value: " + this.value);      
      //create <option>
      var s = document.createElement("option");
      //create text node
      var t = document.createTextNode(size[this.value][i]);
      //console.log("This is the value from the second select: " + size[this.value][i]);
      // add text node to <option>
      s.appendChild(t);
      // set value="" on the <option>
      //Thank you Mike Hilborn for helping me fix this value!!!
      s.setAttribute("value", size[this.value][i]);
      console.log("This is the value from the second select: " + size[this.value][i]);
      // add the new <option> to the <select>
      sel2.appendChild(s);
    } 
  });

  /*-------------------------------------------------------------------------------------------------
  Start over
  -------------------------------------------------------------------------------------------------*/
  $('#refresh-btn').click(function() {
    //console.log("reset pressed");
    // Reset color and texture
    $('#canvas').css('background-color', 'white');
    $('#canvas').css('background-image', '');

    // Clear message and recipient divs
    $('#message-output').html("");
    //$('#total-output').html("");

    // Startover button clears text from pendant and left message output field
    $('.resetMe').val("");

    // reset color back to black
      $('#message-error').css('color', 'black');

    // reset characters back to 16 max
    $('#message-error').html('You have ' + how_many_left + ' characters left');

    // reset the variable back to max amount 16
      // Concatenate message with max
      $('#message-error').html('Max ' + maxMessageLength + ' characters');

    // Remove any shapes from preview
    $('#pendant').html("");

  });


  /*-------------------------------------------------------------------------------------------------
  Print
  -------------------------------------------------------------------------------------------------*/
  $('#print-btn').click(function() {
    
    // Goal: Open the canvas in a new tab
     
      // Take the existing right side on the page (in the #canvas div) and clone it for the new tab
      var canvas_clone = $('#canvas').clone();
          
      /* 
      Get the HTML code of the pendant-container element ... canvas.html() will get us the stuff *inside* the #canvas:
      
      <div id="pendant-container"></div>
      <div id="pendant-c"></div>
      
      Think of a sandwich. The above gets just the inside of the sandwich. But we need the bread too.
      
      I.e., this is what we want:
      <div id="canvas" style="background-image: url(images/... .png);">
        <div id="pendant-container"></div>
        <div id="pendant-c"></div>
      </div> 
      
      To accomplish this, use a new method .prop (short for property) and request the "outerHTML" property of the canvas.
      In JavaScript, "outerHTML" is both the bread and the meat of an element. (Don't let it confuse you, the name outerHTML 
      sounds kinda like it would just be the bread...it's not...it's the whole sammie).
      */
      var canvas = canvas_clone.prop('outerHTML'); // Give us the whole canvas
            
      // Now create a new tab
      // For the new tab, we need to construct all the pieces we need for any HTML page starting with a start <html> tag.
      var new_tab_contents  = '<html>';
      
      // (Note the += symbol is used to add content onto an existing variable ... adding onto our new_tab_contents variable one line at a time)
      new_tab_contents += '<head>';
      new_tab_contents += '<link rel="stylesheet" href="css/main.css" type="text/css">'; // Add CSS so the preview looks good in the new tab!
      new_tab_contents += '<link rel="stylesheet" href="css/features.css" type="text/css">';
      new_tab_contents += '</head>';
      new_tab_contents += '<body>'; 
      new_tab_contents += canvas; // Here's where pendant is added to HTML
      new_tab_contents += '</body></html>';
      
      // Opening the tab
      // Tell JavaScript to create a new tab (tabs are controlled by the "window" object).
      var new_tab =  window.open();

      // Within that tab, open access to the document to make changes
      new_tab.document.open();
      
      // Here's the change we'll make: write the preview (i.e., new_tab_contents) to the document of the tab
      new_tab.document.write(new_tab_contents);
      
      // Then close the tab. This isn't actually closing the tab, it's just closing JS's ability to talk to it.
      new_tab.document.close();
          
  });

});
