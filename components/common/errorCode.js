'use strict';
var eCode = {};
var apiECode = {};

function errorMsg(code,msg){
    return {
        errorCode:code,msg:msg
    };
}

exports.errorCode = function(){
    /* 公共部分 - 从0开始*/
    eCode['tokenTicketValidtionFailed'] = errorMsg('0000000','对不起，您在进行非法操作，我们已记录下您的相关信息，请保重');
    eCode['systemError'] = errorMsg('0000001','系统错误，无法返回数据');
    eCode['systemParamError'] = errorMsg('0000002','参数错误');
    eCode['vcodeNull'] =  errorMsg('0000003','验证码不能为空');
    eCode['vcodeError'] =  errorMsg('0000004','验证码错误');
    eCode['apiException'] =  errorMsg('0000005','获取数据失败');

    /* 用户登录错误码 - 1开头用户相关*/
    eCode['usernameNull'] = errorMsg('1000003','用户名不能为空');
    eCode['passwdNull'] =  errorMsg('1000004','密码不能为空');
    eCode['UPError'] =  errorMsg('1000005','用户名或者密码不正确');

    /* 找回密码 - 1开头用户相关*/
    eCode['mobilePhoneError'] =  errorMsg('1000006','手机号不存在');
    eCode['rePasswordError'] =  errorMsg('1000007','两次不一致');
    eCode['rePasswordNull'] =  errorMsg('1000008','确认密码不能为空');
    eCode['oldPasswordWrong'] =  errorMsg('1000009','您输入的旧密码不正确');

    /* 银行开户 - */
    eCode['userOpenError'] =  errorMsg('1903','您已经绑定过该P2P平台');
    /* 用户注册错误码 - 2开头 */
    eCode['cellPhoneNull'] = errorMsg('2000001','手机号不能为空');
    eCode['cellPhoneIsNotExist'] = errorMsg('2000002','手机号不存在');
    eCode['cellPhoneExisted'] = errorMsg('2000003','手机号已存在');


    /* token 失效 */
    eCode['tokenError'] = errorMsg('3000001','token失效');

    /* 短信验证码 */
    eCode['smsFailed'] = errorMsg('3000010','发送短息失败');
    eCode['smsError'] = errorMsg('3000011','短信验证码不正确');
    eCode['smsInvalid'] = errorMsg('3000012','短信验证码失效');
    eCode['smsTypeIsNull'] = errorMsg('3000013','短信类型不能为空');

    /* 短信验证码 */
    eCode['vcodeNo'] = errorMsg('40000012','验证码不能为空');

    return eCode;
};


exports.apiErrorCode = function() {
    //系统错误信息
    apiECode['40000000'] = 'systemError';//系统错误
    apiECode['40000001'] = 'systemParamError';//参数错误
    apiECode['40000002'] = 'systemError';//rpc调用错误

    //reload token
    apiECode['40000003'] = 'tokenError';//token失效后跳转去登录
    apiECode['40000007'] = 'tokenError';//刷新token失败
    apiECode['40000008'] = 'tokenError';//刷新token时，ticket无效

    //登录
    apiECode['40000004'] = 'UPError';//登录错误

    //修改密码
    apiECode['40000006'] = 'oldPasswordWrong';//修改密码时，旧密码错误

    //注册
    apiECode['40000009'] = 'rePasswordError';//注册时，确认密码不一致
    apiECode['40000010'] = 'cellPhoneExisted';//注册时，确认密码不一致

    //发送短信
    apiECode['40010001'] = 'smsFailed';//发送短息失败
    apiECode['40010002'] = 'smsError';//短信验证码不正确
    apiECode['40010003'] = 'smsInvalid';//短信验证码失效

    //验证码
    apiECode['40000012'] = 'vcodeNo';//没有验证码

    return apiECode;
};

