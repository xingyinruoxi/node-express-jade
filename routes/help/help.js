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
router.get('/help/help.html', function (req, res) {
    var pageData = {
        seo: {
            title: '帮助中心_P2P网贷知识_互联网金融知识-金投手官网',
            keywords: '投资者教育,P2P网贷知识,互联网金融知识',
            discription: '投资者教育栏目为出借、贷款用户提供P2P网贷知识、互联网金融知识等信息。'
        }
    };
    var result = {};
    co(function*() {
        if (req.session.token) {
            var userInfo = yield commonAPI.getUserInfo(req.session.token);
            var data = common.isEmpty(userInfo.data.userAccountInfoVO) ? {} : userInfo.data.userAccountInfoVO;
            result.ecardType = common.isEmpty(data) || common.isEmpty(data.eCardType) ? 0 : data.eCardType;
            result.bindSerialNo = common.isEmpty(data) || common.isEmpty(data.bindSerialNo) ? '' : data.bindSerialNo;
            result.mixMobile=userInfo.data.userInfoVO.mixMobile;
            pageData.result = result;
            console.log('-------', pageData.result);
        }
        res.render('help/help', pageData);
    })
});

//问题种类
router.post('/problem_type.json', function (req, res) {
    var result = {success: false};
    var data = {};
    co(function*() {
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
// 热门问题
router.post('/problem_hot.json', function (req, res) {
    var result = {success: false};
    var data = {};
    co(function*() {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_HELP_PROBLEM_HOTCATEGORIES, {}, {}, {});
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

module.exports = router;