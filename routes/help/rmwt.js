'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var errorCodes = require('../../components/common/errorCode');
/* GET users listing. */
router.get('/help/rmwt', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '注册登录-金投手官网',
            keywords : '金投手,问题分类',
            discription : '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
        },
        curTitle:'热门问题'
    };
    res.render('help/rmwt',pageData);
});
//问题种类
router.post('/problem_type.json', function (req, res) {
    var result = {success: false};
    var data ={};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_HELP_PROBLEM_CATEGORIES, {}, {}, {});
        } catch (e) {
            data = {};
            console.log('常见问题类型异常：', e);
        } finally {
            console.log('11111：', data);
            if (data.success === true) {
                result.success = true;
                result.data = data;
            } else {
                result.success = false;
                result.msg = errorCodes.errorCode()[errorCodes.apiErrorCode()[data.errorCode]];
            }
        }
        res.json(result);
    });
});
router.post('/problem_detial.json', function (req, res) {
    var result = {success: false};
    var body={
        categoryId:req.body.id
    };
    var data ={};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_HELP_PROBLEM_QUERY, {}, {}, body);
        } catch (e) {
            data = {};
            console.log('问题注册登录异常：', e);
        } finally {
            console.log('11111：', data);
            if (data.success === true) {
                result.success = true;
                result.data = data;
            } else {
                result.success = false;
                result.msg = errorCodes.errorCode()[errorCodes.apiErrorCode()[data.errorCode]];
            }
        }
        res.json(result);
    });
});
module.exports = router;
