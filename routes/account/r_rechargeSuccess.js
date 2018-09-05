'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var commonAPI = require('../../components/common/CommonAPI');
var common = require('../../components/common/common');

/* GET users listing. */
router.get('/user/rechargesuccess.html', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : ' 充值结果_金投手-国资控股互联网金融平台',
            keywords : ' 充值结果,金投手,互联网金融,互联网金融平台',
            discription : '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
        },
        curUrlTitle:'充值结果',
        accountInfo:{}
    };

    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        var data = common.isEmpty(userInfo.data.userAccountInfoVO)?{}:userInfo.data.userAccountInfoVO;
        pageData.accountInfo = {
            accountBalance:common.isEmpty(data) || common.isEmpty(data.accountBalance)?'0.00':common.nfmoney(data.accountBalance),
        };
        res.render('account/rechargesuccess',pageData);
    });

});

module.exports = router;

