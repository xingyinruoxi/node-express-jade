/**
 * Created by a110 on 17/4/21.
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
router.get('/user/bankaccountinfo.html', function (req, res) {
    var signToken = common.getRandomString(false, 32),
        signTicket = common.getRandomString(false, 32);
    req.session.signToken = signToken;
    req.session.signTicket = signTicket;
    var pageData = {
        seo: {
            title: '银行存管账户信息-未开通_金投手-国资控股互联网金融平台',
            keywords: '银行存管账户信息,金投手,国资控股互联网金融平台',
            discription: '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
        },
        curUrlTitle:'银行存管账户信息',
        userInfo:{},
        signToken: signToken,
        signTicket: signTicket
    };
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        pageData.isheadshow=commonAPI.getaccountHeader(userInfo.data);
        var data = common.isEmpty(userInfo.data.userAccountInfoVO)?{}:userInfo.data.userAccountInfoVO;
        pageData.userInfo= {

            username:common.isEmpty(data) || common.isEmpty(data.realName)?'':data.mixRealName,
            certNo:common.isEmpty(data) || common.isEmpty(data.idNo)?'':data.mixIdNo,
            mobile:common.isEmpty(data) || common.isEmpty(data.mobile)?'':data.mixMobile,
            bankCode:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.code)?103:data.bankVO.code,
            bankCard:common.isEmpty(data) || common.isEmpty(data.lessBankCard)?8888:data.lessBankCard,
            bindSerialNo:common.isEmpty(data) || common.isEmpty(data.bindSerialNo)?'':data.bindSerialNo,
            ecardNo:common.isEmpty(data) || common.isEmpty(data.eCardNo)?'0000000':data.eCardNo,
            quotaSingle:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaSingle)?'1,000':common.nfmoney(data.bankVO.quotaSingle),
            quotaMonthly:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaMonthly)?'1,000':common.nfmoney(data.bankVO.quotaMonthly),
            quotaDaily:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaDaily)?'1,000':common.nfmoney(data.bankVO.quotaDaily)

        };
        if(pageData.userInfo.bindSerialNo){
            pageData.seo={
                title: '银行存管账户信息-已开通_金投手-国资控股互联网金融平台',
                keywords: '银行存管账户信息,金投手,国资控股互联网金融平台',
                discription: '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
            };
        }
        res.render('account/bankaccountinfo', pageData);
    });
});

//银行列表
router.post('/get_banklist.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_BANK_LIST,
        body:APIClient.getbody(req.body),
        token:req.session.token
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

//银行支行
router.post('/get_branchno.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_BANK_BRANCH_LIST,
        body:APIClient.getbody(req.body),
        token:req.session.token
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

//银行短信
router.post('/sendmsg_bank.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_BANK_SMS,
        body:APIClient.getbody(req.body),
        token:req.session.token
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

//银行开户
router.post('/bankOpen.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_BANK_ACCOUNT_OPEN,
        body:{
            accountName:req.body.accountName,
            address: req.body.address,
            branchNo: req.body.branchNo,
            certNo: req.body.certNo,
            certType:req.body.certType,

            cstNo: req.body.cstNo,
            endDate: req.body.endDate,
            extension: req.body.extension,
            id: req.body.id,
            bankCode:req.body.bankCode,

            mobile: req.body.mobile,
            mobileCode: req.body.mobileCode,
            occupation:req.body.occupation,
            openZjbFlag:req.body.openZjbFlag,
            otherAccno: req.body.otherAccno,

            otherMobile: req.body.otherMobile,
            startDate: req.body.startDate,
            status: req.body.status
        },
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