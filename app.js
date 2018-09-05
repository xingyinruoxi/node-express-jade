'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log = require('./components/bunyan/bunyan').log('jintoushou:app');
var session = require('express-session');
var APIClient = require('./components/APIClient/APIClient');
var APIPath = require('./components/APIClient/APIPath');
var RedisStrore = require('connect-redis')(session);
var co = require('co');
var syc =  require('./config/config');
var common =  require('./components/common/common');
var systemConfig = syc.SystemConfig;
// var less = require('less-middleware');


var config = {
    'cookie' : {
        path :'/',
        maxAge : systemConfig.cookieMaxAge,
        secure : systemConfig.cookieSecure, //https config
        httpOnly : systemConfig.cookieHttpOnly
    },
    'sessionStore' : {
        'host' : systemConfig.redisIP,
        'port' : systemConfig.redisPort,
        'pass' : systemConfig.redisPass,
        'prefix' : systemConfig.redisPrefix, //数据表前缀，默认为sess:，这里配置JTS
        'db' : systemConfig.redisDB,
        'ttl' : systemConfig.redisExpTime,//Redis session TTL过期时间，单位秒
        'logErrors' : true
    }
};

var app = express();
//nginx proxy config
app.set('trust proxy', 1);
app.use(session({
    key: systemConfig.sessionKey,
    secret : systemConfig.sessionSecret,
    resave : true,
    saveUninitialized : true,
    cookie : config.cookie,
    store : new RedisStrore(config.sessionStore)
}));

//app.use(function(req,res,next){
//    res.cookie('user', '5555', { expires: new Date(Date.now() + 900000000000) });
//    next();
//});

app.use(function (req,res,next) {
    var url = req.originalUrl;
        if (url.indexOf('user/') > 0 && !req.session.tokenExpTime){
            return res.redirect('/signin.html');
        }
        next();
});

app.use(function(req, res, next) {
    var tel = req.session.username || null;
    if(tel){
        res.locals.tel = common.cellphoneNumToStar(req.session.username);
        res.locals.message=req.session.message;
    }
    res.locals.website=systemConfig.website;
    next();
});

app.use(function(req, res, next) {
    if(!req.session.comInit){
        co(function* () {
            var data= (yield APIClient.newpost(APIPath.ALICLOUD_INDEX_INIT,{}));
            req.session.comInit=data;
            //res.json(data);

        });
    }
    next();
});

app.use(function(req,res,next){
    //重新获取token
    try{
        co(function* () {
            var fullURL = req.originalUrl;
            if((req.session.tokenExpTime && fullURL.indexOf('.html') > 0) || (req.session.tokenExpTime && fullURL.indexOf('.json') > 0)){
                var expTime = req.session.tokenExpTime;
                var currentTime = new Date().getTime();
                var ticket = req.session.ticket;
                var minuts = Math.floor((expTime-currentTime)/1000/60);
                log.info('expTime: %s currentTime: %s ticket: %s minutes: %s' ,
                    expTime,currentTime,ticket,minuts);

                if(minuts < 3) {
                        if(req.session.reloadToken === 'no'){
                            try{
                                req.session.reloadToken = 'yes';
                                var para={
                                    mdname:APIPath.ALICLOUD_TOKEN_RELOAD,
                                    body:{'ticket':ticket},
                                    token:req.session.token
                                };
                                var result=yield APIClient.newpost(para.mdname, para);

                                /*var result =  yield APIClient.post(APIPath.ALICLOUD_TOKEN_RELOAD,{},{},{'ticket':ticket},
                                    req.session.token,syc.headerConfig.JTS_VERSION,syc.headerConfig.JTS_APPID,syc.headerConfig.JTS_CHANNEL);*/
                                log.info('result : ' + result);

                                if(result && result.success === true){//sign up success
                                    if(result.data.tokenVO.token){
                                        req.session.tokenExpTime = result.data.tokenVO.expTime;
                                        req.session.token = result.data.tokenVO.token;
                                        req.session.ticket = result.data.tokenVO.ticket;
                                        req.session.reloadToken = 'no';
                                        req.session.save();
                                        // next();
                                    }
                                }
                            }catch(e){
                                log.error(e.info());
                                req.session.reloadToken = 'no';
                                req.session.save();
                            }

                        }
                }
            }
        });
    }catch(e){

    }
    next();
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger(systemConfig.morganFormat));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser(systemConfig.sessionSecret,config.cookie));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


//只需要require路由模块
app.use(require('./routes/Routers'));

app.get('*', function(req, res){
    var pageData = {
        seo : {
            title : '404错误页面-金投手官网',
            keywords : '金投手,404错误页面',
            discription : '金投手官网主要为个人出借、家庭出借的用户提供小额出借、短期、活期、定期等网贷保本型理财产品，出借收益在6%-9%，同时，为您提供网络出借技巧、出借小知识等服务。'
        }
    };
    res.render('./404',pageData);
});


/*// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
    next();
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

module.exports = app;
