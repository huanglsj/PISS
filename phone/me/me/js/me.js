appcan.button("#message", "ani-act", function() {
	appcan.window.open("message", "message.html", 2);
});

appcan.button("#password", "ani-act", function() {
	appcan.window.open("password", "password.html", 2);
});

appcan.button("#set", "ani-act", function() {
	appcan.locStorage.setVal("flightHeadClose", "true");
	appcan.window.open("set", "set.html", 2);
});

appcan.button("#about", "ani-act", function() {
	appcan.window.open("about", "about.html", 2);
});