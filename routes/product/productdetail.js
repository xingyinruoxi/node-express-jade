/**
 * Created by a110 on 17/4/19.
 */
'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var common = require('../../components/common/common');
var commonAPI = require('../../components/common/CommonAPI');

/* GET users listing. */
router.get('/baoli/*', function(req, res) {

    //set signin count
    if(!req.session.signinCount){
        req.session.signinCount = 0;
    }
    var signToken = common.getRandomString(false,32);
    var signTicket = common.getRandomString(false,32);

    req.session.signToken = signToken;
    req.session.signTicket = signTicket;

    console.log('signToken_productdetail',signToken,signTicket);
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);

    var pageData = {
        seo : {
            title : '投资详情',
            keywords : '金投手、投资、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        signToken : signToken,
        signTicket : signTicket,
        signinCount : req.session.signinCount
    };
    res.render('product/productdetail',pageData);
});

router.get('/chukoutuishui/*', function(req, res) {

    //set signin count
    if(!req.session.signinCount){
        req.session.signinCount = 0;
    }
    var signToken = common.getRandomString(false,32);
    var signTicket = common.getRandomString(false,32);

    req.session.signToken = signToken;
    req.session.signTicket = signTicket;

    console.log('signToken_productdetail',signToken,signTicket);
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '投资详情',
            keywords : '金投手、投资、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        signToken : signToken,
        signTicket : signTicket,
        signinCount : req.session.signinCount
    };
    res.render('product/productdetail',pageData);
});

router.post('/productdetail_isProLogin.json', function (req, res) {
    var result = {
        islogin:false,
        bindSerialNo:'',
        eCardType:''
    };
    console.log('是否登陆了',req.session.tokenExpTime);
    if(req.session.tokenExpTime){
        result.islogin=true;
        co(function* () {
            var userInfo = yield commonAPI.getUserInfo(req.session.token);
            var data = common.isEmpty(userInfo.data.userAccountInfoVO)?{}:userInfo.data.userAccountInfoVO;
            result.bindSerialNo=data.bindSerialNo;
            result.eCardType=data.eCardType;
            result.riskRating=userInfo.data.userInfoVO.riskRating;
            result.accountBalance=data.accountBalance;
            result.mobile=userInfo.data.userInfoVO.mobile;
            console.log('#############',userInfo);

            res.json(result);
        });
    }else{
        res.json(result);
    }
});

//获取产品信息
router.post('/productdetail_getinfo.json', function (req, res) {
    var para = {
        mdname: APIPath.ALICLOUD_PRODUCT,
        body: APIClient.getbody(req.body)
    };
    co(function* () {
        var data=yield APIClient.newpost(para.mdname, para);
        var productVO=data.data.productVO,
            comInit=req.session.comInit;
        productVO.repayType=comInit.RepayType[productVO.repayType];
        res.json(data);
    });
});

router.post('/productdetail_getEarnings.json', function (req, res) {
    var para = {
        mdname: APIPath.ALICLOUD_ACCOUNT_CALCULATOR,
        body: APIClient.getbody(req.body)
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

router.post('/productdetail_submitAssRes.json', function (req, res) {
    var para = {
        mdname: APIPath.ALICLOUD_ACCOUNT_SUBMITRISK,
        body: APIClient.getbody(req.body),
        token:req.session.token
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

module.exports = router;