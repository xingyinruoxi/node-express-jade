'use strict';

window.productdetail = (function () {
    var pid = sessionStorage.getItem('ProductId'),
        ajax = window.Rui.Ajax,
        check = window.Rui.Check,
        layer = window.Rui.layer,
        date = window.Rui.Date,
        tool = window.Rui.Tool,
        isagree = true,
        userInfo = {};

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
            mdname: '/productdetail_getEarnings.json',
            data: {
                amount:type==='text'?$('#textAmount').val()*100:$('#textAmountAlert').val()*100||'0',
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
        //console.log('收益计算paras',paras);
        //return false;
        ajax(paras, function (res) {
            getEarn(res.data,type);
        });
    }

    /* ####所有layer start #### */
    //计算器弹框
    function layerCalculator() {
        $('.calculator').on('click',function(){
            console.log(333333);
            var paras={
                area: ['360px','360px'],
                id: 'layer_calculator',
                shade: 0.1,
                title: '收益计算器',
                content: $('.layer_calculator')
            };
            layer(paras);
            $('#textAmountAlert').on('keyup', function () {
                console.log('1111111');
                getEarnings('list');
            });
        });
    }

    //去开户弹出框
    function layerOpenAccount(){
        var paras={
            skin: 'layui-layer-rim',
            title:'温馨提示',
            content: '您未开通银行存管账户，请开通',
            btn:'去开户'
        };
        layer(paras,function(){
            location.href='/user/bankaccountinfo.html';
        });
    }

    //是否同意弹出框
    function layerIsAgree(){
        var paras={
            skin: 'layui-layer-rim',
            title:'温馨提示',
            content: '请同意《收益权转让协议》',
            btn:'确定'
        };
        layer(paras);
    }
    /* ####所有layer end #### */


    function dealStatus(type){
        if(type==='init'||type==='tendering'){
        }else if(type==='full'||type==='repaying'||type==='repay'){
        }
    }
    //标的状态数组
    /*Init("init", "初始状态"),
     Tendering("tendering", "募集中"),
     Full("full", "募集满标"),
     Flow("flow", "募集流标"),
     Repaying("repaying", "还款中状态"),
     Repay("repay", "已还款");*/
    var tenderStatusArr={
        init:'初始状态',
        tendering:'募集中',
        full:{name:'募集满标',title:'已满标',text:'正常还款中'},
        flow:'募集流标',
        repaying:{name:'还款中状态',title:'还款中',text:'正常还款中'},
        repay:{name:'已还款',title:'已还清',text:'还款完成'}
    };


    //获取商品详情
    function getProductDetails() {

        //绑定递增金额
        function bindAddAmount(){
            $('.add').bind('click',function(){
                $('#textAmount').val($('#textAmount').val()?(parseInt($('#textAmount').val())+100):100);
            });
            $('.reduce').bind('click',function(){
                $('#textAmount').val($('#textAmount').val()>=100?(parseInt($('#textAmount').val())-100):0);
            });
        }

        var paras = {
            mdname: '/productdetail_getinfo.json',
            data: {
                productId: pid
            }
        };
        ajax(paras, function (res) {
            if(!res.success){
                return false;
            }
            var data = res.data.productVO;
            //左上角初始化 start
            $('#p_name').text(check.ishas(data.name));
            $('#p_rate').text(data.annualRate.toFixed(2) + '%');
            $('#p_timeLimit').text(data.timeLimit);
            $('#p_timeLimitUnit').text('投资期限(' + data.timeLimitUnit + ')');
            $('#p_amount').text(tool.nfmoney(data.amount/10000));
            $('#p_createTime').text(date.formatDateTime(data.createTime));
            $('#p_repayStartDate').text(date.formatDateTime(data.repayStartDate));
            $('#p_repayType').text(data.repayType);
            $('#p_tenderInitAmount').text(tool.nfmoney(data.tenderInitAmount) +'元');
            $('#p_tenderIncreaseAmount').text(tool.nfmoney(data.tenderIncreaseAmount) +'元');
            $('#p_borrowerName').text(data.borrowerName);
            //百分比显示
            var percent=Math.round((data.tenderAmount/data.amount)*100);
            $('.progress_bar').css('width',percent+'%').find('.ico_tip').text(percent+'%');
            //左上角初始化 end


            //右上角初始化 start
            $('#p_surplusTenderAmount').text(tool.nfmoney(data.surplusTenderAmount) + '元');
            if(data.tenderStatus==='tendering'||data.tenderStatus==='init'){
                $('.noraml_state').show();
            }else{ //if(data.tenderStatus==='full'||data.tenderStatus==='repaying'||data.tenderStatus==='repay'){
                $('.other_state').show();
                $('#p_tenderStatusTitle').text('此项目'+tenderStatusArr[data.tenderStatus].title);
                $('#p_tenderUser').text('投资人数：'+data.tenderUser||0+'人');
                $('#p_tenderStatus').text('还款状态：企业'+tenderStatusArr[data.tenderStatus].text);
            }
            //右上角初始化 end

            //绑定递增金额
            bindAddAmount();

        });
    }

    //关闭弹出框
    function closealert(){
        $('.pop_container').bind('click',function(){
            $('.pop_container').hide();
            $('.m_alert').hide();
        });
    }

    //弹出登录窗口
    function openLogin(){
        $('.pop_container').show();
        $('.m_alert').show();
    }

    //登陆相关业务
    function islogin(){
        //绑定点击‘请登录’按钮事件
        function clicklogin(){
            $('#login_no>a').bind('click',function(){
                openLogin();
            });
        }
        var paras = {
            mdname: '/productdetail_isProLogin.json',
            data:{}
        };
        ajax(paras, function (res) {
            console.log('$$$$$$$$$$$');
            userInfo=res;
            console.log('userInfo',userInfo);
            if(res.islogin){
                $('#login_yes').removeClass('hidden');
                if(userInfo.eCardType!=='1'){
                    $('#recharge').show();
                }
                //账户余额
                $('#p_accountBalance').text((tool.nfmoney(userInfo.accountBalance)||'0.00') + '元');
                $('#p_accountBalance2').text('账户余额：'+(tool.nfmoney(userInfo.accountBalance) || '0.00')+'元');
            }else{
                $('#login_no').removeClass('hidden');
                //绑定点击‘请登录’按钮事件
                clicklogin();
            }
        });
    }

    //剩余时间倒计时
    function getRemainingTime(){
        function changeTwo(num){
            return num<10?'0'+num:num;
        }
        var timeall=186420;
        function gettime(allsecond){
            var day=Math.floor(allsecond/(24*60*60)),
                dayother=allsecond%(24*60*60),
                hour=changeTwo(Math.floor(dayother/(60*60))),
                minute=changeTwo(Math.floor((dayother%(60*60))/60)),
                second=changeTwo(dayother%60);
            return (day>0?(day+'天 '):'')+hour+':'+minute+':'+second;
        }
        function settime(obj){
            if(timeall===0){
                console.log('结束了');
            }else{
                $(obj).text(gettime(timeall));
                timeall--;
                setTimeout(function () {
                    settime(obj)
                }, 1000);
            }
        }
        settime($('#p_remainingTime'));
    }

    //校验输入金额
    var minAmount=1000,maxAmount=10000000000;
    function checkAmount(obj) {
        var value = $(obj).val();
        if (!check.isinput(value)) {
            obj.closest('li').find('.form-error').show().text('请填写投资金额');
            return false;
        }
        if(value<minAmount){
            obj.closest('li').find('.form-error').show().text('投资金额小于最小起投金额');
            return false;
        }
        if(value%100!==0){
            obj.closest('li').find('.form-error').show().text('投资递增金额应是100的整数倍');
            return false;
        }
        console.log((minAmount+parseInt(value))>maxAmount,parseInt(value)<maxAmount);
        if((minAmount+parseInt(value))>maxAmount&&value<maxAmount){
            obj.closest('li').find('.form-error').show().text('购买剩余金额小于起投金额，需全部购买');
            return false;
        }
        if(value>maxAmount){
            obj.closest('li').find('.form-error').show().text('投资金额大于剩余可投金额');
            return false;
        }
        obj.closest('li').find('.form-error').hide();
        console.log('通过');
        return true;
    }

    //校验输入金额
    function bindclickAmount(){
        $('#textAmount').on('blur keyup', function () {
            //if(checkAmount($(this))){
            //    getEarnings('text');
            //}
            checkAmount($(this));
            getEarnings('text');
        });
    }

    //绑定点击是否同意事件
    function bindAgree() {
        $('#checkRead').bind('click', function () {
            if ($('#checkRead').attr('checked') === 'checked') {
                isagree = true;
                $('#agree').hide();
            } else {
                isagree = false;
                $('#agree').show();
            }
        });
    }

    /* ####测评业务 start #### */
    var test=0;//得分
    var assDic=[
        [-2,0,-2,-3,-10],
        [0,2,6,8,0],
        [2,4,8,10],
        [0,2,6,10],
        [0,2,6,8,10],

        [0,4,8,10],
        [0,4,6,10],
        [4,6,8,10],
        [2,6,10],
        [-5,0,5,10,15],

        [-2,0,2,4,5]
    ];
    function countRes(){
        var assessmentRes=[],
            notDo=[],
            indexNo=1;
        $('.answer').each(function(){
            var value=$(this).attr('option');
            if(value){
                assessmentRes[parseInt(value.split('|')[0].substring(3))-1]=value.split('|')[1];
            }else{
                notDo.push(indexNo);
            }
            indexNo++;
        });
        if(notDo.length>3){
            $('#tip').text('请完成全部问题即可提交').parent().show();
            return true;
        }else if(notDo.length<=3&&notDo.length>0){
            $('#tip').text('第'+notDo.join('、')+'问题未勾选，请完成全部问题即可提交').parent().show();
            return true;
        }
        for(var i in assDic){
            if(assessmentRes[i]){
                console.log(11111111,i,assessmentRes[i],assDic[i][parseInt(assessmentRes[i])-1]);
                test+=(assDic[i][parseInt(assessmentRes[i])-1]);
            }
        }
        console.log('assessmentRes',assessmentRes,'test',test,'notDo',notDo);
        return false;
    }

    //测评题目选项的点击事件
    function bindAssessmentOpt(){
        $('.answer>label').bind('click',function(){
            $(this).css('color','#10002A').find('input').attr('checked','checked').
                end().siblings().css('color','').find('input').removeAttr('checked');
            console.log(11111,$(this).index()+1,$(this).find('input').attr('name'));
            $(this).parent().attr('option',$(this).find('input').attr('name')+'|'+($(this).index()+1));
            return false;
        });
    }

    //获取测评结果类型
    function getAssType(score){
        /* 分值区间 客户风险类型
         81-100分 激进型
         61-80分 积极型
         36—60分 平衡型
         16-35分 稳健型
         -9-15分 保守型*/
        console.log('score',score);
        if(score>=-9&&score<=15){
            return '保守型';
        }else if(score>=16&&score<=35){
            return '稳健型';
        }else if(score>=36&&score<=60){
            return '平衡型';
        }else if(score>=61&&score<=80){
            return '积极型';
        }else if(score>=81&&score<=100){
            return '激进型';
        }else{
            return false;
        }
    }

    //测评结果弹出框
    function layerAssRes(){
        var paras={
            skin: 'layui-layer-rim',
            title:'温馨提示',
            btn:'继续购买',
            content: '<div class="content">感谢您的配合\<br\>您的风险承受能力为：'+getAssType(test)+'！</div>',
        };
        layer(paras,function(){
            console.log(1111111,sessionStorage.getItem('investment_info'));
            location.href='/product/productconfirm.html';
        });
    }

    //提交测评结果
    function submitAssRes(){
        var paras = {
            mdname: '/productdetail_submitAssRes.json',
            data:{
                level: '稳健型',
                score: '20'
            }
        };
        ajax(paras,function(){
            //测评结果弹出框
            layerAssRes();
        });
    }

    //测评测试弹出框
    function layerAssComplete(){
        var paras={
            skin: 'layui-layer-rim',
            title:'客户风认知和分享承受能力评估调查问卷',
            area: ['860px', '640px'],
            btn:'提交测评',
            offset:'t',
            content: $('.layer_question'),
        };
        layer(paras,function(){
            if(countRes()){
                return true;
            }
            console.log('测评通过');
            //提交测评结果
            submitAssRes();

            ////测评结果弹出框
            //layerAssRes();
        });
    }

    //去测评弹框
    function layerIsAssessment() {
        var paras={
            skin: 'layui-layer-rim',
            title: '测评提示',
            btn: ['去测评','取消'],
            content: '<div class="content pad-top-40">'+'出借前需先进行投资者风险承受能力测评，请您先进行测评！'+'</div>'
        };
        layer(paras,function(){

            //提交测评结果
            //submitAssRes();
            //return false;

            layerAssComplete();//测评测试弹出框
            bindAssessmentOpt();
        });
    }

    //测评业务
    function assessment(){
        if(userInfo.riskRating){
            return true;
        }
        return false;
    }
    /* ####测评业务 end #### */

    //点击‘立即投资’
    function bindBtnInvest() {
        //处理判断业务
        function dealJudge() {
            console.log('******流程判断 start******');

            console.log('一、登陆判断 start');
            if (!userInfo.islogin) {
                openLogin();
                return false;
            }
            console.log('一、登陆判断 end');

            console.log('二、登陆开户 start');
            if (!userInfo.bindSerialNo) {
                layerOpenAccount();//去开户弹出框
                return false;
            }
            console.log('二、登陆开户 end');

            console.log('三、输入金额 start');
            if (!checkAmount($('#textAmount'))) {
                return false;
            }
            console.log($('#textAmount').val());
            sessionStorage.setItem('investment_info', JSON.stringify({
                'pid':pid,
                'textAmount': $('#textAmount').val(),
                'accountBalance': userInfo.accountBalance,
                'mobile':userInfo.mobile
            }));
            console.log(44444444, sessionStorage.getItem('investment_info'));
            //return ;
            console.log('三、输入金额 end');

            console.log('四、是否勾选同意 start');
            if (!isagree) {
                layerIsAgree();//是否同意弹出框
                return false;
            }
            console.log('四、是否勾选同意 end');

            console.log('五、是否进行过风险测评 start');
            if (!assessment()) {
                layerIsAssessment();//去测评弹框
                return false;
            }
            console.log('五、是否进行过风险测评 end');

            console.log('******流程判断 end******');

            location.href = '/product/productconfirm.html';
            return false;
        }

        $('#invest').bind('click', function () {
            dealJudge();
        });
    }




    function start() {

        //获取商品详情
        getProductDetails();

        //计算器弹框
        layerCalculator();

        //关闭弹出框
        closealert();

        //是否登录
        islogin();

        //剩余时间倒计时
        getRemainingTime();

        //校验输入金额
        bindclickAmount();

        //绑定点击是否同意事件
        bindAgree();

        //点击‘立即投资’
        bindBtnInvest();
    }

    return {start: start}
}()).start();