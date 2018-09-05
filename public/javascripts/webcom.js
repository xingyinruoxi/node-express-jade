'use strict';
window.Rui = window.Rui || {
        Ajax:{},
        Module: {},
        Check: {},
        DeValue: {},
        Tool: {},
        Alert: {},
        getAlert:{},
        layer:{},
        getPage:{},
        Date:{},
        Init:{},
        countDown:{},
        toDecimal:{},
        errcode:{}
    };

window.Rui.err=(function(){
    var ec = {
        /* 公共部分 - 从0开始*/
        'default': '暂无数据',
        '0000000': '对不起，您在进行非法操作，我们已记录下您的相关信息，请保重',
        '0000001': '系统错误，无法返回数据',
        '0000002': '参数错误',
        '0000003': '验证码不能为空',
        '0000004': '验证码错误',
        '0000005': '获取数据失败',

        /* 用户登录错误码 - 1开头用户相关*/
        '1000003': '用户名不能为空',
        '1000004': '密码不能为空',
        '40000004': '用户名或者密码不正确',

        /* 找回密码 - 1开头用户相关*/
        '1000006': '手机号不存在',
        '1000007': '两次不一致',
        '1000008': '确认密码不能为空',
        '1000009': '您输入的旧密码不正确',

        /* 银行开户 - */
        '1903': '您已经绑定过该P2P平台',

        /* 用户注册错误码 - 2开头 */
        '2000001': '手机号不能为空',
        '2000002': '手机号不存在',
        '2000003': '手机号已存在',

        /* token 失效 */
        '3000001': 'token失效',

        /* 短信验证码 */
        '3000010': '发送短息失败',
        '3000011': '短信验证码不正确',
        '3000012': '短信验证码失效',
        '3000013': '短信类型不能为空',

        /* 短信验证码 */
        '40000012': '验证码不能为空',

        /**/
        '40010005':'图片验证码失效'
    };

    var newec={
        'default':'系统繁忙，请稍后重试！',
        '40000000':{h:'系统错误',q:''},
        '40000001':{h:'参数错误',q:''},
        '40000002':{h:'rpc调用错误',q:''},
        '40000003':{h:'用户token失效',q:'token失效'},
        '40000004':{h:'登录错误',q:'用户名或者密码不正确'},
        '40000005':{h:'添加用户错误',q:''},
        '40000006':{h:'密码错误',q:'您输入的旧密码不正确'},
        '40000007':{h:'刷新token失败',q:'token失效'},
        '40000008':{h:'刷新token,ticket错误',q:'token失效'},
        '40000009':{h:'确认密码不一致',q:'两次不一致'},
        '40000010':{h:'数据不存在',q:''},
        '40000011':{h:'手机号重复',q:'手机号已存在'},
        '40000012':{h:'用户不存在',q:'该手机号未注册金投手平台'},
        '40000013':{h:'连续登录N次，需要输入验证码',q:'验证码不能为空'},
        '40000014':{h:'用户冻结',q:'该手机号被冻结，请联系400-101-7660'},
        //短信和图片验证码错误码
        '40010001':{h:'发送短息失败',q:'发送短息失败'},
        '40010002':{h:'短信验证码不正确',q:'短信验证码不正确'},
        '40010003':{h:'短信验证码失效',q:'短信验证码失效'},
        '40010004':{h:'图片验证码必填',q:'验证码不能为空'},
        '40010005':{h:'图片验证码失效',q:'验证码错误'},
        '40020001':{h:'用户id为空',q:''},
        '40020002':{h:'用户帐号为null',q:''},
        //银行错误码
        '40030001':{h:'用户帐账号绑定协议号异常',q:''},
        '40030002':{h:'浙商银行系统处理充值失败。',q:''},
        '40030003':{h:'调用银行托管的充值接口成功，持久化数据库失败',q:''},
        '40030004':{h:'银行接口可以调用，但返回错误信息',q:''},
        //浙商银行开立存管账号控制端验证
        '40040001':{h:'ApiBaseParam is null',q:''},
        '40040002':{h:'vo is null',q:''},
        '40040003':{h:'客户姓名accountName is null',q:''},
        '40040004':{h:'证件类型certType is null',q:''},
        '40040005':{h:'证件号码certNo is null',q:''},
        '40040006':{h:'手机号码mobile is null',q:''},
        '40040007':{h:'主账户otherAccno is null',q:''},
        '40040008':{h:'主账户人行联行行号branchNo is null',q:''},
        '40040009':{h:'是否同步开通增金宝openZjbFlag is null',q:''},
        '40040010':{h:'银行code is null',q:''},
        //浙商银行短信发送控制端验证
        '40050001':{h:'vo id is null',q:''},
        '40050002':{h:'mobile is null',q:''},
        '40050003':{h:'mobile is empty',q:''},
        '40050004':{h:'账号系统中的没有录入您的手机号，无法发送短信验证码，请联系平台客户解决问题！',q:''},
        '40050005':{h:'手机号码格式错误！',q:''},
        '40050006':{h:'用户E账户余额不足',q:''},
        '40050007':{h:'非法的出借来源',q:''},
        '40050008':{h:'出借活动使用礼品失败',q:''},
        '40050009':{h:'项目不存在',q:''},
        '40060001':{h:'项目状态错误',q:''},
        '40060002':{h:'项目募集信息错误',q:''},
        '40080013':{h:'购买优惠券ID有误',q:''},
        '40080014':{h:'购买优惠券过期',q:''},
        '40080015':{h:'非本人优惠券',q:''},
        '40080016':{h:'优惠券已使用',q:''},
        '40080017':{h:'优惠券不适合该产品类型',q:''},
        '40080018':{h:'优惠券规则不适合该产品',q:''},
        '40080019':{h:'优惠券累计最低起投金额大于购买金额',q:''},
        '40080020':{h:'产品不允许使用优惠券',q:''},
        '40070001':{h:'充值操作24小时内不能超过十次',q:''},
        '40070002':{h:'提现操作24小时内不能超过十次',q:''}
    };

    function getnewErr(key){
        //return (key&&newec[key].q)||newec['default'];
        return (key&&newec[key].q)||newec['default'];
    }
    function getErrFun(data,id){
        if(data&&data.error){
            $('#'+id).closest('li').find('.form-error').show().text(getnewErr(''));
            return true;
        }
        return false;
    }
    function getErrHref(data,href){
        console.log(1111,data);
        if(data&&data.error){
            console.log('报错啦');
            location.href=href;
            return true;
        }
        return false;
    }
    function geterr(key){
        return ec[key]||ec['default'];
    }

    return {
        geterr: geterr,
        getnewErr: getnewErr,
        getErrHref: getErrHref,
        getErrFun:getErrFun
    }
})();

