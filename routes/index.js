'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../components/APIClient/APIClient');
var APIPath = require('../components/APIClient/APIPath');
var common = require('../components/common/common');
var urlPath = require('../config/config').UrlPath;

/* GET home page. */
router.get([urlPath.indexRoot,urlPath.index], function(req, res) {
    var pageData = {
        seo : {
            title : '金投手',
            keywords : '金投手、投资、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'首页',
        indexInfo:{}
    };
    co(function* () {
        var jtsInfo = yield APIClient.newpost(APIPath.ALICLOUD_INDEX_API, {}, {}, {});
        var data={};
        if(jtsInfo.success){
            data=jtsInfo.data;
        }

        var has={
            advertise:'',//轮播图
            indexStatisticsVO:'',//运营数据
            notices:'',//公告

            productGroupVOS:'',//产品信息
            companyNews:'',//公司新闻
            mediaReports:''//媒体报道
        };
        pageData.indexInfo = {
            advertise:'',//轮播图
            indexStatisticsVO:'',//运营数据
            notices:'',//公告
            activityVOS:'',//活动列表
            productGroupVOS:'',//产品信息
            companyNews:'',//公司新闻
            mediaReports:''//媒体报道
            //companyNews:common.isEmpty(data) || common.isEmpty(data.companyNews)?[]:data.companyNews,
            //indexStatisticsVO:common.isEmpty(data) || common.isEmpty(data.indexStatisticsVO)?{}:data.indexStatisticsVO,
            //mediaReports:common.isEmpty(data) || common.isEmpty(data.mediaReports)?[]:data.mediaReports,
            //notices:common.isEmpty(data) || common.isEmpty(data.notices)?[]:data.notices,
            //productGroupVOS:common.isEmpty(data) || common.isEmpty(data.productGroupVOS)?[]:data.productGroupVOS
        };
        //console.log('##################',data.productGroupVOS[0].productVOList);
        if(!common.isEmpty(data.advertise)){
            has.advertise=true;
            pageData.indexInfo.advertise=data.advertise;
            //console.log(22222,pageData.indexInfo.advertise);
        }
        if(!common.isEmpty(data.indexStatisticsVO)){
            has.indexStatisticsVO=true;
            var indexStat=data.indexStatisticsVO;
            indexStat.totalAmount=common.nfmoney(indexStat.totalAmount,-10);
            indexStat.totalInterest=common.nfmoney(indexStat.totalInterest,-6);
            indexStat.totalUser=common.nfmoney(indexStat.totalUser,0,0,'z');
            indexStat.runDay=common.nfmoney(indexStat.runDay,0,0,'z');
            pageData.indexInfo.indexStatisticsVO=data.indexStatisticsVO;
            //console.log('--------',pageData.indexInfo.indexStatisticsVO);
        }
        if(!common.isEmpty(data.notices)&&data.notices.length>0){
            has.notices=true;
            pageData.indexInfo.notices=data.notices;
        }
        if(!common.isEmpty(data.activityVOS)&&data.activityVOS.length>0){
            has.activityVOS=true;
            for(var i in data.activityVOS){
                data.activityVOS[i].onlineTime=common.formatDateTime(data.activityVOS[i].onlineTime);
                data.activityVOS[i].offlineTime=common.formatDateTime(data.activityVOS[i].offlineTime);
            }
            pageData.indexInfo.activityVOS=data.activityVOS;

        }
        if(!common.isEmpty(data.productGroupVOS)&&data.productGroupVOS.length>0){
            has.productGroupVOS=true;
            if(data.productGroupVOS){
                var dataAA=data.productGroupVOS[0].productVOList;
                for(var j=0,max=dataAA.length;j<max;j++){
                    //console.log(11111,dataAA[i]);
                    dataAA[j].rate=common.nfmoney((dataAA[j].tenderAmount/dataAA[j].amount),2,2);
                    dataAA[j].rate=dataAA[j].rate>=100?'100.00':dataAA[j].rate;
                    dataAA[j].amount=common.nfmoney(dataAA[j].amount,-6);
                    dataAA[j].tenderStatus=req.session.comInit.TenderStatus[dataAA[j].tenderStatus];
                    //console.log(111112222222,dataAA[i].tenderAmount,dataAA[i].amount,dataAA[i].rate);
                }
            }
            pageData.indexInfo.productGroupVOS=data.productGroupVOS;
            //console.log('--------1',pageData.indexInfo.productGroupVOS);
        }
        if(!common.isEmpty(data.companyNews)&&data.companyNews.length>0){
            has.companyNews=true;
            pageData.indexInfo.companyNews=data.companyNews;
        }
        if(!common.isEmpty(data.mediaReports)&&data.mediaReports.length>0){
            has.mediaReports=true;
            pageData.indexInfo.mediaReports=data.mediaReports;
        }

        pageData.has=has;
        //console.log('------3------',pageData);
        //console.log('------4------',data.productGroupVOS[0].productVOList);

        res.render(urlPath.indexJade,pageData);
    });
});

router.get('/json', function(req, res) {
    //res.setHeader("Content-type",APIClien.CONTENT_TYPE_JSON);
    var sid = req.session.username;

    res.json({ title: 'Express' + sid,username: sid});



});
module.exports = router;
