/**
 * Created by a110 on 17/4/17.
 */
'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');

var commonAPI = require('../../components/common/CommonAPI');
var common = require('../../components/common/common');
/* GET users listing. */
router.get('/sitemap/', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手网站地图-金投手官网',
            keywords : '金投手网站地图,金投手',
            discription : '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
        },
        curUrlTitle:'网站地图'
    };
    //res.render('help/wzdt',pageData);
    co(function*() {
        var helpType = yield commonAPI.getHelpType();
        //console.log('*********', helpType.data);
        pageData.helpType =common.ishas( helpType.data);
        console.log('---------------', pageData);
        res.render('help/wzdt',pageData);
    });
});

module.exports = router;