//倒计时
window.Rui.countDown=(function(){
    var waitingtime = 60,//设置等待时间
        countdown = waitingtime;//设置重置时间
    //60秒倒计时
    function Down(id,fn){

        function settime() {
            // console.log(id);
            if (countdown === 0) {
                countdown = waitingtime;
                $(id).css({'color':'','cursor':'pointer'}).text('发送验证码').click(function(){
                    fn(id);
                });
            } else {
                $(id).css({'color':'#ccc','cursor':'default'}).text(countdown + 's');

                countdown--;
                setTimeout(function () {
                    settime(id)
                }, 1000);
            }
        }
        settime(id);
        $(id).closest('li').find('input').focus();
        $(id).unbind('click');
    }

    //n秒倒计时完后跳转
    function downUrl(timelen,id,url){
        console.log('倒计时开始');
        function timecut(){
            if (timelen === 0) {
                console.log('时间到');
                location.href=url;
            } else {
                console.log(timelen);
                $('#'+id).text(timelen);
                timelen--;
                setTimeout(function () {
                    timecut();
                }, 1000);
            }
        }
        timecut();
    }

    return {Down:Down,downUrl:downUrl}
})();

window.Rui.Date=(function(){
    //格式化时间
    function formatDateTime(inputTime,type) {
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        //return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
        return type==='hms'?(y + '-' + m + '-' + d+' '+h+':'+minute+':'+second):(y + '-' + m + '-' + d);
    }
    return {formatDateTime:formatDateTime}
})();

