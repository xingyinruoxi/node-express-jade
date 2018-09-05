var argv = require("yargs").argv,
    _ = require("lodash"),
    path = require("path");

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),//混淆js
    clean = require('gulp-clean'),//清理文件
    less = require('gulp-less'),//转换less用的
    autoprefixer = require('gulp-autoprefixer'),//增加私有变量前缀
    minifycss = require('gulp-minify-css'),//压缩
    concat = require('gulp-concat'),//合并
    fileinclude = require('gulp-file-include'),// include 文件用
    template = require('gulp-template'),//替换变量以及动态html用
    rename = require('gulp-rename'),//重命名
    imagemin = require('gulp-imagemin'),//图片压缩
    gulpif  = require('gulp-if'),//if判断，用来区别生产环境还是开发环境的
    //rev  = require('./sourceFiles/rev/index'),//加MD5后缀
    rev  = require('gulp-rev'),//加MD5后缀
    revCollector = require('gulp-rev-collector'),
    revReplace = require('gulp-rev-replace'),//替换引用的加了md5后缀的文件名，修改过，用来加cdn前缀
    vinylPaths = require('vinyl-paths'),//操作pipe中文件路径的，加md5的时候用到了
    runSequence = require('run-sequence'),//控制task顺序
    jshint = require('gulp-jshint'),//js校验
    jade = require('gulp-jade'),
    nodemon = require('gulp-nodemon'),
    $ = require('gulp-load-plugins')(),
    spriter = require('gulp-css-spriter'),
    map = require("map-stream"),
    browserSync = require('browser-sync'),
    shell = require('gulp-shell'),
    htmlReplace = require('gulp-html-replace');
    systemConfig = require('./config/config').SystemConfig,
    deployTool = require('./components/DeployTool'),
    co = require('co'),
    jsdoc = require('gulp-jsdoc3');



gulp.task('doc', function (cb) {
    gulp.src(['README.md', './components/**/*.js'], {read: false})
        .pipe(jsdoc(cb));
});

gulp.task('closeServer',function() {
    return gulp.src('*.*', {read: false})
        .pipe(shell([
            'ps -efww|grep bin/www|grep -v grep|cut -c 7-16|xargs kill -9'
        ]));
});


/* custome Reporter by jshint */
var customerReporter = map(function(file,cb){
    if(!file.jshint.success){
        //打印出错误信息
        console.log("jshint fail in:" + file.path);
        file.jshint.results.forEach(function(err){
            if(err){
                console.log(err);
                console.log("在 "+file.path+" 文件的第"+err.error.line+" 行的第"+err.error.character+" 列发生错误");
            }
        });
    }
});

/* starting nodemon server */
gulp.task('nodemon', function (cb) {
    var called = false;

    return nodemon({
        script: 'bin/www'
    }).on('start', function () {
        if (!called) {
            cb();
            called = true;
        }
    });
});

/* dev sync browser server port 5000 */
gulp.task('browser-sync', ['nodemon'], function () {
    browserSync.init(null, {
        proxy: 'http://localhost:3000',
        files: ['public/**/*.*', 'views/**/*.*', 'components/**/*.*','bin/**/*.*','routes/**/*.*','app.js'],
        browser: 'google chrome',
        notify: false,
        port: 5000
    });
});

gulp.task('browser-sync-reload',function () {
    browserSync.reload();
});

/* clear all auto files,include every env */

gulp.task('cleanAll',function(){
    gulp.src(['dist/*'],{read:false})
        .pipe(clean());
});
gulp.task('cleanTest',function(){
    gulp.src(['./dist/test/'],{read:false})
        .pipe(clean());
});
gulp.task('cleanRevFiles',function(){
    gulp.src(['./revfiles/'],{read:false})
        .pipe(clean());
});


/* jshint */
gulp.task('jshint', function(){
    return gulp.src(['./components/**/*.js','./bin/**/*.js','./public/javascripts/**/*.js'
        , './routes/**/*.js','./app.js'
    ])
        .pipe($.jshint())
        //.pipe($.jshint.reporter('jshint-stylish'))
        //.pipe($.jshint.reporter('fail'));
        .pipe(customerReporter);
});

/* copy to env */
gulp.task('copy',function () {
    return gulp.src([
        './bin/**/*',
        './views/**/*',
        './routes/**/*',
        './node_modules/**/*',
        './app.js'
    ], {base: './'})
        .pipe(gulp.dest('./dist'))
});

gulp.task('copySourceCoceHttpxDev',function () {
    return gulp.src(['./SourceCode/httpx/lib/index.js']).pipe(gulp.dest('./node_modules/httpx/lib'));
});

/************************************************
 dev env tasks start
 ************************************************/

