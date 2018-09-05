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

/*相关法律*/
router.get(['/tzzjy/flfg/detail*','/tzzjy/detail*'], function(req, res) {
    var para={
        mdname:APIPath.ALICLOUD_NEWS_DETAIL,
        body:APIClient.getbody({id:req.originalUrl.replace(/[^0-9]/ig,'')})
    };
    co(function* () {

        var data=yield APIClient.newpost(para.mdname, para);
        var pageData = {
            seo : {
                title :data.data.topic+',金投手',
                keywords : data.data.keywords,
                discription : data.data.descriptions
            },
            curTab:'法律法规',
            curUrlTitle:'投资者教育',
            listUrl:'/tzzjy/flfg/',
        };
        res.render('help/tzzjydetail',pageData);
    });

    /*var pageData = {
        seo : {
            title : '金投手法律法规-金投手官网',
            keywords : '金投手,法律法规',
            discription : '金投手为用户提供多种贷款产品的综合金融平台，平台产品由金投手网站提供，本声明以本网站使用的条款，凡浏览或注册使用本网站的用户，均表示接受以下条款。'
        },
        curTab:'法律法规',
        curUrlTitle:'投资者教育',
        listUrl:'/tzzjy/flfg/',
    };
    res.render('help/tzzjydetail',pageData);*/
});

/*行政法规*/
router.get('/tzzjy/xzfg/detail*', function(req, res) {
    var para={
        mdname:APIPath.ALICLOUD_NEWS_DETAIL,
        body:APIClient.getbody({id:req.originalUrl.replace(/[^0-9]/ig,'')})
    };
    co(function* () {

        var data=yield APIClient.newpost(para.mdname, para);
        var pageData = {
            seo : {
                title :data.data.topic+',金投手',
                keywords : data.data.keywords,
                discription : data.data.descriptions
            },
            curTab:'行政法规',
            curUrlTitle:'投资者教育',
            listUrl:'/tzzjy/xzfg/',
        };
        res.render('help/tzzjydetail',pageData);
    });
});

/*规范性文件*/
router.get('/tzzjy/gfxwj/detail*', function(req, res) {
    var para={
        mdname:APIPath.ALICLOUD_NEWS_DETAIL,
        body:APIClient.getbody({id:req.originalUrl.replace(/[^0-9]/ig,'')})
    };
    co(function* () {

        var data=yield APIClient.newpost(para.mdname, para);
        var pageData = {
            seo : {
                title :data.data.topic+',金投手',
                keywords : data.data.keywords,
                discription : data.data.descriptions
            },
            curTab:'规范性文件',
            curUrlTitle:'投资者教育',
            listUrl:'/tzzjy/gfxwj/',
        };
        res.render('help/tzzjydetail',pageData);
    });
});

/*司法解释*/
router.get('/tzzjy/sfjs/detail*', function(req, res) {
    var para={
        mdname:APIPath.ALICLOUD_NEWS_DETAIL,
        body:APIClient.getbody({id:req.originalUrl.replace(/[^0-9]/ig,'')})
    };
    co(function* () {

        var data=yield APIClient.newpost(para.mdname, para);
        var pageData = {
            seo : {
                title :data.data.topic+',金投手',
                keywords : data.data.keywords,
                discription : data.data.descriptions
            },
            curTab:'司法解释',
            curUrlTitle:'投资者教育',
            listUrl:'/tzzjy/sfjs/',
        };
        res.render('help/tzzjydetail',pageData);
    });
});

/*知识百科*/
router.get('/tzzjy/zsbk/detail*', function(req, res) {
    var para={
        mdname:APIPath.ALICLOUD_NEWS_DETAIL,
        body:APIClient.getbody({id:req.originalUrl.replace(/[^0-9]/ig,'')})
    };
    co(function* () {

        var data=yield APIClient.newpost(para.mdname, para);
        var pageData = {
            seo : {
                title :data.data.topic+',金投手',
                keywords : data.data.keywords,
                discription : data.data.descriptions
            },
            curTab:'知识百科',
            curUrlTitle:'投资者教育',
            listUrl:'/tzzjy/zsbk/',
        };
        res.render('help/tzzjydetail',pageData);
    });
});

/*专栏文章*/
router.get('/tzzjy/zlwz/detail*', function(req, res) {
    var para={
        mdname:APIPath.ALICLOUD_NEWS_DETAIL,
        body:APIClient.getbody({id:req.originalUrl.replace(/[^0-9]/ig,'')})
    };
    co(function* () {

        var data=yield APIClient.newpost(para.mdname, para);
        var pageData = {
            seo : {
                title :data.data.topic+',金投手',
                keywords : data.data.keywords,
                discription : data.data.descriptions
            },
            curTab:'专栏文章',
            curUrlTitle:'投资者教育',
            listUrl:'/tzzjy/zlwz/',
        };
        res.render('help/tzzjydetail',pageData);
    });
});

//获取投资者教育详情数据
router.post('/get_newsDetail.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_NEWS_DETAIL,
        body:APIClient.getbody(req.body)
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

module.exports = router;
