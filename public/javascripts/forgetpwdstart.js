/**
 * Created by a110 on 17/4/9.
 */
'use strict';

window.forgetpwdstart = (function () {

    var check=window.Rui.Check,
        ajax=window.Rui.Ajax,
        err=window.Rui.err,
        tool = window.Rui.Tool,
        alertControl={tel:false,msgVCode:false};//设置弹出框的开关

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

    // 校验手机号
    function checkTel(obj) {
        if (!check.isinput(obj.val())) {
            obj.closest('li').find('.form-error').show().text('手机号码不能为空');
            alertControl.tel=true;
            return false;
        }
        if (!check.isMHMobile(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写正确手机号码');
            alertControl.tel=true;
            return false;
        }
        obj.closest('li').find('.form-error').hide();
        alertControl.tel=false;
        return true;
    }

    //图片校验
    function checkMsgVcode(obj){
        if (!check.isinput(obj.val())) {
            obj.closest('li').find('.form-error').show().text('请填写图片验证码');
            alertControl.msgVCode=true;
            return false;
        }
        if (obj.val().length!==4){
            obj.closest('li').find('.form-error').show().text('图片验证码填写错误');
            alertControl.msgVCode=true;
            return false;
        }
        obj.prev().hide();
        alertControl.msgVCode=false;
        return true;
    }

    function start() {
        //公共的初始化和刷新图片验证码
        tool.initVCode('.btn-code-img','PASSWORD_RESET');
        //公共的清空各个form字段的方法
        tool.clearFormInputs(['#tel', '#msgVCode']);

        //关闭错误提示
        $('.btn-close').bind('click', function () {
            console.log(111,$(this).closest('.form-error').next().attr('id'));
            alertControl[$(this).closest('.form-error').next().attr('id')]=false;
            $(this).closest('.form-error').hide();
            console.log(alertControl);
        });

        // 手机号失去焦点，校验手机号
        var isNewUser=false;//是否是新用户
        $('#tel').on('blur', function () {
            if(hasOtherOpen('tel')){
                return false;
            }
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
                    alertControl.tel=true;
                    return false;
                }
                if (res.success === true&&res.data===true) {
                    isNewUser = false;
                } else {
                    $('#tel').closest('li').find('.form-error').show().text('该手机号未注册金投手平台');
                    alertControl.tel=true;
                    isNewUser = true;
                }
            });
        });

        //图片验证码校验
        var istrueImgVcode=false;
        $('#msgVCode').on('blur',function() {
            console.log('图片验证码校验');
            if(hasOtherOpen('msgVCode')){
                return false;
            }
            if (!checkMsgVcode($(this))){
                console.log('未通过');
                return false;
            }
            console.log('通过');
            //return false;
            var paras = {
                mdname: '/forgetpwdstart_checkvcode.json',
                data: {
                    code: $('#msgVCode').val(),
                    type:'USER_PASSWORD_RESET'
                }
            };
            console.log('通过');
            ajax(paras, function (res) {
                if(err.getErrFun(res,'msgVCode')){
                    istrueImgVcode=false;
                    return false;
                }
                if(!res.success){
                    istrueImgVcode=false;
                    $('#msgVCode').closest('li').find('.form-error').show().text('图片验证码填写错误');
                    alertControl.msgVCode=true;
                }else{
                    istrueImgVcode=true;
                }
            });
        });


        //点击
        $('#forgetpwdstartBtn').on('click', function () {
            console.log('forgetpwdstartBtn');
            console.log(123);
            if(hasOtherOpen()){
                return false;
            }
            if(!checkTel($('#tel'))){
                return false;
            }
            if(isNewUser){
                $('#tel').closest('li').find('.form-error').show().text('该手机号未注册金投手平台');
                alertControl.tel=true;
                return false;
            }
            if (!checkMsgVcode($('#msgVCode'))){
                return false;
            }
            if(!istrueImgVcode){
                $('#msgVCode').closest('li').find('.form-error').show().text('图片验证码填写错误');
                alertControl.msgVCode=true;
                return false;
            }



            var mobilePhone = $('.mobilePhone').val(),
                signinVcode = $('#msgVCode').val(),
                data = {
                    mobilePhone: mobilePhone,
                    signinVcode: signinVcode
                };

            sessionStorage.setItem('forget_tel', JSON.stringify(data));
            console.log('跳转到forgetpwdmiddle.html', JSON.stringify(data));
            location.href = '/forgetpwdmiddle.html';
            /*$.ajax({
                type: 'post',
                url: 'dosforgetpwdstart.json',
                data: data,
                dataType: 'json',
                success: function (res) {
                    console.log('res', res);
                    if (res.success === true) {
                        sessionStorage.setItem('forget_tel', JSON.stringify(data));
                        console.log('跳转到forgetpwdmiddle.html', JSON.stringify(data));
                        location.href = '/forgetpwdmiddle.html';
                    } else {
                        console.log('失败了');
                    }
                }
            });*/
        });
    }

    return {
        start: start
    };
})().start();