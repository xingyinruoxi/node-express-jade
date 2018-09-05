'use strict';
window.signup = (function () {
    var check = window.Rui.Check,
        tool = window.Rui.Tool,
        ajax = window.Rui.Ajax,
        alert = window.Rui.Alert,
        err=window.Rui.err,
        isNewUser = false,//是否是新用户
        istrueImgVcode = false,//是否是正确的图片验证码
        istruemsgVcode = false,//是否是正确的短信验证码
        isovertime=false,//验证码是否超时
        alertControl={cellphone:false,sendMsgVCode:false,msgVCode:false,
            password:false,repassword:false,inviter:false},//设置弹出框的开关
        waitingtime = 60,//设置等待时间
        countdown = waitingtime,//设置重置时间
        onOff = false,//是否有推荐人
        isrealInviter=false,
        isagree=true;
    //是否有非打开的弹出框
    function hasOtherOpen(id){
        for (var i in alertControl) {
            if ((id && i !== id)||!id) {
                console.log('i', i);
                if (alertControl[i] === true) {
                    return true;
                }
            }
        }
        return false;

       /* if(alertControl.cellphone||alertControl.sendMsgVCode||alertControl.msgVCode||
            alertControl.password||alertControl.repassword||alertControl.inviter){
            return true;
        }
        return false;*/
    }

    //验证码初始化和刷新、清空各个form字段方法
    function vcodeRefresh() {
        //公共的初始化和刷新图片验证码
        tool.initVCode('.btn-code-img','REG');

        //公共的清空各个form字段的方法
        tool.clearFormInputs(['#cellphone', '#sendMsgVCode', '#msgVCode', '#password', '#repassword', '#inviter']);
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

    //校验手机号
    function checkTel(obj) {
        if (!check.isinput(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写手机号码');
            alertControl.cellphone=true;
            return false;
        }
        if (!check.isSimpleTel(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写正确手机号码');
            alertControl.cellphone=true;
            return false;
        }
        obj.prev().hide();
        alertControl.cellphone=false;
        return true;
    }

    //手机号失去焦点，校验手机号
    function checkTelAll() {
        $('#cellphone').on('blur', function () {
            if(hasOtherOpen('cellphone')){
                return false;
            }
            if (!checkTel($(this))) {
                return false;
            }
            var paras = {
                mdname: '/signup_checkphone.json',
                data: {
                    mobile: $('#cellphone').val()
                }
            };
            ajax(paras, function (res) {
                console.log('res', res);
                if(err.getErrFun(res,'cellphone')){return false;}
                if (res.success === true&&res.data===true) {
                    $('#cellphone').closest('li').find('.form-error').show().text('该手机号码已被占用');
                    alertControl.cellphone=true;
                    isNewUser = false;
                    //isNewUser = true;
                } else {
                    isNewUser = true;
                }

            });
        });
    }

    //图片校验
    function checkMsgVcode(obj) {
        if (!check.isinput(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写图片验证码');
            alertControl.sendMsgVCode=true;
            return false;
        }
        if (obj.val().length !== 4) {
            obj.closest('li').find('.form-error').show().text('图片验证码填写错误');
            alertControl.sendMsgVCode=true;
            return false;
        }
        obj.prev().hide();
        alertControl.sendMsgVCode=false;
        return true;
    }

    //图片验证码校验
    function checkMsgVcodeAll() {
        console.log('111图片验证码校验');
        $('#sendMsgVCode').on('blur', function () {
            console.log('图片验证码校验');
            if(hasOtherOpen('sendMsgVCode')){
                return false;
            }
            if (!checkMsgVcode($(this))) {
                console.log('未通过');
                return false;
            }
            var paras = {
                mdname: '/signup_checkvcode.json',
                data: {
                    code: $('#sendMsgVCode').val(),
                    type: 'USER_REG'
                }
            };
            console.log('通过');
            ajax(paras, function (res) {
                if(err.getErrFun(res,'sendMsgVCode')){return false;}
                if (!res.success) {
                    istrueImgVcode = false;
                    $('#sendMsgVCode').closest('li').find('.form-error').show().text('图片验证码填写错误');
                    alertControl.sendMsgVCode=true;
                } else {
                    istrueImgVcode = true;
                }
            });
        });
    }

    //发送短信和倒计时
    function sendMessage(){

        if(hasOtherOpen()){
            return false;
        }
        if (!checkTel($('#cellphone'))) {
            return false;
        }

        //点击发送验证码倒计时60s
        function bindclick(){
            function settime(val) {
                if (countdown === 0) {
                    countdown = waitingtime;
                    $(val).text('发送验证码').click(function(){
                        sendMessage();
                    });
                } else {
                    $(val).text(countdown + 's');
                    countdown--;
                    setTimeout(function () {
                        settime(val)
                    }, 1000);
                }
            }
            settime('#getCellphoneVcode');
            $('#getCellphoneVcode').unbind('click');
        }

        //倒计时
        bindclick();
        console.log('执行了');
        var paras1 = {
            mdname: '/signup_sendmsg.json',
            data: {
                mobile: $('#cellphone').val(),
                type: 'regist'
            }
        };
        ajax(paras1, function (res) {
            if(err.getErrFun(res,'msgVCode')){return false;}
            //console.log('res',res);
        });
    }

    //获取短信验证码
    function getSendVcode() {
        $('#getCellphoneVcode').bind('click', function () {
            console.log('getCellphoneVcode');
            //发送短信和倒计时
            sendMessage();
        });
    }

    //短信检验
    function checkSendVcode(obj) {
        if (!check.isinput(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写6位数字验证码');
            alertControl.msgVCode=true;
            return false;
        }
        if (obj.val().length !== 6) {
            obj.closest('li').find('.form-error').show().text('验证码填写错误,请重新填写');
            alertControl.msgVCode=true;
            return false;
        }
        obj.prev().hide();
        alertControl.msgVCode=false;
        return true;
    }

    //短信验证码校验
    function checkSendVcodeAll() {
        $('#msgVCode').bind('blur', function () {
            console.log('短信验证码校验');
            if(hasOtherOpen('msgVCode')){
                return false;
            }
            if (!checkTel($('#cellphone'))) {
                return false;
            }
            if (!checkSendVcode($(this))) {
                return false;
            }
            isovertime=false;
            var paras = {
                mdname: '/signup_checkmsg.json',
                data: {
                    mobile: $('#cellphone').val(),
                    code: $('#msgVCode').val(),
                    type: 'regist'
                }
            };
            console.log('paras', paras);
            ajax(paras, function (res) {
                console.log('res短信', res);
                if(err.getErrFun(res,'msgVCode')){return false;}
                if (!res.success) {
                    istruemsgVcode = false;
                    if(res.errorCode==='3000012'){
                        isovertime=true;
                        $('#msgVCode').closest('li').find('.form-error').show().text('验证码已超时，请重新获取');
                        alertControl.msgVCode=true;
                    }else{
                        $('#msgVCode').closest('li').find('.form-error').show().text('验证码填写错误，请重新填写');
                        alertControl.msgVCode=true;
                    }
                } else {
                    istruemsgVcode = true;
                }
            });
        });
    }

    //校验密码
    function checkPwd(obj) {
        var value = $.trim(obj.val()),
            security = $('.security-level'),
            col = security.find('.col-33');
        if (!check.isinput(value)) {
            obj.closest('li').find('.form-error').show().text('请输入6-20位数字及字母组合密码');
            alertControl.password=true;
            return false;
        }
        if (check.ispwdlength(value)) {
            if (!check.isrealpwd(value)) {
                obj.closest('li').find('.form-error').show().text('请输入6-20位数字及字母组合密码');
                alertControl.password=true;
                security.hide();//安全级别隐藏
                return false;
            } else {
                //密码安全级别展示
                if (value.length === 6) {
                    col.eq(0).addClass('active');
                    col.eq(1).removeClass('active');
                    col.eq(2).removeClass('active');
                } else if (value.length > 6 && value.length <= 10) {
                    col.eq(0).addClass('active');
                    col.eq(1).addClass('active');
                    col.eq(2).removeClass('active');
                } else {
                    col.eq(0).addClass('active');
                    col.eq(1).addClass('active');
                    col.eq(2).addClass('active');
                }
                security.show();//安全级别展示
                alertControl.password=false;
                obj.prev().hide();
                return true;
            }
        } else {
            obj.closest('li').find('.form-error').show().text('请输入6-20位数字及字母组合密码');
            alertControl.password=true;
            security.hide();//安全级别隐藏
            return false;
        }
    }

    //确认密码校验
    function checkRePwd(obj) {
        var revalue = obj.val(),
            value = $('#password').val();
        if (!check.isinput(revalue)) {
            obj.closest('li').find('.form-error').show().text('确认密码不能为空');
            alertControl.repassword=true;
            return false;
        }
        if (value === revalue) {
            obj.prev().hide();
            alertControl.repassword=false;
            return true;
        } else {
            obj.closest('li').find('.form-error').show().text('两次填写密码不一致');
            alertControl.repassword=true;
            return false;
        }
    }
    //校验密码和确认密码
    function checkPwdAll() {
        //校验密码格式，6到20位密码，数字与字母混合
        $('#password').on('blur keyup', function () {
            if (!alertControl.cellphone && !alertControl.sendMsgVCode&&
                !alertControl.msgVCode && !alertControl.repassword&&
                !alertControl.inviter) {
                checkPwd($(this));
            }

        });

        // 确认密码失去焦点，校验密码
        $('#repassword').on('blur', function () {
            if(!hasOtherOpen('repassword')) {
                checkRePwd($(this));
            }
        });
    }

    //检验推荐人手机号
    function checkInviteTel(obj) {
        if (!check.isinput(obj.val())) {
            obj.prev().hide();
            alertControl.inviter=false;
            return true;
        }
        if (!check.isMHMobile(obj.val())) {
            obj.closest('li').find('.form-error').show().text('推荐人手机号填写错误');
            alertControl.inviter=true;
            return false;
        }
        obj.prev().hide();
        alertControl.inviter=false;
        return true;
    }

    //打开和关闭推荐人、检验推荐人手机号
    function operateInviter() {
        $('.inviter').bind('click', function () {

            if (!onOff) {
                console.log('开');
                $('.inviter_input').removeClass('hidden').end().find('.fa').removeClass('fa-caret-right').addClass('fa-caret-down');
            } else {
                console.log('关');
                $('.inviter_input').addClass('hidden').end().find('.fa').removeClass('fa-caret-down').addClass('fa-caret-right');
                $('#inviter').val('');
            }
            onOff = !onOff;
            console.log('onOff',onOff);
        });

        //检验推荐人手机号
        $('#inviter').on('blur', function () {
            if(hasOtherOpen('inviter')){
                return false;
            }
            if(!checkInviteTel($(this))){
                return false;
            }

            if(onOff&&$(this).val().length>0){
                var paras = {
                    mdname: '/signup_checkphone.json',
                    data: {
                        mobile: $('#inviter').val()
                    }
                };
                ajax(paras, function (res) {
                    if(err.getErrFun(res,'inviter')){return false;}
                    console.log('res', res);
                    if (res.success === true&&res.data===true) {
                        isrealInviter = true;
                    } else {
                        $('#inviter').closest('li').find('.form-error').show().text('推荐人必须为金投手用户，请重新填写');
                        alertControl.inviter=true;
                        isrealInviter = false;
                    }
                    console.log('isrealInviter',isrealInviter);
                });
            }else{
                isrealInviter = true;
            }
            console.log('推荐人',onOff,isrealInviter);
        });

    }

    //发起注册请求
    function regist() {
        var paras = {
            mdname: '/signup_register.json',
            data: {
                confirmPassword: $('#repassword').val(),
                mobile: $('#cellphone').val(),
                password: $('#password').val(),
                inviter: $('#inviter').val(),
                smsCode: $('#msgVCode').val(),//短信验证码
                imageCode:$('#sendMsgVCode').val(),
                referrer:$('#inviter').val()
            }
        };
        ajax(paras, function (res) {
            console.log('res111', res);
            var data=res.data;
            if(err.getErrHref(data,'/signupfail.html')){return false;}
            if (res.success === true) {
                console.log('跳转到signupSuccess.html');
                location.href = '/signupSuccess.html';
            } else {
                switch(data.errorCode){
                    case '40000012':
                    case '40010004':
                    case '40010005':
                        alertControl.signinVcode=true;
                        alert.systemMsg('#sendMsgVCode', err.getnewErr(data.errorCode));
                        break;
                    case '40000001':
                        alertControl.tel=true;
                        alert.systemMsg('#cellphone', err.getnewErr(data.errorCode));
                        break;
                    default:
                        alert.systemMsg('#cellphone', err.getnewErr(data.errorCode));
                        break;
                }

                //if(data.errorCode === 40010005){
                //    alert.systemMsg('#sendMsgVCode', err.geterr(data.errorCode));
                //    alertControl.sendMsgVCode=true;
                //}else{
                //    alert.systemMsg('#cellphone', err.geterr('0000002'));
                //    alertControl.cellphone=true;
                //}
            }
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

            //isagree = ($('#checkRead').attr('checked') === 'checked');
            console.log($('#checkRead').attr('checked'), isagree);
        });
    }

    //点击注册
    function clickRegist() {
        $('#btn_signup').on('click', function () {
            console.log('开始排队，预备报数：');
            if(hasOtherOpen()){
                return false;
            }
            if (!checkTel($('#cellphone'))) {
                return false;
            }
            console.log(1);
            if(!isNewUser){
                $('#cellphone').closest('li').find('.form-error').show().text('该手机号码已被占用');
                return false;
            }
            console.log(2);
            if (!checkMsgVcode($('#sendMsgVCode'))) {
                console.log('未通过');
                return false;
            }
            console.log(3);
            if(!istrueImgVcode){
                $('#sendMsgVCode').closest('li').find('.form-error').show().text('图片验证码填写错误');
                return false;
            }
            console.log(4);
            if (!checkSendVcode($('#msgVCode'))) {
                return false;
            }
            console.log(5);
            if(!istruemsgVcode){
                if(isovertime){
                    $('#msgVCode').closest('li').find('.form-error').show().text('验证码已超时，请重新获取');
                    alertControl.msgVCode=true;
                }else{
                    $('#msgVCode').closest('li').find('.form-error').show().text('验证码填写错误，请重新填写');
                    alertControl.msgVCode=true;
                }
                return false;
            }
            console.log(6);
            if(!checkPwd($('#password'))){
                return false;
            }
            console.log(7);
            if(!checkRePwd($('#repassword'))){
                return false;
            }
            console.log(8);
            if(!checkInviteTel($('#inviter'))){
                return false;
            }
            console.log(9);
            if(onOff&&!isrealInviter){
                $('#inviter').closest('li').find('.form-error').show().text('推荐人必须为金投手用户，请重新填写');
                return false;
            }
            if (!isagree) {
                return false;
            }
            console.log(10);


            console.log('通过');

            //发起注册请求
            regist();
        });
    }

    function start() {
        //验证码初始化和刷新、清空各个form字段方法
        vcodeRefresh();

        //关闭提示
        otherFun();

        //手机号失去焦点，校验手机号
        checkTelAll();

        //图片验证码校验
        checkMsgVcodeAll();

        //获取短信验证码
        getSendVcode();

        //短信验证码校验
        checkSendVcodeAll();

        //校验密码和确认密码
        checkPwdAll();

        //打开和关闭推荐人、检验推荐人手机号
        operateInviter();

        //绑定点击是否同意事件
        bindAgree();

        //点击注册
        clickRegist();

    }

    return {
        start: start
    };
})().start();

