'use strict';
console.time('small loop');
window.Rui = window.Rui || {
        Ajax: {},
        collect: {}
    };
window.Rui.Ajax = (function () {
    return function (paras, fun1) {
        $.ajax({
            url: paras.mdname,
            data: paras.data,
            type: 'GET',
            dataType: 'jsonp',
            success: function (res) {
                if ($.isFunction(fun1)) {
                    fun1(res);
                }
            }
        });
    }
}());
window.Rui.collect = (function () {
    var ajax = window.Rui.Ajax,
    //clickType = ['a'],
        refer = '',
        t = '',
        ua = navigator.userAgent.toLowerCase(),
        tp = '',
        p = '',
        curBtn = '',
        cookie = '',
        val = 10000,
        appId = '';//h5 or pc


    //是否是微信
    function isWeiXin() {
        return ( ua.match(/MicroMessenger/i) ? 1 : 0 );
    }

    // 是否是移动端
    function ismobile() {
        return (ua.match(/(iphone|ipod|android|ios|mobile)/) ? 1 : 0);
    }

    function ishas(value) {
        return (value === '' || value === undefined || value === null) ? '' : value;
    }


    // 获取当前页面
    function getP() {
        p = window.location.pathname;
        if (p.match(/.html/)) {
            p = window.location.pathname.substring(1, p.length - 5) ? window.location.pathname.substring(1, p.length - 5) : 'home';
        } else {
            p = window.location.pathname.substring(1) ? window.location.pathname.substring(1) : 'home';
        }
        p =  p.replace(/\/+/g,'_');
        if(p[p.length-1]=='_'){
            p = p.substring(0,p.length-1);
        }
        if(p.match(/\d/g)){
            if(p[p.length-1]=='_'){
                p = p.substring(0,p.length-1);
            }
            p = p.replace(/([A-Za-z]+\d+)|(\d+)/g,'')+'detail';
        }
        console.log(999999999,p);
        return p;
    }


    // 公共部分添加id
    function addPubId(ele,preTitle) {
        $(ele).each(function () {
            var val1 = 10000;
            $(this).find('a').each(function () {
                $(this).attr('eid', (preTitle + '_' + val1));
                val1++;
            })
        })
    }

    // 过滤公共部分
    function checkId( ele) {
        return $(ele).attr('id')=='header' || $(ele).attr('id')=='footer'||$(ele).attr('class')=='toolbar'?0:1;
    }
    // 其他id添加
    /*function addIdOther() {
        var bodyChild = document.body.childNodes,
            max = bodyChild.length;
        val = 10000;
        // console.log('p:', p);
        for(var i=0;i<max;i++){
            if(checkId(bodyChild[i])){
                $(bodyChild[i]).find('a').attr('eid', (p + '_' + val));
                val ++;
            }
        }
    }*/
    //动态添加id
    function adddynamic(type) {
        $(document).on(type,function () {
            var bodyChild = document.body.childNodes,
                max = bodyChild.length;
            val = 10000;
            // console.log('p:', p);
            for(var i=0;i<max;i++){
                if(checkId(bodyChild[i])){
                    $(bodyChild[i]).find('a').each(function () {
                        $(this).attr('eid', (p + '_' + val));
                        val ++;
                       // console.log(val,$(this));
                    });
                }
            }
        })
    }

    // 添加id
    function addId() {
        addPubId('#footer','footer');
        addPubId('#header','header');
        addPubId('.toolbar','toolbar');
        //addIdOther();
        if(appId=='h5'){
            adddynamic('touchstart');
            getCookie('touchstart');
        }else{
            adddynamic('hover');
            getCookie('hover');
        }
    }
    // 获取目标页面
    function getTp(_this) {
        tp = $(_this).attr('href');
        return tp;
    }

    // 获取cookie
    function getCookie(type) {
        $(document).on(type,function () {
            cookie = document.cookie ? document.cookie : '';
            return cookie;
        })
    }

    // 获取在页面停留时间
    function getDuration() {
        var st = new Date().getTime();
        $(window).on('beforeunload', function () {
            var et = new Date().getTime();
            t = et - st;
        });
    }

    // 获取refer
    function getReferer() {
        refer = document.referrer ? document.referrer : '';
        return refer;
    }

    // 获取元素信息
    function getEle(_this) {
        curBtn = $(_this).attr('eid');
        //console.log('当前按钮',curBtn);
        return curBtn;
    }


    // 所有收集的信息
    function collectInfo(_this) {
        getReferer();// 获取refer
        appId = (ismobile() || isWeiXin()) ? 'h5' : 'pc';
        getTp(_this); // 目标页
        getEle(_this);// 元素信息
    }

    // 发送埋点信息
    function reqCollect(_this, type, t, tp) {
        collectInfo(_this);
        var paras = {
            mdname: 'http://192.168.40.100:8080/stat/gateway/stat/collect/jsonp',
            data: {
                v: '',                     //客户端版本号
                aId: ishas(appId),
                cookie: ishas(cookie),
                r: ishas(refer),   //refer
                p: ishas(p),       //当前页
                tp: ishas(tp),    //目标页
                type: ishas(type),  //打点类型
                pnc: '',                        //页面中文名称
                eId: ishas(curBtn),//点击按钮信息
                t: ishas(t),        //页面停留时长
                bv: ishas(ua)        //浏览器版本  ua
            }
        };
        console.log('埋点', paras.data);
        ajax(paras, function (res) {
            //console.log('埋点结果', res);
        }, appId);
    }

    // 点击时发送埋点信息
    function clickSend() {

        $('a').on('click', function (event) {

            var start = new Date().getTime();//起始时间

            var _this = this;
            if ($(_this).find('input')[0] ? 0 : 1) {
                reqCollect(_this, '20', t, tp); // 发送数据
            }
            var end = new Date().getTime();//接受时间

            console.log('收集信息所用时间', (end - start));
        })
    }

    // 页面刷新或关闭发送埋点信息
    function pageSend() {
        $(window).unload(function () {
            reqCollect('', '10', t, '');
        });
    }

    function start() {
        getP();//获取当前页
        addId();//元素添加id
        getDuration();// 获取页面停留时长
        clickSend(); // 点击发送埋点数据
        pageSend(); // 页面发送埋点数据
    }

    return {
        start: start
    };


}()).start();
console.timeEnd('small loop'); 

