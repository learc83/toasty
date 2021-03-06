$.ajaxSetup({
  timeout: 1000,
});

function activateBedAfterReset() {
	//alert("activateBedAfterReset");
	var url = $activate_url;
	var bed = $("#tan_session_bed").val();
	var minutes = $("#tan_session_minutes").val();
	//make a global minutes variable to hang around for later in createSession
	window.gMinutes = $("#tan_session_minutes").val();
	var a = $("#_" + bed + " a")
	
	$.ajax({
	  url: url + bed + "/" + minutes + "/" + $delay,
	  success: function() {
	    //createSession();
	    window.clearTimeout($idleTimer);
	    var createSessionTimer = window.setTimeout(checkStatusThenCreateSesion, 3000);
  	  $("#post_active").html("Bed " + bed + " Will Activate <br /> in 5 Minutes");
  	  $("#dash_controls_wrapper").hide(0, function() {
  	    $("#post_active").fadeIn(1000);
  	  });
  	  $("#dash_buttons a").unbind("mousedown");

    	$("#_" + bed).removeClass().addClass("red");
      $("#_" + bed).attr("data-bed-loading", "1");
    	$("#bed_activated p").html("Bed " + bed + " Activated");
    	$("#bed_activated").fadeIn().delay(300).fadeOut('slow');
	  },
	  error: function(xhr, textStatus){
	    var now = new Date();
	    try {
        var status = xhr.status;
      }
      catch (err) {
        var status = "";
      };
    	localStorage.setItem(now, 'activate url ' + textStatus + ' ' + status + ' ' + bed);

	    $sent = false
	    //alert("bed did not activate--please try again");
      //window.location.reload();
      //this next part is designed to try again to activate bed to overcome network issues
      $.ajax({
    	  url: url + bed + "/" + minutes + "/" + $delay,
    	  success: function() {
    	    var now = new Date();
    	    localStorage.setItem(now, 'double worked from activateBed');
					window.clearTimeout($idleTimer);
					var createSessionTimer = window.setTimeout(checkStatusThenCreateSesion, 3000);
    	  },
    	  error: function(xhr, textStatus){
    	    var now = new Date();
    	    localStorage.setItem(now, 'double did not worked from activateBed');
    	  }
    	});
      window.location = $form.attr("data-login-url");
	  }
	});
}

function activateBed() {
  var url = $activate_url;
	var bed = $("#tan_session_bed").val();
	var minutes = $("#tan_session_minutes").val();
	//make a global minutes variable to hang around for later in createSession
	window.gMinutes = $("#tan_session_minutes").val();
	var a = $("#_" + bed + " a")
	if ( a.attr("data-bed-status") == "4" ) {
	  resetBed();
		window.clearTimeout($idleTimer);
    //var activateBedTimer = window.setTimeout(activateBedAfterReset(), 5000);
		setTimeout(function(){
			activateBedAfterReset();
		}, 1000);
	}
	else {
  	$.ajax({
		  url: url + bed + "/" + minutes + "/" + $delay,
		  success: function() {
		    //createSession();
		    window.clearTimeout($idleTimer);
		    var createSessionTimer = window.setTimeout(checkStatusThenCreateSesion, 3000);
	  	  $("#post_active").html("Bed " + bed + " Will Activate <br /> in 5 Minutes");
	  	  $("#dash_controls_wrapper").hide(0, function() {
	  	    $("#post_active").fadeIn(1000);
	  	  });
	  	  $("#dash_buttons a").unbind("mousedown");

	    	$("#_" + bed).removeClass().addClass("red");
	      $("#_" + bed).attr("data-bed-loading", "1");
	    	$("#bed_activated p").html("Bed " + bed + " Activated");
	    	$("#bed_activated").fadeIn().delay(300).fadeOut('slow');
		  },
		  error: function(xhr, textStatus){
		    var now = new Date();
		    try {
	        var status = xhr.status;
	      }
	      catch (err) {
	        var status = "";
	      };
	    	localStorage.setItem(now, 'activate url ' + textStatus + ' ' + status + ' ' + bed);

		    $sent = false
		    //alert("bed did not activate--please try again");
	      //window.location.reload();
	      //this next part is designed to try again to activate bed to overcome network issues
	      $.ajax({
	    	  url: url + bed + "/" + minutes + "/" + $delay,
	    	  success: function() {
	    	    var now = new Date();
	    	    localStorage.setItem(now, 'double worked from activateBed');
	    	  },
	    	  error: function(xhr, textStatus){
	    	    var now = new Date();
	    	    localStorage.setItem(now, 'double did not worked from activateBed');
	    	  }
	    	});
	      window.location = $form.attr("data-login-url");
		  }
		});
	};
};

