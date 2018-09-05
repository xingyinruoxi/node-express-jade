'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var errorCodes = require('../../components/common/errorCode');
var commonAPI = require('../../components/common/CommonAPI');
var common = require('../../components/common/common');

router.get(['/help/rmwt/'], function (req, res) {
    var pageData = {
            seo: {
                title: '注册登录-金投手官网',
                keywords: '金投手,问题分类',
                discription: '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
            },
            curTitle: '热门问题'
        };
    co(function*() {
        var helpType = yield commonAPI.getHelpType();
        //console.log('*********', helpType.data);
        pageData.helpType =common.ishas( helpType.data);
        console.log('---------------', pageData);
        res.render('help/rmwt', pageData);
    });
});


/*/!* 热门问题 *!/
 router.get('/help/rmwt/', function(req, res) {
 var pageData = {
 seo : {
 title : '注册登录-金投手官网',
 keywords : '金投手,问题分类',
 discription : '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
 },
 curTab:'热门问题',
 curUrlTitle:'帮助中心'

 };
 res.render('help/rmwt',pageData);
 });

 /!* 安全保障 *!/
 router.get('/help/aqbz/', function(req, res) {
 var pageData = {
 seo : {
 title : '金投手安全保障_出借公司平台保障_金融平台资金保障-金投手官网',
 keywords : '金投手安全保障,出借公司平台保障,金融平台资金保障',
 discription : '金投手平台安全保障页面主要为用户展示更多出借公司平台保障的信息和互联网金融平台资金保障的信息供用户查阅。'
 },
 curTab:'安全保障',
 curUrlTitle:'帮助中心'
 };
 res.render('help/rmwt',pageData);
 });

 /!* 收益与奖励 *!/
 router.get('/help/syjl/', function(req, res) {
 var pageData = {
 seo : {
 title : '金投手平台收益率_个人出借产品收益率_金投手平台贷款利率-金投手官网',
 keywords : '金投手平台收益率,个人出借产品收益率,金投手平台贷款利率',
 discription : '金投手收益与奖励页面主要为用户提供更多关于金投手平台的收益情况和贷款利益的内容信息。'
 },
 curTab:'收益与奖励',
 curUrlTitle:'帮助中心'
 };
 res.render('help/rmwt',pageData);
 });

 /!* 资金出借 *!/
 router.get('/help/zjcj/', function(req, res) {
 var pageData = {
 seo : {
 title : '金投手资金出借平台_北京资金出借公司_北京贷款公司-金投手官网',
 keywords : '金投手资金出借平台,北京资金出借公司,北京贷款公司',
 discription : '金投手资金出借页面为出借用户展示更多北京资金出借公司信息与贷款公司相关的资金信息。'
 },
 curTab:'资金出借',
 curUrlTitle:'帮助中心'
 };
 res.render('help/rmwt',pageData);
 });

 /!* 充值与提现 *!/
 router.get('/help/cztx/', function(req, res) {
 var pageData = {
 seo : {
 title : '金投手账户充值与提现_金投手账户如何提现_个人贷款如何提现-金投手官网',
 keywords : '金投手账户充值,金投手账户如何提现,个人贷款如何提现',
 discription : '金投手充值与提现页面主要为用户提供金投手平台账号如何提现，个人贷款用户的提现流程。'
 },
 curTab:'充值与提现',
 curUrlTitle:'帮助中心'
 };
 res.render('help/rmwt',pageData);
 });

 /!* 存管开户与绑卡 *!/
 router.get('/help/cgbk/', function(req, res) {
 var pageData = {
 seo : {
 title : '金投手存管开户信息_金投手存管平台_银行绑卡流程有哪些-金投手官网',
 keywords : '金投手存管开户信息,金投手存管平台,银行绑卡流程有哪些',
 discription : '金投手平台存管开户与绑卡栏目主要为出借用户提供存管与绑卡相关的信息及银行绑卡的操作流程。'
 },
 curTab:'存管开户与绑卡',
 curUrlTitle:'帮助中心'
 };
 res.render('help/rmwt',pageData);
 });

 /!* 注册与登录 *!/
 router.get('/help/zcdl/', function(req, res) {
 var pageData = {
 seo : {
 title : '金投手用户注册与登录-金投手官网',
 keywords : '金投手用户注册与登录',
 discription : '金投手注册与登录栏目为出借用户展示整洁的登录窗口页面信息。'
 },
 curTab:'注册与登录',
 curUrlTitle:'帮助中心'
 };
 res.render('help/rmwt',pageData);
 });

 /!* 手续费问题 *!/
 router.get('/help/sfwt/', function(req, res) {
 var pageData = {
 seo : {
 title : '金投手平台如何提现_提现如何收费_个人贷款如何提现-金投手官网',
 keywords : '金投手平台如何提现,提现如何收费,个人贷款如何提现',
 discription : '金投手手续费栏目为出借用户展示更多关于提现手续费的相关问题的解答及用户的疑问。'
 },
 curTab:'手续费问题',
 curUrlTitle:'帮助中心'
 };
 res.render('help/rmwt',pageData);
 });

 /!* 金投手介绍 *!/
 router.get('/help/gsjs/', function(req, res) {
 var pageData = {
 seo : {
 title : '金投手介绍_金投手公司介绍_金投手平台介绍-金投手官网',
 keywords : '金投手,金投手介绍,金投手公司介绍,金投手平台介绍',
 discription : '金投手公司介绍栏目为出借用户展示更多与金投手有关的公司资质信息，出借用户可以通过该栏目获取到更多的金投手公司内容。'
 },
 curTab:'金投手介绍',
 curUrlTitle:'帮助中心'
 };
 res.render('help/rmwt',pageData);
 });*/

// 一类问题详情
router.post('/problem_detial.json', function (req, res) {
    var para = {
        mdname: APIPath.ALICLOUD_HELP_PROBLEM_QUERY,
        body: APIClient.getbody(req.body)
    };
    co(function*() {
        res.json(yield APIClient.newpost(para.mdname, para));
    });
});

// 是否解决
router.post('/problem_solved.json', function (req, res) {
    var para = {
        mdname: APIPath.ALICLOUD_HELP_PROBLEM_RESOLVED,
        body: APIClient.getbody(req.body)
    };
    co(function*() {
        res.json(yield APIClient.newpost(para.mdname, para));
    });
});

module.exports = router;
