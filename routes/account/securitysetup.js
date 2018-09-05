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
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '安全设置_金投手-国资控股互联网金融平台',
            keywords : '安全设置,金投手,国资控股互联网金融平台',
            discription : '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
        },
        curUrlTitle:'安全设置',
        result:{}
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
/*var commonPost=function(name,fn){
    router.post(name, function (req, res) {

        var result = {success: '进来了么'};
        console.log('11111111111',1111);
        var data = {};
        co(function* () {
            try {
                data = yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_RISKINFO, {}, {}, {},req.session.token);
                console.log('*************data', data);
            } catch (e) {
                data = {error,'ym'};
                console.log('是否存在error', e.message);
            } finally {
                result.data=data;
                console.log(33333);
                if(typeof fn === "function") {
                    fn(res);
                    console.log(4444);
                }
                /!*if (data && data.success) {
                 result.success = (data.data === true ? false : true);
                 }*!/
            }
            res.json(result);
        });
    });
};
commonPost('/getAssNum.json',function(res){
    console.log('222222222222');
});*/

var para={
    name:'/getAssNum.json',
    mdname:APIPath.ALICLOUD_ACCOUNT_RISKINFO
};
router.post(para.name, function (req, res) {
    co(function* () {
        res.json(yield APIClient.commonPost(para.mdname,{token: req.session.token}));
    });
});

router.post('/submitAssRes_se.json', function (req, res) {
    var body = {
        level: req.body.level,
        score: req.body.score
    };
    console.log('存在body', body);

    var result = {success: '进来了么'};
    var data = {};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_SUBMITRISK, {}, {}, body,req.session.token);
            console.log('data', data);
        } catch (e) {
            data = {};
            console.log('是否存在error', e.message);
        } finally {
            result.data=data;

            /*if (data && data.success) {
             result.success = (data.data === true ? false : true);
             }*/
        }
        res.json(result);
    });
});

module.exports = router;

