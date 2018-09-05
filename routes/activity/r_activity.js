/**
 * Created by a110 on 17/4/17.
 */
'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var common = require('../../components/common/common');
var errorCodes = require('../../components/common/errorCode');
/* GET users listing. */
router.get('/activity/', function(req, res) {
    var pageData = {
        seo : {
            title : '北京贷款公司_小额出借产品_个人出借产品-金投手官网',
            keywords : '小额出借产品,个人出借产品,北京贷款公司',
            discription : '金投手主要为用户提供小额出借、个人出借、活期、定期出借产品，网上出借产品的优惠活动展示。参与出借活动，增加出借收益。'
        }
    };
    res.render('activity/activity',pageData);
});

//活动列表
router.post('/get_activity.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_ACTIVITY_PAGEQUERY,
        body:APIClient.getbody(req.body)
    };
    co(function* () {
        var data=yield APIClient.newpost(para.mdname, para),
            datalist=data.list,
            imageHost=req.session.comInit.SystemConfigVO.imageHost;


        var activityurl={newuser:'/activity/activityguide.html'};

        for(var i=0,max=datalist.length;i<max;i++){
            datalist[i].picUrlPc=imageHost+datalist[i].picUrlPc;
            datalist[i].url=activityurl[datalist[i].code]||'';

        }
        //for(var i=0;)
        console.log('----data---',data.list);
        res.json(data);
    });
});

module.exports = router;
