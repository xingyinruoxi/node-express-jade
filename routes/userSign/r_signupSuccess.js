/**
 * Created by a110 on 17/4/6.
 */
'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var commonAPI = require('../../components/common/CommonAPI');

/* GET users listing. */
router.get('/signupsuccess.html', function(req, res) {
    //res.send('sign in :respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手',
            keywords : '金投手、出借、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        loginHeader:true,
        curUrlTitle:'注册成功'
    };
    res.render('userSign/signupsuccess',pageData);
});

//获取未读信息个数
router.post('/get_unread.json',function (req,res) {
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        req.session.message=userInfo.data.userInfoVO.unReadCount;
        res.json({success:true});
    });
});

module.exports = router;