window.Rui.layer=(function(){
    var layer=window.layer;
    return function(paras,fn){
        //参数api文档http://www.layui.com/doc/modules/layer.html#type
        layer.open({
            id: paras.id||'',
            type: paras.type||1,
            title:paras.title||'信息',
            content:paras.content||'',
            skin: paras.skin||'', //加上边框
            area: paras.area||['400px', '300px'], //宽高
            shade:paras.shade||0.3,
            move: false,
            btn:paras.btn||'',
            offset:paras.offset||'',
            btnAlign:paras.btnAlign||((paras.btn&&paras.btn.length===2)?'cn':'r'),
            closeBtn:paras.closeBtn||1,
            shadeClose:false,
            time:paras.time||0,
            anim:paras.anim||0,
            btn1:function(index,layero){
                if ($.isFunction(fn)) {
                    if(fn(index)){
                        return false;
                    }
                }
                layer.close(index);
            },
            cancel: function(index, layero){
                layer.close(index);
            }
        });
    }
})();

window.Rui.getPage=(function(){
    //console.log('#####11111');
    var pageNo=1,
        pageTotal=10,
        isInit=false,
        html='',
        func=function(){};

    function config(pNo,pTotal,fn){
        pageNo=pNo||1;
        pageTotal=pTotal!==''?pTotal:10;
        console.log('#####',pTotal);
        if ($.isFunction(fn)) {
            func=fn;
            // console.log(func);
        }
        if(!pTotal){
            $('.pagination').empty().addClass('hidden');
        }else{
            $('.pagination').removeClass('hidden');
        }
    }

    //初始化功能DOM
    function init(){
        if(!isInit){
            html='';
            if(pageTotal>5){
                html+='<a href="javascript:;" id="first" class="first fl"><i class="ico ico-step-backward"></i></a>';
                html+='<a href="javascript:;" id="prv" class="prv fl hidden"><i class="fa fa-angle-left"></i></a>';
            }
            html+='<span class="pagingUl">';
            html+='<a id="page_1" href="javascript:" class="active">1</a>';
            if(pageTotal>1){
                html+='<a id="page_2" href="javascript:" class="">2</a>';
            }
            if(pageTotal>2){
                html+='<a id="page_3" href="javascript:" class="">3</a>';
            }
            if(pageTotal>3){
                html+='<a id="page_4" href="javascript:" class="">4</a>';
            }
            if(pageTotal>4){
                html+='<a id="page_5" href="javascript:" class="">5</a>';
            }
            html+='</span>';
            if(pageTotal>5) {
                html += '<a  href="javascript:;" id="next" class="next fl" style="display: inline-block;"><i class="fa fa-angle-right"></i></a>';
                html += '<a  href="javascript:;"  id="last" class="last fl"><i class="ico ico-step-forward"></i></a>';
            }
            $('.pagination').empty().append(html);
        }
    }
    //为内按钮赋值
    function initPageValue(pagefrom){
        $('#page_1').text(pagefrom);
        $('#page_2').text(pagefrom+1);
        $('#page_3').text(pagefrom+2);
        $('#page_4').text(pagefrom+3);
        $('#page_5').text(pagefrom+4);
    }

    //设置选中
    function clearAndAdd(id){
        $('.pagingUl a').removeClass('active');
        $(id).addClass('active');
    }

    //为内按钮赋值和设置选中
    function getPageValue(num,idname){
        $('.pagingUl a').each(function(){
            $(this).text(parseInt($(this).text())+num);
        });
        clearAndAdd(idname||'#page_3');
    }

    //更新外按钮状态
    function getOtherState(){
        if(parseInt(pageNo)===1){
            $('#prv').hide();
            $('#next').show();
        }else if(parseInt(pageNo)===pageTotal){
            $('#prv').show();
            $('#next').hide();
        }else{
            $('#prv').show();
            $('#next').show();
        }
    }

    //绑定内按钮
    function bindInside(){
        $('.pagingUl a').bind('click',function(){

            var obj=$(this),
                pageid=obj.attr('id'),
                pagevalue=obj.text();
            console.log(4444444,pageid);
            if(obj.attr('class')==='active') {
                return false;
            }else{
                $('.pagingUl a').removeClass('active');
                obj.addClass('active');
                pageNo=pagevalue;
            }

            //小于5的不考虑
            if(pageTotal>5){
                if(pageid==='page_1'){
                    if(parseInt(pagevalue)-1>=2){
                        getPageValue(-2);
                    }else if(parseInt(pagevalue)-1===1){
                        getPageValue(-1,'#page_2');
                    }
                }
                if(pageid==='page_2'){
                    if(parseInt(pagevalue)-1>=2){
                        getPageValue(-1);
                    }
                }
                if(pageid==='page_4'){
                    if(parseInt(pagevalue)+1<pageTotal){
                        getPageValue(1);
                    }
                }
                if(pageid==='page_5'){
                    if(parseInt(pagevalue)+1<pageTotal){
                        getPageValue(2);
                    }else if(parseInt(pagevalue)+1===pageTotal){
                        getPageValue(1,'#page_4');
                    }
                }
            }
            getOtherState();
            func(pageNo);
        });
    }

    //绑定外按钮
    function bindOutside(){
        $('.fl').bind('click',function(){
            var obj=$(this),
                pageid=obj.attr('id');

            if(pageid==='first'){
                pageNo=1;
                initPageValue(1);
                clearAndAdd('#page_1');
            }
            if(pageid==='prv'){
                pageNo--;
                if(pageNo<=2){
                    clearAndAdd('#page_'+pageNo);
                }else if(pageNo+2>=pageTotal){
                    clearAndAdd('#page_'+(5-(pageTotal-pageNo)));
                }else{
                    initPageValue(pageNo-2);
                    clearAndAdd('#page_3');
                }
            }
            if(pageid==='next'){
                pageNo++;
                if(pageNo<=3){
                    clearAndAdd('#page_'+pageNo);
                }else if(pageNo+1>=pageTotal){
                    clearAndAdd('#page_'+(5-(pageTotal-pageNo)));
                }else{
                    initPageValue(pageNo-2);
                    clearAndAdd('#page_3');
                }
            }
            if(pageid==='last'){
                pageNo=pageTotal;
                initPageValue(pageTotal-4);
                clearAndAdd('#page_5');
            }
            getOtherState();
            func(pageNo);
        });
    }

    function start(pTotal,fn,pNo){
        config(pNo,pTotal,fn);
        if(pTotal&&pTotal>0){
            init();
            bindInside();
            bindOutside();
        }
    }

    return {start:start}
    //调用方式
    //window.Rui.getPage.start(6,function(pNo){
    //    console.log('点击了一次，触发回调,当前是页数为：',pNo);
    //});
})();

