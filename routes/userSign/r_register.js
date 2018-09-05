/**
 * Created by a110 on 17/4/6.
 */
'use strict';
var express = require('express');
var router = express.Router();

/* 用户注册协议 */
router.get('/xieyi.html', function(req, res) {
    //res.send('sign in :respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手注册协议_金投手出借机构信息-金投手官网',
            keywords : '金投手注册协议,金投手出借机构信息',
            discription : '金投手为用户提供多种贷款产品的综合金融平台，平台产品由金投手网站提供，本声明以本网站使用的条款，凡浏览或注册使用本网站的用户，均表示接受以下条款。'
        }
    };
    res.render('userSign/register',pageData);
});

/*隐私保密协议*/
router.get('/ysbmxy.html', function(req, res) {
    //res.send('sign in :respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手用户隐私保密协议_金投手出借机构信息-金投手官网',
            keywords : '金投手用户隐私保密协议,金投手出借机构信息',
            discription : '金投手为用户提供多种贷款产品的综合金融平台，平台产品由金投手网站提供，本声明以本网站使用的条款，凡浏览或注册使用本网站的用户，均表示接受以下条款。'
        }
    };
    res.render('userSign/privacy',pageData);
});

/*金投手平台居间服务协议-出借人版*/
router.get('/cjqjfwxy.html', function(req, res) {
    //res.send('sign in :respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手平台居间服务协议_金投手出借机构信息-金投手官网',
            keywords : '金投手平台居间服务协议,金投手出借机构信息',
            discription : '金投手为用户提供多种贷款产品的综合金融平台，平台产品由金投手网站提供，本声明以本网站使用的条款，凡浏览或注册使用本网站的用户，均表示接受以下条款。'
        }
    };
    res.render('userSign/lend',pageData);
});


/*金投手平台网络借贷协议*/
router.get('/wljdxy.html', function(req, res) {
    //res.send('sign in :respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手平台网络借贷协议_金投手出借机构信息-金投手官网',
            keywords : '金投手平台网络借贷协议,金投手出借机构信息',
            discription : '金投手为用户提供多种贷款产品的综合金融平台，平台产品由金投手网站提供，本声明以本网站使用的条款，凡浏览或注册使用本网站的用户，均表示接受以下条款。'
        }
    };
    res.render('userSign/network',pageData);
});
module.exports = router;

/*浙商银行网络借贷交易资金存管业务三方协议*/
router.get('/zsyhwljdjyzjcgywsfxy.html', function(req, res) {
    //res.send('sign in :respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '浙商银行网络借贷交易资金存管业务三方协议_金投手出借机构信息-金投手官网',
            keywords : '浙商银行网络借贷交易资金存管业务三方协议,金投手出借机构信息',
            discription : '金投手为用户提供多种贷款产品的综合金融平台，平台产品由金投手网站提供，本声明以本网站使用的条款，凡浏览或注册使用本网站的用户，均表示接受以下条款。'
        }
    };
    res.render('userSign/trading',pageData);
});
module.exports = router;

/*浙商银行委托扣款业务服务协议*/
router.get('/zsyhwtkkywfwxy.html', function(req, res) {
    //res.send('sign in :respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '浙商银行委托扣款业务服务协议_金投手出借机构信息-金投手官网',
            keywords : '浙商银行委托扣款业务服务协议,金投手出借机构信息',
            discription : '金投手为用户提供多种贷款产品的综合金融平台，平台产品由金投手网站提供，本声明以本网站使用的条款，凡浏览或注册使用本网站的用户，均表示接受以下条款。'
        }
    };
    res.render('userSign/deductions',pageData);
});
module.exports = router;