function resetBed() {
  bed = $("#tan_session_bed").val();
  url = $reset_url + bed;
  //$.get(url);
  $.ajax({
    url: url,
		success: function() {
			//activateBedAfterReset();
		},
    error: function(xhr, textStatus){
      var now = new Date();
	    try {
        var status = xhr.status;
      }
      catch (err) {
        var status = "";
      };
    	localStorage.setItem(now, 'reset url ' + textStatus + ' ' + status + ' ' + bed);
			$.ajax({
		    url: url,
				success: function() {
					//activateBedAfterReset();
				},
		    error: function(xhr, textStatus){
		      var now = new Date();
			    try {
		        var status = xhr.status;
		      }
		      catch (err) {
		        var status = "";
		      };
		    	localStorage.setItem(now, 'reset url ' + textStatus + ' ' + status + ' ' + bed);
		    }
		  });
    }
  });
  //alert("Please clean the bed before you tan");
};

function checkStatusThenCreateSesion() {
  //window.clearTimeout(createSessionTimer);
  getTimeStatus($number_of_beds, function() {
    createSession();
  });
};

function createSession() {
  var bed = $("#tan_session_bed").val();
  var url = $form.attr("action");
  var data = $form.serialize();
  var status = $("#_" + bed + " a").attr("data-bed-status");
  if (status == 1 || status == 2 || status == 3) {
    $.ajax({
      type: 'POST',
      url: url,
      data: data,
      timeout: 3000,
      error: function(xhr, textStatus){
  	    var now = new Date();
  	    try {
          var status = xhr.status;
        }
        catch (err) {
          var status = "";
        };
      	localStorage.setItem(now, 'createSession url ' + textStatus + ' ' + status + ' ' + bed);
  	  },
      complete: function() {
        window.location = $form.attr("data-login-url");
      }
    });
  }
  else {
    //window.clearTimeout(idleTimer);
    var now = new Date();
    localStorage.setItem(now, 'checkStatusThenCreateSession failed '+ bed);
    //alert("bed did not activate--please try again");
    //window.location.reload();
    //this next part is designed to try again to activate bed to overcome network issues
    $.ajax({
  	  url: $activate_url + bed + "/" + window.gMinutes + "/" + $delay,
  	  success: function() {
  	    var now = new Date();
  	    localStorage.setItem(now, 'double worked from createSession');
  	  },
  	  error: function(xhr, textStatus){
  	    var now = new Date();
  	    localStorage.setItem(now, 'double did not worked from createSession');
  	  }
  	});
    window.location = $form.attr("data-login-url");
  };
};

function getTimeStatus(beds, f) {
	var url = $status_url;
	$.ajax({
	  url: url + beds,
	  dataType: 'json',
	  success: function(json) {
	    applyTimeStatus(json);
	    if (typeof f == "function") f();
	  },
	  error: function(xhr, textStatus){
	    var now = new Date();
	    try {
        var status = xhr.status;
      }
      catch (err) {
        var status = "";
      };
    	localStorage.setItem(now, 'timeStatus url ' + textStatus + ' ' + status);
    	
	    //alert('status and times error-- ' + textStatus);
	    //window.location = $form.attr("data-login-url");
	  }
	});
};

