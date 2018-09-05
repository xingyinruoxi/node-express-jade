'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get(['/forgetpwdfinish.html','/changepwdfinish.html'], function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手',
            keywords : '金投手、出借、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'找回密码'
    };
    var url = req.originalUrl;
    if ((url.indexOf('changepwdfinish')) > 0) {
        pageData.seo = {
            title : '金投手用户密码修改_用户修改密码操作流程-金投手官网',
            keywords : '金投手用户密码修改,用户修改密码操作流程',
            discription : '	金投手修改密码页面为购买出借产品的用户展示详细的修改密码操作流程信息，供用户来修改密码使用。'
        },
            pageData.curUrlTitle = '修改密码';
    }
    res.render('userSign/forgetpwdfinish',pageData);
});

module.exports = router;
