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
var common = require('../../components/common/common');
var commonAPI = require('../../components/common/CommonAPI');

/* GET users listing. */
router.get('/user/myfriends.html', function(req, res) {
    var pageData = {
        seo : {
            title : '我要提现',
            keywords : '金投手、投资、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'我的好友'
    };
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        pageData.isheadshow = commonAPI.getaccountHeader(userInfo.data);
        res.render('account/myfriends',pageData);
    })
});
router.post('/get_myFriendsList.json', function (req, res) {

    //调用我的好友接口
    var token=req.session.token;
    var result = {success: false};
    var data = {};
    var body={
        needCount: req.body.needCount,
        pageNo: req.body.pageNo,
        pageSize:req.body.pageSize
    };
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_FRIENDLIST, {}, {}, body,token);
        } catch (e) {
            data = {};
            console.log('我的好友异常：', e.message);
        } finally {
            if(data.success===true){
                result.success=true;
                result.list=data.list;
                result.totalCount=data.totalCount;
            }
        }
        res.json(result);
    });
});
router.post('/get_FriendState.json', function (req, res) {

    //调用我的好友接口
    var token=req.session.token;
    var result = {success: false};
    var data = {};
    var body={};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_FRIENDSTATE, {}, {}, {},token);
        } catch (e) {
            data = {};
            console.log('我的好友异常：', e.message);
        } finally {
            if(data.success===true){
                result.success=true;
                result.list=data.list;
                result.totalCount=data.totalCount;
            }
        }
        res.json(result);
    });
});
module.exports = router;


