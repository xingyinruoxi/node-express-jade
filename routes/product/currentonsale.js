'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var errorCodes = require('../../components/common/errorCode');
/* GET users listing. */
router.get('/product/currentonsale.html', function (req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo: {
            title: '当前在售',
            keywords: '金投手、投资、理财',
            discription: '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'当前在售'
    };
    res.render('product/currentonsale', pageData);
});
//投资排行榜
router.post('/get_rank.json', function (req, res) {
    var result = {success: false};
    var data = {};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_STATISTICS_CURRENT, {}, {}, {});
        } catch (e) {
            data = {};
            console.log('投资排行榜异常：',e);
        } finally {
            console.log('投资排行结果：',data);

            if(data.success===true){
                result.success = true;
                result.data=data;
            }else{
                result.success = false;
                result.msg = errorCodes.errorCode()[errorCodes.apiErrorCode()[data.errorCode]];
            }
        }
        res.json(result);
    });
});

//所有当前在售商品列表
router.post('/get_currentsale.json', function (req, res) {
    var body = {
        needCount: req.body.needCount,
        pageNo: req.body.pageNo,
        pageSize: req.body.pageSize,
        type:req.body.type
    };
    console.log('是否存在body', body);
    //调用注册接口
    var result = {success: '进来了么'};
    var data = {};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_PRODUCT_QUERY, {}, {}, body);
            console.log('data', data);
        } catch (e) {
            data = {};
            console.log('当前在售异常', data, e.message);
        } finally {
            result.data=data;

            /*if (data && data.success) {
             result.success = (data.data === true ? false : true);
             }*/
        }
        res.json(result);
    });
});
module.exports = router;

