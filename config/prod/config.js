'use strict';
exports.SystemConfig = {
    redisIP : 'r-tj7f36b6c5599234.redis.rds.aliyuncs.com',
    redisPort : '6379',
    redisExpTime : 1800,//Redis session TTL过期时间，单位秒
    redisDB : 1,
    redisPrefix : 'JTS-PC:', //数据表前缀，默认为sess:，这里配置JTS
    redisPass : 'Puv9pksm4Ekg',

    sessionKey : 'JTS.session',
    sessionSecret : 'Asecret-jintoushou-secret-1qazQAZ-prod',

    morganFormat : 'combined', //combined、common、dev、short

    cookieMaxAge : 1800000,
    cookieSecure : true,
    cookieHttpOnly : true,

    envTest : 'test',
    envPre : 'pre',
    envProd : 'prod',
    envDev : 'dev',

    appKey:'23867597',
    appSecret:'326d94cf16bb135c912a360beb4a1783',
    apiDomain:'http://fa7261e142314ba3b128cc630a01e812-cn-hangzhou-inner.alicloudapi.com',

    logInfo:'info',
    logError:'error',
    logLoopCount:30,
    logPath:'/home/work/logs/www/',
    logType:'rotating-file',

    website:'https://prod-www.jintoushou.com'
};

exports.UrlPath = {
    index : '/index.html',
    indexRoot : '/',
    indexJade : 'index',
    logout : '/logout.html',
    signup : '/signup.html',
    signupsuccess : '/signupsuccess.html',
    signin : '/signin.html'
};

exports.headerConfig = {
    JTS_VERSION : '1.0',
    JTS_APPID : 'pc',
    JTS_CHANNEL : 'jts'
};