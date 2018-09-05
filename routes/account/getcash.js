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
router.get('/user/getcash.html', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '我要提现',
            keywords : '金投手、投资、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'我要提现',
        accountInfo:{}
    };
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        pageData.isheadshow=commonAPI.getaccountHeader(userInfo.data);
        console.log(userInfo);
        var data = common.isEmpty(userInfo.data.userAccountInfoVO)?{}:userInfo.data.userAccountInfoVO;
        pageData.accountInfo = {
            accountBalance:common.ishas(common.nfmoney(common.isEmpty(data) || common.isEmpty(data.accountBalance)?0:data.accountBalance)),
            bankCard:common.ishas(common.isEmpty(data) || common.isEmpty(data.lessBankCard)?9999:data.lessBankCard),
            bankcode:common.ishas(common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.code)?103:data.bankVO.code),
            quotaSingle:common.ishas(common.nfmoney(common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaSingle)?1000:data.bankVO.quotaSingle,-6)),
            quotaDaily:common.ishas(common.nfmoney(common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaDaily) === undefined?1000:data.bankVO.quotaDaily,-6)),
            mobile:common.ishas(userInfo.data.userInfoVO.mixMobile)
        };
        console.log('---------------',pageData);
        res.render('account/getcash',pageData);
    });
});
//充值手机验证码
router.post('/sendvcode_bankgetcash.json', function (req, res) {
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
//提现
router.post('/get_cash.json', function (req, res) {
    var body = {
        amount:req.body.amount,
        verificationCode:req.body.verificationCode
    };
    var token=req.session.token;
    var result = {success: false};
    var data = {};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_TAKE, {}, {}, body,token);
        } catch (e) {
            data = {};
            console.log('提现异常：',e);
        } finally {
            console.log('提现结果数据：',data);

            if(data.success===true){
                result.success = true;
                result.data=data;
            }else{
                result.success = false;
                result.msg = errorCodes.errorCode()[errorCodes.apiErrorCode()[data.errorCode]];
            }
        }
        res.json(result);
    });
});
module.exports = router;