window.Rui.Alert = (function () {
    function systemMsg(clasName,text){
        var classObj = $(clasName);
        classObj.closest('li').find('.form-error').show().text(text);
    }

    //弹出框
    function getAlert(msg, time) {
        $('body').append('<div class="alert"><span>' + msg + '</span></div>');
        $('.alert').css('bottom',(window.innerHeight-40)/2 +'px').fadeIn();
        setTimeout(function () {
            $('.alert').fadeOut(1000);
            setTimeout(function (){ $('.alert').remove();},1000);
        }, time ? time : 1000);
    }
    return {
        systemMsg:systemMsg,
        getAlert: getAlert
    };
}());
//等待处理状态弹窗
function layerLoading() {
    var layer=window.layer||{};
    layer.open({
        type: 1//Page层类型
        ,skin: 'layui-layer-rim'//加上边框
        ,area: ['464px','318px']
        ,shade: 0.4//遮罩透明度
        ,id: 'lay_cash_result'
        ,title:0
        ,closeBtn:0
        ,btnAlign: 'c'
        ,anim:0 //0-6的动画形式，-1不开启
        ,content: '<div class="text-center color-gray"><i class="ico ico_wait"></i><p class="wait_title">处理中......</p><p class="wait_text">我们正在处理您的请求......</p></div>'
    });
}

