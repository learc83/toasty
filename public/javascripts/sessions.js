function isTmaxLocal() {
};

function activateBed(form) {
  var form = form;
  var url = $activate_url;
	var bed = $("#tan_session_bed_id").val();
	var minutes = $("#tan_session_minutes").val();
	var delay = $("#tan_session_delay").val();
	$.ajax({
	  url: url + bed + "/" + minutes + "/" + delay,
	  success: function() {
	    //alert('bed ' + bed + ' activated');
	    //getTimeStatus(6);
	  },
	  error: function(xhr, ajaxOptions, thrownError){
	    alert('bed not activated--' + thrownError );
	  }
	});
	if (delay == "0") {
	  $("#_" + bed).removeClass().addClass("_3");
	}
	else {
	  $("#_" + bed).removeClass().addClass("_1");
	}
	//$("#_" + bed + " .level_and_status").html("Delay");
	var l = $("#_" + bed);
  //var a = $("#_" + bed + " a");
  var s1 = $("#_" + bed + " a .bed_loading")
  var s2 = $("#_" + bed + " a .countdown")
  var s3 = $("#_" + bed + " a .level_and_status")
  l.attr("data-bed-loading", "1");
  s2.hide();
  s3.hide();
  s1.show();
  window.setTimeout(function(){
    l.attr("data-bed-loading", "0");
    s1.hide();
    s2.show();
    s3.show();
  }, 2500);
  //$("#_" + bed + " a").delay(1000).removeClass();
	$("#bed_activated p").html("Bed " + bed + " Activated");
	$("#bed_activated").fadeIn().delay(300).fadeOut('slow');
};

function resetBed() {
  var url = $reset_url;
  var bed = $("#tan_session_bed_id").val();
  $.ajax({
    url: url + bed,
    success: function(data) {
			//alert("bed reset");
    },
    error: function(xhr, ajaxOptions, throwError){
      alert('bed not reset--' + thrownError );
    }
  });
  
  var l = $("#_" + bed)
  var seconds = $("#_" + bed + " .countdown").attr("data-time-seconds");
  var a = $("#_" + bed + " a");
  var s1 = $("#_" + bed + " a .bed_loading")
  var s2 = $("#_" + bed + " a .countdown")
  var s3 = $("#_" + bed + " a .level_and_status")
  
  if (l.hasClass("_4")) {
	  if (seconds == 0) { 
	    l.removeClass().addClass("_0");
	  }
	  else {
	    l.removeClass().addClass("_5")
	  };
	}
	else if (l.hasClass("_1")) {
	  l.removeClass().addClass("_0");
	};
  
  l.attr("data-bed-loading", "1");
  s2.hide();
  s3.hide();
  s1.show();
  window.setTimeout(function(){
    l.attr("data-bed-loading", "0");
    s1.hide();
    s2.show();
    s3.show();
  }, 2500);
	$("#bed_activated p").html("Bed " + bed + " Reset");
	$("#bed_activated").fadeIn().delay(300).fadeOut('slow');
};

function getTimeStatus(beds) {
	var url = $status_url;
	$.ajax({
	  url: url + beds,
	  dataType: 'json',
	  success: function(json) {
	    applyTimeStatus(json);
	  },
	  error: function(xhr, ajaxOptions, thrownError){
	    alert('status and times error--' + thrownError);
	  }
	});
};

function applyTimeStatus(json) {
  $.each(json, function(i, val) {
    var l = $("#_" + val.number)
    var countdown_span = $("#_" + val.number + " .countdown");
    var status_span = $("#_" + val.number + " .level_and_status");
    
    if (l.attr("data-bed-loading") == "0") {
      l.removeClass().addClass("_" + val.status);
    };
    
    if (val.status == 1) {
      status_span.html("Delay");
    }
    else if (val.status == 5) {
      status_span.html("Cooling");
    }
    else if (val.status == 3) {
      status_span.html("Running");
    }
    else {
      status_span.html("Level " +status_span.attr("data-bed-level")); 
    };
    
    if (val.time) {
      countdown_span.html(minutes(val.time)).attr("data-time-seconds", (val.time));
    }
    else {
      countdown_span.attr("data-time-seconds", 0).html("");
    };
  });
};

function minutes(seconds) {
  var minutes = Math.floor(seconds/60);
  var seconds = seconds % 60;
  seconds = ( seconds < 10 ? "0" : "" ) + seconds
  return minutes + ":" + seconds;
};

function ticker() {
  //$("#dash_buttons .countdown").html(minutes($("#dash_buttons .countdown").attr("data-time-seconds") - 1))
  $("#dash_buttons .countdown").each(function(i, val) {
    var seconds = $(val).attr("data-time-seconds");
    if (seconds > 0) {
      $(val).html(minutes(seconds -1)).attr("data-time-seconds", seconds -1);
    };
  });
};

