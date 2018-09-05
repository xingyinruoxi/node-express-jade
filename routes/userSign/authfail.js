/**
 * Created by a110 on 17/6/5.
 */
'use strict';
var express = require('express');
var router = express.Router();

router.get('/signinfail.html', function(req, res) {
    var pageData = {
        seo : {
            title : '金投手',
            keywords : '金投手、投资、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'登录遇到问题',
        failname:'登录',
        failhref:'/signin.html'
    };
    res.render('userSign/authfail',pageData);
});

router.get('/signupfail.html', function(req, res) {
    var pageData = {
        seo : {
            title : '金投手',
            keywords : '金投手、投资、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'注册遇到问题',
        failname:'注册',
        failhref:'/signup.html'
    };
    res.render('userSign/authfail',pageData);
});

router.get('/forgetpwdfail.html', function(req, res) {
    var pageData = {
        seo : {
            title : '金投手',
            keywords : '金投手、投资、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'忘记密码遇到问题',
        failname:'忘记密码',
        failhref:'/forgetpwdStart.html'
    };
    res.render('userSign/authfail',pageData);
});

module.exports = router;
