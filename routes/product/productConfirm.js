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
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '确认投资',
            keywords : '金投手、投资、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        }
        //accountBalance:(data.accountBalance/100).toFixed(2),
        //mobile:userInfo.data.userInfoVO.mobile
    };
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        var data = common.isEmpty(userInfo.data.userAccountInfoVO)?{}:userInfo.data.userAccountInfoVO;
        console.log('-------------',userInfo);
        pageData.accountBalance=(data.accountBalance/100).toFixed(2)
        pageData.mixMobile=userInfo.data.userInfoVO.mixMobile;
        console.log(33333,pageData);
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

//
router.post('/confirmInvest.json',function (req,res) {
    var body = {
        amount:req.body.amount,
        couponIds:req.body['couponIds[]']||[],
        giftType:req.body['giftType'],
        payType:req.body.payType,
        productId:req.body.productId,
        smsCode:req.body.smsCode
    };
    console.log('body11111',req.body);

    var result = { success : false };
    var data = {};
    co(function* () {
        try{
            data =  yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_TRADEPAY,{},{},body,req.session.token);
            //console.log('data',data);

        }catch(e){
            console.log('1111111',data,e.message);
            //data = {};
        }finally {
            console.log('********',data);
            if(data&&data.success){
                result.success=true;
            }
            //result.success = (data.success === true ? false : true);
        }
        res.json(data);
    });
});

//购买获取用户可用红包
router.post('/getUseRedPacketList.json',function (req,res) {
    var body = {
        amount:req.body.amount,
        needCount:req.body.needCount,
        pageNo:req.body.pageNo,
        pageSize:req.body.pageSize,
        productId:req.body.productId
    };
    //console.log('body',body);

    var result = { success : false };
    var data = {};
    co(function* () {
        try{
            data =  yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_REDPACKETLIST,{},{},body,req.session.token);
            //console.log('data',data);
        }catch(e){
            console.log('1111111',data,e.message);
            //data = {};
        }finally {
            console.log('********',data);
            if(data&&data.success){
                result.success=true;
            }
            //result.success = (data.success === true ? false : true);
        }
        res.json(data);
    });
});

//购买获取用户可用加息券
router.post('/getUseCouponList.json',function (req,res) {
    var body = {
        amount:req.body.amount,
        needCount:req.body.needCount,
        pageNo:req.body.pageNo,
        pageSize:req.body.pageSize,
        productId:req.body.productId
    };
    //console.log('body',body);

    var result = { success : false };
    var data = {};
    co(function* () {
        try{
            data =  yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_COUPONLIST,{},{},body,req.session.token);
            //console.log('data',data);
        }catch(e){
            console.log('222222',data,e.message);
            //data = {};
        }finally {
            console.log('********',data);
            if(data&&data.success){
                result.success=true;
            }
            //result.success = (data.success === true ? false : true);
        }
        res.json(data);
    });
});

//购买获取用户可用加息券
router.post('/getVcodeInvest.json',function (req,res) {
    var body = {
        type:req.body.type,
        mobile:''
    };
    //console.log('body',body);

    var result = { success : false };
    var data = {};
    co(function* () {
        try{
            data =  yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_SMSREQ,{},{},body,req.session.token);
            //console.log('data',data);
        }catch(e){
            console.log('222222',data,e.message);
            //data = {};
        }finally {
            console.log('********',data);
            if(data&&data.success){
                result.success=true;
            }
            //result.success = (data.success === true ? false : true);
        }
        res.json(data);
    });
});

module.exports = router;