'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var common = require('../../components/common/common');
var commonAPI = require('../../components/common/CommonAPI');
var APICom = require('../../components/APIClient/APICom');

/* GET users listing. */
router.get('/user/securitysetup.html', function(req, res) {
    var signToken = common.getRandomString(false, 32),
        signTicket = common.getRandomString(false, 32);
    req.session.signToken = signToken;
    req.session.signTicket = signTicket;
    var pageData = {
        seo : {
            title : '安全设置_金投手-国资控股互联网金融平台',
            keywords : '安全设置,金投手,国资控股互联网金融平台',
            discription : '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
        },
        curUrlTitle:'安全设置',
        result:{},
        signToken: signToken,
        signTicket: signTicket
    };
    var result={};
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        pageData.isheadshow=commonAPI.getaccountHeader(userInfo.data);
        var data = common.isEmpty(userInfo.data.userAccountInfoVO)?{}:userInfo.data.userAccountInfoVO;
        result.bindSerialNo=data.bindSerialNo;
        result.mixBankCard=data.mixBankCard;
        result.mixRealName=data.mixRealName;
        result.riskRating=userInfo.data.userInfoVO.riskRating;
        result.mixMobile=userInfo.data.userInfoVO.mixMobile;
        result.percent='33';
        result.level='低';
        console.log('44444',userInfo.data.userInfoVO.riskRating,data.bindSerialNo,result.riskRating);
        if(result.bindSerialNo&&result.riskRating){
            result.percent='100';
            result.level='高';
        }else if(result.bindSerialNo||result.riskRating){
            result.percent='66';
            result.level='中';
        }

        pageData.result=result;
        console.log('#############',pageData);
        res.render('account/securitysetup',pageData);
    });
    //res.render('account/securitysetup',pageData);
});

router.post('/getAssNum.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_ACCOUNT_RISKINFO,
        body:APIClient.getbody(req.body),
        token:req.session.token
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

module.exports = router;

