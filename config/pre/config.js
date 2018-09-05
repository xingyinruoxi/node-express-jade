'use strict';
exports.SystemConfig = {
    redisIP : '127.0.0.1',
    redisPort : '6379',
    redisExpTime : 1800,//Redis session TTL过期时间，单位秒
    redisDB : 1,
    redisPrefix : 'JTS-PC:', //数据表前缀，默认为sess:，这里配置JTS
    redisPass : '',

    sessionKey : 'JTS.session',
    sessionSecret : 'Asecret-jintoushou-secret-1qazQAZ-pre',

    morganFormat : 'combined', //combined、common、dev、short

    cookieMaxAge : 1800000,
    cookieSecure : true,
    cookieHttpOnly : true,

    envTest : 'test',
    envPre : 'pre',
    envProd : 'prod',
    envDev : 'dev'

};
