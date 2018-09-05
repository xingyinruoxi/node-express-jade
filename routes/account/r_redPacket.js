/**
 * Created by a110 on 17/4/17.
 */
'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var errorCodes = require('../../components/common/errorCode');
var commonAPI = require('../../components/common/CommonAPI');
/* GET users listing. */
router.get('/user/redpacket.html', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手抵现红包_金投手-国资控股互联网金融平台',
            keywords : '抵现红包,金投手,国资控股互联网金融平台',
            discription : '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
        },
        activityRules:JSON.stringify(req.session.comInit.ActivityRules),
        curUrlTitle:'抵现红包'
    };

    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        pageData.isheadshow = commonAPI.getaccountHeader(userInfo.data);
        res.render('account/redpacket', pageData);
    })
});
//账户获取红包总览
router.post('/get_redpacketamout.json', function (req, res) {
    var para = {
        mdname: APIPath.ALICLOUD_ACCOUNT_REDPACKETAMOUT,
        body: APIClient.getbody(req.body),
        token:req.session.token
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

//获取红包详情
router.post('/get_redpacket.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_ACCOUNT_REDPACKET,
        body:APIClient.getbody(req.body),
        token:req.session.token
    };
    var result = {success: false};
    co(function* () {
        var data=yield APIClient.newpost(para.mdname, para),
            ProductType=req.session.comInit.ProductType;
        if(data.success===true){
            result.success = true;
            result.data=data.list;
            result.totalCount=data.totalCount;

            var dataAA=data.list;
            for(var i=0,max=dataAA.length;i<max;i++){
                var productType=JSON.parse(dataAA[i].productType),
                    productName='';
                for(var j in productType){
                    productName+=ProductType[productType[j]]+'、';
                }
                dataAA[i].productType=productName.substring(0,productName.length-1);
                //dataAA[i].productType=req.session.comInit.ProductType[JSON.parse(dataAA[i].productType)];
            }

        }else{
            result.success = false;
            result.msg = errorCodes.errorCode()[errorCodes.apiErrorCode()[data.errorCode]];
        }
        res.json(result);
    });
});

module.exports = router;
