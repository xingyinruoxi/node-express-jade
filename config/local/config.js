'use strict';
exports.SystemConfig = {
    redisIP : '127.0.0.1',
    redisPort : '6379',
    redisExpTime : 1800,//Redis session TTL过期时间，单位秒
    redisDB : 1,
    redisPrefix : 'JTS-PC:', //数据表前缀，默认为sess:，这里配置JTS
    redisPass : '123456',

    sessionKey : 'JTS.session',
    sessionSecret : 'Asecret-jintoushou-secret-1qazQAZ',

    morganFormat : 'dev', //combined、common、dev、short

    cookieMaxAge : 1800000,
    cookieSecure : false,
    cookieHttpOnly : true,

    envTest : 'test',
    envPre : 'pre',
    envProd : 'prod',
    envDev : 'dev',

    appKey:'23717799',
    appSecret:'4216d988ad38faa0b9d03e93176a28a7',
    apiDomain:'https://test-api.jintoushou.com',

    logInfo:'info',
    logError:'error',
    logLoopCount:30,
    logPath:'logs/',
    logType:'',

    website:'http://localhost:3000'
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