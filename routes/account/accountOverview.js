/**
 * Created by a110 on 17/4/17.
 */
'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var commonAPI = require('../../components/common/CommonAPI');
var common = require('../../components/common/common');
// var webcom = require('../../public/javascripts/webcom.js');
/* GET users listing. */

router.get('/user/accountoverview.html', function(req, res) {
    var pageData = {
        seo : {
            title : '金投手账户总览',
            keywords : '金投手、投资、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'账户总览',
        accountInfo:{},
        result:{}
    };
    var result={};
    co(function* () {
        var para={
            mdname:APIPath.ALICLOUD_ACCOUNT_ASSETDETAIL,
            body:APIClient.getbody(req.body),
            token:req.session.token
        };
        var userFundDetail=yield APIClient.newpost(para.mdname, para);
        console.log('+++++++++++++++++++++++',userFundDetail);
        var FundDetail={
            accountBalance:userFundDetail.accountBalance,
            totalLend:'',
            redcount:'',
            totalIncome:''
        };

        result.val1=common.ishas('');
        result.val2=common.ishas(undefined);
        result.val3=common.ishas(null);
        result.val4=common.ishas('1');
        result.val5='5';






        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        pageData.isheadshow=commonAPI.getaccountHeader(userInfo.data);
        var data = common.isEmpty(userInfo.data.userAccountInfoVO)?{}:userInfo.data.userAccountInfoVO;
        result.bindSerialNo=data.bindSerialNo;

        //result.totalBalance=data.totalBalance.toFixed(2);
        //result.accumulativeInvestment=data.accumulativeInvestment.toFixed(2);
        //result.redPacketCount =data.redPacketCount;
        //result.totalIncome  =data.totalIncome.toFixed(2);

        result.mixBankCard=data.mixBankCard;
        result.mixRealName=data.mixRealName;
        result.riskRating=userInfo.data.userInfoVO.riskRating;
        result.percent='33';
        result.level='低';
        //console.log('44444',userInfo.data.userInfoVO.riskRating,data.bindSerialNo,result.riskRating);
        if(result.bindSerialNo&&result.riskRating){
            result.percent='100';
            result.level='高';
        }else if(result.bindSerialNo||result.riskRating){
            result.percent='66';
            result.level='中';
        }
        pageData.result=result;
        pageData.accountInfo = {
            accountBalance:common.isEmpty(data) || (common.isEmpty(data.accountBalance)?'0.00':common.nfmoney(data.accountBalance)),
            eCardType:common.isEmpty(data) || common.isEmpty(data.eCardType)?0:data.eCardType,
            mobile:data.mixRealName||userInfo.data.userInfoVO.mixMobile,
            bindSerialNo:common.isEmpty(data) || common.isEmpty(data.bindSerialNo)?'':data.bindSerialNo,
            //riskRating:common.isEmpty(data) || common.isEmpty(userInfo.data.userInfoVO.riskRating)?0:userInfo.data.userInfoVO.riskRating,
            //redPacketCount:common.isEmpty(data) || common.isEmpty(data.redPacketCount)?0:data.redPacketCount,
            //couponCount:common.isEmpty(data) || common.isEmpty(data.couponCount)?0:data.couponCount
        };
        console.log('#####',pageData);
        res.render('account/accountoverview',pageData);
    });

});

// 还款计划
router.post('/get_repaymonth.json', function (req, res) {
    //调用注册接口
    var token=req.session.token;
    var result = {success: false};
    var data = {};
    var body = {
        needCount: req.body.needCount,
        pageSize: req.body.pageSize,
        pageNo: req.body.pageNo
    };
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_REPAYMONTH, {}, {},body,token);
            console.log('data', data);
        } catch (e) {
            data = {};
            console.log('验证手机号是否存在error', data, e.message);
        } finally {
            result.success=true;
            result.data=data;
        }
        res.json(result);

    });
});
// 交易记录
router.post('/get_total.json', function (req, res) {
    //调用注册接口
    var token=req.session.token;
    var result = {success: false};
    var data = {};
    var body = {};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_TRADERTOTAL, {}, {},{},token);
            console.log('data', data);
        } catch (e) {
            data = {};
            console.log('验证手机号是否存在error', data, e.message);
        } finally {
            result.success=true;
            result.data=data;

        }
        res.json(result);

    });
});



//获取用户资金明细
router.post('/accountoverview_funddetail.json',function (req,res) {

});

module.exports = router;