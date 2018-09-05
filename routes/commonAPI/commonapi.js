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
router.post('/get_calculate.json', function(req, res) {
    var body = {
        amount:req.body.amount,
        annualRate: req.body.annualRate,
        productType:'',
        radio: req.body.radio,
        repayInterestDay: req.body.repayInterestDay,
        repayStartDate:'',
        repayType:req.body.repayType,
        resultFormat: req.body.resultFormat,
        term: req.body.term,
        resContainsSUM:true
    };
    //调用理财计算器接口
    var result = {success: false};
    var data = {};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_USER_CALCULATOR, {}, {}, body);
            console.log('333333',data);
        } catch (e) {
            data = {};
            console.log('异常',e);
        } finally {
            if(data.success===true){
                result.success=true;
                result.data=data.data;
            }
        }
        res.json(result);
    });
});


module.exports = router;