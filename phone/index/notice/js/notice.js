(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {appcan.window.close(1);});
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        
        appcan.button("#safety", "ani-act", function() {
			appcan.window.open("notice_safety", "notice_safety.html", 2);
		});
		
		appcan.button("#customs", "ani-act", function() {
			appcan.window.open("notice_customs", "notice_customs.html", 2);
		});
		
		appcan.button("#quarantine", "ani-act", function() {
			appcan.window.open("notice_quarantine", "notice_quarantine.html", 2);
		});
		
		appcan.button("#border", "ani-act", function() {
			appcan.window.open("notice_border", "notice_border.html", 2);
		});
		
		appcan.button("#time", "ani-act", function() {
			appcan.window.open("notice_time", "notice_time.html", 2);
		});
		
		appcan.button("#luggage", "ani-act", function() {
			appcan.window.open("notice_luggage", "notice_luggage.html", 2);
		});
        
    })

	
})($);