window.Rui.Ajax = (function () {
    return function(paras,fun1,fun2,type,loading) {
        var flag = true;
        $.ajax({
            url: paras.mdname,
            data: paras.data,
            type: type ? 'GET' : 'POST',
           beforeSend: function () {
                   setTimeout(function () {
                       if(loading){
                           if(flag) {
                               layerLoading();
                               flag = false;
                           }
                       }
                   },3000)
            },
            complete: function () {
                if(loading){
                    var layer=window.layer||{};
                   //layer.closeAll();
                    //flag = false;
                }
            },
            dataType: 'json',
            success: function (res) {
                console.log('调用结果：',res);
                if(flag){
                    flag = false;
                    if (res.error2) {
                        var paras1 = {
                            id:'error2',
                            skin: 'layui-layer-rim layui-layer-signin',
                            title: '温馨提示',
                            content: '<div class="content">系统繁忙，请稍后重试！</div>',
                            btn: '确定'
                        };
                        Rui.layer(paras1);
                        return false;
                    }
                    //console.groupEnd();
                    if ($.isFunction(fun1)) {
                        fun1(res);
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('【error】');
                if ($.isFunction(fun2)) {
                    fun2(XMLHttpRequest);
                }
            }
        });
    }
}());

window.Rui.Tool=(function () {
    var ajax=Rui.Ajax;

    /*//转换金额：s-金额（单位：分），n-几位小数，type -（1.获取:h，单位为分，2.输入:s，单位为元），res-元
     function nfmoney(s, type,n) {
     n = n > 0 && n <= 20 ? n : 2;
     s = type === 's' ? (parseFloat(s) * 100) : (parseFloat(s) / 100);
     s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
     var l = s.split('.')[0].split('').reverse(),
     r = s.split('.')[1];
     var t = '';
     for (var i = 0; i < l.length; i++) {
     t += l[i] + ((i + 1) % 3 === 0 && (i + 1) != l.length ? ',' : '');
     }
     return t.split('').reverse().join('') + '.' + r;
     }*/

    /**转换金额
     * s:金额（单位：默认为分）
     * power:10的几次冥次方（默认为-2）
     * n:保留几位小数（默认为2）
     * type:s的类型（默认为金额）'':为金额，'z'为非金额,或非金额转换的数值,则power和n必传
     */
    function nfmoney(s, power,n,type) {
        var fuzhi=false;
        if(s===''||s===undefined||s===null){return '暂无数据';}
        if(s<0){
            fuzhi=true;
            s=Math.abs(s);
        }
        power=(type!=='z')?(power||-2):power;
        s = (parseFloat(s) * Math.pow(10,power));
        n = n >= 0 && n <= 20 ? n : 2;
        s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
        var l = s.split('.')[0].split('').reverse(),
            r = (type==='z'&&n===0)?'':(n===0?'':s.split('.')[1]);
        var t = '';
        for (var i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 === 0 && (i + 1) != l.length ? ',' : '');
        }
        return (fuzhi?'-':'')+t.split('').reverse().join('') + (r!==''?('.' + r):'');
    }

    function mfnumber(m,n){
        n = n > 0 && n <= 20 ? n : 2;
        return parseFloat((m+'').split(',').join('')).toFixed(n);
        //parseFloat(data[i].interest.replace(/\,/g,""));
    }

    //点击enter事件
    function btnEnter(fn){
        document.onkeydown=function(event){
            var e = event ? event :(window.event ? window.event : null);
            if(e.keyCode==13){
                if ($.isFunction(fn)) {
                    fn();
                }
            }
        };
    }

    //清空各个表单字段
    function clearFormInputs(ids) {
        for(var i in ids){
            $(ids[i]).val('');
        }
    }
    //初始化和刷新验证码
    function initVCode(vcode,type){
        //init vcode
        vcode = $(vcode);

        var paras = {
            mdname: ('/reloadVcode_'+type+'.json'),
        };
        ajax(paras, function (res) {
            vcode.attr('src',res);
        },'','GET');

        vcode.unbind('click').on('click',function(){
            ajax(paras, function (res) {
                vcode.attr('src',res);
            },'','GET');
        });
    }
    function alerttip(id,text,state){
        $(id).closest('li').find('.form-error').css({'display':state?'none':'block'}).text(text);
        //$(id).next().css({'display':state?'none':'block'}).text(text);
    }

    return{
        clearFormInputs:clearFormInputs,
        initVCode:initVCode,
        btnEnter:btnEnter,
        nfmoney:nfmoney,
        mfnumber:mfnumber,
        alerttip:alerttip
    }
}());

window.Rui.Check = {
    //【start】
    isvalid:function(value){
        //console.log('isvalid',value);
        return (value===''||value===undefined||value===null)?false:true;
    },
    ishas:function(value){
        return (value===''||value===undefined||value===null)?'暂无数据':value;
    },
    //检查是否输入了内容
    isinput: function (value) {
        return (value && value.length) ? true : false;
    },
    //校验密码格式，6到20位密码，数字与字母混合
    isrealpwd:function(value){
        return (value.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,20}$/) !== null) ? true : false;
    },
    //6到20位密码
    ispwdlength:function(value){
        return (value.match(/^[^\s]{6,20}$/) !== null) ? true : false;
    },
    //检查是否为汉字
    isChinese: function (value) {
        return (value.match(/^[\u4e00-\u9fa5]+$/) !== null) ? true : false;
    },
    //检查是否为字母
    isEnglist: function (value) {
        return (value.match(/^[a-zA-Z]*$/) !== null) ? true : false;
    },
    //检查是否只包括字母或数字
    isChineseandEnglist: function (value) {
        return (value.match(/^([\u4e00-\u9fa5]|[a-zA-Z])*$/) !== null) ? true : false;
    },
    //检查是否为数字
    isCureNum: function (value) {
        return (value.match(/^[0-9]*$/) !== null) ? true : false;
    },
    //检查是否为正整数
    isPositiveInteger: function (value) {
        return (value.match(/^([1-9]\d*|0)$/) !== null) ? true : false;
    },
    //验证字符串长度value,最小长度min,最大长度max
    isCertainLength: function (value, min, max) {
        return (value.length >= min && value.length <= max) ? true : false;
    },
    //验证字符串长度value,是否超过某个值
    isMorethanLength: function (value, maxlen) {
        return (value.length > maxlen) ? true : false;
    },
    //arr是否包含element
    isContains: function (arr, element) {
        for (var i = 0; i < arr.length; i++){
            if(arr[i] === element) {
                return true;
            }
        }
        return false;
    },
    isSimpleTel:function(value){
        return (/^1[0-9]{10}$/).test(value);
    },
    //验证大陆手机号
    isMHMobile: function (value) {
        //var _phone = /^1([38]\d|4[57]|5[0-35-9]|7[06-8]|8[89])\d{8}$/ ;
        return (/^((\+?86)|(\(\+86\)))?1[3|4|5|7|8][0-9]{9}$/).test(value);
    },
    //验证邮箱
    isEmail: function (value) {
        return (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/).test(value);
    },
    //验证网络
    isonLine: function () {
        return navigator.onLine;
    },
    //是否是微信
    isWeiXin: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        return (ua.match(/MicroMessenger/i) == 'micromessenger') ? true : false;
    },
    //验证身份证用户名
    isUserName:function(value){
        return (/^[\u2E80-\u9FFF]{2,8}$/).test(value);
    },
    //验证身份证号码
    isCertNo:function (value) {
        return (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(value);
    },
    isOtherAccNo:function (value) {
        return (/^(\d{16}|\d{19})$/).test(value);
    },
    //验证充值金额
    isrechargeAmount:function (value) {
        return (/^(([1-9]\d{0,8})|(0))(\.\d{0,2})?$/).test(value);
    }
    //【end】
};

