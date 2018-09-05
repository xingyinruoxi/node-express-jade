'use strict';
window.getcash = (function () {
    var check = window.Rui.Check,
        tool = window.Rui.Tool,
        ajax = window.Rui.Ajax,
        flagMax=false,
        onOff=true,
        waitingtime = 60,//设置等待时间
        countdown = waitingtime;//设置重置时间

    var layer = window.layer || {};

    // alertAssessmentNO(['再试一次'],['帮助中心'],'<p class="title">对不起，提现申请失败</p>',false,'/')
    function layerCashSuccessOpen(btnText, content, onOff, href) {
        layer.open({
            type: 1//Page层类型
            , skin: 'layui-layer-rim'//加上边框
            , area: ['464px', '318px']
            , shade: 0.4//遮罩透明度
            , id: 'lay_cash_result'
            , title: '提现结果'
            , btn: btnText
            , btnAlign: 'c'
            , anim: 0 //0-6的动画形式，-1不开启
            , content: '<div class="text-center color-gray">' + content + '</div>'
            , btn1: function () {
                if (onOff) {
                    location.href = href;
                } else {
                    layer.closeAll();
                }
            }

        });
    }

    //等待处理状态弹窗
    function layerLoading(content) {
        layer.open({
            type: 1//Page层类型
            ,
            skin: 'layui-layer-rim'//加上边框
            ,
            area: ['464px', '318px']
            ,
            shade: 0.4//遮罩透明度
            ,
            id: 'lay_cash_result'
            ,
            title: 0
            ,
            closeBtn: 0
            ,
            btnAlign: 'c'
            ,
            anim: -1 //0-6的动画形式，-1不开启
            ,
            content: '<div class="text-center color-gray"><i class="ico ico_wait"></i><p class="wait_title">处理中......</p><p class="wait_text">我们正在处理您的提现请求......</p></div>'
        });
    }

    function layerCashErrorOpen(btnText1, btnText2, content, onOff, href) {
        layer.open({
            type: 1//Page层类型
            ,
            skin: 'layui-layer-rim'//加上边框
            ,
            area: ['464px', '318px']
            ,
            shade: 0.4//遮罩透明度
            ,
            id: 'lay_cash_result'
            ,
            title: '提现结果'
            ,
            btn: ['<div class="btnbox1"><span class="btn1 ">' + btnText1 + '</span></div>', '<div class=""><span class="btn2">' + btnText2 + '</span></div>']
            ,
            btnAlign: 'c'
            ,
            anim: 0 //0-6的动画形式，-1不开启
            ,
            content: '<div class="text-center color-gray">' + content + '</div>'
            ,
            btn1: function () {
                if (onOff) {
                    console.log('1');
                    location.href = 'www.baidu.com';
                } else {
                    console.log('1');

                    layer.closeAll();
                }
            }
            ,
            btn2: function () {
                console.log('2')
            }
            ,
            success: function (layero) {
                var btna = layero.find('.layui-layer-btn a');
                var btn = layero.find('.layui-layer-page .layui-layer-btn');
                var btnhover = layero.find('.layui-layer-btn0');
                btna.css({'width': '50%'});
                btn.css({'padding': '0 44px 40px'});
                btnhover.css({'background': '#fff'})
            }
        });
    }



    //点击发送验证码倒计时60s
    function clickCountDown(val) {
        console.log('发送验证码');
        function settime(val) {
            if (countdown === 0) {
                countdown = waitingtime;
                $(val).text('发送验证码').click(function () {
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

    // 校验输入金额大于账户余额
    function checkmax(obj) {
            flagMax=false;
            var balance=parseFloat($('#getcashAmount').val())- parseFloat($('#balance').text().split(',').join(''));
            if(balance>0){
                flagMax=true;
                obj.closest('li').find('.form-error').show().text('填写金额有误，请重新填写');
                return false;
            }
    }
    // 校验提现金额格式
    function checkGetcashAmount(obj) {
        //console.log(123, $(obj).attr('id'));
        if (!check.isinput(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写提现金额');
            return false;
        }
        if (!check.isrechargeAmount(obj.val())) {
            obj.closest('li').find('.form-error').show().text('填写金额有误，请重新填写');
            return false;
        }
        obj.closest('li').find('.form-error').hide();
        return true;
    }
    // 校验汇总
    function checkGetcashAmountAll() {
        $('#getcashAmount').on('blur keyup', function () {
            // 输入格式校验
            checkGetcashAmount($(this));
            // 输入最大值校验
            checkmax($(this));
        });
    }

    //校验充值手机验证码
    function checkRechargeVcode(obj) {
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
    //发送充值手机验证码
    function sendMobilCode() {
        //倒计时
        clickCountDown('.btn_send_code');
        var paras = {
            mdname: '/sendvcode_bankgetcash.json',
            data: {
                mobile: $('#getcashVcode').val(),
                type: 5
            }
        };
        console.log(1);
        ajax(paras, function (res) {
            console.log('提现验证码数据：', res);
        });
    }
    //获取充值手机验证码
    function getBankSendVcode() {
        $('.btn_send_code').bind('click', function () {
            if (!checkGetcashAmount($('#getcashAmount'))) {
                return false;
            }
            //发送充值手机验证码
            sendMobilCode();
        });
    }


    //充值手机验证码失去焦点，校验充值手机验证码
    function checkRechargeVcodeAll() {
        $('#getcashVcode').on('blur', function () {
            if (!checkGetcashAmount($('#getcashAmount'))) {
                return false;
            }
            checkRechargeVcode($(this));
        });
    }

    //发起提现请求
    function getcash() {
        var paras = {
            mdname: '/get_cash.json',
            data: {
                amount: $('#getcashAmount').val() * 100,
                verificationCode: $('#getcashVcode').val()
            }
        };
        ajax(paras, function (res) {
            if (!res) {
                layerLoading();
            } else {
                if (res.success === true) {
                    console.log(res);
                    var cash = {
                        'getcashAmount': res.data.data.amount,
                        'getcashIncomeamount': res.data.data.incomeAmout
                    };
                    sessionStorage.setItem('getcash_amount', JSON.stringify(cash));
                } else {
                }
            }
        });
    }

    //点击提现
    function clickGetcash() {
        $('#btn_getcash').bind('click', function () {
            var arrCheck=[checkGetcashAmount($('#getcashAmount')),checkRechargeVcode($('#getcashVcode'))];
            for(var i in arrCheck){
                if(!arrCheck[i]){
                    onOff=false;
                }
            }
            if(onOff){
                //发起提现请求
                // getcash();
            }

        });
    }

    // 点击全部提现
    function getcashall() {
        $('#getcashAll').bind('click', function () {
            if (this.checked) {
                //选中状态
                var third = $('#balance').html();
                $('#getcashAmount').val(third);
                $('.realaccount').text($('#getcashAmount').val());
            } else {
                //未选中状态
                $('#getcashAmount').val('');
                $('.realaccount').text('0.00');
            }

        })
    }

    // 实际到账
    function realaccount() {
        $('#getcashAmount').on('blur',function () {
            $('.realaccount').text(tool.nfmoney($('#getcashAmount').val()*100));
        });
    }

    function start() {

        //充值金额失去焦点，校验充值金额
        checkGetcashAmountAll();
        //获取充值手机验证码
        getBankSendVcode();
        //手机验证码失去焦点，校验充值手机验证码
        checkRechargeVcodeAll();
        //点击提现
        clickGetcash();
        // 全部提现
        getcashall();

        realaccount();
    }

    return {start: start}
}()).start();
