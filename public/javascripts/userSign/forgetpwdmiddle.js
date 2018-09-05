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
        listcheck={
            mobilecode:false,
            mobilecodechecked:false,
            pwd:false,
            pwdchecked:false,
            repwd:false,
            repwdchecked:false
        },
        alertControl={msgVCode:false,password:false,repassword:false},//设置弹出框的开关
        forgetTel=JSON.parse(sessionStorage.getItem('forget_tel'));//从第一步传过来的手机号


    console.log('forgetTel',forgetTel);

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
        listcheck.mobilecodechecked=true;
        if (!check.isinput(obj.val())) {
            tool.alerttip(obj,'请填写6位数字验证码');
            listcheck.mobilecode=false;
            return false;
        }
        if (obj.val().length !== 6) {
            tool.alerttip(obj,'验证码填写错误,请重新填写');
            listcheck.mobilecode=false;
            return false;
        }
        tool.alerttip(obj,'','h');
        listcheck.mobilecode=true;
        return true;
    }

    //校验密码
    function checkPwd(obj) {
        listcheck.pwdchecked=true;
        var value = $.trim(obj.val()),
            security = $('.security-level'),
            col = security.find('.col-33');
        if (!check.isinput(value)) {
            tool.alerttip(obj,'请输入6-20位数字及字母组合密码');
            listcheck.pwd=false;
            return false;
        }
        if (check.ispwdlength(value)) {
            if (!check.isrealpwd(value)) {
                tool.alerttip(obj,'请输入6-20位数字及字母组合密码');
                listcheck.pwdchecked=false;
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
                tool.alerttip(obj,'','h');
                listcheck.pwd=true;
                return true;
            }
        } else {
            tool.alerttip(obj,'请输入6-20位数字及字母组合密码');
            listcheck.pwd=true;
            security.hide();//安全级别隐藏
            return false;
        }
    }

    //确认密码校验
    function checkRePwd(obj) {
        listcheck.repwdchecked=true;
        var revalue = obj.val(),
            value = $('#password').val();
        if (!check.isinput(revalue)) {
            tool.alerttip(obj,'确认密码不能为空');
            listcheck.repwd=false;
            return false;
        }
        if (value === revalue) {
            tool.alerttip(obj,'','h');
            listcheck.repwd=true;
            return true;
        } else {
            tool.alerttip(obj,'两次填写密码不一致');
            listcheck.repwd=false;
            return false;
        }
    }

    //校验密码和确认密码
    function checkPwdAll() {
        //校验密码格式，6到20位密码，数字与字母混合
        $('#password').on('blur keyup', function () {
            checkPwd($(this));
        });

        // 确认密码失去焦点，校验密码
        $('#repassword').on('blur', function () {
            checkRePwd($(this));
        });
    }

    //短信验证码校验
    function checkSendVcodeAll() {
        $('#msgVCode').bind('blur', function () {
            console.log('短信验证码校验');
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

                if(res.success&&res.data){
                    istruemsgVcode = true;
                    listcheck.mobilecode=true;
                }else{
                    istruemsgVcode = false;
                    if(res.errorCode==='3000012'){
                        isovertime=true;
                        tool.alerttip('#msgVCode','验证码已超时，请重新获取');
                        listcheck.mobilecode=false;
                    }else{
                        tool.alerttip('#msgVCode','验证码填写错误，请重新填写');
                        listcheck.mobilecode=false;
                    }
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
                confirmPassword: $('#repassword').val(),
                signToken: $('#signToken').val(),
                signTicket: $('#signTicket').val()
            }
        };
        ajax(paras, function (res) {
            console.log('res', res);
            if(err.getErrHref(res.data,'/forgetpwdfail.html')){return false;}
            if (res.success) {
                //sessionStorage.removeItem('forget_tel');

                if( window.location.pathname.indexOf('changepwdmiddle') > 0){
                    location.href = '/changepwdfinish.html';
                }else{
                    location.href = '/forgetpwdfinish.html';
                }
                //console.log('跳转到forgetpwdFinish.html');
                //location.href = '/forgetpwdfinish.html';
            } else {
                console.log('失败了');
            }
        });
    }

    //点击设置完成
    function clickSetComplete(){
        $('#setComplete').on('click', function () {
            console.log('开始排队，预备报数：');
            var checkcount=0;
            console.log('检查mobilecode start 1');
            if(!listcheck.mobilecodechecked){
                console.log(1);
                checkSendVcode($('#msgVCode'));
                if(listcheck.mobilecode){
                    console.log(2);
                    checkcount++;
                }
            }else{
                console.log(3);
                if(listcheck.mobilecode){
                    console.log(4);
                    checkcount++;
                }
            }

            console.log('检查mobilecode end 1');

            console.log('检查pwd start 2');
            if(!listcheck.pwdchecked){
                console.log(1);
                checkPwd($('#password'));
                if(listcheck.pwd){
                    console.log(2);
                    checkcount++;
                }
            }else{
                console.log(3);
                if(listcheck.pwd){
                    console.log(4);
                    checkcount++;
                }
            }
            console.log('检查pwd end 2');

            console.log('检查repwd start 3');
            if(!listcheck.repwdchecked){
                console.log(1);
                checkRePwd($('#repassword'));
                if(listcheck.repwd){
                    console.log(2);
                    checkcount++;
                }
            }else{
                console.log(3);
                if(listcheck.repwd){
                    console.log(4);
                    checkcount++;
                }
            }
            console.log('检查repwd end 3');
            console.log('checkcount',checkcount);
            if(checkcount!==3){
                console.log('不通过');
                return false;
            }

            console.log('通过');
            //return false;

            /*console.log('进来了么');
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
            console.log('通过');*/





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
