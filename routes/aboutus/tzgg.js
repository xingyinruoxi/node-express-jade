/**
 * Created by a110 on 17/4/17.
 */
'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/xxpl/tzgg/', function(req, res) {
    var pageData = {
        seo : {
            title : '金投手出借产品信息_金投手出借活动信息_金投手出借产品信息公告-金投手官网',
            keywords : '金投手出借产品信息,金投手出借活动信息,金投手出借产品信息公告',
            discription : '金投手新闻公告为您提供金投手最新的出借产品活动介绍，和金保理等出借产品的上线。'
        },
        curTab:'通知公告',
        curUrlTitle:'信息披露'
    };
    res.render('aboutus/tzgg',pageData);
});

module.exports = router;
