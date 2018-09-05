'use strict';
window.forgetpwdMiddle=(function () {
    var check = window.Rui.Check,
        tool = window.Rui.Tool,
        err=window.Rui.err,
        ajax = window.Rui.Ajax,
        waitingtime = 60,//设置等待时间
        countdown = waitingtime,//设置重置时间
        istruemsgVcode = false,//是否是正确的短信验证码
        isovertime=false,//验证码是否超时
        alertControl={msgVCode:false,password:false,repassword:false},//设置弹出框的开关
        forgetTel=JSON.parse(sessionStorage.getItem('forget_tel'));//从第一步传过来的手机号


    console.log('forgetTel',forgetTel);
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
    }



    //点击发送验证码倒计时60s
    function bindclick(){
        function settime(val) {
            if (countdown === 0) {
                console.log(1);
                countdown = waitingtime;
                $(val).text('发送验证码').click(function(){
                    bindclick();
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

    //发送短信和倒计时
    function sendMessage(){
        if(hasOtherOpen()){
            return false;
        }
        if(!forgetTel.mobilePhone){
            return false;
        }
        //倒计时
        bindclick();
        var paras1 = {
            mdname: '/forgetpwdMiddle_sendmsg.json',
            data: {
                mobile: forgetTel.mobilePhone,
                type: 'findPassword'
            }
        };
        ajax(paras1, function (res) {
            if(err.getErrFun(res,'msgVCode')){return false;}
            //console.log('res',res);
        });
    }

    //获取短信验证码
    function getSendVcode(){
        $('#getCellphoneVcode').bind('click', function () {
            console.log('getCellphoneVcode',forgetTel);
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
        obj.closest('li').find('.form-error').hide();
        alertControl.msgVCode=false;
        return true;
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
                obj.closest('li').find('.form-error').hide();
                alertControl.password=false;
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
            obj.closest('li').find('.form-error').hide();
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
            if(hasOtherOpen('password')){
                return false;
            }
            checkPwd($(this));
        });

        // 确认密码失去焦点，校验密码
        $('#repassword').on('blur', function () {
            if(hasOtherOpen('repassword')){
                return false;
            }
            checkRePwd($(this));
        });
    }

    //短信验证码校验
    function checkSendVcodeAll() {
        $('#msgVCode').bind('blur', function () {
            console.log('短信验证码校验');
            if(hasOtherOpen('msgVCode')){
                return false;
            }
            if (!checkSendVcode($(this))) {
                return false;
            }
            isovertime=false;
            var paras = {
                mdname: '/forgetpwdMiddle_checkmsg.json',
                data: {
                    mobile: forgetTel.mobilePhone,
                    code: $('#msgVCode').val(),
                    type: 'findPassword'
                }
            };
            console.log('paras', paras);
            ajax(paras, function (res) {
                if(err.getErrFun(res,'msgVCode')){return false;}
                console.log('res短信', res);
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

    //发起设置完成请求
    function setComplete() {
        var paras = {
            mdname: '/dosforgetpwdmiddle.json',
            data: {
                mobile: forgetTel.mobilePhone,
                smsCode: $('#msgVCode').val(),
                newPassword: $('.password').val(),
                imageCode: forgetTel.signinVcode,
                oldPassword: ''
            }
        };
        ajax(paras, function (res) {
            console.log('res', res);
            if(err.getErrHref(res.data,'/forgetpwdfail.html')){return false;}
            if (res.success === true) {
                //sessionStorage.removeItem('forget_tel');
                console.log('跳转到forgetpwdFinish.html');
                location.href = '/forgetpwdFinish.html';
            } else {
                console.log('失败了');
            }
        });
    }

    //点击设置完成
    function clickSetComplete(){
        $('#setComplete').on('click', function () {
            console.log('进来了么');
            if(hasOtherOpen()){
                return false;
            }
            if (!checkSendVcode($('#msgVCode'))) {
                return false;
            }
            console.log(1);
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
            console.log(2);

            if(!checkPwd($('#password'))){
                return false;
            }
            console.log(3);
            if(!checkRePwd($('#repassword'))){
                return false;
            }
            console.log('通过');

            //发起设置完成请求
            setComplete();

        });
    }

    function start(){

        //公共的清空各个form字段的方法
        tool.clearFormInputs(['#msgVCode', '#password', '#repassword']);

        //获取短信验证码
        getSendVcode();

        //短信验证码校验
        checkSendVcodeAll();

        //校验密码和确认密码
        checkPwdAll();

        //点击设置完成
        clickSetComplete();

    }
    return {start:start};
}()).start();
