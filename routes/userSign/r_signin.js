'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var common = require('../../components/common/common');
var errorCodes = require('../../components/common/errorCode');

router.get('/signin.html', function(req, res) {
    var ses=req.session,
        signToken = common.getRandomString(false,32),
        signTicket = common.getRandomString(false,32);
    ses.signinCount|| (ses.signinCount = 0);
    ses.signToken = signToken;
    ses.signTicket = signTicket;
    var pageData = {
        seo : {
            title : '金投手-用户登录',
            keywords : '金投手、出借、理财、注册金投手',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        loginHeader:true,
        signToken : signToken,
        signTicket : signTicket,
        signinCount : ses.signinCount
    };
    res.render('userSign/signin',pageData);
});

//获取或更新图片验证码
router.get('/reloadVcode_LOGIN.json', function(req, res) {
    co(function* () {
        var vcode = yield APIClient.getValidateVCode(APIPath.ALICLOUD_GET_VCODE,'USER_LOGIN', req.session.id);
        res.json(vcode);
    });
});

//校验图片验证码[新]
router.post('/signin_checkvcode.json', function (req, res) {
    var body=APIClient.getbody(req.body);
    body.validateKey=req.session.id;
    var para = {
        mdname:APIPath.ALICLOUD_GET_CHECKVCODE,
        body: body
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

//登录
router.post('/signin_login.json',function(req, res){
    var ses=req.session,
        body=APIClient.getbody(req.body),
        result = { success : false },
        data = {};
    body.validateKey=ses.id;
    var para={
        mdname:APIPath.ALICLOUD_SIGNIN_API,
        body:body
    };
    co(function* () {
        if(common.isEmpty(req.body.signToken) || req.session.signToken !== req.body.signToken
            ||common.isEmpty(req.body.signTicket)|| req.session.signTicket !== req.body.signTicket){
            result.msg = errorCodes.errorCode().usernamePasswdError;
        }else {
            console.log('登陆开始1');
            data=yield APIClient.newpost(para.mdname, para);
            if(common.setSession(req,data)){
                result.success = true;
            }else{
                result.data = data;
                result.data.signinCount = ses.signinCount;
                ses.signinCount?ses.signinCount+=1:ses.signinCount=1;
            }
        }
        res.json(result);
    });
});

//手机动态登录
router.post('/123.json',function(req, res){
    var ses=req.session,
        body=APIClient.getbody(req.body),
        result = { success : false },
        data = {};
    body.validateKey=ses.id;
    var para={
        mdname:APIPath.ALICLOUD_SIGNIN_API_M,
        body:body
    };
    co(function* () {
        if(!common.checkCSRF(req)){
            result.data.errorCode = 'default';
        }else {
            console.log('登陆开始1');
            data=yield APIClient.newpost(para.mdname, para);
            if(common.setSession(req,data)){
                result.success = true;
            }else{
                result.data = data;
                result.data.signinCount = ses.signinCount;
                ses.signinCount?ses.signinCount+=1:ses.signinCount=1;
            }
        }
        res.json(result);
    });
});

module.exports = router;