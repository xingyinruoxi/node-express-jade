/**
 * Created by a110 on 17/4/19.
 */
'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var common = require('../../components/common/common');
var commonAPI = require('../../components/common/CommonAPI');
var errorCodes = require('../../components/common/errorCode');

/* GET users listing. */
var tablist={
    0:['项目描述','担保详情','相关文件','还款计划','投资记录'],
    1:['项目介绍','保障措施','风险提示','融资人信息','投资记录'],
    2:['项目介绍','保障措施','风险提示','融资人信息','投资记录'],
    //3:['项目描述','票据展示','常见问题','还款计划','投资记录']
};

//router.get('/abcde/:id.html', function(req, res){
//    res.json(req.params.id);
//});

router.get('/baoli/:id.html', function(req, res) {
    console.log('------------------------',req.params.id);
    if(!req.session.signinCount){
        req.session.signinCount = 0;
    }
    var signToken = common.getRandomString(false,32);
    var signTicket = common.getRandomString(false,32);

    req.session.signToken = signToken;
    req.session.signTicket = signTicket;

    console.log('signToken_productdetail',signToken,signTicket);
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);

    var pageData = {
        seo : {
            title : '',
            //title:sessionStorage.getItem('ProductId'),
            keywords : '个人出借产品,小额出借项目,家庭出借产品,出借项目收益率',
            discription : '金投手互联网金融平台为您提供金保理等定期理财产品，投资期限2-6个月不等，定期利息为6%-11%'
        },
        signToken : signToken,
        signTicket : signTicket,
        signinCount : req.session.signinCount,
        ptype:'baoli',
        curTab:'金保理产品',
        tablist:tablist[0]
    };

    var show={},
        cominit=req.session.comInit;
    show.TimeLimitUnit=JSON.stringify(cominit.TimeLimitUnit);
    show.RepayType=JSON.stringify(cominit.RepayType);
    pageData.show=show;
    res.render('product/productdetail',pageData);
});

