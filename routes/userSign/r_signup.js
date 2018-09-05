'use strict';
var express = require('express');
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var router = express.Router();
var common = require('../../components/common/common');
var errorCodes = require('../../components/common/errorCode');

/* GET users listing. */
router.get('/signup.html', function (req, res) {
    var signToken = common.getRandomString(false, 32),
        signTicket = common.getRandomString(false, 32);
    req.session.signToken = signToken;
    req.session.signTicket = signTicket;

    var pageData = {
        seo: {
            title: '金投手-用户注册',
            keywords: '金投手、出借、理财',
            discription: '国资金融，当前最稳定、最安全、最有保障的金融产品',
        },
        loginHeader:true,
        signToken: signToken,
        signTicket: signTicket
    };
    res.render('userSign/signup', pageData);
});

//获取或更新图片验证码
router.get('/reloadVcode_REG.json', function (req, res) {
    co(function* () {
        var vcode = yield APIClient.getValidateVCode(APIPath.ALICLOUD_GET_VCODE, 'USER_REG', req.session.id);
        res.json(vcode);
    });
});

//验证手机号是否存在
router.post('/signup_checkphone.json', function (req, res) {
    var para = {
        mdname: APIPath.ALICLOUD_USER_VALIDATEMOBILE,
        body: APIClient.getbody(req.body)
    };
    var result = { success : false };
    co(function* () {
        if(!common.checkCSRF(req)){
            result.CSRF = 'default';
        }else {
            res.json(yield APIClient.newpost(para.mdname, para));
        }
        res.json(result);

    });
});

//校验图片验证码[新]
router.post('/signup_checkvcode.json', function (req, res) {
    var body=APIClient.getbody(req.body);
    body.validateKey=req.session.id;
    var result = { success : false };
    var para = {
        mdname:APIPath.ALICLOUD_GET_CHECKVCODE,
        body: body
    };
    co(function* () {
        if(!common.checkCSRF(req)){
            result.CSRF = 'default';
        }else {
            res.json(yield APIClient.newpost(para.mdname, para));
        }
        res.json(result);
    });
});

//获取短信验证码
router.post('/signup_sendmsg.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_SMS_SEND,
        body:APIClient.getbody(req.body)
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

//校验短信验证码
router.post('/signup_checkmsg.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_SMS_VALIDATE,
        body:APIClient.getbody(req.body)
    };
    var result = { success : false };
    co(function* () {
        if(!common.checkCSRF(req)){
            result.CSRF = 'default';
        }else {
            res.json(yield APIClient.newpost(para.mdname, para));
        }
        res.json(result);
    });
});

//注册功能
router.post('/signup_register.json',function(req, res){
    var body=APIClient.getbody(req.body);
    body.validateKey=req.session.id;
    var para={
        mdname:APIPath.ALICLOUD_SIGNUP_API,
        body:body
    };
    var result = { success : false };
    co(function* () {
        console.log('#####',req.body.signToken,req.body.signTicket,req.session.signToken,req.session.signTicket);
        if(!common.checkCSRF(req)){
            result.data.errorCode = 'default';
        }else {
            var data= yield APIClient.newpost(para.mdname,para);
            if(common.setSession(req,data) === true){//sign up success
                result.success = true;
            }else{
                result.success = false;
                result.data=data;
            }
        }
        res.json(result);
    });
});

module.exports = router;