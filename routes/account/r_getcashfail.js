/**
 * Created by a110 on 17/4/19.
 */
'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/user/getcashfail.html', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : ' 提现结果_金投手-国资控股互联网金融平台',
            keywords : '提现结果,金投手,国资控股互联网金融平台',
            discription : '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
        },
        curUrlTitle:'提现结果',
    };
    res.render('account/getcashfail',pageData);
});

module.exports = router;