router.get(['/tuishuidai/:id.html','/piaojudai/:id.html'], function(req, res) {
    var cindex=req.originalUrl.indexOf('tuishuidai')>-1?1:2;
    console.log('------555555-------',req.originalUrl,cindex);

    var header = {
        1: {
            discription : '金投手互联网金融平台为您提供金保理等定期理财产品，投资期限2-6个月不等，定期利息为6%-11%',
            ptype: 'chukoutuishui',
            curTab: '退税贷',
            tablist:tablist[1]
        },
        2: {
            discription : '本项目是银行承兑汇票投融资理财产品，票面金额：10万元，本次融资金额：99000.00元，票据到期由江苏常熟农村商业银行进行无条件承兑。',
            ptype: 'piaojudai',
            curTab: '票据贷',
            tablist:tablist[2]
        }
    };
    if(!req.session.signinCount){
        req.session.signinCount = 0;
    }


    var signToken = common.getRandomString(false,32);
    var signTicket = common.getRandomString(false,32);

    req.session.signToken = signToken;
    req.session.signTicket = signTicket;

    console.log('signToken_productdetail',signToken,signTicket);
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '',
            keywords : '',
            discription : header[cindex].discription
        },
        signToken : signToken,
        signTicket : signTicket,
        signinCount : req.session.signinCount,
        ptype:header[cindex].ptype,
        curTab:header[cindex].curTab,
        curUrlTitle:header[cindex].curTab,
        tablist:header[cindex].tablist,
    };
    /*if ((url.indexOf('piaojudai')) > 0) {
        pageData.seo = {
            discription : '	金投手修改密码页面为购买出借产品的用户展示详细的修改密码操作流程信息，供用户来修改密码使用。'
        }
    };*/

    co(function* () {
        var show={},
            cominit=req.session.comInit;
        show.TimeLimitUnit=JSON.stringify(cominit.TimeLimitUnit);
        show.RepayType=JSON.stringify(cominit.RepayType);
        pageData.show=show;

        var para = {
            mdname: APIPath.ALICLOUD_PRODUCT,
            body: {productId: req.params.id}
        };
        var data=yield APIClient.newpost(para.mdname, para),
            rule=[
                ['项目简介','借款金额','借款用途','还款方式','还款来源'],
                ['风控意见','还款保障措施','相关文件','税单展示'],
                ['项目风险提示'],
                ['融资人信息'],
            ],
            showD=[[], [], [],[],{}],
            datalist=data.data.productVO,
            dataExtends=datalist.productExtends,
            listExtends={};
        listExtends[rule[1][3]]=[];
        for(var i=0,maxi=dataExtends.length;i<maxi;i++){
            if(dataExtends[i].description===rule[1][3]){
                if(dataExtends[i].value){
                    listExtends[rule[1][3]].push(cominit.SystemConfigVO.imageHost+dataExtends[i].value);
                }
            }else{
                listExtends[dataExtends[i].description]=dataExtends[i].value;
            }
        }
        console.log('3333333',dataExtends,listExtends);
        //showD[0][0]['项目简介']=listExtends['项目简介'];
        showD[0][rule[0][0]]=listExtends[rule[0][0]];
        showD[0][rule[0][1]]=common.nfmoney(datalist.amount,-6,2);
        showD[0][rule[0][2]]=listExtends[rule[0][2]];
        showD[0][rule[0][3]]=cominit.RepayType[datalist.repayType];
        showD[0][rule[0][4]]=listExtends[rule[0][4]];

        showD[1][rule[1][0]]=listExtends[rule[1][0]];
        showD[1][rule[1][1]]=listExtends[rule[1][1]];
        showD[1][rule[1][2]]=[];
        showD[1][rule[1][3]]=listExtends[rule[1][3]];

        showD[2][rule[2][0]]=listExtends[rule[2][0]];

        var para1 = {
            mdname: APIPath.ALICLOUD_ACCOUNT_BORROWER,
            body: {id: datalist.borrowerId}
        };
        var data1=yield APIClient.newpost(para1.mdname, para1),
            datalist1=data1.data.borrowerInfo,
            datafiles=data1.data.borrowerQualificationFiles,
            showfile={};

        for(var l=0,maxl=datafiles.length;l<maxl;l++){
            if(datafiles[l].filename){
                showfile[datafiles[l].name]=cominit.SystemConfigVO.imageHost+datafiles[l].filename;
            }
        }

        pageData.showfile=showfile;


        showD[3][rule[3][0]]={
            borrowerName:datalist1.borrowerName,
            registeredCapital:datalist1.registeredCapital,
            businessAddress:datalist1.businessAddress,
            foundingTime:common.formatDateTime(datalist1.foundingTime),
            legalPerson:datalist1.legalPerson,

            use:listExtends[rule[0][2]],
            shareholderInfo:datalist1.shareholderInfo,
            creditInfo:datalist1.creditInfo,
            contributedCapital:datalist1.contributedCapital,
            workAddress:datalist1.workAddress,
            managementArea:datalist1.managementArea,
            remark:datalist1.remark
        };
        console.log('-----222222----',data1,data1.data.borrowerQualificationFiles,showfile);
        //showD[3]

        var para2 = {
            mdname: APIPath.ALICLOUD_ACCOUNT_QUERYTENDERUSER,
            body: {
                pageNo:'1',
                pageSize:'10',
                productId:req.params.id
            }
        };
        var data2=yield APIClient.newpost(para2.mdname, para2),
            datatopUsers=data2.topUsers,//三投手
            //datatopUsers=[],//三投手
            datatenderUsers=data2.tenderUsers,//投资列表
            showlist=[],showtop=[],
            icontype = {pc: 'tv', android: 'android', ios: 'apple', h5: 'mobile'};
        //datatopUsers=datatenderUsers;

        for(var j=0,maxj=datatenderUsers.length;j<maxj;j++){
            showlist[j]=[];
            showlist[j].name=datatenderUsers[j].realName;
            showlist[j].money=common.nfmoney(datatenderUsers[j].transAmount);
            showlist[j].createTime=common.formatDateTime(datatenderUsers[j].createTime,'hms');
            showlist[j].osName=icontype[datatenderUsers[j].osName];
        }
        for(var k=0,maxk=datatopUsers.length;k<maxk;k++){
            showtop[k]=[];
            showtop[k].name=datatopUsers[k].realName;
            showtop[k].money=common.nfmoney(datatopUsers[k].transAmount);
            showtop[k].createTime=common.formatDateTime(datatopUsers[k].createTime,'hms');
        }
        pageData.showtop=showtop;
        pageData.showlist=showlist;

        //console.log('-----1111111----',showlist);

        pageData.showD=showD;
        pageData.rule=rule;
        //console.log('-----4444444444----',req.params.id,showD,66666,data1);
        //console.log('====11111====',data.data.productVO.productExtends);
        res.render('product/productdetail',pageData);
    });
});

