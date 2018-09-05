/**
 * Created by wenlixia on 17/4/27.
 */

'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/flsm.html', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手法律声明_金投手出借机构信息- 金投手官网',
            keywords : '金投手法律声明,金投手出借机构信息',
            discription : '金投手为用户提供多种贷款产品的综合金融平台，平台产品由金投手网站提供，本声明以本网站使用的条款，凡浏览或注册使用本网站的用户，均表示接受以下条款。'
        },
        curUrlTitle:'法律声明'
    };
    res.render('security/flsm',pageData);
});

module.exports = router;
