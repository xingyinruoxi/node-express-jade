'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var commonAPI = require('../../components/common/CommonAPI');


/* GET users listing. */
router.get('/user/invitedfriends.html', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '邀请好友_金投手-国资控股互联网金融平台',
            keywords : '邀请好友金投手,国资控股互联网金融平台',
            discription : '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
        },
        curUrlTitle:'邀请好友',
    };
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        pageData.isheadshow = commonAPI.getaccountHeader(userInfo.data);
        res.render('account/invitedfriends',pageData);
    })
});


var para={
    name:'/getBarcode1.json',
    mdname:APIPath.ALICLOUD_ACCOUNT_QRCREATE
};
router.post(para.name, function (req, res) {
    var para1={
        body:{
            id:req.body.id,
            mobile:req.body.mobile,
        },
        token: req.session.token
    };
    co(function* () {

        var data= (yield APIClient.commonPost(para.mdname,para1));
        res.json(data);
    });
});

//获取短信验证码
router.post('/getBarcode.json',function (req,res) {
    var result = { success : false };
    var data = {};
    co(function* () {
        try{
            data =  yield APIClient.get(APIPath.ALICLOUD_ACCOUNT_QRCREATE,req.session.token);
        }catch(e){
            console.log('《《《《《-------调用报错 start-------》》》》》');
            data = {};
            console.log(e.message);
        }finally {
            console.log('《《《《《-------成功结果 start-------》》》》》');
            //if(data&&data.success){
            //    result.success=true;
            //}
            //result.success = (data.success === true ? false : true);
        }
        res.json(result);
    });
});


module.exports = router;

