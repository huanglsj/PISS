appcan.button("#nav-left", "btn-act",
    function() {appcan.window.close(1);});

$("#sHead li").click(function(){
	$(this).addClass("active").siblings().removeClass("active");
	var index = $(this).index();
	$("#sCon .s-con-list").eq(index).addClass("active").siblings().removeClass("active");
})
