/**
 * Created by a110 on 17/4/17.
 */
'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var errorCodes = require('../../components/common/errorCode');

/* GET users listing. */
router.get('/xxpl/tzgg/detail*', function(req, res) {

    var para={
        mdname:APIPath.ALICLOUD_NOTICE_DETAIL,
        body:APIClient.getbody({id:req.originalUrl.replace(/[^0-9]/ig,'')})
    };
    co(function* () {

        var data=yield APIClient.newpost(para.mdname, para);
        var pageData = {
            seo : {
                title :data.data.topic+',金投手',
                keywords : data.data.keywords,
                discription : data.data.descriptions
            },
            curTab:'通知公告',
            listUrl:'/xxpl/tzgg/',
            curUrlTitle:'信息披露'
        };
        res.render('aboutus/noticedetail',pageData);
    });
    /*var pageData = {
        seo : {
            title : '金投手出借产品信息_金投手出借活动信息_金投手出借产品信息公告-金投手官网',
            keywords : '金投手出借产品信息,金投手出借活动信息,金投手出借产品信息公告',
            discription : '金投手新闻公告为您提供金投手最新的出借产品活动介绍，和金保理等出借产品的上线。'
        },
        curTab:'通知公告',
        listUrl:'/xxpl/tzgg/',
        curUrlTitle:'信息披露'
    };
    res.render('aboutus/noticedetail',pageData);*/
});

//获取通知公告详情数据
router.post('/get_noticeDetail.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_NOTICE_DETAIL,
        body:APIClient.getbody(req.body)
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

module.exports = router;


