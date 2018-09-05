'use strict';
/**
 * npm install aliyun-api-gateway --save
 */
/* require bunyan */
var log = require('../bunyan/bunyan').log('jintoushou:apiclient');
var config = require('../../config/config');
var co = require('co');
var Client = require('aliyun-api-gateway').Client;
/* create client instance with appkey and appsecret */
var client = new Client(config.SystemConfig.appKey, config.SystemConfig.appSecret);
var APIPath = require('../../components/APIClient/APIPath');
var common = require('../common/common');
/*config running Env : X-Ca-Stage，取值 TEST/PRE/RELEASE*/
client.stage = 'TEST';
exports.client = client;


/* getToken */
exports.post = function(url,_signHeaders,_query,_body,token,version,appid,channel){
    console.log(123456,url,_signHeaders,_query,_body,token,version,appid,channel);
    url = config.SystemConfig.apiDomain + url;
    var result = {};
    log.info('start get token from %s',url);
    return co(function*() {
        result = yield client.post(url, {
            headers: {
                'accept': 'application/json',
                'content-type': Client.CONTENT_TYPE_JSON,
                'jts-token': token ? token : '',
                'jts-version': version ? version : config.headerConfig.JTS_VERSION,
                'jts-appId': appid ? appid : config.headerConfig.JTS_APPID,
                'jts-channel': channel ? channel : config.headerConfig.JTS_CHANNEL

            },
            signHeaders: _signHeaders,
            query: _query,
            data: _body,
            timeout: 15000
        });
        log.info('get result: %s',JSON.stringify(result));
        return result;
    });
};

function isContains (arr, element) {
    for (var i = 0; i < arr.length; i++){
        if(arr[i] === element) {
            return true;
        }
    }
    return false;
}

var errMethod=[
    APIPath.ALICLOUD_ACCOUNT_CALCULATOR,
    APIPath.ALICLOUD_GET_CHECKVCODE
];

exports.newpost=function(url,para){
    var userbind = common.getRandomString(false,32);
    var result = {};
    var method=url;
    url = config.SystemConfig.apiDomain + url;
    //log.info('start get token from %s',url);
    console.log('《《《《《-------传递参数 start:'+method+'-------》》》》》');
    //console.log('*******111111',userbind);
    console.log('接口名称：',url);
    console.log('数据：',para.body);
    console.log('《《《《《-------传递参数   end:'+method+'-------》》》》》');
    return co(function*() {
        var postdata = {
            headers: {
                'accept': 'application/json',
                'content-type': Client.CONTENT_TYPE_JSON,
                'jts-token': para.token || '',
                'jts-version': config.headerConfig.JTS_VERSION,
                'jts-appId': config.headerConfig.JTS_APPID,
                'jts-channel': config.headerConfig.JTS_CHANNEL
            },
            signHeaders: para._signHeaders || {},
            query: para.query || {},
            data: para.body || {},
            timeout: 15000
        };
        console.log('《《《《《-------其他参数 start:'+method+'-------》》》》》');
        console.log(postdata);
        console.log('《《《《《-------其他参数   end:'+method+'-------》》》》》');
        try {
            result = yield client.post(url, postdata);
        } catch (e) {
            result.error2=true;
            console.log('《《《《《-------调用报错 start:'+method+'-------》》》》》');
            console.log('数据异常：',e.message);
            console.log('《《《《《-------调用报错   end:'+method+'-------》》》》》');
        } finally {
            console.log('《《《《《-------成功结果 start:'+method+'-------》》》》》');
            /*console.log('##########--------',(isContains(errMethod,method)?'包含':'不包含')+method);
            if(isContains(errMethod,method)){
                console.log('##########--------',result.errorCode);
                if(!result.errorCode){
                    result.error1=true;
                }
            }*/
            console.log(result);
            console.log('《《《《《-------成功结果   end:'+method+'-------》》》》》');
        }
        //log.info('get result: %s',JSON.stringify(result));
        return result;
    });
};

