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
router.get('/user/getcash.html', function(req, res) {
    var signToken = common.getRandomString(false, 32),
        signTicket = common.getRandomString(false, 32);
    req.session.signToken = signToken;
    req.session.signTicket = signTicket;
    var pageData = {
        seo : {
            title : '我要提现_金投手-国资控股互联网金融平台',
            keywords : '我要提现,金投手,国资控股互联网金融平台',
            discription : '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
        },
        curUrlTitle:'我要提现',
        accountInfo:{},
        signToken: signToken,
        signTicket: signTicket,
        withdrawLimit:req.session.comInit.SystemConfigVO.withdrawLimit
    };
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        pageData.isheadshow=commonAPI.getaccountHeader(userInfo.data);
        console.log(234567890987654,userInfo);
        console.log(66666,userInfo);
        var data = common.isEmpty(userInfo.data.userAccountInfoVO)?{}:userInfo.data.userAccountInfoVO;
        pageData.accountInfo = {
            bindSerialNo:common.isEmpty(data) || common.isEmpty(data.bindSerialNo)?'':data.bindSerialNo,
            accountBalance:common.ishas(common.nfmoney(common.isEmpty(data) || common.isEmpty(data.accountBalance)?0:data.accountBalance)),
            bankCard:common.ishas(common.isEmpty(data) || common.isEmpty(data.lessBankCard)?9999:data.lessBankCard),
            bankcode:common.ishas(common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.code)?103:data.bankVO.code),
            quotaSingle:common.ishas(common.nfmoney(common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaSingle)?1000:data.bankVO.quotaSingle,-6)),
            quotaDaily:common.ishas(common.nfmoney(common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaDaily) === undefined?1000:data.bankVO.quotaDaily,-6)),
            mobile:common.isEmpty(data) || common.isEmpty(data.mixMobile)?'暂无数据':data.mixMobile
        };

        res.render('account/getcash',pageData);
    });
});

router.post('/get_cash.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_ACCOUNT_TAKE,
        body:APIClient.getbody(req.body),
        token:req.session.token
    };
    var result = { success : false };
    //co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
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
