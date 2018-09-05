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

/* 媒体报道 */
router.get('/xxpl/mtbd', function(req, res) {
    var pageData = {
        seo : {
            title : '金投手媒体报道_金投手新闻资讯-金投手官网',
            keywords : '金投手媒体报道,金投手新闻资讯',
            discription : '金投手媒体报道栏目为用户提供互联网金融行业媒体对金投手出借金融平台的报道。'
        },
        curTab:'媒体报道',
        curUrlTitle:'信息披露',
        imageHost:req.session.comInit.SystemConfigVO.imageHost
    };
    console.log('----1111111pageData----',pageData);
    res.render('aboutus/medialist',pageData);
});
/* 公司动态. */
router.get('/xxpl/gsdt/', function(req, res) {
    var pageData = {
        seo : {
            title : '金投手活动信息_金投手媒体报道_金投手资讯信息-金投手官网',
            keywords : '金投手活动信息,金投手媒体报道,金投手资讯信息,金投手官网',
            discription : '金投手公司动态栏为用户展示更多关于社会媒体的关注和报道的新闻信息。'
        },
        curTab:'公司动态',
        curUrlTitle:'信息披露',
        imageHost:req.session.comInit.SystemConfigVO.imageHost
    };
    console.log('----22222222pageData----',pageData);
    res.render('aboutus/companylist',pageData);
});
/* 公司报告 */
router.get('/xxpl/gsbg/', function(req, res) {
    var pageData = {
        seo : {
            title : '金投手公司报告_金投手数据报告_金投手信息安全公告-金投手官网',
            keywords : '金投手公司报告,金投手数据报告,金投手信息安全公告',
            discription : '金投手公司公告为您提供金投手最新的公司报告数据信息，为用户披露更多信息安全方面的信息。'
        },
        curTab:'公司报告',
        curUrlTitle:'信息披露'
    };
    res.render('aboutus/reportlist',pageData);
    //res.send(234567890);
});

//获取新闻列表数据
router.post('/get_newsList.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_NEWS_LIST,
        body:APIClient.getbody(req.body)
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});


module.exports = router;


