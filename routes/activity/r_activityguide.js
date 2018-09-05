/**
 * Created by a110 on 17/4/17.
 */
'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var errorCodes = require('../../components/common/errorCode');
/* GET users listing. */
router.get('/activity/activityguide.html', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '北京贷款公司_小额出借产品_个人出借产品-金投手官网',
            keywords : '小额出借产品,个人出借产品,北京贷款公司',
            discription : '金投手主要为用户提供小额出借、个人出借、活期、定期出借产品，网上出借产品的优惠活动展示。参与出借活动，增加出借收益。'
        }
    };
    res.render('activity/activityguide',pageData);
});

module.exports = router;
