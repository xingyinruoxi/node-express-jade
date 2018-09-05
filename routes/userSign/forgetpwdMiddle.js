'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var errorCodes = require('../../components/common/errorCode');

/* GET users listing. */
router.get('/forgetpwdmiddle.html', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手',
            keywords : '金投手、投资、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'找回密码'
    };
    res.render('userSign/forgetpwdMiddle',pageData);
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
    co(function* () {
        var data=yield APIClient.newpost(para.mdname, para);
        var result = { success : false };
        if(data.success){
            result.success = true;
            req.session.destroy(function(err){
                if(err){
                    console.log(err);
                } else {
                    res.redirect('/');
                }
            });
        }else{
            result.success = false;
            result.data=data;
        }
        res.json(result);
    });
});

router.post('/dosforgetpwdmiddle1.json',function(req, res){

    var result = { success : false };
    var data = {};

    var body = {
        'mobile': req.body.mobile,
        'smsCode': req.body.smsCode,
        'newPassword': req.body.newPassword,

        'imageCode': req.body.imageCode,
        'oldPassword': req.body.oldPassword,
        'validateKey':req.session.id
    };
    //res.json(result);
    co(function* () {
        //验证通过
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_FORGETPWD_API, {}, {}, body);
        } catch (e) {
            data = null;
        } finally {
            if(data.success===true){
                result.success = true;
            }else{
                result.success = false;
                result.msg = errorCodes.errorCode()[errorCodes.apiErrorCode()[data.errorCode]];
            }

        }
        res.json(result);
    });
});



module.exports = router;


