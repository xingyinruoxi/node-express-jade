/**
 * Created by a110 on 17/7/13.
 */
'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var commonAPI = require('../../components/common/CommonAPI');
var common = require('../../components/common/common');

/* GET users listing. */
router.get('/user/getcashhistory.html', function(req, res) {
    var signToken = common.getRandomString(false, 32),
        signTicket = common.getRandomString(false, 32);
    req.session.signToken = signToken;
    req.session.signTicket = signTicket;
    var pageData = {
        seo : {
            title : '我要提现-国资控股互联网金融平台',
            keywords : '我要提现,金投手,互联网金融,互联网金融平台',
            discription : '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
        },
        curUrlTitle:'我要提现',
        rechargeInfo:{},
        signToken: signToken,
        signTicket: signTicket,
    };
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        pageData.isheadshow=commonAPI.getaccountHeader(userInfo.data);
        res.render('account/getcashhistory',pageData);
    });
});

module.exports = router;