/* css by less : merge & compress */
gulp.task('dev-css-min',function () {
    gulp.src("./public/stylesheets/**/*.less")
        .pipe(less())
        .pipe(concat('jintoushou-main.css'))
        .pipe(gulp.dest('./public/css'))
        .pipe(rename({suffix:'.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('./public/css'));
});
/* js compress : merge & compress */
gulp.task('dev-js-min',function(){
    gulp.src("./public/javascripts/**/*.js")
        .pipe(concat('jintoushou.main.js'))
        .pipe(gulp.dest('./public/js'))
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest("./public/js"))
    ;

});

//compress PNG/SVG/JPEG/GIF
gulp.task('image-min', function() {
    return gulp.src('./public/images/**/*.{png,jpg,gif,jpeg}')
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('./dist/images'));
});

gulp.task('spriter', function() {
    return gulp.src('./dist/css/**/*.css')//比如recharge.css这个样式里面什么都不用改，是你想要合并的图就要引用这个样式。
        .pipe(spriter({
            // The path and file name of where we will save the sprite sheet
            'spriteSheet': './dist/images/spritesheet.png', //这是雪碧图自动合成的图。
            // Because we don't know where you will end up saving the CSS file at this point in the pipe,
            // we need a litle help identifying where it will be.
            'pathToSpriteSheetFromCSS': '../images/spritesheet.png' //这是在css引用的图片路径
        }))
        .pipe(gulp.dest('./dist/css')); //最后生成出来
});
gulp.task('build',function () {
    //生产环境为true，开发环境为false，默认为true
    var prodEnv = argv.p || !argv.d;
    //模块名,默认为全部
    var allMod = argv.m || 'all';

    if(prodEnv === systemConfig.envProd){ //prod

    }else if(prodEnv === systemConfig.envPre){ //pre

    }else if(prodEnv === systemConfig.envTest){ //test

    }

    console.log("-------" + prodEnv + allMod);
});

gulp.task('watch', function() {
    gulp.watch(['./public/javascripts/**/*.*','config/**/*.*','./public/stylesheets/**/*.*','routes/**/*.*'],
        ['jshint','dev-js-min','dev-css-min']);
});

gulp.task('default',['dev-js-min','dev-css-min','copySourceCoceHttpxDev']);

gulp.task('dev',['default','watch','browser-sync']);


/************************************************
 dev env tasks end
 ************************************************/






/**************************************************************************
 *                          公共打包方法                                    *
 **************************************************************************/
gulp.task('copySourceCoceHttpx',function () {
    return gulp.src(['./SourceCode/httpx/lib/index.js']).pipe(gulp.dest('./node_modules/httpx/lib'));
});
gulp.task('css-min',function () {
    var env = argv.p || !argv.d;
    gulp.src("./public/stylesheets/**/*.less")
        .pipe(less())
        .pipe(concat('jintoushou-main.css'))
        .pipe(gulp.dest('./public/css'))
        .pipe(rename({suffix:'.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('./dist/'+env+'/public/css'));
});
gulp.task('js-min',function(){
    var env = argv.p || !argv.d;
    var mod = argv.m || 'all';
    deployTool.jsMin(gulp,deployTool.jsMinAndReplaceHtmlAndRevOptions(env,mod));
});
gulp.task('htmlReplace', function() {
    var env = argv.p || !argv.d;
    var mod = argv.m || 'all';
    deployTool.htmlReplace(gulp,deployTool.jsMinAndReplaceHtmlAndRevOptions(env,mod));
});
gulp.task('rev', function() {
    var env = argv.p || !argv.d;
    var mod = argv.m || 'all';
    deployTool.revFileFromRevJsonFile(gulp,deployTool.jsMinAndReplaceHtmlAndRevOptions(env,mod));
});
gulp.task('copy',function () {
    var env = argv.p || !argv.d;
    return gulp.src([
        './bin/**/*',
        './views/**/*',
        './routes/**/*',
        './public/libs/**/*',
        './public/fonts/**/*',
        './components/**/*',
        './app.js',
        './package.json',
        './pm2-web-config.json',
        //'./node_modules/**/*',
    ], {base: './'})
        .pipe(gulp.dest('./dist/'+env))
});

gulp.task('copy-fonts',function () {
    var env = argv.p || !argv.d;
    return gulp.src([
        './public/stylesheets/font-awesome.min.css',
    ], {base: './'})
        .pipe(gulp.dest('./dist/'+env))
});

gulp.task('copy-config',function () {
    var env = argv.p || !argv.d;
    return gulp.src([
        './config/'+env+'/config.js'
    ], {base: './config/'+env+'/'})
        .pipe(gulp.dest('./dist/'+env+'/config'))
});
gulp.task('copy-pm2Config',function () {
    var env = argv.p || !argv.d;
    return gulp.src([
        './config/'+env+'/pm2Conf.json',
    ], {base: './config/'+env+'/'})
        .pipe(gulp.dest('./dist/'+env))
});
gulp.task('copy-favicon',function () {
    var env = argv.p || !argv.d;
    return gulp.src([
        './public/favicon.ico'
    ], {base: './'})
        .pipe(gulp.dest('./dist/'+env))
});
gulp.task('image-min', function() {
    var env = argv.p || !argv.d;
    return gulp.src('./public/images/**/*.{png,jpg,gif,jpeg}')
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('./dist/'+env+'/public/images'));
});
gulp.task('buildEnv',['jshint','cleanAll','copySourceCoceHttpx']);
/**************************************************************************
 *                                                                        *
 **************************************************************************/

