/**
 * Created by a110 on 17/4/20.
 */
'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/product/productfail.html', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '投资失败',
            keywords : '金投手、投资、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        }
    };
    res.render('product/productfail',pageData);
});

module.exports = router;