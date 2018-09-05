/**
 * Created by jo on 17/5/15.
 */
'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var errorCodes = require('../../components/common/errorCode');
/* GET users listing. */
router.get('/baoli', function (req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo: {
            title: '保理列表',
            keywords: '金投手、投资、理财',
            discription: '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'保理'
    };
    res.render('product/factoring', pageData);
});

router.get('/chukoutuishui', function (req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo: {
            title: '保理列表',
            keywords: '金投手、投资、理财',
            discription: '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'出口退税'
    };
    res.render('product/factoring', pageData);
});

router.get('/piaojudai', function (req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo: {
            title: '保理列表',
            keywords: '金投手、投资、理财',
            discription: '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'票据贷'
    };
    res.render('product/factoring', pageData);
});



//保理商品列表
router.post('/get_productlist.json', function (req, res) {
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
            console.log('保理异常', data, e.message);
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

