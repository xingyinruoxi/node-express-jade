'use strict';

window.productdetail = (function () {
    var idget=location.pathname.split('/'),
        idget1=idget[idget.length-1].split('.')[0],
        //pid = sessionStorage.getItem('ProductId'),
        pid=idget1,
        ajax = window.Rui.Ajax,
        check = window.Rui.Check,
        layer = window.Rui.layer,
        date = window.Rui.Date,
        tool = window.Rui.Tool,
        isagree = true,
        currentProductInfo={},
        userTenderAmount,
        userInfo = {},
        TimeLimitUnit=JSON.parse($('#TimeLimitUnit').val()),
        RepayType=JSON.parse($('#RepayType').val());

    var minAmount=0,maxAmount=0;//最小起投金额，最大出借金额
    //计算器的收益计算
    function getEarn(data,type){
        var earn=0,html='';
        if(data){
            for(var i=0,max=data.length;i<max;i++){
                if(i===max-1){
                    earn=tool.nfmoney(data[i].interest);
                    html+='<tr><td>'+check.ishas(data[i].repayDate)+'</td><td>'+tool.nfmoney(data[i].income)+'</td></tr>';
                }else{
                    html+='<tr><td>'+check.ishas(data[i].repayDate)+'</td><td>'+tool.nfmoney(data[i].interest)+'</td></tr>';
                }
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

    var repaytype={'一次性还本付息':'principalAndInterestTotally','先息后本':'equalInterestMonthlyByDay'};
    var timetype={'天':'day','月':'month'};
    //计算器算法
    function getEarnings(type){
        var paras = {
            mdname: '/productdetail_getEarnings.json',
            data: {
                amount:type==='text'?$('#textAmount').val()*100:$('#textAmountAlert').val()*100||'0',
                //amount:'1000'*100,
                annualRate:currentProductInfo.annualRate,
                timeLimitUnit: currentProductInfo.timeLimitUnit,
                repayInterestDay: 1,
                repayStartDate: date.formatDateTime(currentProductInfo.repayStartDate),

                repayType:currentProductInfo.repayType,
                timeLimit: currentProductInfo.timeLimit,
                isNeedTotal:true
            }
        };
        console.log('收益计算paras',paras,currentProductInfo.repayType);
        //return false;
        ajax(paras, function (res) {
            getEarn(res.data,type);
        });
    }

    /* ####所有layer start #### */
    //计算器弹框
    function layerCalculator() {
        $('#p_calculator').on('click',function(){
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
            content: '<div class="pad-top-40 font16">您未开通银行存管账户，请开通</div>',
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
            content: '<div class="content pad-top-30 font15">请同意《金投手平台网络借贷信息撮合服务协议-出借人》和《票据贷借款项目协议-出借人/借款人/金投手》</div>',
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

    //剩余时间倒计时
    function getRemainingTime(timeEnd,timeCurrent){
        function changeTwo(num){
            return num<10?'0'+num:num;
        }
        //var timeall=186420;
        var timeall=timeEnd>timeCurrent?((timeEnd-timeCurrent)/1000).toFixed(0):0;
        console.log('剩余时间：',timeEnd,timeCurrent,timeall);
        function gettime(allsecond){
            var day=Math.floor(allsecond/(24*60*60)),
                dayother=allsecond%(24*60*60),
                hour=changeTwo(Math.floor(dayother/(60*60))),
                minute=changeTwo(Math.floor((dayother%(60*60))/60)),
                second=changeTwo(dayother%60);
            return (day>0?(day+'天'):'')+hour+'时'+minute+'分'+second+'秒';
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
        flow:{title:'募集流标',text:'已结清'},
        repaying:{name:'还款中状态',title:'还款中',text:'正常还款中'},
        repay:{name:'已还款',title:'已还清',text:'还款完成'}
    };


    //获取商品详情
    function getProductDetails() {

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
            console.log(1234567876,res);
            var data = res.data.productVO;
            currentProductInfo=data;
            //面包屑
            $('.breadcrumb li:nth-child(3)').text(data.name);
            $('head title').text(data.name+'_金投手-国资控股互联网金融平台');
            $('meta[name="keywords"]').attr('content',data.name+',金投手,国资控股,互联网金融平台');

            //左上角初始化 start
            //金保理
            $('#p_name').text(check.ishas(data.name));
            $('#p_label').text(data.isAdvanceRepayment==='true'?'支持提前还款':'不支持提前还款');
            console.log(34567,data.isTenderingPay);
            if(data.isTenderingPay==='true'){
                $('#p_label').after('<label class="label label-default">募集期计息</label>');
            }
            $('#p_rate').text(tool.nfmoney(data.annualRate,0,2,'z') + '%');
            $('#p_timeLimit').text(check.ishas(data.timeLimit));
            //$('#p_timeLimitUnit').text('出借期限(' + check.ishas(data.timeLimitUnit&&TimeLimitUnit[data.timeLimitUnit]) + ')');
            $('#p_timeLimitUnit').text('出借期限(' + check.ishas(TimeLimitUnit[data.timeLimitUnit]) + ')');

            $('#p_amount').text(tool.nfmoney(data.amount/10000));
            $('#p_createTime').text(check.isvalid(data.tenderStartTime)?date.formatDateTime(data.tenderStartTime):'暂无数据');

            $('#p_repayStartDate').text(check.isvalid(data.repayStartDate)?date.formatDateTime(data.repayStartDate):'暂无数据');
            $('#p_repayType').text(check.ishas(data.repayType&&RepayType[data.repayType]));
            $('#p_tenderInitAmount').text(tool.nfmoney(data.tenderInitAmount) +'元');
            $('#p_tenderIncreaseAmount').text(tool.nfmoney(data.tenderIncreaseAmount) +'元');
            $('#p_borrowerName').text(check.ishas(data.borrowerName));

            //出口退税或票据贷$('#').text();
            $('#c_tenderStartTime').text(check.isvalid(data.tenderStartTime)?date.formatDateTime(data.tenderStartTime):'暂无数据');
            $('#c_tenderEndTime').text(check.isvalid(data.tenderEndTime)?date.formatDateTime(data.tenderEndTime):'暂无数据');
            $('#c_repayStartDate').text(check.isvalid(data.repayStartDate)?date.formatDateTime(data.repayStartDate):'暂无数据');
            $('#c_productEndTime').text(check.isvalid(data.productEndTime)?date.formatDateTime(data.productEndTime):'暂无数据');
            //$('#c_singleMaxAmont').text(tool.nfmoney(data.singleMaxAmont) +'元');
            $('#c_singleMaxAmont').text(data.singleMaxAmont?tool.nfmoney(data.singleMaxAmont)+'元':'没有上限');

            //$('#c_tenderMaxAmount').text(tool.nfmoney(data.tenderMaxAmount) +'元');
            $('#c_tenderMaxAmount').text(data.tenderMaxAmount?tool.nfmoney(data.tenderMaxAmount)+'元':'没有上限');

            $('#c_productRisk').text(data.productRisk||'暂无数据');
            userTenderAmount=data.userTenderAmount;//用户已投金额
            for(var i in data.productExtends) {
                if (data.productExtends[i].description === '承兑银行') {
                    console.log('1111', data.productExtends[i]);
                    $('#c_productExtends_value').text(data.productExtends[i].value);
                }
            }


            //百分比显示

            var percent=check.isvalid(data.tenderAmount/data.amount)?Math.round((data.tenderAmount/data.amount)*100):0;
            //$('.progress_bar').css('width',percent+'%').find('.ico_tip').text(percent+'%');

            if(data.tenderStatus==='full'){
                percent='100';
            }else if(data.tenderStatus==='init'){
                percent='0';
            }
            $('.progress_bar').css('width',percent+'%').find('.ico_tip').text(percent+'%');
            //左上角初始化 end


            //右上角初始化 start
            getRemainingTime(data.tenderEndTime,res.systemTime); //剩余时间倒计时
            $('#p_surplusTenderAmount').text(tool.nfmoney(data.surplusTenderAmount) + '元');
            $('#textAmount').attr('placeholder',tool.nfmoney(data.tenderInitAmount)+'元起投,'+tool.nfmoney(data.tenderIncreaseAmount)+'元递增');//tenderInitAmount,tenderIncreaseAmount
            if(data.tenderStatus==='tendering'||data.tenderStatus==='init'){
                $('.noraml_state').show();
            }else if(data.tenderStatus==='full') {
                $('.invest_record .row').find('.col-33').eq(1).hide().end().eq(2).hide();
            }else{ //if(data.tenderStatus==='full'||data.tenderStatus==='repaying'||data.tenderStatus==='repay'){
                $('.other_state').show();
                $('#p_tenderStatusTitle').text('此项目'+(check.isvalid(data.tenderStatus)?tenderStatusArr[data.tenderStatus].title:'暂无数据'));
                $('#p_tenderUser').text('出借人数：'+(data.tenderUser||0)+'人');
                $('#p_tenderStatus').text('还款状态：企业'+(check.isvalid(data.tenderStatus)?tenderStatusArr[data.tenderStatus].text:'暂无数据'));
                //$('#p_tenderStatus').text('还款状态：企业'+check.isvalid(tenderStatusArr[data.tenderStatus]) ?tenderStatusArr[data.tenderStatus].text:'暂无数据'   );

            }
            if(data.tenderStatus==='full'){
                $('.invest_record .row').find('.col-33').eq(1).hide().end().eq(2).hide();
            }
            //最小起投金额
            minAmount=data.tenderInitAmount/100;
            if(!data.singleMaxAmont||data.singleMaxAmont===0){
                maxAmount=data.surplusTenderAmount/100;
            }else{
                maxAmount=data.singleMaxAmont;
            }
            if($('#textAmount').val()){
                $('#textAmount').trigger('blur');
            }
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
            $('#login_no>a,#login_no2>a').bind('click',function(){
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
                $('#login_yes,#login_yes2').removeClass('hidden');
                if(userInfo.eCardType!=='1'){
                    $('#recharge').show();
                    if(userInfo.bindSerialNo){
                        $('#recharge').attr('href','../user/recharge.html');
                    }else{
                        $('#recharge').attr('href','../user/bankaccountinfo.html');
                    }
                }

                //账户余额
                $('#p_accountBalance').text((tool.nfmoney(userInfo.accountBalance)||'暂无数据') + '元');
                $('#p_accountBalance2').text((tool.nfmoney(userInfo.accountBalance) || '暂无数据')+'元');
            }else{
                $('#login_no,#login_no2').removeClass('hidden');
                //绑定点击‘请登录’按钮事件
                clicklogin();
            }
        });
    }


    //校验输入金额

    function checkAmount(obj) {
        var value = $(obj).val();
        if (!check.isinput(value)) {
            obj.parent().find('.form-error').show().text('请填写出借金额');
            return false;
        }
        if((value*100)>userInfo.accountBalance){
            obj.parent().find('.form-error').show().text('您的存管账户余额不足，请重新输入');
            return false;
        }
        if(value<minAmount){
            obj.closest('li').find('.form-error').show().text('出借金额小于最小起投金额');
            return false;
        }
        var tenderIncreaseAmount=($('#p_tenderIncreaseAmount').text());
        if(value%Number(tenderIncreaseAmount.substr(0,tenderIncreaseAmount.length-1))!==0){
            obj.closest('li').find('.form-error').show().text('出借递增金额应是'+tenderIncreaseAmount+'的整数倍');
            return false;
        }
        var singleMaxAmont=$('#c_singleMaxAmont').text().replace(/[^\d\.]/g,'');
        if(singleMaxAmont){
            if(value>Number(singleMaxAmont)){
                obj.closest('li').find('.form-error').show().text('出借金额超出单笔出借限额');
                return false;
            }
        }
        var tenderMaxAmount=$('#c_tenderMaxAmount').text().replace(/[^\d\.]/g,'');
        if(tenderMaxAmount){
            if((Number(value)+userTenderAmount)>Number(tenderMaxAmount)){
                obj.closest('li').find('.form-error').show().text('出借金额超出单人投资限额');
                return false;
            }
        }





        if(maxAmount!==parseFloat(value)&&value<maxAmount){
            if((maxAmount-value)<minAmount){
                obj.closest('li').find('.form-error').show().text('购买剩余金额小于起投金额，需全部购买');
                return false;
            }
        }
        if(value>maxAmount){
            obj.closest('li').find('.form-error').show().text('出借金额大于剩余可投金额');
            return false;
        }
        obj.closest('li').find('.form-error').hide();
        console.log('通过');
        return true;
    }

    //校验输入金额
    function bindclickAmount(){
        $('#textAmount').on('keyup blur', function () {
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
         81-100分 激进型 5
         61-80分 积极型 4
         36—60分 平衡型 3
         16-35分 稳健型 2
         -9-15分 保守型 1*/
        console.log('score',score);
        if(score>=-9&&score<=15){
            return '1';
        }else if(score>=16&&score<=35){
            return '2';
        }else if(score>=36&&score<=60){
            return '3';
        }else if(score>=61&&score<=80){
            return '4';
        }else if(score>=81&&score<=100){
            return '5';
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
                level:getAssType(test),
                score: test,
                signToken: $('#signToken').val(),
                signTicket: $('#signTicket').val(),
            }
        };
        console.log('提交测评结果',paras);
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
            skin: 'layui-layer-rim layui-layer-test',
            title: '测评提示',
            btn: ['去测评','取消'],
            content: '<div class="content pad-top-40 font16">'+'出借前需先进行出借者风险承受能力测评，<br>请您先进行测评！'+'</div>'
            //content: '<div class="content pad-top-40">'+'出借前请先进行风险承受能力测评！'+'</div>'
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
        console.log('无可奈何111',userInfo.riskRating);
        if(userInfo.riskRating){
            return true;
        }
        return false;
    }
    /* ####测评业务 end #### */

    //点击‘立即出借’
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
                'name':currentProductInfo.name,
                'textAmount': $('#textAmount').val(),
                'accountBalance': userInfo.accountBalance,
                'mobile':userInfo.mobile,
                annualRate:currentProductInfo.annualRate,
                //timeLimitUnit:timetype[currentProductInfo.timeLimitUnit],
                timeLimitUnit:currentProductInfo.timeLimitUnit,
                repayStartDate: date.formatDateTime(currentProductInfo.repayStartDate),
                //repayType:repaytype[currentProductInfo.repayType],
                repayType:currentProductInfo.repayType,
                timeLimit: currentProductInfo.timeLimit,
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


    /*=== 文件协议轮播 ===*/
    function scrollImg() {
        var oPic=$('#slider_pic').find('ul'),
            oImg=oPic.find('li'),
            oLen=oImg.length,
            prev=$('#prev'),
            next=$('#next'),
            iNow=0;

        oPic.width(oLen*328);//计算总长度
        function clickScroll(){

            iNow === 0? prev.addClass('no_click'): prev.removeClass('no_click');
            iNow === oLen-3?next.addClass('no_click'):next.removeClass('no_click');

            oPic.animate({left:-iNow*310})
        }
        prev.click(function(){
            if(iNow>0){
                iNow--;

            }
            clickScroll();
        });
        next.click(function(){
            if(iNow<oLen-3){
                iNow++
            }
            clickScroll();
        });
        $('.alert-pic').each(function(){
            $(this).hover(function(){
                $(this).find('.slider-text').show();
            },function(){
                $(this).find('.slider-text').hide();
            });
        });
        $('.alert-pic').click(function(){
            var iWidth=$(window).height();
            $('.modal-backdrop').fadeIn();
            $('.placeholder-img').find('img').attr('src',$(this).attr('_href'));
            $('.placeholder-img').css({'height':iWidth,'lineHeight':iWidth+'px'}).fadeIn();
        });
        $('.placeholder-img').click(function(){
            $('.placeholder-img').fadeOut();
            $('.modal-backdrop').fadeOut('slow');
        });
    }
    //展示投资记录
    function goDepositHistory() {
        if(location.search.substr(-1,1)==4){
            var tabLinks=$('.dl_tab dt a'),
                tabContents=$('.dl_tab dd');
            tabLinks.eq(tabLinks.length-1).addClass('active').siblings().removeClass('active');
            tabContents.eq(tabLinks.length-1).addClass('active').siblings().removeClass('active');
            $('html,body').animate({
                scrollTop: '520px'
            }, 0);
        }
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
        //校验输入金额
        bindclickAmount();

        //绑定点击是否同意事件
        bindAgree();

        //点击‘立即出借’
        bindBtnInvest();
        //文件协议轮播
        scrollImg();
        goDepositHistory();//展示投资记录

    }

    return {start: start}
}()).start();


