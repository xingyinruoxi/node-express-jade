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
            title : '金投手-国资控股互联网金融平台',
            keywords : '金投手,金保理出借产品,小额出借产品,个人出借产品,退税贷产品,家庭出借产品,互联网金融平台',
            discription : '金投手由北京粮油交易所、中建国能等央企法人成立，主要为个人出借、家庭出借的用户提供小额出借、短期出借、活期、定期出借产品收益在6%-9%收益稳健的互联网金融平台。'
        },
        curUrlTitle:'首页',
        indexInfo:{}
    };
    console.log('234567',pageData.website);
    co(function* () {
        var cominit=null;
        if(!req.session.comInit){
            req.session.comInit= (yield APIClient.newpost(APIPath.ALICLOUD_INDEX_INIT,{}));
        }
        cominit=req.session.comInit;

        var jtsInfo = yield APIClient.newpost(APIPath.ALICLOUD_INDEX_API, {}, {}, {});
        var data={};
        if(jtsInfo.success){
            data=jtsInfo.data
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
        var activityurl={newuser:'/activity/activityguide.html'};
        if(!common.isEmpty(data.activityVOS)&&data.activityVOS.length>0){
            has.activityVOS=true;
            for(var i in data.activityVOS){
                data.activityVOS[i].onlineTime=common.formatDateTime(data.activityVOS[i].onlineTime);
                data.activityVOS[i].offlineTime=common.formatDateTime(data.activityVOS[i].offlineTime);
                data.activityVOS[i].url=activityurl[data.activityVOS[i].code]||'';
            }
            pageData.indexInfo.activityVOS=data.activityVOS;
        }

        console.log('----- pageData.indexInfo.activityVOS--', pageData.indexInfo.activityVOS,jtsInfo.data.activityVOS);
        if(!common.isEmpty(data.productGroupVOS)&&data.productGroupVOS.length>0){
            has.productGroupVOS=true;
            if(data.productGroupVOS){
                var dataAA=data.productGroupVOS[0].productVOList;
                var dataBB=data.productGroupVOS[1].productVOList;
                var dataCC=data.productGroupVOS[2].productVOList;
                var j,max;

                for( j=0,max=dataAA.length;j<max;j++){
                    dataAA[j].annualRate=common.nfmoney(dataAA[j].annualRate*100);
                    dataAA[j].rate=common.nfmoney((dataAA[j].tenderAmount/dataAA[j].amount),2,2);
                     dataAA[j].rate=dataAA[j].rate>=100?'100':dataAA[j].rate;
                    dataAA[j].amount=common.nfmoney(dataAA[j].amount,-6);
                    if(dataAA[j].tenderStatus==='full'){
                        dataAA[j].rate='100';
                    }else if(dataAA[j].tenderStatus==='init'){
                        dataAA[j].rate='0';
                    }
                    dataAA[j].tenderStatus=cominit.TenderStatus[dataAA[j].tenderStatus];
                }
                for( j=0,max=dataBB.length;j<max;j++){
                    dataBB[j].annualRate=common.nfmoney(dataBB[j].annualRate*100);
                    dataBB[j].rate=common.nfmoney((dataBB[j].tenderAmount/dataBB[j].amount),2,2);
                    dataBB[j].rate=dataBB[j].rate>=100?'100':dataBB[j].rate;
                    dataBB[j].amount=common.nfmoney(dataBB[j].amount,-6);
                    if(dataBB[j].tenderStatus==='full'){
                        dataBB[j].rate='100';
                    }else if(dataBB[j].tenderStatus==='init'){
                        dataBB[j].rate='0';
                    }
                    dataBB[j].tenderStatus=cominit.TenderStatus[dataBB[j].tenderStatus];
                }
                for( j=0,max=dataCC.length;j<max;j++){
                    dataCC[j].annualRate=common.nfmoney(dataCC[j].annualRate*100);
                    dataCC[j].rate=common.nfmoney((dataCC[j].tenderAmount/dataCC[j].amount),2,2);
                    dataCC[j].rate=dataCC[j].rate>=100?'100':dataCC[j].rate;
                    dataCC[j].amount=common.nfmoney(dataCC[j].amount,-6);
                    if(dataCC[j].tenderStatus==='full'){
                        dataCC[j].rate='100';
                    }else if(dataCC[j].tenderStatus==='init'){
                        dataCC[j].rate='0';
                    }
                    dataCC[j].tenderStatus=cominit.TenderStatus[dataCC[j].tenderStatus];
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
        pageData.imageHost=cominit.SystemConfigVO.imageHost;
        //console.log('------3------',pageData);
        //console.log('------4------',data.productGroupVOS[0].productVOList);
        //pageData.imageHost=req.session.comInit.SystemConfigVO.imageHost;
        res.render(urlPath.indexJade,pageData);
    });
});

router.get('/json', function(req, res) {
    //res.setHeader("Content-type",APIClien.CONTENT_TYPE_JSON);
    var sid = req.session.username;

    res.json({ title: 'Express' + sid,username: sid});



});
module.exports = router;
