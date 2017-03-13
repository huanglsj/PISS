appcan.ready(function() {
            appcan.initBounce();
        })
        var lv1 = appcan.listview({
            selector : "#listview1",
            type : "thinLine",
            hasIcon : true,
            hasAngle : false,
            hasControl : true,
        });
        lv1.set([{
            title : "夜间模式",
            icon : 'set/img/nightmode.png',
            "switchBtn" : {
                value : false,
                mini : true
            }
        }, {
            title : "新消息通知",
            icon : 'set/img/message.png',
            "switchBtn" : {
                value : true,
                mini : true
            }
        }, {
            title : "无图模式",
            icon : 'set/img/noimage.png',
            "switchBtn" : {
                value : false,
                mini : true
            }
        }]);

        lv1.on("switch:change", function(ele, obj) {
            //lv1.updateItem(ele,"title","Switch:"+obj.switchBtn.value);
        })