function applyTimeStatus(json) {
  $.each(json, function(i, val) {
    var bedli = $("#_" + val.number);
    var bed = bedli.children("a");
    var disabled = bed.attr("data-bed-disabled");
    if (!disabled) {
      bed.attr("data-bed-status", val.status);
      if (val.status == "0") {
        bedli.removeClass().addClass("green");
      }
      else if (val.status == "4" && bed.attr("data-session-over") == "true" && !val.time) {
        bedli.removeClass().addClass("green");
      }
      else {
        bedli.removeClass().addClass("red");
      };
    };
  });
};

function disableBeds() {
  $("#dash_buttons li a").each(function() {
    var bed = $(this)
    var bl = bed.attr("data-bed-level");
    if ($cl < bl) {
      bed.attr("data-bed-disabled", "disabled");
    }
  });
};

function selectBed(a) {
	par = a.parent();
	if (par.hasClass("green")) {
	  var num = a.attr("data-bed");
  	var max = a.attr("data-maxtime");
  	var level = a.attr("data-bed-level")
  	
  	$("#dash_buttons a").removeClass("bed_active");
  	a.addClass("bed_active");
  	$("#dash_start h2 span").html(num);
  	$("#tan_session_bed").val(num);
  	$time_box.attr("data-maxtime", max);
  	$("#max_time").html("Max Time " + max + " Minutes");
  	$("#bed_level").html("Level " + level + " Bed")
  	if(+$time_box.val() > max ) {
  		$time_box.val(max);
  	};
  	if($hidden) {
	    $("#please").hide(300, function() {
	      $("#dash_controls_wrapper").show();
	    });
	    $hidden = false
	  };
  };
	return false;
};

function doTimeout() {
  window.location = $form.attr("data-login-url");
};

$(document).ready(function() {
  $ip = $('meta[name=tmax-ip]').attr('content');
  $number_of_beds = $('meta[name=number-of-beds]').attr('content');
  $activate_url = "http://" + $ip + ":4567/1/";
  $status_url = "http://" + $ip + ":4568/";
  $reset_url = "http://" + $ip + ":4567/2/";
  $delay = 5;
  $form = $("#new_tan_session")
  $index = $("#tan_session_minutes");
  $time_box = $("#tan_session_minutes");
  $cl = $("#bottom_level").attr("data-customer-level")
  $sent = false;
  $hidden = true;
  
  disableBeds();
	
	getTimeStatus($number_of_beds);
	
	$idleTimer = window.setTimeout(doTimeout, 30000);
  
  $("body").click(function() {
    return false;
  });
  
  $("body").mousedown(function() {
    window.clearTimeout($idleTimer);
    $idleTimer = window.setTimeout(doTimeout, 30000);
    return false;
  });
  
  //$(document)[0].oncontextmenu = function() {return false;}
  
  $("#dash_up_arrow").mousehold(function(){
    max = $index.attr("data-maxtime")
    if(+$index.val() < max) {
  		$index.val(+$index.val()+1 );
  	}
  	return false;
  });

  $("#dash_down_arrow").mousehold(function(){
  	if(+$index.val() > 2) {
  		$index.val( +$index.val()-1 );
  	}
  });
  
  $("#new_tan_session").submit(function() {
    return false;
  });
  
	$("#dash_buttons a").mousedown(function() {
	  selectBed($(this));
	});
  
  var depressed = false
  
	$('#start_button').mousedown(function(){ 
	  if (!$sent && !depressed) {
	    $(this).addClass("start_active");
	    depressed = true
    }
	});
	
	$('#start_button').mouseout(function(){ 
	  $(this).removeClass("start_active");
	  depressed = false
	});
	
	$('#start_button').mouseup(function(){
	  if (depressed && !$sent) {
	    $sent = true
	    depressed = false
	    $(this).removeClass("start_active");
	    activateBed();
	    return false;
    };
	});
});