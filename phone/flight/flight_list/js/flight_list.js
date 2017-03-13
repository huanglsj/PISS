var flightFromCityNode;
var flightToCityNode;
var airDate;
var flightSiteType;
var flightKeyWord;
var app;
var screenDir = 0; //是否是正序
var screenType = 0; //筛选的类型

flightFromCityNode = appcan.locStorage.getVal("flightFromCityNode");
flightToCityNode = appcan.locStorage.getVal("flightToCityNode");
airDate = appcan.locStorage.getVal("airDate");
$("#today").text(airDate);
flightSiteType = appcan.locStorage.getVal("flightSiteType");
appcan.locStorage.remove("flightSiteType");
if(flightSiteType) {
	flightSiteType = flightSiteType.substring(0, flightSiteType.length - 1);
	if(flightSiteType != '无') {
		flightSiteType = flightSiteType.split(",");
	}
}
flightKeyWord = appcan.locStorage.getVal("flightKeyWord");

appcan.ready(function() {
	appcan.button("#nav-left", "btn-act",
		function() { appcan.window.close(1); });

	if(appcan.locStorage.getVal("flightFromCity")) {
		$("#depPlane").html(appcan.locStorage.getVal("flightFromCity"));
		$("#arrPlane").html(appcan.locStorage.getVal("flightToCity"));
	}

	appcan.window.evaluateScript({
		name: 'plane_ticket_searchresult',
		scriptContent: 'preventClick()'
	});
	//shieldRequest(); //屏蔽公司
	screenNoClick(); //是否可以点击
	showPlaneList(); //航班列表
	getMinDatePrice(); //最低价格

});

var app = new Vue({
	el: '#planeTicketlist',
	data: {
		items: [],
	},
	methods: {
		openRand: function(item) {

			appcan.window.confirm({
				title: '提示',
				content: '您要关注这个航班吗',
				buttons: ['确定', '取消'],
				callback: function(err, data, dataType, optId) {
					if(err) {
						//如果出错了
						return;
					}
					console.log(data);
					//data 按照按钮的索引返回值
					var flight = item.carrier+item.flightNo;
					if(data == 0) {
						if(appcan.locStorage.getVal('flightDetail')) {
							var flightDetail = appcan.locStorage.getVal('flightDetail');
							flightDetail = JSON.parse(flightDetail);
							console.log(flightDetail)
							var flag = true;
							for(var i = 0; i < flightDetail.length; i++) {
								var myFlight = flightDetail[i].carrier+flightDetail[i].flightNo;
								if(myFlight == flight) {
									alert("您已经关注了这个航班了");
									flag = false;
									return;
								}
							}
							if(flag) {
								flightDetail.push(item);
								appcan.locStorage.setVal('flightDetail', flightDetail);
							}

						} else {
							appcan.locStorage.setVal('flightDetail', [item]);
						}
						
						
					}
				}
			});
		},
	},
});

var planePm = {
	fromCity: flightFromCityNode,
	toCity: flightToCityNode,
	airDate: airDate,
	siteType: flightSiteType,
	cmdShare: "1",
	stopType: "ST_Direct" //ST_Nonstop("N"), 直达无经停 ST_Direct("D"), 直达有经停 ST_All("A"); 
};

var flightsArr = [];

//屏蔽航司：春秋 9C。西部  PN。中联  KN。九元  AQ。成都  EU。华夏  G5。长安  9H。
var shield = [];
//屏蔽公司接口
function shieldRequest() {
	appcan.request.ajax({
		url: httpHost + 'tmcDeleteFlightsController.do?all',
		beforeSend: addHeader,
		type: "POST",
		dataType: "json",
		success: function(data) {
			console.log(data);
			if(data.length > 0) {
				for(var i = 0; i < data.length; i++) {
					shield.push(data[i].flightCode);
				}
			}
		},
		error: function(err) {
			//appcan.window.openToast("网络请求异常，请检查网络是否正常。", 1000);
		}
	});
}

