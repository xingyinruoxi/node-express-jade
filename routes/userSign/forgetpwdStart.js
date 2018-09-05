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
router.get('/forgetpwdstart.html', function(req, res) {
    //var signToken = common.getRandomString(false, 32),
    //    signTicket = common.getRandomString(false, 32);
    //req.session.signToken = signToken;
    //req.session.signTicket = signTicket;
    var pageData = {
        seo : {
            title : '忘记密码',
            keywords : '金投手、投资、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'找回密码'
    };
    res.render('userSign/forgetpwdStart',pageData);
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
