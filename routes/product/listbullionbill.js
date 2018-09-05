/**
 * Created by a110 on 17/4/21.
 */
'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var errorCodes = require('../../components/common/errorCode');
/* GET users listing. */
router.get('/product/listbullionbill.html', function (req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo: {
            title: '票据列表',
            keywords: '金投手、投资、理财',
            discription: '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'票据'
    };
    res.render('product/listbullionbill', pageData);
});

module.exports = router;

