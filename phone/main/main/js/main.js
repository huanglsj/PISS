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

		var tabview = appcan.tab({
			selector: $("#Tab"),
			hasIcon: true,
			hasAnim: false,
			hasLabel: true,
			hasBadge: false,
			index: 0,
			data: [{
				label: "首页",
				icon: "fa-home"
			}, {
				label: "航班",
				icon: "fa-plane"
			}, {
				label: "服务",
				icon: "fa-align-justify",
			}, {
				label: "我的",
				icon: "fa-user"
			}]
		});

		tabview.on("click", function(obj, index) { /*TAB变更时切换多浮动窗口*/
			if(index==1){
				appcan.locStorage.setVal("flightHeadClose", "false");
			}
			appcan.window.selectMultiPopover("ContentFlexVer", index);
		});

		appcan.frame.open({ /*创建多浮动窗口*/
			id: "ContentFlexVer",
			url: [{
				"inPageName": "index",
				"inUrl": "../index/index.html",
			}, {
				"inPageName": "flight",
				"inUrl": "../flight/flight.html",
			}, {
				"inPageName": "service",
				"inUrl": "../index/service.html",
			}, {
				"inPageName": "me",
				"inUrl": "../me/me.html",
			}],
			top: 0,
			left: 0,
			index: 0,
			change: function(index, res) { /*浮动窗口推拽变更时回调，可控制tab进行同步变更*/
				tabview.moveTo(res.multiPopSelectedIndex);
			}
		});
		window.onorientationchange = window.onresize = function() {
			appcan.frame.resize("ContentFlexVer", 0, 0);
		}

	});

})($);