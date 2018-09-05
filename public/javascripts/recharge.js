/**
 * Created by a110 on 17/4/28.
 */
'use strict';
window.bankaccountinfo = (function () {
    var check = window.Rui.Check,
        ajax = window.Rui.Ajax,
        waitingtime = 60,//设置等待时间
        onOff=true,
        tool = window.Rui.Tool,
        countdown = waitingtime;//设置重置时间
    var layer=window.layer||{};

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
    // 校验充值金额
    function checkRechargeAmount(obj) {
        if (!check.isinput(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写充值金额');
            return false;
        }
        if (!check.isrechargeAmount(obj.val())) {
            obj.closest('li').find('.form-error').show().text('填写金额有误，请重新填写');
            return false;
        }
        obj.closest('li').find('.form-error').hide();
        return true;
    }
    //校验充值手机验证码
    function checkRechargeVcode(obj) {
        if (!check.isinput(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写手机验证码');
            return false;
        }

        if (obj.val().length !== 6) {
            obj.closest('li').find('.form-error').show().text('验证码填写有误');
            return false;
        }
        obj.closest('li').find('.form-error').hide();
        return true;
    }

    //发起充值请求
    function recharge() {
        var paras = {
            mdname: '/get_recharge.json',
            data: {
                rechargeAmount:$('#rechargeAmount').val(),
                verificationCode: $('#rechargeVcode').val()
            }
        };
        ajax(paras, function (res) {
            if(!res){
                layerLoading();
            }else{
                if(res.success===true){
                    sessionStorage.setItem('rechargeAmount',JSON.stringify(paras.data.rechargeAmount));
                    location.href='rechargesuccess.html';
                }else{
                    location.href='rechargefail.html';
                }
            }
        });
    }
    //发送充值手机验证码
    function sendMobilCode() {
        //倒计时
        clickCountDown('.btn_send_code');
        var paras= {
            mdname: '/sendvcode_bankrechange.json',
            data: {
                mobile: $('#rechargeVcode').val(),
                type:4
            }
        };
        ajax(paras, function (res) {
            console.log('充值验证码数据：',res);
        });
    }

    //获取充值手机验证码
    function getBankSendVcode() {
        $('.btn_send_code').bind('click', function () {
            if (!checkRechargeAmount($('#rechargeAmount'))) {
                return false;
            }
            //发送充值手机验证码
            sendMobilCode();
        });
    }

    //充值后账户余额
    function rechargedAccountBalance() {
        $('#rechargeAmount').on('keyup',function () {
            var accountBalance=parseFloat($('#accountBalance').text().replace(/,/g,''));
            var rechargeAmount=parseFloat($('#rechargeAmount').val());
            var sum=(accountBalance + rechargeAmount).toFixed(2);
            if(isNaN(sum)){
                $('#rechargedAccountBalance').text(accountBalance);
            }else{
                $('#rechargedAccountBalance').text(tool.nfmoney(sum*100));
            }

        });
    }
    //充值金额失去焦点，校验充值金额
    function checkRechargeAmountAll() {
        $('#rechargeAmount').on('blur keyup', function () {
            checkRechargeAmount($(this));
        });
    }
    //充值手机验证码失去焦点，校验充值手机验证码
    function checkRechargeVcodeAll() {
        $('#rechargeVcode').on('blur', function () {
            if (!checkRechargeAmount($('#rechargeAmount'))) {
                return false;
            }
            checkRechargeVcode($(this));
        });
    }

    //点击充值
    function clickRecharge() {
        $('#btn_recharge').bind('click',function () {
            console.log('开始点击充值验证');
            var arrCheck=[checkRechargeAmount($('#rechargeAmount')),checkRechargeVcode($('#rechargeVcode'))];

            for(var i in arrCheck){
                if(!arrCheck[i]){
                    onOff=false;
                }
            }
            if(onOff){
                //发起充值请求
                recharge();
            }
        });
    }

    function start() {

        //充值金额失去焦点，校验充值金额
        checkRechargeAmountAll();
        //充值后账户余额
        rechargedAccountBalance();
        //获取充值手机验证码
        getBankSendVcode();
        //充值手机验证码失去焦点，校验充值手机验证码
        checkRechargeVcodeAll();
        //点击充值
        clickRecharge();
    }

    return {start: start}
}()).start();