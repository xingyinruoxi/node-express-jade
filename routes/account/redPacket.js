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
var commonAPI = require('../../components/common/CommonAPI');
/* GET users listing. */
router.get('/user/redpacket.html', function(req, res) {
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '金投手账户总览',
            keywords : '金投手、投资、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        curUrlTitle:'抵现红包'
    };
    co(function* () {
        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        pageData.isheadshow = commonAPI.getaccountHeader(userInfo.data);
        res.render('account/redpacket', pageData);
    })
});
//账户获取红包总览
router.post('/get_redpacketamout.json', function (req, res) {
    var para = {
        mdname: APIPath.ALICLOUD_ACCOUNT_REDPACKETAMOUT,
        body: APIClient.getbody(req.body),
        token:req.session.token
    };
    // console.log(1111111,para);
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });


    /*var body = {
    };
    var token=req.session.token;
    //调用获取红包总览接口
    var result = {success: false};
    var data = {};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_REDPACKETAMOUT, {}, {}, body,token);
        } catch (e) {
            data = {};
            console.log('获取红包总览异常：',e);
        } finally {
            console.log('获取红包总览结果数据：',data);
            if(data.success===true){
                result.success = true;
                result.data=data.data;
            }else{
                result.success = false;
                result.msg = errorCodes.errorCode()[errorCodes.apiErrorCode()[data.errorCode]];
            }
        }
        res.json(result);
    });*/
});

//获取红包详情
router.post('/get_redpacket.json', function (req, res) {
    var body = {
        needCount:req.body.needCount,
        pageNo:req.body.pageNo,
        pageSize:req.body.pageSize,
        type:req.body.type
    };
    var token=req.session.token;
    //调用获取红包接口
    var result = {success: false};
    var data = {};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_ACCOUNT_REDPACKET, {}, {}, body,token);
        } catch (e) {
            data = {};
            console.log('获取红包异常：',e);
        } finally {
            console.log('获取红包结果数据：',data,data.success===true);

            if(data.success===true){
                result.success = true;
                result.data=data.list;
                result.totalCount=data.totalCount;

                var dataAA=data.list;
                for(var i=0,max=dataAA.length;i<max;i++){
                    //console.log('$$$$$$$$$$$$$$$$$$',dataAA[i].productType);
                    dataAA[i].productType=req.session.comInit.ProductType[JSON.parse(dataAA[i].productType)];
                    //console.log('$$$$$$$$$$$$$$$$$$2',dataAA[i].productType);
                }

            }else{
                result.success = false;
                result.msg = errorCodes.errorCode()[errorCodes.apiErrorCode()[data.errorCode]];
            }
        }
        res.json(result);
    });
});
module.exports = router;
