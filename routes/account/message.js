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
router.get('/user/message.html', function(req, res) {
    var pageData = {
        seo : {
            title : '我要提现',
            keywords : '金投手、投资、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'消息公告'
    };
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        pageData.isheadshow = commonAPI.getaccountHeader(userInfo.data);
        // console.log(userInfo);
        var data = common.isEmpty(userInfo.data.userAccountInfoVO)?{}:userInfo.data.userAccountInfoVO;
        pageData.accountInfo = {
            accountBalance:common.isEmpty(data) || common.isEmpty(data.accountBalance)?0:data.accountBalance/100,
            bankcode:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.code)?103:data.bankVO.code,
            bankCard:common.isEmpty(data) || common.isEmpty(data.bankCard)?9999:data.bankVO.bankCard,
            quotaSingle:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaSingle)?1000:data.bankVO.quotaSingle,
            quotaDaily:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.quotaDaily) === undefined?1000:data.bankVO.quotaDaily,
            mobile:common.isEmpty(data.bankVO) || common.isEmpty(data.bankVO.mobile) === undefined?13500000000:data.mobile
        };
        res.render('account/message',pageData);
    });
});
//

router.post('/get_message.json', function (req, res) {
    console.log(1111111111111);
    //调用注册接口
    var token=req.session.token;
    var result = {success: false};
    var data = {};
    var body={
        isRead:req.body.isRead,
        pageSize:req.body.pageSize,
        pageNo:req.body.pageNo
    };
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_MESSAGE, {}, {}, body,token);
            // console.log('data', data);
        } catch (e) {
            data = {};
            console.log('验证手机号是否存在error', e.message);
        } finally {
             console.log(11111111111111111,data);
            result.success=true;
            result.data=data;

        }
        res.json(result);
    });
});
router.post('/change_state.json', function (req, res) {
    console.log(1111111111111);
    //调用注册接口
    var token=req.session.token;
    var result = {success: false};
    var data = {};
    var body={
        id:req.body.id
    };
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_READESTATE, {}, {}, body,token);
            // console.log('data', data);
        } catch (e) {
            data = {};
            console.log('验证手机号是否存在error', e.message);
        } finally {
            console.log(11111111111111111,data);
            result.success=true;
            result.data=data;
            req.session.message =data.data.totalCountUnRead;
            /*if (data && data.success) {
             result.success = (data.data === true ? false : true);
             }*/
        }
        res.json(result);
    });
});

module.exports = router;

/**
 * Created by Administrator on 2017/5/20.
 */
