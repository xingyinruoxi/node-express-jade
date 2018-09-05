'use strict';
var express = require('express');
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var common = require('../../components/common/common');
var errorCodes = require('../../components/common/errorCode');
var config = require('../../config/config');
var router = express.Router();

/**
 * 工具栏理财计算器
 */
router.post('/get_calculate.json', function (req, res) {
    var para = {
        mdname: APIPath.ALICLOUD_ACCOUNT_CALCULATOR,
        body: APIClient.getbody(req.body)
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

module.exports = router;