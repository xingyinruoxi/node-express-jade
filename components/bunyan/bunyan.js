'use strict';
var bunyan = require('bunyan');
var config = require('../../config/config');
//var fs = require("fs");
//var filePath=__dirname+config.SystemConfig.logPath;
//console.log('@@@@@@@@@@@@@',filePath);
//if(!fs.existsSync(filePath)){
//    fs.mkdirSync(filePath);
//}
//exports.initdir=function(){
//
//};


//save count
//const logLoopCount = 30;
//day
//const logType = 'rotating-file';
//create bunyan logger to debug
exports.log = function(appName){
    return bunyan.createLogger({
        name: appName,
        streams: [
            {
                level: 'info',
                // log INFO and above to stdout
                stream: process.stdout
            },
            {
                level: 'info',
                type: config.SystemConfig.logType,
                count: config.SystemConfig.logLoopCount,
                period: '1d',
                // log INFO and above to a file
                path: config.SystemConfig.logPath + appName + '-' + config.SystemConfig.logInfo + '.log'
            },
            {
                level: 'error',
                type: config.SystemConfig.logType,
                count: config.SystemConfig.logLoopCount,
                period: '1d',
                // log ERROR and above to a file
                path: config.SystemConfig.logPath + appName + '-' + config.SystemConfig.logError + '.log'
            }
        ]
    });
};