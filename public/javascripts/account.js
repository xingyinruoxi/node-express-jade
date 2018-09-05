'use strict';
//推荐人
$(function () {
    var $inviter = $('.inviter');
    var onOff=true;
    $inviter.click(function () {
        if(onOff){
            $('.inviter_input').removeClass('hidden').end().find('.fa').removeClass('fa-caret-right').addClass('fa-caret-down');
        }else{
            $('.inviter_input').addClass('hidden').end().find('.fa').removeClass('fa-caret-down').addClass('fa-caret-right');
        }
        onOff=!onOff;
    });
});
//错误提示关闭按纽
$(function () {
    var $btnErrorClose=$('.form-error').find('.btn-close');
    $btnErrorClose.click(function () {
        $(this).closest('.form-error').hide();
    });
});
//找回密码第一步
$(function () {
    // 手机号失去焦点，校验手机号
    $('.forgetpwdstart .mobilePhone').on('blur',function(){
        /* jshint ignore:start */
        checkMobile();
        /* jshint ignore:end */
    });
    //提交表单
    var $btnSubmit=$('.forgetpwdstart').find('.btn-default');
    $btnSubmit.click(function () {
        /* jshint ignore:start */
        checkMobile();
        /* jshint ignore:end */
    });
});
//找回密码第二步
$(function () {
    //校验密码格式，6到20位密码，数字与字母混合
    $('.forgetpwdmiddle .password').on('blur keyup',function(){
        /* jshint ignore:start */
        checkPassword();
        /* jshint ignore:end */
    });
    // 确认密码失去焦点，校验密码
    $('.forgetpwdmiddle .repassword').on('blur',function(){
        /* jshint ignore:start */
        checkConfirmPassword();
        /* jshint ignore:end */
    });
    //提交表单
    var $btnSubmit=$('.forgetpwdmiddle').find('.btn');
    $btnSubmit.click(function () {
        /* jshint ignore:start */
        checkPassword();
        checkConfirmPassword();
        /* jshint ignore:end */
    });
});
//登录
$(function () {
    // 手机号失去焦点，校验手机号
    $('.signin .mobilePhone').on('blur',function(){
        /* jshint ignore:start */
        checkMobile();
        /* jshint ignore:end */
    });
    //提交表单
    var $btnSubmit=$('.signin').find('.btnbtn-default');
    $btnSubmit.click(function () {
        /* jshint ignore:start */
        checkMobile();
        /* jshint ignore:end */
    });
});
//注册
$(function () {
// 手机号失去焦点，校验手机号
    $('.signup .mobilePhone').on('blur',function(){

        /* jshint ignore:start */

        if(checkMobile()){
            $.ajax({
                type: 'POST',
                url: '/checkcellphone.json',
                data: {
                    cellphone:$('#cellphone').val()
                    /*username:$('#tel').val(),
                    password:$('#password').val(),
                    signToken:$('#signToken').val(),
                    signTicket:$('#signTicket').val(),
                    signinVcode:$('#signinVcode').val()*/
                },
                dataType: 'json',
                success: function(res){
                    console.log('res',res);
                    if(res.success === true){
                        //location.href = '/forgetpwdMiddle.html';
                    }else{
                        $('#cellphone').prev().show().find('.text').text('手机号码已注册');

                        /*//登录失败
                        //登录失败3次之后需要输入验证码
                        if(res.data && res.data.signinCount && res.data.signinCount >= 3){
                            $('#signinVcodeConfirm').show();
                        }
                        if(res.msg.errorCode === '1000003'
                            || res.msg.errorCode === '1000005'){
                            systemMsg('#tel',res.msg.msg);
                        }else if(res.msg.errorCode === '1000004'){
                            systemMsg('#password',res.msg.msg);
                        }else if(res.msg.errorCode === '0000003' || res.msg.errorCode === '0000004'){
                            systemMsg('#signinVcode',res.msg.msg);
                        }*/

                    }
                }
            });
        }else{
            console.log('false,手机号无效');
        }
        /* jshint ignore:end */
    });
    //校验密码格式，6到20位密码，数字与字母混合
    $('.signup .password').on('blur keyup',function() {
        /* jshint ignore:start */
        checkPassword();
        /* jshint ignore:end */
    });
    // 确认密码失去焦点，校验密码
    $('.signup .repassword').on('blur',function(){
        //if(checkPassword());
        /* jshint ignore:start */
        checkConfirmPassword();
        /* jshint ignore:end */
    });

    //提交表单
    var $btnSubmit=$('.signup').find('.btn-default');
    $btnSubmit.click(function () {
        /* jshint ignore:start */
        checkMobile();
        checkPassword();
        checkConfirmPassword();
        /* jshint ignore:end */
    });
});
//检验好友手机号
$(function () {
    var inviterInput=$('.inviter_input').find('input');
    inviterInput.on('blur',function () {
        /* jshint ignore:start */
        checkInvitePhoneNo();
        /* jshint ignore:end */
    });
});