/*=== 银行列表下拉框 ===*/
$(function () {
    var onOff = true;
    $('.dl_dropdown dt').on('click',function () {
        if (onOff) {
            $(this).closest('dl').find('dd').show();
            $(this).find('.caret').removeClass('fa-caret-down').addClass('fa-caret-up');
        } else {
            $(this).closest('dl').find('dd').hide();
            $(this).find('.caret').removeClass('fa-caret-up').addClass('fa-caret-down');
        }
        onOff = !onOff;
        return false;
    });
    $('.dl_dropdown dd').on('click','li',function () {
        $(this).closest('dl').find('dt').find('span').html($(this).html()).addClass('color-black').attr('code',$(this).attr('code'));
        $('.bankType').closest('li').find('.form-error').hide();
        $('#bankQuota').removeClass('hidden')
            .find('.quotasingle').text($(this).attr('quotasingle'))
            .end().find('.quotadaily').text($(this).attr('quotadaily'));
        $(this).closest('dd').hide();
        $(this).closest('dl').find('.caret').removeClass('fa-caret-up').addClass('fa-caret-down');
        onOff = true;
        return false;
    });
    $(document).click(function () {
        $('.dl_dropdown').find('dd').hide().end().find('.caret').removeClass('fa-caret-up').addClass('fa-caret-down');
        onOff = true;
    });
});
/*===  弹层样式重置 ===*/
$(function () {
    $('#fontawesomecss').after($('#layuicss-skinlayercss'));
});
/*=== 公共选项卡（dl_tab）===*/
$(function () {
    var $tab=$('.dl_tab'),
        $tabDt=$tab.find('dt'),
        $dd=$tab.find('dd');
    $tabDt.find('a').on('click',function () {
        $(this).addClass('active').siblings().removeClass('active');
        $dd.eq($(this).index()).addClass('active').siblings().removeClass('active');
    });
});
/*=== 账户中心侧边栏展开收缩 ===*/
$(function () {
    $('#aside').find('h4').on('click',function () {
        var This=$(this);
        $(this).toggleClass('on');
        if($(this).hasClass('on')){
            $(this).next().slideUp('slow',function () {
                This.find('.fa').removeClass('fa-caret-down').addClass('fa-caret-right');
            });

        }else{
            $(this).next().slideDown('slow',function () {
                This.find('.fa').removeClass('fa-caret-right').addClass('fa-caret-down');
            });
        }
    });
});
// 账户中心顶部通知关闭
$(function () {
    $('.alert_warning .btn_close').on('click', function () {
        $(this).closest('.alert_warning').hide();
    });
});
/*=== 固定导航 ===*/
$(function(){
    var nav=$('#header .navbar'); //得到导航对象
    var win=$(window); //得到窗口对象
    var sc=$(document);//得到document文档对象。
    var iHeight=$('#header .top-bar').height();
    var navHeight=nav.outerHeight(true);
    win.scroll(function(){
        if(sc.scrollTop()>=iHeight){
            //console.log(navHeight);
            nav.addClass('fixednav');
            $('#header .top-bar').css('margin-bottom',navHeight);
        }else{
            nav.removeClass('fixednav');
            $('#header .top-bar').css('margin-bottom','0');
        }
    })
});

