appcan.button("#nav-right", "btn-act", function() {
	appcan.locStorage.setVal("flightHeadClose", "true");
	appcan.window.publish('attentionFlight', "true");
	appcan.window.open("flight", "../flight/flight.html", 2);
});

var flightDetail = appcan.locStorage.getVal('flightDetail');
if(flightDetail) {
	flightDetail = JSON.parse(flightDetail);
	for(var i=0;i<flightDetail.length;i++){
		flightDetail[i].logo = '../flight/'+flightDetail[i].logo;
	}

	var app = new Vue({
		el: '#plane',
		data: {
			items: flightDetail,
		}
	})

} else {
	$(".msg").show();
}