function selectBed(a) {
	var num = a.attr("data-bed");
	var max = a.attr("data-maxtime");
	$("#dash_buttons a").removeClass("bed_active");
	a.addClass("bed_active");
	$("#dash_start h2 span").html(num);
	$("#tan_session_bed_id").val(num);
	$time_box.attr("data-maxtime", max)
	if(+$time_box.val() > max ) {
		$time_box.val(max)
	};
	return false;
};

var search_timeout = undefined;

function customerJSONSearch() {
  if(search_timeout != undefined) {
    clearTimeout(search_timeout);
  };
  
  search_timeout = setTimeout(function() {
    search_timeout = undefined;
    
    var form = $("#customer_json_search_form");
    var url = form.attr("action");  
    var formData = form.serialize();
    
    $.ajax({
      type: 'POST',
      url: url,
      data: formData,
  	  dataType: 'json',
  	  success: function(json) {
  	    $number_of_customers = json.length;
  	    applyCustomerJSONSearch(json);
  	  },
  	  error: function(xhr, ajaxOptions, thrownError){
  	    //alert('status and times error--' + thrownError);
  	    $number_of_customers = 0;
  	    $("#customer_dropdown").html('');
  	  }
  	});
  }, 250);
};

function applyCustomerJSONSearch(json) {
  var customers_list = [];
  
  $.each(json, function(i, val) { 
    cust = val.customer
    customers_list.push('<li>' + cust.first_name + ' ' + cust.last_name + '</li>')
  });
  
  $("#customer_dropdown").html(customers_list.join('')).show();
  $("#customer_dropdown li:first-child").addClass('active');
};

$(document).ready(function() {
  $ip = $('meta[name=tmax-ip]').attr('content');
  $number_of_beds = $('meta[name=number-of-beds]').attr('content');
  $activate_url = "http://" + $ip + ":4567/1/";
  $status_url = "http://" + $ip + ":4568/";
  $reset_url = "http://" + $ip + ":4567/2/"
  
  $index = $("#tan_session_minutes");
  $time_box = $("#tan_session_minutes");
  $search_box = $("#dash_search_box")
  $number_of_customers = 0
  
  $("#dash_search_box").bind("keyup", function(e) {
    key = e.which
    if (!(key == 37 || key == 38 || key == 39 || key == 40)) {
      customerJSONSearch();
    };
  });
  
  $("#customer_dropdown li").live('click', function() {
    $("#customer_dropdown li").removeClass('active');
    $(this).addClass('active');
    $search_box.focus();
  });
  
  $("#customer_dropdown li").live('mouseover', function() {
    $("#customer_dropdown li").removeClass('active');
    $(this).addClass('active');
  });
  
  $($search_box).bind("keydown", function(e) {
    if(e.which == 40) {
      $("#customer_dropdown li.active").removeClass('active').next().addClass('active');
      return false;
    }
    else if (e.which == 38) {
      $("#customer_dropdown li.active").removeClass('active').prev().addClass('active');
      return false;
    };
    //$search_box.focus();
  });
  
  //$("body").click(function() {
    //return false;
  //});
  
  //$("body").mousedown(function() {
    //return false;
  //});
  
  //$(document)[0].oncontextmenu = function() {return false;}
  
  $("#dash_up_arrow").mousehold(function(){
    $max = $index.attr("data-maxtime")
    if(+$index.val() < $max) {
  		$index.val(+$index.val()+1 );
  	}
  });

  $("#dash_down_arrow").mousehold(function(){
  	if(+$index.val() > 2) {
  		$index.val( +$index.val()-1 );
  	}
  });
  
  $("#start_admin").click(function() {
    activateBed($(this));
    return false;
  });
  
  $("#new_tan_session").submit(function() {
    activateBed($(this));
    return false;
  });
  
  var hidden = true
  
	$("#dash_buttons a").mousedown(function() {
	  selectBed($(this));
	  if(hidden) {
	    $("#please").hide(300, function() {
	      $("#dash_controls_wrapper").show();
	    });
	    hidden = false
	  };
	});
	
	$("#dash_buttons a").click(function() {
	  return false;
	});
	
	$("#reset").click(function() {
	  resetBed();
	  return false;
	});
	
	//getTimeStatus($number_of_beds);
	
	//window.setInterval(function() {
	  //getTimeStatus($number_of_beds);
  //}, 1000);
	
	//window.setInterval(function() {
	  //getTimeStatus(14);
	  //ticker();
  //}, 1025);
});
