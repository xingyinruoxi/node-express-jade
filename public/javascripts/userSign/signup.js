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
        waitingtime = 60,//设置等待时间
        countdown = waitingtime,//设置重置时间
        onOff = false,//是否有推荐人
        isrealInviter=false,
        isagree=false,
        listcheck={
            tel:false,
            telchecked:false,
            imgcode:false,
            imgcodechecked:false,
            mobilecode:false,
            mobilecodechecked:false,
            pwd:false,
            pwdchecked:false,
            repwd:false,
            repwdchecked:false,
            hasinviter:false,
            inviter:false,
            inviterchecked:false,
        };

    //验证码初始化和刷新、清空各个form字段方法
    function vcodeRefresh() {
        //公共的初始化和刷新图片验证码
        tool.initVCode('.btn-code-img','REG');

        //公共的清空各个form字段的方法
        tool.clearFormInputs(['#cellphone', '#sendMsgVCode', '#msgVCode', '#password', '#repassword', '#inviter']);
    }

    //校验手机号
    function checkTel(obj) {
        listcheck.telchecked=true;
        if (!check.isinput(obj.val())) {
            tool.alerttip(obj,'请填写手机号码');
            listcheck.tel=false;
            return false;
        }
        if (!check.isSimpleTel(obj.val())) {
            tool.alerttip(obj,'请填写正确手机号码');
            listcheck.tel=false;
            return false;
        }
        tool.alerttip(obj,'','h');
        listcheck.tel=true;
        return true;
    }

    //手机号失去焦点，校验手机号
    function checkTelAll() {
        $('#cellphone').on('blur', function () {
            if (!checkTel($(this))) {
                return false;
            }
            var paras = {
                mdname: '/signup_checkphone.json',
                data: {
                    mobile: $('#cellphone').val(),
                    signToken: $('#signToken').val(),
                    signTicket: $('#signTicket').val()
                }
            };
            ajax(paras, function (res) {
                console.log('res', res);
                if(err.getErrFun(res,'cellphone')){return false;}
                if(res.CSRF){
                    tool.alerttip('#cellphone',err.getnewErr(res.CSRF));
                    listcheck.tel=false;
                    return false;
                }
                if (res.success === true&&res.data===true) {
                    tool.alerttip('#cellphone','该手机号码已被占用');
                    listcheck.tel=false;
                    isNewUser = false;
                    //isNewUser = true;
                } else{
                    listcheck.tel=true;
                    isNewUser = true;
                }

            });
        });
    }

    //图片校验
    function checkMsgVcode(obj) {
        listcheck.imgcodechecked=true;
        if (!check.isinput(obj.val())) {
            tool.alerttip(obj,'请填写图片验证码');
            listcheck.imgcode=false;
            return false;
        }
        if (obj.val().length !== 4) {
            tool.alerttip(obj,'图片验证码填写错误');
            listcheck.imgcode=false;
            return false;
        }
        tool.alerttip(obj,'','h');
        listcheck.imgcode=true;
        return true;
    }

    //图片验证码校验
    function checkMsgVcodeAll() {
        console.log('111图片验证码校验');
        $('#sendMsgVCode').on('blur', function () {
            console.log('图片验证码校验');
            if (!checkMsgVcode($(this))) {
                console.log('未通过');
                return false;
            }
            var paras = {
                mdname: '/signup_checkvcode.json',
                data: {
                    code: $('#sendMsgVCode').val(),
                    type: 'USER_REG',
                    signToken: $('#signToken').val(),
                    signTicket: $('#signTicket').val()
                }
            };
            console.log('通过');
            ajax(paras, function (res) {
                if(err.getErrFun(res,'sendMsgVCode')){return false;}
                if(res.CSRF){
                    tool.alerttip('#sendMsgVCode',err.getnewErr(res.CSRF));
                    listcheck.imgcode=false;
                    return false;
                }
                if(res.success&&res.data){
                    listcheck.imgcode=true;
                    istrueImgVcode = true;
                }else{
                    $('#sendMsgVCode').closest('li').find('.form-error').show().text('图片验证码填写错误');
                    listcheck.imgcode=false;
                    istrueImgVcode = false;
                }
            });
        });
    }

    //发送短信和倒计时
    function sendMessage(){
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
        listcheck.mobilecodechecked=true;
        if (!check.isinput(obj.val())) {
            console.log('短信检验1');
            tool.alerttip(obj,'请填写6位数字验证码');
            listcheck.mobilecode=false;
            return false;
        }
        if (obj.val().length !== 6) {
            console.log('短信检验2');
            tool.alerttip(obj,'验证码填写错误,请重新填写');
            listcheck.mobilecode=false;
            return false;
        }
        tool.alerttip(obj,'','h');
        listcheck.mobilecode=true;
        return true;
    }

    //短信验证码校验
    function checkSendVcodeAll() {
        $('#msgVCode').bind('blur', function () {
            console.log('短信验证码校验');
            if(!listcheck.telchecked){
                checkTel($('#cellphone'));
                if(!listcheck.tel){
                    return false;
                }
            }else{
                if(!listcheck.tel){
                    return false;
                }
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
                    type: 'regist',
                    signToken: $('#signToken').val(),
                    signTicket: $('#signTicket').val()
                }
            };
            console.log('paras', paras);
            ajax(paras, function (res) {
                console.log('res短信', res);
                if(err.getErrFun(res,'msgVCode')){return false;}
                if(res.CSRF){
                    tool.alerttip('#sendMsgVCode',err.getnewErr(res.CSRF));
                    listcheck.mobilecode=false;
                    return false;
                }
                if (!res.success) {
                    istruemsgVcode = false;
                    listcheck.mobilecode=false;
                    if(res.errorCode==='3000012'){
                        isovertime=true;
                        $('#msgVCode').closest('li').find('.form-error').show().text('验证码已超时，请重新获取');

                    }else{
                        $('#msgVCode').closest('li').find('.form-error').show().text('验证码填写错误，请重新填写');
                    }
                } else {
                    listcheck.mobilecode=true;
                    istruemsgVcode = true;
                }
            });
        });
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
                listcheck.pwd=false;
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
                listcheck.pwd=true;
                tool.alerttip(obj,'','h');
                return true;
            }
        } else {
            tool.alerttip(obj,'请输入6-20位数字及字母组合密码');
            listcheck.pwd=false;
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

    //检验推荐人手机号
    function checkInviteTel(obj) {
        listcheck.inviterchecked;
        if (!check.isinput(obj.val())) {
            tool.alerttip(obj,'','h');
            listcheck.inviter=true;
            return true;
        }
        if (!check.isMHMobile(obj.val())) {
            tool.alerttip(obj,'推荐人手机号填写错误');
            listcheck.inviter=false;
            return false;
        }
        tool.alerttip(obj,'','h');
        listcheck.inviter=true;
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
               // $('#inviter').val('');
            }
            onOff = !onOff;
            console.log('onOff',onOff);
        });

        //检验推荐人手机号
        $('#inviter').on('blur', function () {
            if(!checkInviteTel($(this))){
                return false;
            }

            if(onOff&&$(this).val().length>0){
                var paras = {
                    mdname: '/signup_checkphone.json',
                    data: {
                        mobile: $('#inviter').val(),
                        signToken: $('#signToken').val(),
                        signTicket: $('#signTicket').val()
                    }
                };
                ajax(paras, function (res) {
                    if(err.getErrFun(res,'inviter')){return false;}
                    if(res.CSRF){
                        tool.alerttip('#inviter',err.getnewErr(res.CSRF));
                        listcheck.inviter=false;
                        return false;
                    }
                    console.log('res', res);
                    if (res.success === true&&res.data===true) {
                        isrealInviter = true;
                        listcheck.inviter=true;
                    } else {
                        $('#inviter').closest('li').find('.form-error').show().text('推荐人必须为金投手用户，请重新填写');
                        listcheck.inviter=false;
                        isrealInviter = false;
                    }
                    console.log('isrealInviter',isrealInviter);
                });
            }else{
                listcheck.inviter=true;
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
                //inviter: $('#inviter').val(),
                smsCode: $('#msgVCode').val(),//短信验证码
                imageCode:$('#sendMsgVCode').val(),
                referrer:$('#inviter').val(),
                signToken: $('#signToken').val(),
                signTicket: $('#signTicket').val()
            }
        };
        ajax(paras, function (res) {
            console.log('res111', res);
            var data=res.data;
            if(err.getErrHref(data,'/signupfail.html')){return false;}
            if(res.CSRF){
                location.href='/signupfail.html';
                return false;
            }
            if (res.success === true) {
                sessionStorage.setItem('registerAmount',tool.nfmoney(data.UserActivityVO.registerAmount));
                sessionStorage.setItem('openAccountAmount',tool.nfmoney(data.UserActivityVO.openAccountAmount));
                location.href = '/signupSuccess.html';
            } else {
                switch(data.errorCode){
                    case '40000012':
                    case '40010004':
                    case '40010005':
                        listcheck.imgcode=false;
                        alert.systemMsg('#sendMsgVCode', err.getnewErr(data.errorCode));
                        break;
                    case '40000001':
                        listcheck.tel=false;
                        alert.systemMsg('#cellphone', err.getnewErr(data.errorCode));
                        break;
                    default:
                        alert.systemMsg('#cellphone', err.getnewErr(data.errorCode));
                        break;
                }
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
            var checkcount=0;

            console.log('检查tel start 1');
            if(!listcheck.telchecked){
                console.log(1);
                checkTel($('#cellphone'));
                if(listcheck.tel){
                    console.log(2);
                    checkcount++;
                }
            }else{
                console.log(3);
                if(listcheck.tel){
                    console.log(4);
                    checkcount++;
                }
            }
            console.log('检查tel end');

            console.log('检查imgcode start 2');
            if(!listcheck.imgcodechecked){
                console.log(1);
                checkMsgVcode($('#sendMsgVCode'));
                if(listcheck.imgcode){
                    console.log(2);
                    checkcount++;
                }
            }else{
                console.log(3);
                if(listcheck.imgcode){
                    console.log(4);
                    checkcount++;
                }
            }
            console.log('检查imgcode end');

            console.log('检查mobilecode start 3');
            if(listcheck.tel){
                console.log(1);
                if(!listcheck.mobilecodechecked){
                    console.log(2);
                    checkSendVcode($('#msgVCode'));
                    if(listcheck.mobilecode){
                        console.log(3);
                        checkcount++;
                    }
                }else{
                    console.log(4);
                    if(listcheck.mobilecode){
                        console.log(5);
                        checkcount++;
                    }
                }
            }
            console.log('检查mobilecode end');


            console.log('检查pwd start 4');
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
            console.log('检查pwd end');

            console.log('检查repwd start 5');
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
            console.log('检查repwd end');

            console.log('检查inviter start 6');
            if(onOff){
                checkInviteTel($('#inviter'));
                if(listcheck.inviter){
                    checkcount++;
                }
            }else{
                checkcount++;
            }
            console.log('检查inviter end 6');

            console.log('检查isagree start 7');
            if (isagree) {
                checkcount++;
            }
            console.log('检查isagree start 7');


            console.log('checkcount',checkcount);
            if(checkcount!==7){
                console.log('不通过');
                return false;
            }
            console.log('通过');

            //return false;
            //发起注册请求
            regist();
        });
    }

    function start() {
        //验证码初始化和刷新、清空各个form字段方法
        vcodeRefresh();

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

