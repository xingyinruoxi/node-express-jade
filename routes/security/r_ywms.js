/**
 * Created by wenlixia on 17/4/26.
 */

'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/ywms.html', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手出借产品_金投手合作伙伴_北京互联网金融公司-金投手官网',
            keywords : '金投手出借产品,金投手合作伙伴,金投手,北京互联网金融公司',
            discription : '金投手业务模式栏目为广大用户提供最靠谱的出借产品和出借项目信息'
        }
    };
    res.render('security/ywms',pageData);
});

module.exports = router;
