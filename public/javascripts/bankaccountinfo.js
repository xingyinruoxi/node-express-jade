/**
 * Created by yangrui on 17/4/21.
 */
'use strict';
window.bankaccountinfo = (function () {
    var check = window.Rui.Check,
        ajax = window.Rui.Ajax,
        waitingtime = 60,//设置等待时间
        countdown = waitingtime,
        onOff=true;//设置重置时间

    var layer=window.layer||{};


    //开通结果弹层
    function layerBankOpen(btnText,content,onOff,href) {
        layer.open({
            type: 1//Page层类型
            ,skin: 'layui-layer-rim'//加上边框
            ,area: ['464px','318px']
            ,shade: 0.4//遮罩透明度
            ,id: 'lay_open_result'
            ,title: '开通结果'
            ,btn:btnText
            ,btnAlign: 'c'
            ,anim: 0 //0-6的动画形式，-1不开启
            ,content: '<div class="text-center color-gray">'+content+'</div>'
            ,btn1:function () {
                if(onOff){
                    location.href=href;
                }else{
                    layer.closeAll();
                }
            }
        });
    }
    //等待处理状态弹窗
    function layerLoading(content) {
        layer.open({
            type: 1//Page层类型
            ,skin: 'layui-layer-rim'//加上边框
            ,area: ['464px','318px']
            ,shade: 0.4//遮罩透明度
            ,id: 'lay_cash_result'
            ,title:0
            ,closeBtn:0
            ,btnAlign: 'c'
            ,anim: -1 //0-6的动画形式，-1不开启
            ,content: '<div class="text-center color-gray"><i class="ico ico_wait"></i><p class="wait_title">处理中......</p><p class="wait_text">我们正在处理您的提现请求......</p></div>'
        });
    }
    //点击发送验证码倒计时60s
    function clickCountDown(val){

        function settime(val) {
            if (countdown === 0) {
                countdown = waitingtime;
                $(val).text('发送验证码').click(function(){
                    clickCountDown(val);
                });
            } else {
                $(val).text(countdown + 's');
                countdown--;
                setTimeout(function () {
                    settime(val)
                }, 1000);
            }
        }

        settime(val);
        $(val).unbind('click');
    }

    // 校验用户名
    function checkUserName(obj) {
        console.log('checkUserName',11111);
        if (!check.isinput(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写您的真实姓名');
            return false;
        }
        if (!check.isUserName(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写您的真实姓名');
            return false;
        }
        obj.closest('li').find('.form-error').hide();
        return true;
    }
    //校验身份证号
    function checkCertNo(obj) {
        if (!check.isinput(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写身份证号码');
            return false;
        }
        if (!check.isCertNo(obj.val())) {
            obj.closest('li').find('.form-error').show().text('身份证号码填写错误，请重新填写');
            return false;
        }
        obj.closest('li').find('.form-error').hide();
        return true;
    }
    //校验银行卡号
    function checkOtherAccNo(obj) {
        if (!check.isinput(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写银行卡号');
            return false;
        }
        if (!check.isOtherAccNo(obj.val())) {
            obj.closest('li').find('.form-error').show().text('银行卡号填写错误，请重新填写');
            return false;
        }
        obj.closest('li').find('.form-error').hide();
        return true;
    }
    //校验银行支行
    function checkBranchNo(obj) {
        if (!check.isinput(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写银行支行信息');
            return false;
        }
        obj.closest('li').find('.form-error').hide();
        return true;
    }
    //校验银行预留手机号
    function checkMobile(obj) {
        if (!check.isinput(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写银行预留手机号码');
            return false;
        }
        if (!check.isSimpleTel(obj.val())) {
            obj.closest('li').find('.form-error').show().text('银行预留手机号填写错误，请重新填写');
            return false;
        }
        obj.closest('li').find('.form-error').hide();
        return true;
    }
    //校验银行手机号验证码
    function checkMobileCode(obj) {
        if (!check.isinput(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写手机验证码');
            return false;
        }
        if (obj.val().length !== 6) {
            obj.closest('li').find('.form-error').show().text('手机验证码填写错误,请重新填写');
            return false;
        }
        obj.closest('li').find('.form-error').hide();
        return true;
    }
    //协议
    function checkRead() {
        if($('#checkRead').attr('checked') === 'checked'){
            $('#agree').hide();
            return true;
        }else{
            $('#agree').show();
            return false;
        }

    }

    //银行列表Html
    function bankListHtml(dataList) {
        var html='',max=dataList.length;
        for(var i=0;i<max;i++){
            html+='<li><img src="/images/banks/YH'+dataList[i].code+'.png" code="'+dataList[i].code+'" name="'+dataList[i].name+'"></li>';
        }
        $('#bankList').empty().append(html);
    }
    //银行支行列表Html
    function branchNoListHtml(dataList) {
        var html='',max=dataList.length;
        for(var i=0;i<max;i++){
            html+='<li renhanghao="'+dataList[i].renhanghao+'">'+dataList[i].branchBankName+'</li>';
        }
        $('#branchNoList').empty().append(html);
    }

    //获取银行列表
    function getBankList(){
        var paras = {
            mdname: '/get_banklist.json',
            data: {
            }
        };
        ajax(paras, function (res) {
            bankListHtml(res.data.data);
        });
    }

    //开户银行支行查询
    function searchBranchNo() {
        $('#branchNo').on('keyup',function () {

            var paras = {
                mdname: '/get_branchno.json',
                data: {
                    bankCode:$('.bankType').find('img').attr('code'),
                    branchBankName:$('#branchNo').val()
                }
            };
            ajax(paras, function (res) {
                if(res.success===true){
                    $('#branchNo').next().show();
                    branchNoListHtml(res.data);
                }else{
                    $('#branchNo').next().hide();
                }
            });
        });
    }
    function sendMobilCode() {

        if (!checkMobile($('#mobile'))) {
            return false;
        }
        //倒计时
        clickCountDown('.btn_send_code');
        var paras= {
            mdname: '/sendmsg_bank.json',
            data: {
                mobile: $('#mobile').val(),
                type:1
            }
        };
        ajax(paras, function (res) {
            console.log('银行短信数据：',res);
        });
    }
    //获取银行手机验证码
    function getBankSendVcode() {
        $('.btn_send_code').bind('click', function () {
            //发送短信
            sendMobilCode();
        });
    }



    //用户名失去焦点，校验用户名
    function checkUserNameAll() {
        $('#userName').on('blur', function () {
            checkUserName($(this));
        });
    }
    //身份证号失去焦点，校验身份证号
    function checkCertNoAll() {
        $('#certNo').on('blur', function () {
            checkCertNo($(this));
        });
    }
    //银行卡号失去焦点，校验银行卡号
    function checkOtherAccNoAll() {
        $('#otherAccNo').on('blur', function () {
            checkOtherAccNo($(this));
        });
    }
    //银行支行失去焦点，校验银行支行
    function checkBranchNoAll() {
        $('#branchNo').on('blur', function () {
            checkBranchNo($(this));
        });
    }
    //银行预留手机号失去焦点，校验手机号
    function checkMobileAll() {
        $('#mobile').on('blur', function () {
            checkMobile($(this));
        });
    }
    //手机验证码失去焦点，校验手机验证码
    function checkMobileCodeAll() {
        $('#mobileCode').on('blur', function () {
            if (!checkMobile($('#mobile'))) {
                return false;
            }
            checkMobileCode($(this));
        });
    }

    //发起开开通请求
    function bankOpen() {
        var paras = {
            mdname: '/bankOpen.json',
            data: {
                accountName: $('#userName').val(),
                branchNo: $('#branchNo').attr('renhanghao'),
                certNo:$('#certNo').val(),
                certType:'1',
                id: '2',
                bankCode:$('.bankType').find('img').attr('code'),
                mobile:$('#mobile').val(),
                mobileCode: $('#mobileCode').val(),
                otherAccno:$('#otherAccNo').val(),
            }
        };
        ajax(paras, function (res) {
            if(!res){
                layerLoading();
            }else{
                if(res.success === true){
                    if(res.data.data.tipsMsgDto.flag==='1'){
                        var $bankAcountInfo=$('.dl_bankAcountInfo');
                        var $content1=$bankAcountInfo.find('.content').eq(0);
                        var $content2=$bankAcountInfo.find('.content').eq(1);
                        $content1.addClass('hidden');
                        $content2.removeClass('hidden').end().find('.username').text($('#userName').val())
                            .end().find('.certNo').text($('#certNo').val())
                            .end().find('.ico_bank').find('img').attr('src',$('.bankType').find('img').attr('src'))
                            .end().end().find('.bank_mobile').text($('#mobile').val());
                        if(res.data.data.cardType){
                            layerBankOpen('去充值','您已开通银行存管账户',true,'/user/recharge.html');
                        }else{
                            layerBankOpen('去投资','您已开通银行存管账户',true,'#');
                        }
                    }else{
                        layerBankOpen('重试',res.data.data.tipsMsgDto.errorMessage,false,'/');
                    }
                }else{
                    layerBankOpen('重试',res.data.data.tipsMsgDto.errorMessage,false,'/');
                }
            }
        });
    }
    //绑定点击是否同意事件
    function bindAgree() {
        $('#checkRead').bind('click', function () {
            checkRead();
        });
    }
    //点击开通
    function clickBankOpen(){
        $('#btn_submit').bind('click',function () {
            console.log('开始点击验证');
            var arrCheck=[checkUserName($('#userName')),checkCertNo($('#certNo')),checkOtherAccNo($('#otherAccNo')),checkBranchNo($('#branchNo')),checkMobile($('#mobile')),checkMobileCode($('#mobileCode')),checkRead()];
            for(var i in arrCheck){
                if(!arrCheck[i]){
                    onOff=false;
                }
            }

            //发起开开通请求
            if(onOff){
                bankOpen();
            }

        });
    }
    function start() {
        //获取银行列表
        getBankList();
        //开户银行支行查询
        searchBranchNo();
        //用户名失去焦点，校验用户名
        checkUserNameAll();
        //身份证号失去焦点，校验身份证号
        checkCertNoAll();
        //银行卡号失去焦点，校验银行卡号
        checkOtherAccNoAll();
        //银行支行失去焦点，校验银行支行
        checkBranchNoAll();
        //银行预留手机号失去焦点，校验手机号
        checkMobileAll();
        //获取银行手机验证码
        getBankSendVcode();
        //手机验证码失去焦点，校验机验证码
        checkMobileCodeAll();
        //绑定点击是否同意事件
        bindAgree();
        //点击开通
        clickBankOpen();
    }
    return {start: start}
}()).start();
//选择银行支行
$(function () {
    $('#branchNoList').on('click','li',function () {
        $('#branchNo').val($(this).text());
       $('#branchNo').attr('renhanghao',$(this).attr('renhanghao'));
    });
});

