'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var errorCodes = require('../../components/common/errorCode');
/* GET users listing. */
router.get('/onSaleingProduct/', function (req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo: {
            title: '票据出借产品_P2P网贷产品_债权转让项目_退税贷项目收益率-金投手官网',
            keywords: '票据出借产品,P2P网贷产品,债权转让项目,退税贷项目收益率',
            discription: '金投手当前在售栏目为用户提供最新的票据出借产品和P2P网贷产品信息，同时销售债权转让项目、退税贷项目收益率，打造出借产品的高收益率的互联网金融平台。'
        },
        curUrlTitle:'当前在售'
    };
    res.render('product/currentonsale', pageData);
});

//投资排行榜
router.post('/get_rank.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_STATISTICS_CURRENT,
        body:APIClient.getbody(req.body)
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

//所有当前在售商品列表
router.post('/get_currentsale.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_PRODUCT_QUERY,
        body:APIClient.getbody(req.body)
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

module.exports = router;

