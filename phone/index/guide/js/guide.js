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
        
        appcan.button("#clearance", "ani-act", function() {
			appcan.window.open("guide_clearance", "guide_clearance.html", 2);
		});
		
		appcan.button("#transit", "ani-act", function() {
			appcan.window.open("guide_transit", "guide_transit.html", 2);
		});
		
		appcan.button("#arrive", "ani-act", function() {
			appcan.window.open("guide_arrive", "guide_arrive.html", 2);
		});
        
    })

	
})($);