//渲染数据
function showPlaneList() {
	ajaxRequest({
		url: httpHost + 'flightController.do?queryFlightsList',
		beforeSend: addHeader,
		data: planePm,
		type: "POST",
		dataType: 'json',
		success: function(data) {
			$(".flight-foot").show();
			console.log(data)
			appcan.window.evaluateScript({
				name: 'plane_ticket_searchresult',
				scriptContent: 'outMask()'
			});
			screenClick();
			if(data.success) {
				$("#planeTicketlist").show();
				$("#msg").hide();
				var flights = filterCode(data.obj.data.flights);
				flights = compareArrList(flights);
				if(flights.length > 0) {
					for(var i = 0; i < flights.length; i++) {
						var seat = flights[i].seats;
						var logo = 'flight_list/img/logo/' + flights[i].carrier + '.png';
						flights[i].companyName = airPortNameMaps[flights[i].carrier];
						flights[i].logo = logo;
						var seatArr = getMinPrice(seat);
						flights[i].minPrice = seatArr[0];
						flights[i].discount = (seatArr[1] * 1 / 10).toFixed(1);
						flights[i].shipping = seatArr[2];
						if(seatArr[2] != undefined || seatArr[2]) {
							flights[i].shipping = seatArr[2];
						} else {
							flights[i].shipping = '其他舱位';
						}
						flights[i].fromName = airPortInfos[flights[i].depart].airPortName;
						flights[i].toName = airPortInfos[flights[i].arrival].airPortName;
						var myDepDateHours = flights[i].depDate.hours < 10 ? "0" + flights[i].depDate.hours : flights[i].depDate.hours;
						var myDepDateMinutes = flights[i].depDate.minutes < 10 ? "0" + flights[i].depDate.minutes : flights[i].depDate.minutes;
						var myArrDateHours = flights[i].arrDate.hours < 10 ? "0" + flights[i].arrDate.hours : flights[i].arrDate.hours;
						var myArrDateMinutes = flights[i].arrDate.minutes < 10 ? "0" + flights[i].arrDate.minutes : flights[i].arrDate.minutes;
						flights[i].myDepDate = myDepDateHours + ':' + myDepDateMinutes;
						flights[i].myArrDate = myArrDateHours + ':' + myArrDateMinutes;
					}
				} else {
					$("#planeTicketlist").hide();
					$("#msg").show();
					$("#msg").text("查无结果或暂时无票");
				}
				flightsArr = flights;
				app.items = doOrder(flights, screenType, screenDir);
			} else {
				appcan.window.evaluateScript({
					name: 'plane_ticket_searchresult',
					scriptContent: 'outMask()'
				});
				$("#planeTicketlist").hide();
				$("#msg").show();
				$("#msg").text(data.msg);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			appcan.window.evaluateScript({
				name: 'plane_ticket_searchresult',
				scriptContent: 'outMask()'
			});
			screenClick();
			$("#planeTicketlist").hide();
			$("#msg").show();
			$("#msg").text("网络请求异常，请检查网络是否正常");
		}
	}, "../img/loading.gif");

	setTimeout(function() {
		screenClick();
	}, 20000);
}

//屏蔽不想要的航空公司
function shieldCompany(obj) {
	if(obj) {
		if(shield.length > 0) {
			for(var j = 0; j < obj.length; j++) {
				if(shield.indexOf(obj[j].carrier) > -1) {
					obj.splice(j, 1);
					j--;
				}
			}
		}

	}

	return obj;
}

//过滤舱位信息
function filterCode(arr) {
	if(flightSiteType != '无') {
		for(var i = 0; i < arr.length; i++) {
			var seat = arr[i].seats;
			for(var j = 0; j < seat.length; j++) {
				if(!(flightSiteType.indexOf(seat[j].code) > -1)) {
					seat.splice(j, 1);
					j--;
				}
			}
		}
	}
	return arr;
}

//获取舱位最低价格
function getMinPrice(arr) {
	var minPrice = arr[0].price;
	var discount = arr[0].sale;
	var shipping = myShipping[arr[0].code];
	for(var i = 1; i < arr.length; i++) {
		if(arr[i].price < minPrice) {
			minPrice = arr[i].price;
			discount = arr[i].sale;
			shipping = myShipping[arr[i].code];
		}
	}
	var seatArr = [minPrice, discount, shipping];
	return seatArr;
}

//如果舱位价格全部是空的就把这个列表去掉
function compareArrList(arr) {
	if(arr.length > 0) {
		for(var i = 0; i < arr.length; i++) {
			var seat = compareArr(arr[i].seats);
			if(seat.length === 0) {
				arr.splice(i, 1);
				i--
			}
		}
		return arr;
	}
	return;
}

//去掉舱位空的价格
function compareArr(arr) {
	if(arr.length > 0) {
		for(var i = 0; i < arr.length; i++) {
			if(arr[i].price !== "" && arr[i].price !== 0 && arr[i].price !== null) {
				continue;
			}
			arr.splice(i, 1);
			i--;
		}
		return arr;
	}
	return [];
}

var minPm = {
	"fCity": flightFromCityNode,
	"tCity": flightToCityNode,
	"date": airDate,
	"dayNum": 3
};

//获取最近三天最低价格
function getMinDatePrice() {
	appcan.request.ajax({
		url: httpHost + "flightController.do?queryLowPriceByDate",
		beforeSend: addHeader,
		data: minPm,
		type: "POST",
		dataType: 'json',
		success: function(data) {
			if(data.lowPrices) {
				if(data.lowPrices.length > 0) {
					appcan.locStorage.setVal("mainMInPrice", data);
					appcan.window.evaluateScript({
						name: 'plane_ticket_searchresult',
						scriptContent: 'getMainMInPrice()'
					});
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(textStatus);
		}
	})
}

appcan.button("#prevDay", "ani-act", prevDay);

function prevDay() {
	$(".flight-foot").hide();
	var myDate = appcan.locStorage.getVal("airDate");
	var curDate = new Date();
	var dateText = asDay(new Date(myDate), 1, 1);
	var poor = (new Date(dateText).getTime() - (new Date(NYR(curDate, 1))).getTime());
	if(poor >= 0) {
		appcan.locStorage.setVal("airDate", dateText);
		airDate = dateText;
		//		appcan.window.evaluateScript({
		//			name: 'plane_ticket_searchresult',
		//			scriptContent: 'setDate("' + dateText + '")'
		//		});
		$("#today").text(dateText);
		//		$("#calendarHidden").val(dateText);
		planePm.airDate = dateText;
		appcan.window.evaluateScript({
			name: 'plane_ticket_searchresult',
			scriptContent: 'preventClick()'
		});
		screenNoClick();
		minPm = {
			"fCity": flightFromCityNode,
			"tCity": flightToCityNode,
			"date": dateText,
			"dayNum": 3
		};
		getMinDatePrice();
		showPlaneList();
	} else {
		appcan.window.openToast('不能选择小于今天的日期', '2000');
	}
}

appcan.button("#nextDay", "ani-act", nextDay);

function nextDay() {
	$(".flight-foot").hide();
	var myDate = appcan.locStorage.getVal("airDate");
	var dateText = asDay(new Date(myDate), 1, 0);
	airDate = dateText;
	appcan.locStorage.setVal("airDate", dateText);
	//	appcan.window.evaluateScript({
	//		name: 'plane_ticket_searchresult',
	//		scriptContent: 'setDate("' + dateText + '")'
	//	});
	$("#today").text(dateText);
	//	$("#calendarHidden").val(dateText);
	planePm.airDate = dateText;
	appcan.window.evaluateScript({
		name: 'plane_ticket_searchresult',
		scriptContent: 'preventClick()'
	});
	screenNoClick();
	minPm = {
		"fCity": flightFromCityNode,
		"tCity": flightToCityNode,
		"date": dateText,
		"dayNum": 3
	};
	getMinDatePrice();
	showPlaneList();
}

appcan.button("#today", "ani-act", showCalendar);

var calendarShow;

function showCalendar() {
	var today = $("#today").text();
	appcan.window.evaluateScript({
		name: 'plane_ticket_searchresult',
		scriptContent: 'preventClick()'
	});
	screenNoClick();
	calendarShow = $("#today").mobiscroll().calendar({
		min: new Date(),
		dateFormat: 'yy-mm-dd',
		defaultValue: new Date(today),
		onCancel: function(val, obj) {
			appcan.window.evaluateScript({
				name: 'plane_ticket_searchresult',
				scriptContent: 'outMask()'
			});
			screenClick();
		},
		onSet: function(val, obj) {
			$(".flight-foot").hide();
			val = val.valueText;
			appcan.locStorage.setVal("airDate", val);
			$("#today").text(val);
			planePm.airDate = val;
			minPm = {
				"fCity": flightFromCityNode,
				"tCity": flightToCityNode,
				"date": val,
				"dayNum": 3
			};
			getMinDatePrice();
			showPlaneList();
		}
	});
	calendarShow.mobiscroll("show");
}

//排序
function doOrder(datas, type, dir) {
	//type 0代表起飞时间,1代表到达时间，2最低价
	//dir 0代表正序，1代表倒叙
	var temp;
	if(datas != null && datas.length > 0) {
		for(var i = 0; i < datas.length - 1; i++) {
			for(var j = i + 1; j < datas.length; j++) {
				var value1 = getComPareValue(datas[i], type);
				var value2 = getComPareValue(datas[j], type);
				if(dir == 0) { //正序
					if(value1 > value2) {
						temp = datas[i];
						datas[i] = datas[j];
						datas[j] = temp;
					}
				} else { //d倒叙
					if(value1 < value2) {
						temp = datas[i];
						datas[i] = datas[j];
						datas[j] = temp;
					}
				}
			}
		}
	}
	return datas;
}

function getComPareValue(data, type) {
	var compareValue;
	var planeDate = appcan.locStorage.getVal("airDate");
	if(type == 0) {
		var myDepDate = new Date(NYR(planeDate, 1).replace(/-/g, "/") + ' ' + data.myDepDate).getTime();
		compareValue = myDepDate;
	} else if(type == 1) {
		var myArrDate = new Date(NYR(planeDate, 1).replace(/-/g, "/") + ' ' + data.myArrDate).getTime();
		compareValue = myArrDate;
	} else {
		compareValue = getMinPriceOrder(data.seats);
	}
	return compareValue;
}

function getMinPriceOrder(arr) {
	var minPrice = arr[0].price;
	for(var i = 1; i < arr.length; i++) {
		if(arr[i].price < minPrice) {
			minPrice = arr[i].price;
		}
	}
	return minPrice;
}

//起飞时间排序
appcan.button("#departTime", "btn-act", function() {
	var self = $(this);
	var type = screenList(self);
	screenType = 0;
	app.items = doOrder(flightsArr, screenType, type);
});

//到达时间排序
// appcan.button("#arriveTime","btn-act",function(){
// var self = $(this);
// var type = screenList(self);
// screenType = 1;
// app.items = doOrder(flightsArr,screenType,type);
// });

//最低价排序
appcan.button("#lowestPrice", "btn-act", function() {
	var self = $(this);
	var type = screenList(self);
	screenType = 2;
	app.items = doOrder(flightsArr, screenType, type);
})

function screenList(obj) {
	var first = obj.find(".fa-caret-up").hasClass("active");
	if(first) {
		$("#screen i").removeClass("active");
		obj.find(".fa-caret-down").addClass("active");
		screenDir = 1;
	} else {
		screenDir = 0;
		$("#screen i").removeClass("active");
		obj.find(".fa-caret-up").addClass("active");
	}
	app.items = [];
	return screenDir;
}

//数据加载的时候不给点击筛选
function screenNoClick() {
	$("#screen").addClass("active");
}

//数据加载完给点击筛选
function screenClick() {
	$("#screen").removeClass("active");
}