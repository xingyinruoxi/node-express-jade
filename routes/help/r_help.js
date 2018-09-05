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
router.get('/help/', function (req, res) {
    var pageData = {
        seo: {
            title: '出借产品帮助中心，实现小额出借产品简单化- 金投手官网',
            keywords: '出借产品,小额出借产品',
            discription: '金投手主要为广大用户提供在出借过程中遇到的出借问题，可以通过此栏目更好了解到新的购买出借产品的技巧，实现小额出借产品简单化。'
        }
    };
    var result = {};
    co(function*() {
        var imageHost=req.session.comInit.SystemConfigVO.imageHost;
        var helpType = yield commonAPI.getHelpType();

        for(var i=0;i<helpType.data.length;i++){
            helpType.data[i].picUrl=imageHost+helpType.data[i].picUrl;
            console.log('_____________我是问题分类的每一项',helpType.data[i]);
        }
        pageData.helpType =common.ishas( helpType.data);
        if (req.session.token) {
            var userInfo = yield commonAPI.getUserInfo(req.session.token);
            var data = common.isEmpty(userInfo.data.userAccountInfoVO) ? {} : userInfo.data.userAccountInfoVO;
            result.ecardType = data.eCardType=='0'?0:1; //是否为浙商卡
            result.bindSerialNo = common.isEmpty(data) || common.isEmpty(data.bindSerialNo) ? '' : data.bindSerialNo;//是否开户
            result.mixMobile=userInfo.data.userInfoVO.mixMobile;
            pageData.result = result;
            console.log('-------', pageData.result);
        }
        res.render('help/help', pageData);
    })
});

//问题种类
router.post('/problem_type.json',function (req,res) {
    co(function*() {
        var imageHost=req.session.comInit.SystemConfigVO.imageHost,
            helpType = yield commonAPI.getHelpType();
        for(var i=0;i<helpType.data.length;i++){
            helpType.data[i].picUrl=imageHost+helpType.data[i].picUrl;
            helpType.data[i].picMouseUrl =imageHost+helpType.data[i].picMouseUrl ;
        }
        res.json(helpType);
    })
});
// 热门问题
router.post('/problem_hot.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_HELP_PROBLEM_HOTCATEGORIES,
        body:APIClient.getbody(req.body)
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

module.exports = router;