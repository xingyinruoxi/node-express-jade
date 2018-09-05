'use strict';
window.productconfirm=(function(){
    var check = window.Rui.Check,
        ajax = window.Rui.Ajax,
        tool = window.Rui.Tool,
        layer = window.Rui.layer,
        investmentInfo=JSON.parse(sessionStorage.getItem('investment_info')),
        dictionary={hongBao:'redpacket',jia:'coupon'},
        ProductType=JSON.parse($('#ProductType').val()),
        selectInfo={name:'hongBao',ids:[]};//设置重置时间

    console.log(33333,investmentInfo);
    var classifyType=['hongbao','jiaxijuan'],
        idheader=['hid','jid'],
        currentSelect=classifyType[0],
        currentid=idheader[0],
        hongorjiaID=[],
        currentname='';

    var paymoney=0;
    var dataRed={};//红包关键数据
    var couponlist={};//加息券关键数据

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
    function getEarnings(){
        var paras = {
            mdname: '/productconfirm_getEarnings.json',
            data: {
                amount:investmentInfo.textAmount*100,
                annualRate:investmentInfo.annualRate,
                timeLimitUnit: investmentInfo.timeLimitUnit,
                repayInterestDay: 1,
                repayStartDate: investmentInfo.repayStartDate,
                repayType:investmentInfo.repayType,
                timeLimit: investmentInfo.timeLimit,
                isNeedTotal:true
            }
        };

        ajax(paras, function (res) {
            console.log(4444,res.data[res.data.length-1].income);
            console.log(4444,res);
            $('#p_income').text(tool.nfmoney(res.data[res.data.length-1].income));
            $('#p_interest').text(tool.nfmoney(res.data[res.data.length-1].interest));
        });
    }

    // 选项卡（dl_tab）  // 没有执行-------------------------------------------------
    function bindTab(){
        $('.dl_tab_new a').bind('click',function(){
            console.log('index111111',$(this).index());
            currentSelect=classifyType[$(this).index()];
            currentid=idheader[$(this).index()];
            console.log(currentSelect,currentid);
            $(this).addClass('active').siblings().removeClass('active');
            $('.dl_tab dd').eq($(this).index()).addClass('active').siblings().removeClass('active');
            selectInfo.name=($(this).index()===0)?'hongBao':'jia';
            if(hongorjiaID.length>0){
                console.log('有值',currentname);
            }else{
                currentname=selectInfo.name;
                console.log('没有值',currentname,selectInfo.name);
            }
            $('#payMoney2').hide();
            $('#payMoney3').hide();
            $('#payMoney4').hide();
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

    function getRedorCouponInfo(){
        console.log('hongorjiaID',hongorjiaID,currentname,selectInfo.name);
        var redmoney=0,couponearening=0;
        if(hongorjiaID.length>0){
            console.log(61);
            if(selectInfo.name==='hongBao'){
                console.log(62);
                for(var i in hongorjiaID){
                    redmoney+=parseFloat(dataRed[hongorjiaID[i]]);
                }
                paymoney=parseFloat(investmentInfo.textAmount)-redmoney;
            }else{
                console.log(63);
                for(var j in hongorjiaID){
                    couponearening+=(investmentInfo.textAmount*parseFloat(couponlist[hongorjiaID[j]]/100)*investmentInfo.timeLimit)/365;
                }
                paymoney=parseFloat(investmentInfo.textAmount);
            }
            if(selectInfo.name==='hongBao'){
                console.log(64);
                $('#payMoney2').show().text('-'+redmoney.toFixed(2)+'='+tool.nfmoney((investmentInfo.textAmount-redmoney)*100,0,'-2'));
                if((investmentInfo.textAmount-redmoney)<$('#accountbalance').text()){
                    $('#nobalance2').hide();
                }
                $('#payMoney3').show();
                $('#payMoney4').hide();
                $('#raiseearning1').hide();
                $('#raiseearning2').hide();
            }else{
                console.log(65);
                $('#payMoney2').hide();
                $('#payMoney3').hide();
                $('#payMoney4').hide();
                $('#raiseearning1').show();
                $('#raiseearning2').show().text(couponearening.toFixed(2));
            }
        }else{
            console.log(66);
            currentname=selectInfo.name;
            console.log(3333,currentname,selectInfo.name);
            paymoney=parseFloat(investmentInfo.textAmount);
            $('#payMoney2').hide();
            $('#payMoney3').hide();
            $('#payMoney4').hide();
            $('#raiseearning1').hide();
            $('#raiseearning2').hide();
        }
        console.log(555,currentname,selectInfo.name);
    }

    //测评结果弹出框
    function layerRedorCoupon(type,obj){
        var paras={
            skin: 'layui-layer-rim',
            title:'温馨提示',
            btn:'确定',
            content: type?'您选用的红包累计金额超出投资可使用限额':'是否放弃当前选中'+(currentname==='hongBao'?'红包':'加息券'),
        };
        layer(paras,function(){
            if(!type){
                //是否放弃当前选中红包
                $((currentname==='hongBao'?'.list_redpacket':'.list_coupon')+' .click').removeClass('click');
                $(obj).find('.red_bag_on').show().addClass('click');
                hongorjiaID=[];
                currentname=selectInfo.name;
                hongorjiaID.push($(obj).attr(currentid));
                getRedorCouponInfo();
                //return true;
            }else{

            }
        });
    }


    //红包，加息券
    //
    /*=== 红包及加息劵（选择） ===*/
    function bindHongBao(){
        $('.category').each(function() {
            $(this).unbind('click').click(function() {
                if($(this).find('.red_bag_on').hasClass('click')){
                    $(this).find('.red_bag_on').show().removeClass('click');
                    remove(hongorjiaID,$(this).attr(currentid));
                    getRedorCouponInfo();
                }else{
                    console.log(1,currentname,selectInfo.name);
                    if(currentname){
                        if(currentname===selectInfo.name){
                            console.log(2,currentname,selectInfo.name,hongorjiaID.length);
                            if(currentname==='jia'&&hongorjiaID.length===1){
                                console.log(21,currentname,selectInfo.name);
                                $(this).find('.red_bag_on').show().addClass('click').parent().siblings().find('.red_bag_on').removeClass('click');
                                hongorjiaID=[];
                                hongorjiaID.push($(this).attr(currentid));
                                getRedorCouponInfo();
                            }else{
                                console.log(22),currentname,selectInfo.name;
                                $(this).find('.red_bag_on').show().addClass('click');
                                hongorjiaID.push($(this).attr(currentid));
                                getRedorCouponInfo();
                            }
                            console.log(23,currentname,selectInfo.name);
                            //$(this).find('.red_bag_on').show().addClass('click');
                            //hongorjiaID.push($(this).attr(currentid));
                            //getRedorCouponInfo();
                        }else{
                            console.log(3);
                            if(hongorjiaID.length>0){
                                console.log(4);
                                layerRedorCoupon('',$(this));
                            }else{
                                console.log(5);
                                $(this).find('.red_bag_on').show().addClass('click');
                                hongorjiaID.push($(this).attr(currentid));
                                getRedorCouponInfo();
                            }
                        }
                    }else{
                        currentname=selectInfo.name;
                        $(this).find('.red_bag_on').show().addClass('click');
                        hongorjiaID.push($(this).attr(currentid));
                        getRedorCouponInfo();
                    }
                }
                $(this).find('.red_bag_hover').hide();

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

    //适用类型
    function dataChange(data) {
        var str='';
        for(var i in data){
            str+=ProductType[data[i]]+'、';
        }
        str=str.substring(0,str.length-1);
        return str;
    }
    //获取红包
    function getUseRedPacketList(){
        var paras = {
            mdname: '/getUseRedPacketList.json',
            data: {
                amount:investmentInfo.textAmount*100,
                needCount:true,
                pageNo:1,
                pageSize:100,
                productId:investmentInfo.pid
            }
        };
        function gethtmlRule(data) {
            var html = '';
            for (var i in data) {
                html += '<p>出借≥' + data[i].limit + '天，出借' + tool.nfmoney(data[i].minAmount) + '元可用；</p>';
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
                    dataRed[data[i].id]=tool.nfmoney(data[i].amount);
                    if(i%4===0){
                        html+='<div class="row">'
                    }
                    html+='<div class="category" hid="'+data[i].id+'">';
                    html+='<div style="display: block;'+(i%4===0?'margin-left: 0':'')+'" class="red_bag_on">';
                    html+='<h4>'+data[i].name+'</h4>';
                    html+='<div class="time"><span>￥'+tool.nfmoney(data[i].amount)+'</span><br>'+formatDateTime(data[i].startTime)+' - '+formatDateTime(data[i].endTime)+'</div>';
                    html+='</div>';
                    html+='<div style="display: none;'+(i%4===0?'margin-left: 0':'')+'" class="red_bag_hover">';
                    html+=gethtmlRule(JSON.parse(data[i].rule))+'<p>适用于'+dataChange(JSON.parse(data[i].productType))+'</p>';
                    html+='</div>';
                    html+='</div>';
                    if(i%4===3||(i===max-1)){
                        html+='</div>'
                    }
                }
                $('.list_redpacket').empty().append(html);
                bindHongBao();
                console.log('dataRed',dataRed);
            }
        });
    }

    //获取加息券
    function getUseCouponList(){
        var paras = {
            mdname: '/getUseCouponList.json',
            data: {
                amount:investmentInfo.textAmount*100,
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
                    couponlist[data[i].id]=data[i].rate;
                    if(i%4===0){
                        html+='<div class="row">'
                    }
                    html+='<div jid="'+data[i].id+'" class="category">';
                    html+='<div style="display: block;'+(i%4===0?'margin-left: 0':'')+'" class="red_bag_on">';
                    html+='<h4>'+data[i].name+'</h4>';
                    html+='<div class="time"><span>'+data[i].rate+'<i>%</i></span><br>'+formatDateTime(data[i].startTime)+' - '+formatDateTime(data[i].endTime)+'</div>';
                    html+='</div>';
                    html+='<div style="display: none;'+(i%4===0?'margin-left: 0':'')+'" class="red_bag_hover">';
                    html+='<p>出借≥'+data[i].minInvestLimit+'天，出借'+tool.nfmoney(data[i].minInvestAmount)+'元可用，适用于'+dataChange(JSON.parse(data[i].productType))+'</p>';
                    html+='</div>';
                    html+='</div>';
                    if(i%4===3||(i===max-1)){
                        html+='</div>'
                    }
                }
                //console.log(html);
                $('.list_coupon').empty().append(html);
                bindHongBao();
                console.log('couponlist',couponlist);
            }
        });
    }


    //短信检验
    function checkSendVcode(obj) {
        if (!check.isinput(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写6位数字验证码');
            return false;
        }
        if (obj.val().length !== 6) {
            obj.closest('li').find('.form-error').show().text('验证码填写错误,请重新填写');
            return false;
        }
        obj.closest('li').find('.form-error').hide();
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


    //获取银行短信
    function getVcode(){
        $('.btn_send_code').bind('click',function(){
            sendMessage('.btn_send_code');
        });
    }

    //点击确认投资
    function bindBtnInvest(){
        $('.btn_submit').bind('click',function(){

            if($('#nobalance2').is(':visible')){
                return false;
            }
            if (!checkSendVcode($('#smsCode'))) {
                return false;
            }

            var paras = {
                mdname: '/confirmInvest.json',
                data: {
                    //amount:paymoney*100,
                    amount:(parseFloat(investmentInfo.textAmount)*100).toFixed(0),
                    couponIds:hongorjiaID,
                    giftType:dictionary[selectInfo.name],
                    //payType:'',
                    productId:investmentInfo.pid,
                    smsCode:$('#smsCode').val(),
                    signToken: $('#signToken').val(),
                    signTicket: $('#signTicket').val(),
                }
            };
            ajax(paras, function (res) {
                console.log(2345678,res);
                if(res.success){
                    sessionStorage.setItem('ProductId',res.data.id);
                   location.href='/product/productsuccess.html';
                }else{
                    sessionStorage.setItem('resultMsg',res.resultMsg);
                    location.href='/product/productfail.html';
                }
            });
        });
    }

    //处理业务
    function dealdata(){
        console.log('investmentInfo',investmentInfo,tool.nfmoney(investmentInfo.textAmount,2,2));
        $('#p_name').text(investmentInfo.name);
        $('#p_investmentAmount').text(tool.nfmoney(investmentInfo.textAmount,'0',2));
        $('#payMoney1').text(tool.mfnumber(tool.nfmoney(investmentInfo.textAmount,'0',2)));
        if(parseFloat($('#accountbalance').text())<parseFloat(investmentInfo.textAmount)){
            $('#nobalance1').show();
            $('#nobalance2').show();
        }
        paymoney=parseFloat(investmentInfo.textAmount)
    }

    // 渲染还款计划
    function randerRepayList(dataList){
        var html ='',
            interestStartD =formatDateTime(investmentInfo.repayStartDate),
            principal = tool.nfmoney(investmentInfo.textAmount,'0',2),
            toltalRetAmout = tool.nfmoney(dataList[dataList.length-1].income),
            proEarn = tool.nfmoney(dataList[dataList.length-1].interest);
        if(dataList.length){
            html += '<div>';
            html += '<span> 投资金额：' + principal + '元</span>';
            html += '<span>  起息日期：' + interestStartD + '</span>';
            html += '<span class="">  计息天数：' + investmentInfo.timeLimit + '天</span>';
            html += '<span class="inCome">  到期总回款: ' + toltalRetAmout + '元</span>';
            html += '<span class="preEarn">  预计收益: ' + proEarn + '元</span>';
            html += '</div>';
            html += '<table class="table" cellpadding="0" cellspacing="0">';
            html += '<thead><th width="119">还款日期</th>';
            html += '<th width="119">还款金额(元)</th>';
            html += '<th width="119">付息金额(元)</th>';
            html += '<th width="119">还本金额(元)</th></thead>';
            html += '<tbody class="trlist text-center">';
            html += '<tr>' + '<td>' + dataList[0].repayDate + '</td>';
            html += '<td>' + toltalRetAmout + '</td>';
            html += '<td>' + proEarn + '</td>';
            html += '<td>' + principal + '</td>';
            html += '</tr></tbody></table>';
        }else {
            html += '<table class="table" cellpadding="0" cellspacing="0">';
            html += '<thead><th width="119">还款日期</th>';
            html += '<th width="119">还款金额(元)</th>';
            html += '<th width="119">付息金额(元)</th>';
            html += '<th width="119">还本金额(元)</th></thead>';
            html += '<tbody class="trlist text-center">';
            html += '<tr>';
            html += '<td>'+ '暂无还款计划' +'</td>';
            html += '</tr></tbody></table>';
        }
        $('.planDetail').empty().append(html);
    }
    // ajax还款计划
    function ajaxRepayPlan() {
        var paras = {
            mdname: '/productconfirm_getEarnings.json',
            data: {
                amount:investmentInfo.textAmount*100,
                annualRate:investmentInfo.annualRate,
                timeLimitUnit: investmentInfo.timeLimitUnit,
                repayInterestDay: 1,
                repayStartDate: investmentInfo.repayStartDate,
                repayType:investmentInfo.repayType,
                timeLimit: investmentInfo.timeLimit,
                isNeedTotal:true
            }
        };
        ajax(paras, function (res) {
            console.log('回款计划',res);
            randerRepayList(res.data);
        });
    }
    //还款计划弹出框--
    function layerRepayPlan(){
        //console.log(6666,'还款计划');
        var paras={
            area:['960px','400px'],
            skin: 'layui-layer-rim',
            title:'净收益还款计划',
            content :'<div class="planDetail"></div>'
        };
        layer(paras,function(){

        });
    }
    // 还款计划
    function getRepayPlay() {
        $('.repayPlan').on('click',function () {
            ajaxRepayPlan();
            layerRepayPlan();
        })
    }

    function start(){
        //处理业务
        dealdata();

        //获取收益
        getEarnings();

        bindTab();

        //bindHongBao();

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

        // 还款计划
        getRepayPlay();
    }
    return {start:start}
})().start();