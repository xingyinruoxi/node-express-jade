/**
 * Created by Administrator on 2017/5/10.
 */
'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var errorCodes = require('../../components/common/errorCode');
var commonAPI = require('../../components/common/CommonAPI');
var common = require('../../components/common/common');
/* GET users listing. */
router.get('/user/myrepayment.html', function(req, res) {
    var pageData = {
        seo : {
            title : ' 我的项目_金投手-国资控股互联网金融平台',
            keywords : ' 我的项目,金投手,互联网金融,互联网金融平台',
            discription : '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
        },
        curUrlTitle:'我的项目',
    };
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        pageData.isheadshow=commonAPI.getaccountHeader(userInfo.data);
        console.log(userInfo);
        var data = common.isEmpty(userInfo.data.userAccountInfoVO)?{}:userInfo.data.userAccountInfoVO;
        pageData.accountInfo = {
            accountBalance:common.isEmpty(data) || common.isEmpty(data.accountBalance)?0:data.accountBalance/100,
            bankcode:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.code)?103:data.bankVO.code,
            bankCard:common.isEmpty(data) || common.isEmpty(data.bankCard)?9999:data.bankVO.bankCard,
            quotaSingle:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaSingle)?1000:data.bankVO.quotaSingle,
            quotaDaily:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaDaily) === undefined?1000:data.bankVO.quotaDaily,
            mobile:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.mobile) === undefined?13500000000:data.mobile
        };
        res.render('account/myrepayment',pageData);
    });
});

router.post('/get_tradelist.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_ACCOUNT_MYTRADETENDER,
        body:APIClient.getbody(req.body),
        token:req.session.token
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

// 我的定期-还款计划
router.post('/get_repaylist.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_ACCOUNT_MYTRADERREPAYMENT,
        body:APIClient.getbody(req.body),
        token:req.session.token
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

// 余额查询或交易记录
router.post('/get_total.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_ACCOUNT_TRADERTOTAL,
        body:APIClient.getbody(req.body),
        token:req.session.token
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

module.exports = router;


