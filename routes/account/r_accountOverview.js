/**
 * Created by a110 on 17/4/17.
 */
'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var commonAPI = require('../../components/common/CommonAPI');
var common = require('../../components/common/common');
// var webcom = require('../../public/javascripts/webcom.js');
/* GET users listing. */

router.get('/user/zhzl/', function(req, res) {
    var pageData = {
        seo : {
            title : ' 账号总览-金投手-国资控股互联网金融平台',
            keywords : ' 账号总览,金投手,互联网金融,互联网金融平台',
            discription : '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
        },
        RepayStatus:JSON.stringify(req.session.comInit.RepayStatus),
        curUrlTitle:'账户总览',
        accountInfo:{},
        result:{}
    };
    var result={};
    co(function* () {
        var para={
            mdname:APIPath.ALICLOUD_ACCOUNT_ASSETDETAIL,
            body:APIClient.getbody(req.body),
            token:req.session.token
        };
        var userFundDetail=yield APIClient.newpost(para.mdname, para);
        //console.log('+++++++++++++++++++++++',userFundDetail,userFundDetail.accountBalance);
            //accountBalance (integer, optional): 账户余额 ,
            //couponCount (integer, optional): 加息券个数 ,
            //lendIncome (integer, optional): 出借收益 ,
            //redPacketCount (integer, optional): 红包个数 ,
            //redRacketIncome (integer, optional): 红包抵现 ,
            //totalAsset (integer, optional): 总资产 ,
            //totalIncome (integer, optional): 累计收益 ,
            //totalLend (integer, optional): 出借金额 ,
            //totalTendering (integer, optional): 在投金额 ,
            //unIncome (integer, optional): 待收收益
        var FundDetail={
            accountBalance:userFundDetail.accountBalance,
            totalLend:'',
            redcount:'',
            totalIncome:''
        };

        result.val1=common.ishas(common.nfmoney(userFundDetail.data.totalAsset));//总资产
        result.val2=common.ishas(common.nfmoney(userFundDetail.data.totalTendering,-2,2));//出借中金额

        result.val3=common.ishas(parseInt(userFundDetail.data.redPacketCount)+parseInt(userFundDetail.data.couponCount));//红包加息卷
        result.val4=common.ishas(common.nfmoney(userFundDetail.data.totalLend));//  累计出借
        result.val5=common.ishas(common.nfmoney(userFundDetail.data.totalIncome));//累计收益

        var userInfo = yield commonAPI.getUserInfo(req.session.token);
        pageData.isheadshow=commonAPI.getaccountHeader(userInfo.data);
        var data = common.isEmpty(userInfo.data.userAccountInfoVO)?{}:userInfo.data.userAccountInfoVO;
        result.bindSerialNo=data.bindSerialNo;
        result.mixBankCard=data.mixBankCard;
        result.mixRealName=data.mixRealName;
        result.riskRating=userInfo.data.userInfoVO.riskRating;
        result.percent='33';
        result.level='低';
        if(result.bindSerialNo&&result.riskRating){
            result.percent='100';
            result.level='高';
        }else if(result.bindSerialNo||result.riskRating){
            result.percent='66';
            result.level='中';
        }
        result.systemTime = common.formatDateTime(userInfo.systemTime,'hms').split(':').join('').substring(11,15);
        console.log(222222,result.systemTime);
        if((result.systemTime-600)<=0||(result.systemTime-1700)>0){
            result.welWord='晚上好';
        }else if((result.systemTime-600)>0&&(result.systemTime-1130)<=0){
            result.welWord='早上好';
        }else if( (result.systemTime-1400)<=0){
            result.welWord='中午好';
        }else if ((result.systemTime-1700)<=0){
            result.welWord='下午好';
        }else{
            result.welWord='你好';
        }
        pageData.result=result;
        pageData.accountInfo = {
            accountBalance:common.isEmpty(data) || (common.isEmpty(data.accountBalance)?'0.00':common.nfmoney(data.accountBalance)),
            eCardType:common.isEmpty(data) || common.isEmpty(data.eCardType)?0:data.eCardType,
            mobile:data.mixRealName||userInfo.data.userInfoVO.mixMobile,
            bindSerialNo:common.isEmpty(data) || common.isEmpty(data.bindSerialNo)?'':data.bindSerialNo
        };
        res.render('account/accountoverview',pageData);
    });

});
// 还款计划
router.post('/get_repaymonth.json',function (req,res) {
    var para={
        mdname:APIPath.ALICLOUD_ACCOUNT_REPAYMONTH,
        body:APIClient.getbody(req.body),
        token:req.session.token
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

//获取用户资金明细
router.post('/accountoverview_funddetail.json',function (req,res) {

});

module.exports = router;