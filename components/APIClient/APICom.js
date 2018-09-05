/**
 * Created by yangrui on 17/5/22.
 */
'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var common = require('../../components/common/common');
var commonAPI = require('../../components/common/CommonAPI');

/*var para={
    name:'/getAssNum.json',
    mdname:APIPath.ALICLOUD_ACCOUNT_RISKINFO
};*/
exports.post=function(para){
    router.post(para.name, function (req, res) {
        co(function* () {
            res.json(yield APIClient.commonPost(para.mdname,{token: req.session.token}));
        });
    });
};

module.exports = router;