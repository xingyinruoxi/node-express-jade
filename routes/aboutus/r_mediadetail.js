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

/* 媒体报道详情 */
router.get('/xxpl/mtbd/detail*', function(req, res) {

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
            /*body:{
                title :data.data.topic,
                time:data.data.reportDate,
                content:data.data.content,
                prev:data.data.newsLastVO?data.data.newsLastVO:'',
                next:data.data.newsNextVO?data.data.newsNextVO:'',
            },*/
            curTab:'媒体报道',
            listUrl:'/xxpl/mtbd/',
            curUrlTitle:'信息披露'
        };
        res.render('aboutus/mediadetail',pageData);
    });
});

/* 公司动态详情 */
router.get('/xxpl/gsdt/detail*', function(req, res) {
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
            curTab:'公司动态',
            listUrl:'/xxpl/gsdt/',
            curUrlTitle:'信息披露'
        };
        res.render('aboutus/mediadetail',pageData);
    });
   /* var pageData = {
        seo : {
            title : '金投手活动信息_金投手媒体报道_金投手资讯信息-金投手官网',
            keywords : '金投手活动信息,金投手媒体报道,金投手资讯信息,金投手官网',
            discription : '金投手公司动态栏为用户展示更多关于社会媒体的关注和报道的新闻信息。'
        },
        curTab:'公司动态',
        listUrl:'/xxpl/gsdt/',
        curUrlTitle:'信息披露'
    };
    res.render('aboutus/mediadetail',pageData);*/
});

/* 公司动态详情 */
router.get('/xxpl/gsbg/detail*', function(req, res) {
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
            curTab:'公司报告',
            listUrl:'/xxpl/gsbg/',
            curUrlTitle:'信息披露'
        };
        res.render('aboutus/mediadetail',pageData);
    });
});


module.exports = router;


