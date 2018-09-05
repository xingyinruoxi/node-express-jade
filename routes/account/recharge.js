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
router.get('/user/recharge.html', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '我要充值',
            keywords : '金投手、投资、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'我要充值',
        rechargeInfo:{}
    };
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        pageData.isheadshow=commonAPI.getaccountHeader(userInfo.data);
        var data = common.isEmpty(userInfo.data.userAccountInfoVO)?{}:userInfo.data.userAccountInfoVO;
        console.log(data);
        pageData.rechargeInfo = {
            accountBalance:common.isEmpty(data) || common.isEmpty(data.accountBalance)?'0.00':common.nfmoney(data.accountBalance),
            bankcode:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.code)?103:data.bankVO.code,
            bankCard:common.isEmpty(data) || common.isEmpty(data.lessBankCard)?9999:data.lessBankCard,
            quotaSingle:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaSingle)?'1,000':common.nfmoney(data.bankVO.quotaSingle),
            quotaDaily:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaDaily) === undefined?'1,000':common.nfmoney(data.bankVO.quotaDaily),
            mobile:common.isEmpty(data.bankVO) || common.isEmpty(userInfo.data.userInfoVO.mixMobile) === undefined?13500000000:userInfo.data.userInfoVO.mixMobile,

        };

        res.render('account/recharge',pageData);
    });
});
//充值手机验证码
router.post('/sendvcode_bankrechange.json', function (req, res) {
    var body = {
        mobile:req.body.mobile,
        type:req.body.type
    };
    var token=req.session.token;
    //调用银行短信接口
    var result = {success: false};
    var data = {};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_BANK_SMS, {}, {}, body,token);
        } catch (e) {
            data = {};
        } finally {
            result.success=true;
            result.data=data;
        }
        res.json(result);
    });
});
//充值
router.post('/get_recharge.json', function (req, res) {
    var body = {
        amount:req.body.rechargeAmount,
        verificationCode:req.body.verificationCode
    };
    var token=req.session.token;
    //调用充值接口
    var result = {success: false};
    var data = {};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_RECHARGE, {}, {}, body,token);
        } catch (e) {
            data = {};
            console.log('充值异常：',e);
        } finally {
            console.log('充值结果数据：',data);
            result.data=data;
            if(data.success===true){
                result.success = true;
            }else{
                result.success = false;
                result.msg = errorCodes.errorCode()[errorCodes.apiErrorCode()[data.errorCode]];
            }
        }
        res.json(result);
    });
});
module.exports = router;

