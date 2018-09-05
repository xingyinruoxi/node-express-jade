'use strict';
window.productconfirm=(function(){
    var check = window.Rui.Check,
        ajax = window.Rui.Ajax,
        tool = window.Rui.Tool,
        investmentInfo=JSON.parse(sessionStorage.getItem('investment_info')),
        dictionary={hongBao:'redpacket',jia:'coupon'},
        selectInfo={name:'hongBao',ids:[]},
        waitingtime = 5,//设置等待时间
        countdown = waitingtime,//设置重置时间
        alertControl={msgVCode:false};//设置弹出框的开关

    console.log(investmentInfo);
    var classifyType=['hongbao','jiaxijuan'],
        idheader=['hid','jid'],
        currentSelect=classifyType[0],
        currentid=idheader[0],
        hongorjiaID=[];

    //格式化时间
    function formatDateTime(inputTime) {
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
        return y + '-' + m + '-' + d;
    }

    //计算器的收益计算
    function getEarn(data,type){
        var earn=0,html='';
        for(var i=0,max=data.length;i<max;i++){
            if(i===max-1){
                earn=tool.nfmoney(data[i].interest);
                html+='<tr><td>'+data[i].repayDate+'</td><td>'+tool.nfmoney(data[i].income)+'</td></tr>';
            }else{
                html+='<tr><td>'+data[i].repayDate+'</td><td>'+tool.nfmoney(data[i].interest)+'</td></tr>';
            }
        }
        console.log('data111',data);
        if(type==='text'){
            $('#earn').text(earn+'元');
        }else{
            $('#earnAlert').text(earn+'元');
            $('#earnAlertList').empty().append(html);
        }
    }


    //计算器算法
    function getEarnings(type){
        var paras = {
            mdname: '/productconfirm_getEarnings.json',
            data: {
                amount:type==='text'?$('#p_investmentAmount').text()*100:$('#p_investmentAmount').text()*100||'0',
                annualRate:12.5,
                productType:'',
                radio: 'day',
                repayInterestDay: 1,
                repayStartDate: '2017-05-04',
                repayType:'equalInterestMonthlyByDay',
                resultFormat: 'false',
                term: '90'
            }
        };
        console.log('收益计算paras',paras);
        //return false;
        ajax(paras, function (res) {
            console.log(4444,res.data[res.data.length-1].income);
            $('#p_income').text(tool.nfmoney(res.data[res.data.length-1].income));
            $('#p_interest').text(tool.nfmoney(res.data[res.data.length-1].interest));
            //getEarn(res.data,type);
        });
    }

    // 选项卡（dl_tab）
    function bindTab(){
        $('.dl_tab_new a').bind('click',function(){
            console.log('index111111',$(this).index());
            currentSelect=classifyType[$(this).index()];
            currentid=idheader[$(this).index()];
            console.log(currentSelect,currentid);
            hongorjiaID=[];

            $(this).addClass('active').siblings().removeClass('active');
            $('.dl_tab dd').eq($(this).index()).addClass('active').siblings().removeClass('active');
            selectInfo.name=($(this).index()===0)?'hongBao':'jia';
        });
    }

    function indexOf(arr,val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {return i;}
        }
        return -1;
    }

    function remove(arr,val) {
        var index = arr.indexOf(val);
        if (index > -1) {
            arr.splice(index, 1);
        }
    }

    //红包，加息券
    /*=== 红包及加息劵（选择） ===*/
    function bindHongBao(){
        console.log(2222);
        $('.category').each(function() {
            $(this).unbind('click').click(function() {
                console.log(1111,$(this).index());
                $(this).find('.red_bag_on').show().toggleClass('click');
                $(this).find('.red_bag_hover').hide();
                if($(this).find('.red_bag_on').hasClass('click')){
                    console.log('yes');
                    hongorjiaID.push($(this).attr(currentid));
                }else{
                    console.log('no');
                    remove(hongorjiaID,$(this).attr(currentid));
                }
                console.log(111111111111,hongorjiaID);
            });
            $(this).mouseenter(function() {
                $(this).find('.red_bag_hover').show();
                $(this).find('.red_bag_on').hide();
            });
            $(this).mouseleave(function() {
                $(this).find('.red_bag_hover').hide();
                $(this).find('.red_bag_on').show();
            });
        });
    }

    //获取红包
    function getUseRedPacketList(){
        var paras = {
            mdname: '/getUseRedPacketList.json',
            data: {
                amount:1000,
                needCount:true,
                pageNo:1,
                pageSize:100,
                productId:investmentInfo.pid
            }
        };
        function gethtmlRule(data) {
            var html = '';
            for (var i in data) {
                html += '<p>投资≥' + data[i].limit + '天，投资' + data[i].minAmount + '元可用，适用于金保理、金担保</p>';
            }
            return html;
        }
        ajax(paras, function (res) {
            if(res.success){
                console.log('成功',res.list);
                var html='',
                    data=res.list;
                //formatDateTime
                for(var i=0,max=data.length;i<max;i++){

                    if(i%4===0){
                        html+='<div class="row">'
                    }
                    html+='<div class="category" hid="'+data[i].id+'">';
                    html+='<div '+(i%4===0?'style=margin-left: 0px; display: block;':'')+' class="red_bag_on">';
                    html+='<h4>'+data[i].name+'</h4>';
                    html+='<div class="time"><span>￥'+data[i].amount+'</span><br>'+formatDateTime(data[i].startTime)+' - '+formatDateTime(data[i].endTime)+'</div>';
                    html+='</div>';
                    html+='<div '+(i%4===0?'style=margin-left: 0px; display: none;':'')+' class="red_bag_hover">';
                    //html+='<p>投资≥30天，投资88888元可用，适用于金保理、金担保</p>';
                    //html+='<p>投资≥30天，投资88888元可用，适用于金保理、金担保</p>';
                    html+=gethtmlRule(JSON.parse(data[i].rule));
                    html+='</div>';
                    html+='</div>';
                    if((i!==0&&i%3===0)||(i===max-1)){
                        html+='</div>';
                    }
                }
                //console.log(html);
                $('.box').empty().append(html);
                bindHongBao();
            }
        });
    }

    //获取加息券
    function getUseCouponList(){
        var paras = {
            mdname: '/getUseCouponList.json',
            data: {
                amount:1000,
                needCount:true,
                pageNo:1,
                pageSize:100,
                productId:investmentInfo.pid
            }
        };
        ajax(paras, function (res) {
            if(res.success){
                console.log('成功',res.list);
                var html='',
                    data=res.list;
                for(var i=0,max=data.length;i<max;i++){

                    if(i%4===0){
                        html+='<div class="row">'
                    }
                    html+='<div jid="'+data[i].id+'" class="category">';
                    html+='<div '+(i%4===0?('style=margin-left: 0px; display: block;'):'')+' class="red_bag_on">';
                    html+='<h4>'+data[i].name+'</h4>';
                    html+='<div class="time"><span>'+data[i].rate+'<i>%</i></span><br>'+formatDateTime(data[i].startTime)+' - '+formatDateTime(data[i].endTime)+'</div>';
                    html+='</div>';
                    html+='<div '+(i%4===0?('style=margin-left: 0px; display: block;'):'')+' class="red_bag_hover">';
                    html+='<p>投资≥30天，投资88888元可用，适用于金保理、金担保</p>';
                    html+='<p>投资≥30天，投资88888元可用，适用于金保理、金担保</p>';
                    html+='</div>';
                    html+='</div>';
                    if((i!==0&&i%3===0)||(i===max-1)){
                        html+='</div>';
                    }
                }
                //console.log(html);
                $('.tab').empty().append(html);
                bindHongBao();
            }
        });
    }

    //关闭提示
    function otherFun() {
        $('.btn-close').bind('click', function () {
            console.log(111,$(this).closest('.form-error').next().attr('id'));
            alertControl[$(this).closest('.form-error').next().attr('id')]=false;
            $(this).closest('.form-error').hide();
            console.log(alertControl);
        });
    }

    //短信检验
    function checkSendVcode(obj) {
        if (!check.isinput(obj.val())) {
            obj.prev().show().find('.text').text('请填写6位数字验证码');
            alertControl.msgVCode=true;
            return false;
        }
        if (obj.val().length !== 6) {
            obj.prev().show().find('.text').text('验证码填写错误,请重新填写');
            alertControl.msgVCode=true;
            return false;
        }
        obj.prev().hide();
        alertControl.msgVCode=false;
        return true;
    }

    //短信验证码校验
    function checkSendVcodeAll() {
        $('#smsCode').bind('blur',function(){
            if (!checkSendVcode($(this))) {
                return false;
            }
        });
    }

    //发送短信和倒计时
    function sendMessage(id){
        //倒计时
        //countDown(id);
        window.Rui.countDown.Down(id,sendMessage);

        var paras = {
            mdname: '/getVcodeInvest.json',
            data: {
                mobile:investmentInfo.mobile,
                type:'2'
                //类型 1:开立存管账户;2:资金冻结;4:充值;5:提现;6:转让;7:自动投标设置;8:解绑;9:修改手机号码;10:变更存管账户;
            }
        };
        console.log('短信',paras);
        ajax(paras, function (res) {

        });
    }

    //点击发送验证码倒计时60s
    function countDown(id){
        function settime() {
            console.log(id);
            if (countdown === 0) {
                countdown = waitingtime;
                $(id).text('发送验证码').click(function(){
                    sendMessage(id);
                });
            } else {
                $(id).text(countdown + 's');
                countdown--;
                setTimeout(function () {
                    settime(id)
                }, 1000);
            }
        }
        settime(id);
        $(id).unbind('click');
    }

    //获取银行短信
    function getVcode(){
        $('.btn_send_code').bind('click',function(){
            sendMessage('.btn_send_code');
        });
    }

    function bindBtnInvest(){
        $('.btn_submit').bind('click',function(){
            console.log('fffff');
            if (!checkSendVcode($('#smsCode'))) {
                return false;
            }
            //
            //if(selectInfo.name==='hongBao'){
            //    console.log('hongBao');
            //    $('.box .click').each(function(){
            //        //selectInfo.ids.push($(this).parent().attr('hid'));
            //    });
            //}else{
            //    console.log('jia');
            //    $('.tab .click').each(function(){
            //        console.log('11111');
            //        console.log($(this).parent().attr('jid'));
            //        selectInfo.ids.push($(this).parent().attr('jid'));
            //    });
            //}
            console.log('btn_submit',hongorjiaID);

            var paras = {
                mdname: '/confirmInvest.json',
                data: {
                    amount:investmentInfo.textAmount,
                    couponIds:hongorjiaID,
                    giftType:dictionary[selectInfo.name],
                    payType:'',
                    productId:investmentInfo.pid,
                    smsCode:$('#smsCode').val()
                }
            };

            console.log('paras',paras);
            //return false;
            ajax(paras, function (res) {
                console.log(44444,res,res.success);
                if(res.success){
                    location.href='currentsale.html';
                }
            });
        });
    }

    function start(){
        console.log('investmentInfo',investmentInfo);
        $('#p_investmentAmount').text(parseInt(investmentInfo.textAmount).toFixed(2));

        //获取收益
        getEarnings();

        //关闭提示
        otherFun();

        bindTab();

        bindHongBao();

        //购买获取用户可用红包
        getUseRedPacketList();

        //购买获取用户可用加息券
        getUseCouponList();

        //获取银行短信
        getVcode();

        //短信验证码校验
        checkSendVcodeAll();

        //点击确认投资
        bindBtnInvest();
    }
    return {start:start}
})().start();