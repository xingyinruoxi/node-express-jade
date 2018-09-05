'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var commonAPI = require('../../components/common/CommonAPI');


var invitedfriendsMobile='';

/* GET users listing. */
router.get('/user/invitedfriends.html', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : ' 邀请好友_金投手-国资控股互联网金融平台',
            keywords : '邀请好友金投手,国资控股互联网金融平台',
            discription : '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
        },
        curUrlTitle:'邀请好友',
    };
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        invitedfriendsMobile=userInfo.data.userInfoVO.mobile;
        pageData.mobile=invitedfriendsMobile;
        pageData.isheadshow = commonAPI.getaccountHeader(userInfo.data);
        console.log('----pageData---',pageData);
        res.render('account/invitedfriends',pageData);
    })
});



//生成二難碼
router.get('/getBarcode.json',function (req,res) {
    co(function* () {
        var vcode = yield APIClient.getInvitefriend(APIPath.ALICLOUD_ACCOUNT_QRCREATE,'https://www.jintoushou.com/user/toRegisterPage?invitePhoneNo='+invitedfriendsMobile, req.session.token);
        res.json(vcode);
    });

    //var para={
    //    mdname:APIPath.ALICLOUD_ACCOUNT_QRCREATE,
    //    body:APIClient.getbody(req.body),
    //    token:req.session.token
    //};
    //co(function* () { res.json(yield APIClient.newget(para.mdname, para)); });
});



module.exports = router;

