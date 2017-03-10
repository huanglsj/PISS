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
	})

	
	var login = function() {
		var data = { "userName": $("#uid").val(), "passWord": $("#upwd").val() };
		appcan.request.ajax({
			url: httpHost + 'apploginController.do?applogin',
			type: 'POST',
			data: data,
			success: function(objson) {
				if(appcan.locStorage.getVal("userName") !== $("#uid").val()) {
					appcan.locStorage.remove();
				}
				resp = eval('(' + objson + ')');
				if(resp.success) {		
					appcan.locStorage.setVal("sessionId", resp.obj.sessionId); //SessionId
					appcan.locStorage.setVal("userName", resp.obj.uname); //姓名
					appcan.locStorage.setVal("userCode", resp.obj.ucode); //用户名
					appcan.locStorage.setVal("userNum", resp.obj.userNum); //身份证号
					appcan.locStorage.setVal("userMobile", resp.obj.mobile); //电话
					appcan.locStorage.setVal("isChecker", resp.obj.isChecker); //是否管理员
					appcan.locStorage.setVal("userRoles", resp.obj.userRoles); //用户权限配置
					appcan.window.open("main", "main/main.html", 10);
				} else {
					global_error(resp.msg)
				}
				removeMask();
			},
			error: function(e, err) {
				removeMask();
			}
		});
	}
	
	appcan.button("#submit", "ani-act",login);

})($);