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
            title : '我的好友_金投手-国资控股互联网金融平台',
            keywords : '我的好友,金投手,国资控股互联网金融平台',
            discription : '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
        },
        curUrlTitle:'我的好友'
    };
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        pageData.isheadshow = commonAPI.getaccountHeader(userInfo.data);
        pageData.isEmployee ={
            isEmployer : userInfo.data.userInfoVO.isEmployee
        }

        console.log('---------------',pageData);
        res.render('account/myfriends',pageData);
    })
});

router.post('/get_myFriendsList.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_ACCOUNT_FRIENDLIST,
        body:APIClient.getbody(req.body),
        token:req.session.token
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});


module.exports = router;