/*=== 工具栏 ===*/
window.Rui.Init=(function () {
    var check = window.Rui.Check,
        ajax = window.Rui.Ajax,
        alertControl={amount:false,term:false,annualRate:false},//设置弹出框的开关
        timer=null,
        onOff=true,
        onOff1=true;

    function toolBar() {
        $('.toolbar li').not('.mobile_btn').hover(function () {
            $(this).addClass('active').siblings().removeClass('active');
        }, function () {
            $(this).delay(400).removeClass('active');
        });
        $('.mobile_btn').hover(function () {
            clearTimeout(timer);
            $(this).addClass('active');
        }, function () {
            timer = setTimeout(function () {
                $('.mobile_btn').removeClass('active');
            }, 300);
        });
        $('#unitType').on('click','label',function () {
            //console.log($(this).index());
            if($(this).index()){
                $('#unitTypeDay').show();
                $('#term').next().text('天');
            }else{
                $('#unitTypeDay').hide();
                $('#term').next().text('月');
            }
        });
        $('.calculator .btn_reset').on('click',function () {
            $('#unitTypeDay').show();
        });
        $('.mobile_btn ol li').mouseover(function () {
            $(this).addClass('active').siblings().removeClass('active');
        });

        $(document).scroll(function () {
            var scrollTop = $(this).scrollTop();
            var width = $(window).height();
            if (scrollTop >= width) {
                $('.gotop_btn').fadeIn();
            }
            else if (scrollTop < width) {
                $('.gotop_btn').fadeOut();
            }
        });
        /*=== 返回顶部 ===*/
        $('.gotop_btn').click(function () {
            $('html,body').animate({scrollTop: 0}, 300);
        });

        $('.leftBar a').click(function () {
            if (onOff) {
                $('.calculator_result').animate({'width': 30}, 'slow', function () {
                    $('.leftBar a').removeClass('fa-angle-right').addClass('fa-angle-left');
                });
            }
            else {
                $('.calculator_result').animate({'width': 600}, 'slow', function () {
                    $('.leftBar a').removeClass('fa-angle-left').addClass('fa-angle-right');
                });
            }
            onOff = !onOff;

        });

        $('.calculator dt a').click(function () {
            $('dl.calculator').hide();
            $('.calculator_result').css('width', 0);
            return false;
        });
        $('.calculator_btn').click(function () {
            $('.calculator').show();
        });
    }

    function getBodyHtml(datalist) {
        var html = '', max, dataList;

        html = '', max = datalist.length, dataList = datalist;
        for (var i = 0; i < max-1; i++) {
            html += '<tr class="color-gray">';
            html += '<td style="border-left:none;">' + dataList[i].repayDate + '</td>';
            html += '<td>' + Rui.Tool.nfmoney(dataList[i].income) + '</td>';
            html += '<td>' + Rui.Tool.nfmoney(dataList[i].interest) + '</td>';
            html += '<td>' + Rui.Tool.nfmoney(dataList[i].principle) + '</td>';
            html += '</tr>';
        }

        $('#repayPlanBody').empty().append(html);
    }

    function getFooterHtml(data) {
        var html = '';

        html = '<tr><th style="border-left:none;">总计</th><th>' + Rui.Tool.nfmoney(data.income) + '</th><th>' + Rui.Tool.nfmoney(data.interest) + '</th><th>' + Rui.Tool.nfmoney(data.principle) + '</th></tr>';

        $('#repayPlanFooter').empty().append(html);
    }
    function calculate() {
        var paras = {
            mdname: '/get_calculate.json',
            data: {
                amount:$('#amount').val()*100,
                annualRate:$('#annualRate').val(),
                timeLimitUnit: $('#unitType input:radio:checked').val(),
                repayInterestDay: 1,
                repayStartDate: '',
                repayType:$('#repayType option:selected').val(),
                timeLimit: $('#term').val(),
                isNeedTotal:true
            }
        };
        ajax(paras, function (res) {
            if(res.success===true){
                console.log(2222,res);
                getBodyHtml(res.data);
                getFooterHtml(res.data[res.data.length-1]);
                $('.calculator_result').animate({'width': 600}, 'slow', function () {
                    $('.leftBar a').removeClass('fa-angle-left').addClass('fa-angle-right');
                });
            }
        });
    }

    //校验出借金额
    function checkAmount(obj) {
        if (!check.isinput(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写出借金额');
            alertControl.amount=true;
            return false;
        }
        if (!check.isrechargeAmount(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写正确出借金额');
            alertControl.amount=true;
            return false;
        }
        obj.closest('li').find('.form-error').hide();
        alertControl.amount=false;
        return true;
    }
    //校验出借期限
    function checkTerm(obj) {
        if (!check.isinput(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写出借期限');
            alertControl.term=true;
            return false;
        }
        if (!check.isrechargeAmount(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写正确出借期限');
            alertControl.term=true;
            return false;
        }
        obj.closest('li').find('.form-error').hide();
        alertControl.term=false;
        return true;
    }

    //校验年化收益
    function checkAnnualRate(obj) {
        if (!check.isinput(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写年化收益');
            alertControl.annualRate=true;
            return false;
        }
        if (!check.isrechargeAmount(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写正确年化收益');
            alertControl.annualRate=true;
            return false;
        }
        obj.closest('li').find('.form-error').hide();
        alertControl.annualRate=false;
        return true;
    }
    //出借金额失去焦点，校验出借金额
    function checkAmountAll() {
        $('#amount').on('blur', function () {
            checkAmount($(this));
        });
    }
    //出借期限失去焦点，校验出借期限
    function checkTermAll() {
        $('#term').on('blur', function () {
            checkTerm($(this));
        });
    }
    //年化收益失去焦点，校验年化收益
    function checkAnnualRateAll() {
        $('#annualRate').on('blur', function () {
            checkAnnualRate($(this));
        });
    }
    //点击开始计算
    function clickCalculate() {
        $('.calculator .btn_submit').on('click',function () {
            var arrCheck=[checkAmount($('#amount')),checkTerm($('#term')),checkAnnualRate($('#annualRate'))];
            for(var i in arrCheck){
                if(!arrCheck[i]){
                    onOff1=false;
                }
            }
            if(onOff1){
                //开始计算
                calculate();
            }
        });
    }

    // 我的账户登录时跳转
    function  loginSkipWhere() {
        $('nav .account').on('click',function () {
            sessionStorage.setItem('loginSkip','accountaaaaaa');
        })
    }
    function start() {
        //工具栏
        toolBar();
        //出借金额失去焦点，校验出借金额
        checkAmountAll();
        //出借期限失去焦点，校验出借期限
        checkTermAll();
        //年化收益失去焦点，校验年化收益
        checkAnnualRateAll();
        //点击开始计算
        clickCalculate();
        loginSkipWhere()//登录跳转到我的账户
    }
    return {start:start}
})().start();