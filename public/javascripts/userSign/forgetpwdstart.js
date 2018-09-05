/**
 * Created by a110 on 17/4/9.
 */
'use strict';

window.forgetpwdstart = (function () {
    var check=window.Rui.Check,
        ajax=window.Rui.Ajax,
        err=window.Rui.err,
        tool = window.Rui.Tool,
        listcheck={
            tel:false,
            telchecked:false,
            imgcode:false,
            imgcodechecked:false
        };

    // 校验手机号
    function checkTel(obj) {
        listcheck.telchecked=true;
        if (!check.isinput(obj.val())) {
            tool.alerttip(obj,'手机号码不能为空');
            listcheck.tel=false;
            return false;
        }
        if (!check.isMHMobile(obj.val())) {
            tool.alerttip(obj,'请填写正确手机号码');
            listcheck.tel=false;
            return false;
        }
        tool.alerttip(obj,'','h');
        listcheck.tel=true;
        return true;
    }

    //图片校验
    function checkMsgVcode(obj){
        listcheck.imgcodechecked=true;
        if (!check.isinput(obj.val())) {
            tool.alerttip(obj,'请填写图片验证码');
            listcheck.imgcode=false;
            return false;
        }
        if (obj.val().length!==4){
            tool.alerttip(obj,'图片验证码填写错误');
            listcheck.imgcode=false;
            return false;
        }
        tool.alerttip(obj,'','h');
        listcheck.imgcode=true;
        return true;
    }

    function start() {
        //公共的初始化和刷新图片验证码
        tool.initVCode('.btn-code-img','PASSWORD_RESET');
        //公共的清空各个form字段的方法
        tool.clearFormInputs(['#tel', '#msgVCode']);

        // 手机号失去焦点，校验手机号
        var isNewUser=false;//是否是新用户
        $('#tel').on('blur', function () {
            if(!checkTel($(this))){
                return false;
            }
            var paras={
                mdname:'/forgetpwdstart_checkphone.json',
                data: {
                    mobile:$('#tel').val()
                }
            };
            ajax(paras,function(res){
                console.log('res',res);
                if(err.getErrFun(res,'tel')){
                    listcheck.tel=false;
                    return false;
                }
                if (res.success === true&&res.data===true) {
                    isNewUser = false;
                } else {
                    tool.alerttip('#tel','该手机号未注册金投手平台');
                    listcheck.tel=false;
                    isNewUser = true;
                }
            });
        });

        //图片验证码校验
        var istrueImgVcode=false;
        $('#msgVCode').on('blur',function() {
            console.log('图片验证码校验');
            if (!checkMsgVcode($(this))){
                console.log('未通过');
                return false;
            }
            var paras = {
                mdname: '/forgetpwdstart_checkvcode.json',
                data: {
                    code: $('#msgVCode').val(),
                    type:'USER_PASSWORD_RESET'
                }
            };
            console.log('图片进来了');
            ajax(paras, function (res) {
                if(err.getErrFun(res,'msgVCode')){
                    istrueImgVcode=false;
                    return false;
                }
                if(res.success&&res.data){
                    istrueImgVcode=true;
                    listcheck.imgcode=true;
                }else{
                    istrueImgVcode=false;
                    tool.alerttip('#msgVCode','图片验证码填写错误');
                    listcheck.imgcode=false;
                }
            });
        });


        //点击
        $('#forgetpwdstartBtn').on('click', function () {
            console.log('forgetpwdstartBtn');

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

            console.log('检查imgcode start 2');
            if(!listcheck.imgcodechecked){
                console.log(1);
                checkMsgVcode($('#msgVCode'));
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
            console.log('checkcount',checkcount);

            if(checkcount!==2){
                console.log('不通过');
                return false;
            }
            console.log('通过');

            //return false;
            /*if(!checkTel($('#tel'))){
                return false;
            }
            if(isNewUser){
                tool.alerttip('#tel','该手机号未注册金投手平台');
                listcheck.tel=false;
                return false;
            }
            if (!checkMsgVcode($('#msgVCode'))){
                return false;
            }
            if(!istrueImgVcode){
                tool.alerttip('#msgVCode','图片验证码填写错误');
                listcheck.imgcode=false;
                return false;
            }*/

            var mobilePhone = $('.mobilePhone').val(),
                signinVcode = $('#msgVCode').val(),
                data = {
                    mobilePhone: mobilePhone,
                    signinVcode: signinVcode
                };
            sessionStorage.setItem('forget_tel', JSON.stringify(data));
            //console.log('跳转到forgetpwdmiddle.html', JSON.stringify(data));
            if( window.location.pathname.indexOf('changepwdstart') > 0){
                location.href = '/changepwdmiddle.html';
            }else{
                location.href = '/forgetpwdmiddle.html';
            }

        });
    }

    return {
        start: start
    };
})().start();