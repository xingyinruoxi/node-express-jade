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
            title: '个人出借产品_小额出借项目_家庭出借产品_出借项目收益率-金投手官网',
            keywords: '个人出借产品,小额出借项目,家庭出借产品,出借项目收益率',
            discription: '金投手个人出借栏目主要为小额出借用户提供安全的，高收益的家庭投出借产品，用户可以通过金投手互联网金融平台上的出借产品项目进行出借，从而获得高收益率。'
        },
        curUrlTitle:'保理',
        ptype:'baoli'
    };
    res.render('product/factoring', pageData);
});

router.get('/tuishuidai/', function (req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo: {
            title: '退税贷项目_退税贷产品收益率_退税贷项目收益率-金投手官网',
            keywords: '退税贷项目,退税贷产品收益率,退税贷项目收益率',
            discription: '金投手退税贷产品栏目为用户展示更多关于退税贷的产品，用户可以通过金投手互联网金融平台上的退税贷产品项目进行出借，从而获得高收益率。'
        },
        curUrlTitle:'退税贷',
        ptype:'chukoutuishui'
    };
    res.render('product/factoring', pageData);
});

router.get('/piaojudai/', function (req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo: {
            title: '票据产品_票据产品收益_票据平台哪个好_票据平台排名有哪些-金投手官网',
            keywords: '票据产品,票据产品收益,票据平台哪个好,票据平台排名有哪些',
            discription: '金投手票据产品栏目主要为票据出借用户提供安全的，高收益的票据出借产品，为用户提供安全、靠谱的票据出借平台，同时让用户得更高的票据产品收益率。'
        },
        curUrlTitle:'票据贷',
        ptype:'piaojudai'
    };
    res.render('product/factoring', pageData);
});

//保理商品列表
router.post('/get_productlist.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_PRODUCT_QUERY,
        body:APIClient.getbody(req.body)
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

module.exports = router;

