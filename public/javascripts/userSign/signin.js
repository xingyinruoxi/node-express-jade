'use strict';
window.signin = (function () {
    var check = window.Rui.Check,
        ajax = window.Rui.Ajax,
        tool = window.Rui.Tool,
        alert = window.Rui.Alert,
        layer = window.Rui.layer,
        err=window.Rui.err,
        listcheck={
            tel:false,
            telchecked:false,
            isNewUser:false,//是否是新用户，默认为不是
            pwd:false,
            pwdchecded:false,
            //mobilecodegeted:false,
            mobilecode:false,
            mobilecodechecked:false,
            hasvcode:false,
            vcode:false,
            vcodechecked:false,
            checkvcodeajax:false,//是否是正确的图片验证码
            idcheckedvcode:false//是否判断过图片验证码
        },
        curTab='common';//common为普通登录，mobile为手机动态登录

    //测评结果弹出框
    function layertiplogin(){
        var paras={
            skin: 'layui-layer-rim',
            title:'温馨提示',
            btn:'立即注册',
            content: '您输入的手机号码尚未注册金投手平台，您可以通过“立即注册”按钮,注册成为我们的用户。',
        };
        layer(paras,function(){
            location.href='/signup.html';
        });
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

    //校验密码
    function checkPwd(obj) {
        listcheck.pwdchecded=true;
        var value = $.trim(obj.val());
        if (!check.isinput(value)) {
            tool.alerttip(obj,'请输入6-20位数字及字母组合密码');
            listcheck.pwd=false;
            return false;
        }
        if (check.ispwdlength(value)) {
            if (!check.isrealpwd(value)) {
                tool.alerttip(obj,'请输入6-20位数字及字母组合密码');
                listcheck.pwd=false;
                return false;
            } else {
                tool.alerttip(obj,'','h');
                listcheck.pwd=true;
                return true;
            }
        } else {
            tool.alerttip(obj,'请输入6-20位数字及字母组合密码');
            listcheck.pwd=false;
            return false;
        }
    }



    //验证码初始化刷新
    function vcodeRefresh(isgo){
        if($('#signinCount').val()>2){
            listcheck.hasvcode=true;
        }
        //公共的初始化和刷新图片验证码
        if(isgo||$('#signinCount').val()>2){
            listcheck.hasvcode=true;
            tool.initVCode('.btn-code-img','LOGIN');
        }
    }

    //图片校验
    function checkMsgVcode(obj) {
        listcheck.vcodechecked=true;
        console.log(1);
        if (!check.isinput(obj.val())) {
            tool.alerttip(obj,'请填写图片验证码');
            listcheck.vcode=false;
            return false;
        }
        console.log(2);
        if (obj.val().length !== 4) {
            tool.alerttip(obj,'图片验证码填写错误');
            listcheck.vcode=false;
            return false;
        }
        console.log(3);
        tool.alerttip(obj,'','h');
        listcheck.vcode=true;
        return true;
    }



    //图片验证码校验
    function checkMsgVcodeAll() {
        $('#signinVcode,#m_signinVcode').on('blur', function () {
            var vid=$(this).attr('id');
            console.log('signinVcode','blur',vid);
            if (!checkMsgVcode($(this))) {
                return false;
            }
            var paras = {
                mdname: '/signin_checkvcode.json',
                data: {
                    code: $(this).val(),
                    type: 'USER_LOGIN'
                }
            };
            ajax(paras, function (res) {
                listcheck.idcheckedvcode=true;
                //if(err.getErrFun(res,'signinVcode')){return false;}
                if(res.success&&res.data){
                    console.log(1);
                    listcheck.vcode=true;
                    listcheck.checkvcodeajax=true;
                }else{
                    console.log(2);
                    listcheck.vcode=false;
                    listcheck.checkvcodeajax=false;
                    tool.alerttip('#'+vid,'图片验证码填写错误');
                }
            });
        });
    }

    //短信检验
    function checkMcode(obj) {
        listcheck.mobilecodechecked=true;
        if (!check.isinput(obj.val())) {
            tool.alerttip(obj,'请填写动态密码');
            listcheck.mobilecode=false;
            return false;
        }
        if (obj.val().length !== 6) {
            tool.alerttip(obj,'动态密码填写错误,请重新填写');
            listcheck.mobilecode=false;
            return false;
        }
        tool.alerttip(obj,'','h');
        listcheck.mobilecode=true;
        return true;
    }


    //发送短信和倒计时
    function sendMessage(){
        //倒计时
        window.Rui.countDown.Down('#getMVcode',sendMessage);
        var paras1 = {
            mdname: '/forgetpwdMiddle_sendmsg.json',
            data: {
                mobile: $('#m_tel').val(),
                type: 'login'
            }
        };
        console.log('请求参数',paras1);
        //return false;
        ajax(paras1, function (res) {
            //if(err.getErrFun(res,'msgVCode')){return false;}
            //console.log('res',res);
        });
    }

    //获取短信验证码
    function getSendVcode(){
        $('#getMVcode').unbind('click').bind('click', function () {
            if(!checkTel($('#m_tel'))){
                return false;
            }
            if(listcheck.isNewUser){
                layertiplogin();
                return false;
            }
            if (!checkMsgVcode($('#m_signinVcode'))) {
                return false;
            }
            console.log('获取短信验证码');
            listcheck.mobilecodegeted=true;
            //发送短信和倒计时
            sendMessage();
        });
    }

    //校验手机号和密码
    function checkTelandPwd(){
        $('#tel').on('blur', function () {
            checkTel($(this));
        });
        $('#password').on('keyup blur', function () {
            checkPwd($(this));
        });
        $('#m_vcode').bind('blur',function(){
            console.log('校验短信');
            if(!checkTel($('#m_tel'))){
                return false;
            }
            checkMcode($(this));
        });

        $('#m_tel').bind('blur',function(){
            if(!checkTel($(this))){
                return false;
            }
            var paras = {
                mdname: '/signup_checkphone.json',
                data: {
                    mobile: $('#m_tel').val(),
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
                    listcheck.tel=true;
                    listcheck.isNewUser = false;
                } else{
                    layertiplogin();
                    listcheck.tel=false;
                    listcheck.isNewUser = true;
                }

            });
        });
    }

    //校验手机号和密码
    function checklogin(){
        console.log('listcheck',listcheck);
        var checkcount=0;
        console.log('检查tel start 1');
        if(!listcheck.telchecked){
            console.log(1);
            checkTel($('#tel'));
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
        console.log('检查tel end 1');
        console.log('检查pwd start 2');
        if(!listcheck.pwdchecded){
            console.log(1);
            checkPwd($('#password'));
            if(listcheck.pwd){
                console.log(2);
                checkcount++;
            }
        }else{
            console.log(3);
            if(listcheck.pwd) {
                console.log(4);
                checkcount++;
            }
        }
        console.log('检查pwd end 2');
        console.log('检查vcode start 3');
        if(listcheck.hasvcode){
            console.log(1);
            if(!listcheck.vcodechecked){
                console.log(2);
                checkMsgVcode($('#signinVcode'));
                if(listcheck.vcode){
                    console.log(3);
                    checkcount++;
                }
            }else{
                if(listcheck.vcode){
                    console.log(4);
                    checkcount++;
                }
            }
        }else{
            console.log(5);
            checkcount++;
        }
        console.log('检查vcode end 3');

        console.log('checkcount',checkcount,checkcount===3?true:false);

        return checkcount===3?true:false;
    }

    //手机动态登录提交验证:校验手机号、图片验证码、短信验证码
    function checkloginm(){
        var checkcount=0;
        console.log('listcheck',listcheck);
        console.log('检查tel start 1');
        if(!listcheck.telchecked){
            console.log(1);
            checkTel($('#m_tel'));
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
        console.log('检查tel end 1');

        console.log('检查vcode start 2');
        if(listcheck.hasvcode){
            console.log(1);
            if(!listcheck.vcodechecked){
                console.log(2);
                checkMsgVcode($('#m_signinVcode'));
                if(listcheck.vcode){
                    console.log(3);
                    checkcount++;
                }
            }else{
                if(listcheck.vcode){
                    console.log(4);
                    checkcount++;
                }
            }
        }else{
            console.log(5);
            checkcount++;
        }
        console.log('检查vcode end 2');

        console.log('检查mobilecode start 3');
        if(listcheck.tel){
            console.log(1);
           if(!listcheck.mobilecodechecked){
               console.log(2);
               checkTel($('#m_tel'));
               if(listcheck.mobilecode){
                   console.log(3);
                   checkcount++;
               }
           }else{
               if(listcheck.mobilecode){
                   console.log(4);
                   checkcount++;
               }
           }
        }else{
            if(listcheck.mobilecode){
                console.log(5);
                checkcount++;
            }
        }
        console.log('检查mobilecode end 3');

        console.log('checkcount',checkcount,'通过');
        return checkcount===3?true:false;

    }

    function dealTab(){
        console.log('55555');
        for(var i in listcheck){
            listcheck[i]=false;
        }
        if(curTab==='mobile'){
            console.log('dealTab1111');
            vcodeRefresh(111);
            getSendVcode();//获取短信验证码
        }
        console.log('重置listcheck',listcheck);
    }

    //切换登陆方式
    function loginTab() {
        $('.tab_title li').on('click' ,function () {
            if(!$(this).find('a').hasClass('active')){
                curTab=$(this).find('a').hasClass('tab_link1')?'common':'mobile';
                console.log(curTab);
                $(this).find('a').addClass('active').end().siblings().find('a').removeClass('active');
                $('.dl-signup dd').eq($(this).closest('li').index()).removeClass('hidden').siblings('dd').addClass('hidden');
                //if(curTab==='mobile'){
                dealTab();
                //}
            }
        });
        //$('.tab_title li:last-child').click();
    }


    //登陆
    function login(isgo){
        var username='',paras={};
        if (curTab === 'common') {
            if (!checklogin()) {//校验手机号和密码
                return false;
            }
            username = $('#tel').val();
            paras = {
                mdname: '/signin_login.json',
                data: {
                    mobile: username,//40000001
                    password: $('#password').val(),//40000001
                    signToken: $('#signToken').val(),
                    signTicket: $('#signTicket').val(),
                    imageCode: $('#signinVcode').val()//为空时:40000012
                }
            };
        }else {
            if (!checkloginm()) {//手机动态登录提交验证
                return false;
            }
            username = $('#m_tel').val();
            paras = {
                mdname: '/123.json',
                data: {
                    mobile: username,//40000001
                    password: $('#m_vcode').val(),//40000001
                    signToken: $('#signToken').val(),
                    signTicket: $('#signTicket').val(),
                    imageCode: $('#m_signinVcode').val()//为空时:40000012
                }
            };
        }

        ajax(paras, function (res) {
            var data=res.data;

            if(err.getErrHref(data,'/signinfail.html')){return false;}
            //$(this).text('登录中');
            if (res.success === true) {
                localStorage.setItem('userRemember',JSON.stringify({'isremember':($('#isRemember').attr('checked')==='checked'),username:($('#isRemember').attr('checked')==='checked')?username:''}));
                console.log('登陆成功！',JSON.parse(localStorage.getItem('userRemember')));
                //return false;
                if(!isgo){
                    //location.href = window.location.search? '/':'/user/zhzl/';
                    var skipWhere=sessionStorage.getItem('loginSkip');
                    location.href = skipWhere?'/user/zhzl/' :'/';
                    sessionStorage.removeItem('loginSkip')
                }else{
                    location.reload();
                }
            } else {
                //登录失败3次之后需要输入验证码
                if (data && data.signinCount && data.signinCount >= 2) {
                    $('#signinVcodeConfirm').show();
                    //验证码刷新
                    vcodeRefresh(111);
                    listcheck.hasvcode=true;
                }
                if(data.errorCode.toString()){
                    $('#signinBtn').next().show().text(err.getnewErr(data.errorCode));
                }
                /*switch(data.errorCode.toString()){
                    case '40000012':case '40010004':case '40010005':case '40000013':
                    alert.systemMsg('#signinVcode', err.getnewErr(data.errorCode));
                    break;
                    case '40000001':
                        alert.systemMsg('#tel', err.getnewErr(data.errorCode));
                        break;
                    default:
                        alert.systemMsg('#tel', err.getnewErr(data.errorCode));
                        break;
                }*/
            }
        });
    }

    //点击登陆
    function clicklogin(){
        $('#signinBtn').bind('click', function () {
            login();
        });
        $('#signinBtnAlert').bind('click', function () {
            login('yes');
        });
    }

    //是否是老用户
    function islogoedUser(){
        var userRemember= localStorage.getItem('userRemember')?JSON.parse(localStorage.getItem('userRemember')):'';
        if(userRemember){
            if(userRemember.isremember===true){
                $('#isRemember').attr('checked','checked');
                $('#tel,#m_tel').val(userRemember.username);
            }else{
                $('#isRemember').removeAttr('checked');
            }
        }
    }

    //回车
    function btnEnter(){
        tool.btnEnter(function(){
            $('#signinBtn,#signinBtnAlert').click();
        });
    }


    function start() {
        //切换登陆方式
        loginTab();

        tool.clearFormInputs(['#tel', '#password', '#signinVcode']);//清空各个表单字段
        checkTelandPwd();//校验手机号和密码
        vcodeRefresh();//验证码初始化刷新
        checkMsgVcodeAll();//图片验证码校验
        clicklogin();//点击登陆
        islogoedUser();//是否是老用户
        btnEnter();//回车
    }

    return {
        start: start,
        login:login
    };
}());
window.signin.start();
