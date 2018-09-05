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
router.get('/user/ratecoupon.html', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手账户总览',
            keywords : '金投手、投资、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'加息券'
    };
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        pageData.isheadshow = commonAPI.getaccountHeader(userInfo.data);
        res.render('account/ratecoupon',pageData);
    })
});
//账户获取加息券总览
router.post('/get_couponamout.json', function (req, res) {
    var body = {
    };
    var token=req.session.token;
    //调用获取加息券总览接口
    var result = {success: false};
    var data = {};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_COUPONAMOUT, {}, {}, body,token);
        } catch (e) {
            data = {};
            console.log('获取加息券总览异常：',e);
        } finally {
            console.log('获取加息券总览结果数据：',data);
            if(data.success===true){
                result.success = true;
                result.data=data.data;
            }else{
                result.success = false;
                result.msg = errorCodes.errorCode()[errorCodes.apiErrorCode()[data.errorCode]];
            }
        }
        res.json(result);
    });
});
//账户获取加息券详情
router.post('/get_ratecoupon.json', function (req, res) {
    var body = {
        needCount:req.body.needCount,
        pageNo:req.body.pageNo,
        pageSize:req.body.pageSize,
        type:req.body.type
    };
    var token=req.session.token;
    //调用获取加息券接口
    var result = {success: false};
    var data = {};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_COUPON, {}, {}, body,token);
        } catch (e) {
            data = {};
            console.log('获取加息券异常：',e);
        } finally {
            console.log('获取加息券结果数据：',data);

            if(data.success===true){
                result.success = true;
                result.data=data.list;
                //result.totalCount=data.totalCount;
                result.totalCount=data.totalCount;
                var dataAA=data.list;
                for(var i=0,max=dataAA.length;i<max;i++){
                    dataAA[i].productType=req.session.comInit.ProductType[JSON.parse(dataAA[i].productType)];
                }

            }else{
                result.success = false;
                result.msg = errorCodes.errorCode()[errorCodes.apiErrorCode()[data.errorCode]];
            }
        }
        res.json(result);
    });
});
module.exports = router;
