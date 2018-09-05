/**
 * Created by a110 on 17/4/20.
 */
'use strict';
var express = require('express');
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var router = express.Router();
var common = require('../../components/common/common');
var commonAPI = require('../../components/common/CommonAPI');

/* GET users listing. */
router.get('/product/productconfirm.html', function(req, res) {
    var signToken = common.getRandomString(false, 32),
        signTicket = common.getRandomString(false, 32);
    req.session.signToken = signToken;
    req.session.signTicket = signTicket;
    var pageData = {
        seo : {
            title : '确认投资_金投手-国资控股互联网金融平台',
            keywords : '确认投资,金投手,国资控股互联网金融平台',
            discription : '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
        },
        ProductType:JSON.stringify(req.session.comInit.ProductType),
        curUrlTitle:'确认投资',
        signToken: signToken,
        signTicket: signTicket
    };
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        var data = common.isEmpty(userInfo.data.userAccountInfoVO)?{}:userInfo.data.userAccountInfoVO;
        console.log('-------------',userInfo);
        pageData.accountBalance=(data.accountBalance/100).toFixed(2)
        pageData.mixMobile=userInfo.data.userInfoVO.mixMobile;
        res.render('product/productconfirm',pageData);
    });
});

router.post('/productconfirm_getEarnings.json', function (req, res) {
    var para = {
        mdname: APIPath.ALICLOUD_ACCOUNT_CALCULATOR,
        body: APIClient.getbody(req.body)
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

//购买获取用户可用红包
router.post('/getUseRedPacketList.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_ACCOUNT_REDPACKETLIST,
        body:APIClient.getbody(req.body),
        token:req.session.token
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});


//购买获取用户可用加息券
router.post('/getUseCouponList.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_ACCOUNT_COUPONLIST,
        body:APIClient.getbody(req.body),
        token:req.session.token
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

//发送短信
router.post('/getVcodeInvest.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_ACCOUNT_SMSREQ,
        body:APIClient.getbody(req.body),
        token:req.session.token
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

router.post('/confirmInvest.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_ACCOUNT_TRADEPAY,
        body:{
            amount:req.body.amount,
            couponIds:req.body['couponIds[]']||[],
            giftType:req.body['giftType'],
            productId:req.body.productId,
            smsCode:req.body.smsCode
        },
        token:req.session.token
    };
    console.log('请求数据',para.body);
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