/*router.get('/piaojudai/!*', function(req, res) {

    //set signin count
    if(!req.session.signinCount){
        req.session.signinCount = 0;
    }
    var signToken = common.getRandomString(false,32);
    var signTicket = common.getRandomString(false,32);

    req.session.signToken = signToken;
    req.session.signTicket = signTicket;

    console.log('signToken_productdetail',signToken,signTicket);
    //res.send('forgetpwd : respond 11 with a resource' + req.session.username);
    var pageData = {
        seo : {
            title : '投资详情',
            keywords : '金投手、出借、理财',
            discription : '国资金融，当前最稳定、最安全、最有保障的金融产品'
        },
        signToken : signToken,
        signTicket : signTicket,
        signinCount : req.session.signinCount,
        ptype:'piaojudai',
        curTab:'票据贷产品',
        tablist:tablist[2]
    };
    var show={},
        cominit=req.session.comInit;
    show.TimeLimitUnit=JSON.stringify(cominit.TimeLimitUnit);
    show.RepayType=JSON.stringify(cominit.RepayType);
    pageData.show=show;
    res.render('product/productdetail',pageData);
});*/

router.post('/productdetail_isProLogin.json', function (req, res) {
    var result = {
        islogin:false,
        bindSerialNo:'',
        eCardType:''
    };
    console.log('是否登陆了',req.session.tokenExpTime);
    if(req.session.tokenExpTime){
        result.islogin=true;
        co(function* () {
            var userInfo = yield commonAPI.getUserInfo(req.session.token);
            var data = common.isEmpty(userInfo.data.userAccountInfoVO)?{}:userInfo.data.userAccountInfoVO;
            result.bindSerialNo=data.bindSerialNo;
            result.eCardType=data.eCardType;
            result.riskRating=userInfo.data.userInfoVO.riskRating;
            result.accountBalance=data.accountBalance;
            result.mobile=userInfo.data.userInfoVO.mobile;
            console.log('#############',userInfo);

            res.json(result);
        });
    }else{
        res.json(result);
    }
});

//获取产品信息
router.post('/productdetail_getinfo.json', function (req, res) {
    var para = {
        mdname: APIPath.ALICLOUD_PRODUCT,
        body: APIClient.getbody(req.body)
    };
    co(function* () {
        var data=yield APIClient.newpost(para.mdname, para);
        var productVO=data.data.productVO,
            comInit=req.session.comInit;
        //productVO.repayType=comInit.RepayType[productVO.repayType];

        //console.log('====11111====',data.data.productVO.productExtends);
        res.json(data);
    });
});

router.post('/productdetail_getEarnings.json', function (req, res) {
    var para = {
        mdname: APIPath.ALICLOUD_ACCOUNT_CALCULATOR,
        body: APIClient.getbody(req.body)
    };
    co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
});

router.post('/productdetail_submitAssRes.json', function (req, res) {
    var para = {
        mdname: APIPath.ALICLOUD_ACCOUNT_SUBMITRISK,
        body: APIClient.getbody(req.body),
        token:req.session.token
    };
    //co(function* () { res.json(yield APIClient.newpost(para.mdname, para)); });
    var result = { success : false };
    co(function* () {
        if(!common.checkCSRF(req)){
            result.data.errorCode = 'default';
        }else{
            result=yield APIClient.newpost(para.mdname, para);
        }
        res.json(result);
    });
});

module.exports = router;