exports.commonPost=function(url,para){
    var result = {};
    url = config.SystemConfig.apiDomain + url;
    log.info('start get token from %s',url);
    console.log('《《《《《-------传递参数 '+url+'-------》》》》》');
    console.log(url,para);
    console.log('《《《《《-------传递参数   end-------》》》》》');
    return co(function*() {
        var postdata = {
            headers: {
                'accept': 'application/json',
                'content-type': Client.CONTENT_TYPE_JSON,
                'jts-token': para.token || '',
                'jts-version': config.headerConfig.JTS_VERSION,
                'jts-appId': config.headerConfig.JTS_APPID,
                'jts-channel': config.headerConfig.JTS_CHANNEL
            },
            signHeaders: para._signHeaders || {},
            query: para._query || {},
            data: para._body || {},
            timeout: 15000
        };
        console.log('《《《《《-------其他参数 start-------》》》》》');
        console.log(postdata);
        console.log('《《《《《-------其他参数   end-------》》》》》');
        try {
            result = yield client.post(url, postdata);
        } catch (e) {
            console.log('《《《《《-------调用报错 start-------》》》》》');
            console.log(e.message);
            console.log('《《《《《-------调用报错   end-------》》》》》');
        } finally {
            console.log('《《《《《-------成功结果 start-------》》》》》');
            console.log(result);
            console.log('《《《《《-------成功结果   end-------》》》》》');
        }
        log.info('get result: %s',JSON.stringify(result));
        return result;
    });
};

exports.newget=function(url,para){
    var result = {};
    var method=url;
    url = config.SystemConfig.apiDomain + url;
    //log.info('start get token from %s',url);
    console.log('《《《《《-------传递参数 start:'+method+'-------》》》》》');
    //console.log('*******111111',userbind);
    console.log('接口名称：',url);
    console.log('数据：',para.body);
    console.log('《《《《《-------传递参数   end:'+method+'-------》》》》》');
    return co(function*() {
        var getdata={
            headers: {
                'jts-token': para.token || '',
                'jts-version':  config.headerConfig.JTS_VERSION,
                'jts-appId':  config.headerConfig.JTS_APPID,
                'jts-channel':  config.headerConfig.JTS_CHANNEL
            },
            signHeaders: para._signHeaders || {},
            query: para.query || {},
            data: para.body || {},
            timeout: 15000
        };
        console.log('《《《《《-------其他参数 start:'+method+'-------》》》》》');
        console.log(getdata);
        console.log('《《《《《-------其他参数   end:'+method+'-------》》》》》');
        try {
            result = yield client.get(url,getdata);
        } catch (e) {
            result.error2=true;
            console.log('《《《《《-------调用报错 start:'+method+'-------》》》》》');
            console.log('数据异常：',e.message);
            console.log('《《《《《-------调用报错   end:'+method+'-------》》》》》');
        }finally{
            console.log('《《《《《-------成功结果 start:'+method+'-------》》》》》');
            console.log(result);
            console.log('《《《《《-------成功结果   end:'+method+'-------》》》》》');
        }
        return result;
    });
};

exports.get = function(url,token){
    var result = {};
    return co(function*() {
        var getdata={
            headers: {
                'jts-token': token ? token : '',
                'jts-version':  config.headerConfig.JTS_VERSION,
                'jts-appId':  config.headerConfig.JTS_APPID,
                'jts-channel':  config.headerConfig.JTS_CHANNEL
            }
        };
        result = yield client.get(url,getdata);
        return result;
    });
};

/**
 * 通过URL从后端api获取验证码的base64字符串
 * @param url
 * @returns {*}
 */
exports.getValidateVCode = function(url,type,sessionId,token,version,appid,channel) {
    return co(function*() {
        var result = 'data:image/png;base64,';
        result += yield client.get(config.SystemConfig.apiDomain + url + '?type='+ type + '&validateKey=' + sessionId,
            {
                headers: {
                    'jts-token' : token?token:'',
                    'jts-version' : version?version:config.headerConfig.JTS_VERSION,
                    'jts-appId' : appid?appid:config.headerConfig.JTS_APPID,
                    'jts-channel' : channel?channel:config.headerConfig.JTS_CHANNEL
                }
            }
        );
        return result;
    });

};

exports.getInvitefriend = function(url,type,token,version,appid,channel) {
    console.log('-----getInvitefriend-----');
    return co(function*() {
        var result = 'data:image/png;base64,',
            para = {
                name: config.SystemConfig.apiDomain + url + '?url=' + type,
                body: {
                    headers: {
                        'jts-token': token ? token : '',
                        'jts-version': version ? version : config.headerConfig.JTS_VERSION,
                        'jts-appId': appid ? appid : config.headerConfig.JTS_APPID,
                        'jts-channel': channel ? channel : config.headerConfig.JTS_CHANNEL
                    }
                }
            };
        result += yield client.get(para.name, para.body);
        return result;
    });

};

//自动获取body里的参数
exports.getbody=function(data){
    var res={};
    for(var i in data){res[i]=data[i];}
    return res;
};