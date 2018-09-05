/**
 * Created by a110 on 17/4/17.
 */
'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var errorCodes = require('../../components/common/errorCode');
/* GET users listing. */
router.get(['/tzzjy/flfg/','/tzzjy'], function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手法律法规-金投手官网',
            keywords : '金投手,法律法规',
            discription : '金投手为用户提供多种贷款产品的综合金融平台，平台产品由金投手网站提供，本声明以本网站使用的条款，凡浏览或注册使用本网站的用户，均表示接受以下条款。'
        },
        curTab:'法律法规',
        curUrlTitle:'投资者教育'

    };
    res.render('help/tzzjy',pageData);
});

router.get('/tzzjy/xzfg/', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '投资者教育_P2P网贷知识_互联网金融知识-金投手官网',
            keywords : '投资者教育,P2P网贷知识,互联网金融知识',
            discription : '投资者教育栏目为出借、贷款用户提供P2P网贷知识、互联网金融知识等信息。'
        },
        curTab:'行政法规',
        curUrlTitle:'投资者教育'
    };
    res.render('help/tzzjy',pageData);
});
router.get('/tzzjy/gfxwj/', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手规范性文件-金投手官网',
            keywords : '金投手,规范性文件',
            discription : '金投手为用户提供多种贷款产品的综合金融平台，平台产品由金投手网站提供，本声明以本网站使用的条款，凡浏览或注册使用本网站的用户，均表示接受以下条款。'
        },
        curTab:'规范性文件',
        curUrlTitle:'投资者教育'
    };
    res.render('help/tzzjy',pageData);
});
router.get('/tzzjy/sfjs/', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手司法解释-金投手官网',
            keywords : '金投手,司法解释',
            discription : '金投手为用户提供多种贷款产品的综合金融平台，平台产品由金投手网站提供，本声明以本网站使用的条款，凡浏览或注册使用本网站的用户，均表示接受以下条款。'
        },
        curTab:'司法解释',
        curUrlTitle:'投资者教育'
    };
    res.render('help/tzzjy',pageData);
});
router.get('/tzzjy/zsbk/', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '互联网金融百科_贷款知识_出借贷款知识-金投手官网',
            keywords : '互联网金融百科,贷款知识,出借贷款知识',
            discription : '金投手为用户提供多种贷款产品的综合金融平台，平台产品由金投手网站提供，本声明以本网站使用的条款，凡浏览或注册使用本网站的用户，均表示接受以下条款。'
        },
        curTab:'知识百科',
        curUrlTitle:'投资者教育'
    };
    res.render('help/tzzjy',pageData);
});
router.get('/tzzjy/zlwz/', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '贷款知识专栏_出借产品知识_网贷知识-金投手官网',
            keywords : '金投手,专栏文章,贷款知识,互联网金融平台',
            discription : '金投手为用户提供多种贷款产品的综合金融平台，平台产品由金投手网站提供，本声明以本网站使用的条款，凡浏览或注册使用本网站的用户，均表示接受以下条款。'
        },
        curTab:'专栏文章',
        curUrlTitle:'投资者教育'
    };
    res.render('help/tzzjy',pageData);
});




module.exports = router;
