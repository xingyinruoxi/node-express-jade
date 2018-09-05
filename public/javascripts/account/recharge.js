/**
 * Created by a110 on 17/4/28.
 */
'use strict';
window.bankaccountinfo = (function () {
    var check = window.Rui.Check,
        ajax = window.Rui.Ajax,
        onOff=true,
        tool = window.Rui.Tool;
    var layer=window.layer||{};



    //判断是否开通存管账户
    function layerCheckOpenBank() {
        layer.open({
            type: 1//Page层类型
            ,skin: 'layui-layer-rim'//加上边框
            ,area: ['464px','300px']
            ,shade: 0.4//遮罩透明度
            ,id: 'lay_cash_result'
            ,title:'温馨提示'
            ,closeBtn:1
            ,btnAlign: 'c'
            ,anim: 0 //0-6的动画形式，-1不开启
            ,content: '<div class="text-center color-gray" style="padding-top:50px;font-size:18px;line-height: 32px;">您还未开通浙商银行存管账户，请开<br>通后再进行充值。</div>'
            ,btn:'去开户'
            ,btn1:function(){
                location.href='bankaccountinfo.html';
            }
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
        if (Number($('#rechargeAmount').val())>$('#quotaSingle').text().replace(/,/g,'')*10000) {
            obj.closest('li').find('.form-error').show().text('充值金额超出银行单笔限额，请重新填写');
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
        if($('#btn_recharge').hasClass('disabled')){
            $('#rechargeNum').show();
            return false;
        }
        var paras = {
            mdname: '/get_recharge.json',
            data: {
                amount:$('#rechargeAmount').val()*100,
                verificationCode: $('#rechargeVcode').val(),
                signToken: $('#signToken').val(),
                signTicket: $('#signTicket').val(),
            }
        };
        ajax(paras, function (res) {

            if(res.success===true){
                sessionStorage.setItem('rechargeAmount',JSON.stringify(paras.data.amount));
                location.href='rechargesuccess.html';
            }else{
                sessionStorage.setItem('resultMsg',res.resultMsg);
                location.href='rechargefail.html';
            }
        },'','',true);
    }

    //发送充值手机验证码
    function sendMessage() {
        //倒计时
        window.Rui.countDown.Down('.btn_send_code',sendMessage);
        var paras= {
            mdname: '/sendmsg_bank.json',
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
            sendMessage();
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
        var onOff1=true;//充值每次只可点击一次
        $('#btn_recharge').bind('click',function () {
            var arrCheck=[checkRechargeAmount($('#rechargeAmount')),checkRechargeVcode($('#rechargeVcode'))];

            for(var i in arrCheck){
                if(!arrCheck[i]){
                    onOff=false;
                }
            }
            if(onOff&&onOff1){
                //发起充值请求
                recharge();
                onOff1=false;
            }
        });
    }

    function start() {
        if($('.dl_bankAcountInfo').hasClass('active')){
            //判断是否开通存管账户
            layerCheckOpenBank();
        }
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