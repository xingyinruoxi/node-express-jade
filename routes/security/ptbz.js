/**
 * Created by wenlixia on 17/4/26.
 */

'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/guarantee.html/', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '出借平台安全保障_互联网金融公司保障_金融平台资金保障-金投手官网',
            keywords : '出借平台安全保障,互联网金融公司保障,金融平台资金保障',
            discription : '金投手安全保障栏目主要为广大用户提供安全可靠的出借平台保障信息，让家庭出借和个人出借了解到互联网金融平台安全相关的知识和操作流程。'
        }
    };
    res.render('security/ptbz',pageData);
});

module.exports = router;
