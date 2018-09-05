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
router.get('/user/recharge.html', function(req, res) {
    var signToken = common.getRandomString(false, 32),
        signTicket = common.getRandomString(false, 32);
    req.session.signToken = signToken;
    req.session.signTicket = signTicket;
    var pageData = {
        seo : {
            title : '我要充值_金投手-国资控股互联网金融平台',
            keywords : '我要充值,金投手,互联网金融,互联网金融平台',
            discription : '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
        },
        curUrlTitle:'我要充值',
        rechargeInfo:{},
        signToken: signToken,
        signTicket: signTicket,
        rechargeLimit:req.session.comInit.SystemConfigVO.rechargeLimit
    };
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        pageData.isheadshow=commonAPI.getaccountHeader(userInfo.data);
        var data = common.isEmpty(userInfo.data.userAccountInfoVO)?{}:userInfo.data.userAccountInfoVO;
        console.log(data);
        pageData.rechargeInfo = {
            bindSerialNo:common.isEmpty(data) || common.isEmpty(data.bindSerialNo)?'':data.bindSerialNo,
            accountBalance:common.isEmpty(data) || common.isEmpty(data.accountBalance)?'暂无数据':common.nfmoney(data.accountBalance),
            bankcode:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.code)?103:data.bankVO.code,
            bankCard:common.isEmpty(data) || common.isEmpty(data.lessBankCard)?9999:data.lessBankCard,
            quotaSingle:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaSingle)?'1,000':common.nfmoney(data.bankVO.quotaSingle,-6),
            quotaDaily:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaDaily)?'1,000':common.nfmoney(data.bankVO.quotaDaily,-6),
            mobile:common.isEmpty(data) || common.isEmpty(data.mixMobile)?'暂无数据':data.mixMobile
        };

        res.render('account/recharge',pageData);
    });
});

//充值
router.post('/get_recharge.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_ACCOUNT_RECHARGE,
        body:APIClient.getbody(req.body),
        token:req.session.token
    };
    var result = { success : false };
    co(function* () {
        if(!common.checkCSRF(req)){
            result.data.errorCode = 'default';
        }else{
            result=yield APIClient.newpost(para.mdname, para);
        }
        res.json(result);
    });
});
module.exports = router;

