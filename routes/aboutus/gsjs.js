/**
 * Created by a110 on 17/4/17.
 */
'use strict';
var express = require('express');
var router = express.Router();

/*公司介绍*/
router.get(['/xxpl','/xxpl/gsjs.html'], function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手公司介绍_金投手平台介绍_北京出借金融公司-金投手官网',
            keywords : '金投手公司介绍,北京出借金融公司,金投手平台介绍',
            discription : '金投手公司是由北京粮油交易所、中建国能等央企法人成立，为央企、国企、上市公司等核心企业建立的科技金融公司。'
        },
        curTab:'公司介绍',
        curUrlTitle:'信息披露'
    };
    res.render('aboutus/gsjs',pageData);
});

/*团队介绍*/
router.get(['/xxpl/tdjs.html'], function(req, res) {
    var pageData = {
        seo : {
            title : '金投手团队介绍_金投手管理团队_金投手团队信息-金投手官网',
            keywords : '金投手团队介绍,金投手管理团队,金投手团队信息',
            discription : '金投手团队介绍主要为用户展示金投手高管管理团队的相关个人简介信息。'
        },
        curTab:'团队介绍',
        curUrlTitle:'信息披露'
    };
    res.render('aboutus/tdjs',pageData);
});

/*运营数据*/
router.get('/xxpl/yysj.html', function(req, res) {
    var pageData = {
        seo : {
            title : '金投手平台数据_金投手平台运营数据_金投手数据信息-金投手官网',
            keywords : '金投手平台数据,金投手平台运营数据,金投手数据信息',
            discription : '金投手平台运营数据页面为用户展示平台整体数据信息的披露,平台的运营数据的披露。'
        },
        curTab:'运营数据',
        curUrlTitle:'信息披露'
    };
    res.render('aboutus/yysj',pageData);
});

/*合作伙伴*/
router.get('/xxpl/hzhb.html', function(req, res) {
    var pageData = {
        seo : {
            title : '互联网金融机构_北京贷款公司信息_北京出借公司排名- 金投手官网',
            keywords : '互联网金融机构,北京贷款公司信息,北京出借公司排名',
            discription : '金投手合作伙伴主要介绍和金投手出借平台合作的中央企业和金融机构'
        },
        curTab:'合作伙伴',
        curUrlTitle:'信息披露'
    };
    res.render('aboutus/hzhb',pageData);
});

/*联系我们*/
router.get('/xxpl/lxwm.html', function(req, res) {
    var pageData = {
        seo : {
            title : '金投手平台地址_金投手客服电话_互联网金融公司联系方式- 金投手官网',
            keywords : '金投手平台地址,金投手客服电话,互联网金融公司联系方式',
            discription : '金投手互联网金融公司客服电话：400-101-7660，公司地址：北京市海淀区中关村丹棱街甲1号互联网金融中心B座22层。'
        },
        curTab:'联系我们',
        curUrlTitle:'信息披露'
    };
    res.render('aboutus/lxwm',pageData);
});

module.exports = router;
