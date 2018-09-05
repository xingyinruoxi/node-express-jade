'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var common = require('../../components/common/common');
var syc =  require('../../config/config');
var errorCodes = require('../../components/common/errorCode');

/* GET users listing. */
router.get(['/forgetpwdstart.html','/changepwdstart.html'], function(req, res) {
    //var signToken = common.getRandomString(false, 32),
    //    signTicket = common.getRandomString(false, 32);
    //req.session.signToken = signToken;
    //req.session.signTicket = signTicket;
    var pageData = {
        seo : {
            title : '金投手用户密码找回_用户找回密码操作流程-金投手官网',
            keywords : '金投手用户密码找回,用户找回密码操作流程',
            discription : '	金投手找回密码页面为购买出借产品的用户展示详细的找回密码操作流程信息，供用户来找回密码使用。'
        },
        curUrlTitle:'找回密码'
    };
    var url = req.originalUrl;
    if((url.indexOf('changepwdstart')) > 0){
        pageData.seo = {
            title : '金投手用户密码修改_用户修改密码操作流程-金投手官网',
            keywords : '金投手用户密码修改,用户修改密码操作流程',
            discription : '	金投手修改密码页面为购买出借产品的用户展示详细的修改密码操作流程信息，供用户来修改密码使用。'
        },
        pageData.curUrlTitle='修改密码';
    }
    res.render('userSign/forgetpwdstart',pageData);
});


//验证手机号是否存在
router.post('/forgetpwdstart_checkphone.json', function (req, res) {
    var para = {
        mdname: APIPath.ALICLOUD_USER_VALIDATEMOBILE,
        body: APIClient.getbody(req.body)
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

//获取或更新图片验证码
router.get('/reloadVcode_PASSWORD_RESET.json', function(req, res) {
    co(function* () {
        var vcode = yield APIClient.getValidateVCode(APIPath.ALICLOUD_GET_VCODE,'USER_PASSWORD_RESET', req.session.id);
        res.json(vcode);
    });
});

//校验图片验证码[新]
router.post('/forgetpwdstart_checkvcode.json', function (req, res) {
    var body=APIClient.getbody(req.body);
    body.validateKey=req.session.id;
    var para = {
        mdname:APIPath.ALICLOUD_GET_CHECKVCODE,
        body: body
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

module.exports = router;
