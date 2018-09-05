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
router.get(['/tzzjy/xgfl/detail*','/tzzjy/detail*'], function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手法律法规-金投手官网',
            keywords : '金投手,法律法规',
            discription : '金投手为用户提供多种贷款产品的综合金融平台，平台产品由金投手网站提供，本声明以本网站使用的条款，凡浏览或注册使用本网站的用户，均表示接受以下条款。'
        },
        curTab:'相关法律',
        curUrlTitle:'投资者教育',
        listUrl:'/tzzjy/xgfl/',
    };
    res.render('help/tzzjydetail',pageData);
});

/*行政法规*/
router.get('/tzzjy/xzfg/detail*', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '投资者教育_P2P网贷知识_互联网金融知识-金投手官网',
            keywords : '投资者教育,P2P网贷知识,互联网金融知识',
            discription : '投资者教育栏目为出借、贷款用户提供P2P网贷知识、互联网金融知识等信息。'
        },
        curTab:'行政法规',
        curUrlTitle:'投资者教育',
        listUrl:'/tzzjy/xzfg/',
    };
    res.render('help/tzzjydetail',pageData);
});

/*规范性文件*/
router.get('/tzzjy/gfxwj/detail*', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手规范性文件-金投手官网',
            keywords : '金投手,规范性文件',
            discription : '金投手为用户提供多种贷款产品的综合金融平台，平台产品由金投手网站提供，本声明以本网站使用的条款，凡浏览或注册使用本网站的用户，均表示接受以下条款。'
        },
        curTab:'规范性文件',
        curUrlTitle:'投资者教育',
        listUrl:'/tzzjy/gfxwj/',
    };
    res.render('help/tzzjydetail',pageData);
});

/*司法解释*/
router.get('/tzzjy/sfjs/detail*', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手司法解释-金投手官网',
            keywords : '金投手,司法解释',
            discription : '金投手为用户提供多种贷款产品的综合金融平台，平台产品由金投手网站提供，本声明以本网站使用的条款，凡浏览或注册使用本网站的用户，均表示接受以下条款。'
        },
        curTab:'司法解释',
        curUrlTitle:'投资者教育',
        listUrl:'/tzzjy/sfjs/',
    };
    res.render('help/tzzjydetail',pageData);
});

/*知识百科*/
router.get('/tzzjy/zsbk/detail*', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '互联网金融百科_贷款知识_出借贷款知识-金投手官网',
            keywords : '互联网金融百科,贷款知识,出借贷款知识',
            discription : '金投手为用户提供多种贷款产品的综合金融平台，平台产品由金投手网站提供，本声明以本网站使用的条款，凡浏览或注册使用本网站的用户，均表示接受以下条款。'
        },
        curTab:'知识百科',
        curUrlTitle:'投资者教育',
        listUrl:'/tzzjy/zsbk/',
    };
    res.render('help/tzzjydetail',pageData);
});

/*专栏文章*/
router.get('/tzzjy/zlwz/detail*', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '贷款知识专栏_出借产品知识_网贷知识-金投手官网',
            keywords : '金投手,专栏文章,贷款知识,互联网金融平台',
            discription : '金投手为用户提供多种贷款产品的综合金融平台，平台产品由金投手网站提供，本声明以本网站使用的条款，凡浏览或注册使用本网站的用户，均表示接受以下条款。'
        },
        curTab:'专栏文章',
        curUrlTitle:'投资者教育',
        listUrl:'/tzzjy/zlwz/',
    };
    res.render('help/tzzjydetail',pageData);
});



//获取投资者教育详情数据
router.post('/get_newsDetail.json', function (req, res) {
    var body = {
        id:req.body.id
    };
    //调用获取投资者教育详情接口
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
