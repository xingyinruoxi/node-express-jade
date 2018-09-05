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
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手媒体报道_金投手新闻资讯-金投手官网',
            keywords : '金投手媒体报道,金投手新闻资讯',
            discription : '金投手媒体报道栏目为用户提供互联网金融行业媒体对金投手出借金融平台的报道。'
        },
        curTab:'媒体报道',
        listUrl:'/xxpl/mtbd/',
        curUrlTitle:'信息披露'
    };
    res.render('aboutus/mediadetail',pageData);
});

/* 公司动态详情 */
router.get('/xxpl/gsdt/detail*', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手活动信息_金投手媒体报道_金投手资讯信息-金投手官网',
            keywords : '金投手活动信息,金投手媒体报道,金投手资讯信息,金投手官网',
            discription : '金投手公司动态栏为用户展示更多关于社会媒体的关注和报道的新闻信息。'
        },
        curTab:'公司动态',
        listUrl:'/xxpl/gsdt/',
        curUrlTitle:'信息披露'
    };
    res.render('aboutus/mediadetail',pageData);
});

/* 公司动态详情 */
router.get('/xxpl/gsbg/detail*', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手活动信息_金投手媒体报道_金投手资讯信息-金投手官网',
            keywords : '金投手活动信息,金投手媒体报道,金投手资讯信息,金投手官网',
            discription : '金投手公司动态栏为用户展示更多关于社会媒体的关注和报道的新闻信息。'
        },
        curTab:'公司报告',
        listUrl:'/xxpl/gsbg/',
        curUrlTitle:'信息披露'
    };
    res.render('aboutus/mediadetail',pageData);
});

//获取新闻详情数据
router.post('/get_newsDetail.json', function (req, res) {
    var body = {
        id:req.body.id
    };
    //调用获取新闻详情接口
    var result = {success: false};
    var data = {};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_NEWS_DETAIL, {}, {}, body);
        } catch (e) {
            data = {};
            console.log('获取新闻详情异常：',e);
        } finally {
            console.log('获取新闻详情结果数据：',data);
            if(data.success===true){
                result.success = true;
                result.data=data.data;
            }else{
                result.success = false;
                result.msg = errorCodes.errorCode()[errorCodes.apiErrorCode()[data.errorCode]];
            }
        }
        res.json(result);
    });
});

module.exports = router;


