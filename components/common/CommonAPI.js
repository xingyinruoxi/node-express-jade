'use strict';
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
exports.getUserInfo = function (token) {
    var para = {
        mdname: APIPath.ALICLOUD_USER_INFO,
        token: token
    };
    return co(function* () {
        return (yield APIClient.newpost(para.mdname, para));
    });
};

exports.getaccountHeader=function(data){
    return {
        bindSerialNo:data.userAccountInfoVO.bindSerialNo?'1':'',
        riskRating:data.userInfoVO.riskRating?'1':'',
        isredorcou:data.userAccountInfoVO.redPacketCount&&data.userAccountInfoVO.couponCount?'1':'',
        eCardType:data.userAccountInfoVO.eCardType
    };
};
// 热门问题种类
exports.getHelpType = function () {
    var para = {
        mdname: APIPath.ALICLOUD_HELP_PROBLEM_CATEGORIES
    };
    return co(function* () {
        return (yield APIClient.newpost(para.mdname, para));
    });
};