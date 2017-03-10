(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {appcan.window.close(1);});
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        $.scrollbox($("body")).on("releaseToReload",
        function() { //After Release or call reload function,we reset the bounce
            $("#ScrollContent").trigger("reload", this);
        }).on("onReloading",
        function(a) { //if onreloading status, drag will trigger this event
        }).on("dragToReload",
        function() { //drag over 30% of bounce height,will trigger this event
        }).on("draging",
        function(status) { //on draging, this event will be triggered.
        }).on("release",
        function() { //on draging, this event will be triggered.
        }).on("scrollbottom",
        function() { //on scroll bottom,this event will be triggered.you should get data from server
            $("#ScrollContent").trigger("more", this);
        }).hide();
        
        appcan.button("#lease", "ani-act", function() {
			appcan.window.open("service_lease", "service_lease.html", 2);
		});
		
		appcan.button("#consult", "ani-act", function() {
			appcan.window.open("service_consult", "service_consult.html", 2);
		});
		
		appcan.button("#handle", "ani-act", function() {
			appcan.window.open("service_handle", "service_handle.html", 2);
		});
		
		appcan.button("#found", "ani-act", function() {
			appcan.window.open("service_found", "service_found.html", 2);
		});
		
		appcan.button("#packet", "ani-act", function() {
			appcan.window.open("service_packet", "service_packet.html", 2);
		});
		
		appcan.button("#luggage", "ani-act", function() {
			appcan.window.open("service_luggage", "service_luggage.html", 2);
		});
		
		appcan.button("#medical", "ani-act", function() {
			appcan.window.open("service_medical", "service_medical.html", 2);
		});
    })

	
})($);