/**
 * Created by Administrator on 2017/5/10.
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
router.get('/user/dealhistory.html', function(req, res) {
    var pageData = {
        seo : {
            title : '我要提现',
            keywords : '金投手、投资、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'交易记录',
    };
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        pageData.isheadshow=commonAPI.getaccountHeader(userInfo.data);
        console.log(userInfo);
        var data = common.isEmpty(userInfo.data.userAccountInfoVO)?{}:userInfo.data.userAccountInfoVO;
        pageData.accountInfo = {
            accountBalance:common.isEmpty(data) || common.isEmpty(data.accountBalance)?0:data.accountBalance/100,
            bankcode:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.code)?103:data.bankVO.code,
            bankCard:common.isEmpty(data) || common.isEmpty(data.bankCard)?9999:data.bankVO.bankCard,
            quotaSingle:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaSingle)?1000:data.bankVO.quotaSingle,
            quotaDaily:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaDaily) === undefined?1000:data.bankVO.quotaDaily,
            mobile:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.mobile) === undefined?13500000000:data.mobile
        };
        res.render('account/dealhistory',pageData);
    });
});
router.post('/get_dealhistory.json', function (req, res) {
    //调用注册接口
    var token=req.session.token;
    var result = {success: false};
    var data = {};
    var body = {
        needCount :req.body.needCount ,
        pageSize:req.body.pageSize,
        pageno:req.body.pageNo,
        type:req.body.type,
        queryDateStart: req.body.queryDateStart,
        queryDateEnd: req.body.queryDateEnd
    };
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_DEALHISTORY, {}, {}, body,token);
            console.log('data', data);
        } catch (e) {
            data = {};
            console.log('验证手机号是否存在error', data, e.message);
        } finally {
            result.success=true;
            result.data=data;

            /*if (data && data.success) {
             result.success = (data.data === true ? false : true);
             }*/
        }
        res.json(result);
    });
});
module.exports = router;

