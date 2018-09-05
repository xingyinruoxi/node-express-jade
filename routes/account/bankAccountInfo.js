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
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo: {
            title: '银行存管账户信息',
            keywords: '金投手、投资、理财',
            discription: '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'银行存管账户信息',
        userInfo:{}
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
            ecardNo:common.isEmpty(data) || common.isEmpty(data.ecardNo)?'0000000':data.ecardNo,
            quotaSingle:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaSingle)?'1,000':common.nfmoney(data.bankVO.quotaSingle),
            quotaMonthly:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaMonthly)?'1,000':common.nfmoney(data.bankVO.quotaMonthly),
            quotaDaily:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaDaily)?'1,000':common.nfmoney(data.bankVO.quotaDaily)

        };
        res.render('account/bankaccountinfo', pageData);
    });
});
//银行列表
router.post('/get_banklist.json', function (req, res) {
   var body = {
    };
   var token=req.session.token;
    //调用银行列表接口
    var result = {success: '进来了'};
    var data = {};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_BANK_LIST, {}, {}, body,token);
        } catch (e) {
            //data = {};
            console.log('数据异常：',e);
        } finally {
            result.data=data;
            console.log(result.data);
        }
        res.json(result);
    });
});
//银行支行
router.post('/get_branchno.json', function (req, res) {
    var body = {
        bankCode:req.body.bankCode,
        branchBankName:req.body.branchBankName
    };
    var token=req.session.token;
    //调用银行支行接口
    var result = {success:false};
    var data = {};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_BANK_BRANCH_LIST, {}, {}, body,token);
        } catch (e) {
            data = {};
            console.log('银行支行异常：',e);
        } finally {

            if(data&&data.success&&data.data){
                result.success = true;
                result.data=data.data;

            }else{

            }
        }
        res.json(result);
    });
});
//银行短信
router.post('/sendmsg_bank.json', function (req, res) {
    var body = {
        mobile:req.body.mobile,
        type:req.body.type
    };
    var token=req.session.token;
    //调用银行短信接口
    var result = {success:false};
    var data = {};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_BANK_SMS, {}, {}, body,token);
        } catch (e) {
            data = {};
        } finally {

            result.success=true;
           /* if(data&&data.success&&data.data){
                result.success = true;
                console.log('银行验证码数据：',data);

            }*/
            result.data=data;
        }
        res.json(result);
    });
});
//银行开户
router.post('/bankOpen.json', function (req, res) {
    var body = {
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
    };
    var token=req.session.token;
    //调用银行开户接口
    var result = {success: false};
    var data = {};
    co(function* () {
        try {
            console.log('data',data);
            data = yield APIClient.post(APIPath.ALICLOUD_BANK_ACCOUNT_OPEN, {}, {}, body,token);
        } catch (e) {
            data={};
           console.log('开户异常:',e);
        } finally {
            if(data&&data.success&&data.data){
                result.success = true;
            }else{
                result.success = false;

            }
            result.data=data;
        }
        res.json(result);
    });
});
module.exports = router;

