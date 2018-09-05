'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var errorCodes = require('../../components/common/errorCode');
var common = require('../../components/common/common');

/* GET users listing. */
router.get(['/forgetpwdmiddle.html','/changepwdmiddle.html'], function(req, res) {
    var signToken = common.getRandomString(false, 32),
        signTicket = common.getRandomString(false, 32);
    req.session.signToken = signToken;
    req.session.signTicket = signTicket;
    var pageData = {
        seo : {
            title : '金投手用户密码找回_用户找回密码操作流程-金投手官网',
            keywords : '金投手用户密码找回,用户找回密码操作流程',
            discription : '	金投手找回密码页面为购买出借产品的用户展示详细的找回密码操作流程信息，供用户来找回密码使用。'
        },
        signToken: signToken,
        signTicket: signTicket,
        curUrlTitle:'找回密码'
    };
    var url = req.originalUrl;
    if ((url.indexOf('changepwdmiddle')) > 0) {
        pageData.seo = {
            title : '金投手用户密码修改_用户修改密码操作流程-金投手官网',
            keywords : '金投手用户密码修改,用户修改密码操作流程',
            discription : '	金投手修改密码页面为购买出借产品的用户展示详细的修改密码操作流程信息，供用户来修改密码使用。'
        },
        pageData.curUrlTitle = '修改密码';
    }
    res.render('userSign/forgetpwdmiddle',pageData);
});

//获取短信验证码
router.post('/forgetpwdMiddle_sendmsg.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_SMS_SEND,
        body:APIClient.getbody(req.body)
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

//校验短信验证码
router.post('/forgetpwdMiddle_checkmsg.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_SMS_VALIDATE,
        body:APIClient.getbody(req.body)
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

//忘记密码第二步

router.post('/dosforgetpwdmiddle.json',function(req, res) {
    var body = APIClient.getbody(req.body);
    body.validateKey = req.session.id;
    var para = {
        mdname: APIPath.ALICLOUD_FORGETPWD_API,
        body: body
    };
    var result = { success : false };
    co(function* () {
        if(!common.checkCSRF(req)){
            result.data.errorCode = 'default';
        }else{
            var data=yield APIClient.newpost(para.mdname, para);
            if(data.success){
                result.success = true;
                req.session.destroy(function(err){
                    if(err){
                        console.log(err);
                    } else {
                        //res.redirect('/');
                    }
                });
            }else{
                result.success = false;
                result.data=data;
            }
        }
        res.json(result);
    });
});

module.exports = router;


