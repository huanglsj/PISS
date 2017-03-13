(function($) {
	appcan.button("#nav-left", "btn-act",
		function() {});
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

		var slider = appcan.slider({
			selector: '#slider',
			aspectRatio: 6 / 16,
			hasLabel: true,
			index: 1,
			auto: 2000
		});
		slider.set([{
			img: "../img/1.jpg",
			label: "快速！丰富稳定的UI组件、海量的行业UI模板，快速拼装APP"
		}, {
			img: "../img/2.jpg",
			label: "便捷！网络部署APP，摆脱数据线"
		}, {
			img: "../img/3.jpg",
			label: "高效！项目云端同步，多人协同开发"
		}]);
		slider.on("clickItem", function(index, data) {
			console.log(index, data);
		});

		appcan.button("#service", "ani-act", function() {
			appcan.window.open("service", "service.html", 2);
		});

		appcan.button("#guide", "ani-act", function() {
			appcan.window.open("guide", "guide.html", 2);
		});

		appcan.button("#dynamic", "ani-act", function() {
			appcan.locStorage.setVal("flightHeadClose", "true");
			appcan.window.open("flight", "../flight/flight.html", 2);
		});

		appcan.button("#traveller", "ani-act", function() {
			appcan.window.open("notice", "notice.html", 2);
		});

		appcan.button("#shopping", "ani-act", function() {
			appcan.window.open("shopping", "shopping.html", 2);
		});

		appcan.button("#traffic", "ani-act", function() {
			appcan.window.open("traffic", "traffic.html", 2);
		});

		appcan.button("#phone", "ani-act", function() {
			appcan.window.open("phone", "phone.html", 2);
		});

		appcan.button("#opinion", "ani-act", function() {
			appcan.window.open("opinion", "opinion.html", 2);
		});
		
		appcan.button("#attention", "ani-act", function() {
			appcan.window.open("attention", "attention.html", 2);
		});
		
		appcan.button("#wifi", "ani-act", function() {
			appcan.window.open("wifi", "wifi.html", 2);
		});

	});

})($);