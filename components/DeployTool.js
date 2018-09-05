'use strict';
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
    map = require('map-stream'),
    browserSync = require('browser-sync'),
    shell = require('gulp-shell'),
    htmlReplace = require('gulp-html-replace');

var deployTool = function () {};
deployTool.jsMin = function(gulp,options){
    //console.log('revFilePath',options.revFilePath);
    //console.log(1111,options.destName,options.tempDest,options.distPath,options.revFilePath);
    gulp.src(options.src)
        .pipe(concat(options.destName))
        .pipe(gulp.dest(options.tempDest))
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe(rev())
        //.pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(options.distPath))
        .pipe(rev.manifest())
        .pipe(gulp.dest(options.revFilePath))
    ;
};
//替换jade文件中build：js 或者 build：css的工具
deployTool.htmlReplace = function(gulp,options){
    //console.log(333333,options.replaceSrc);
    gulp.src(options.replaceSrc)
        .pipe(htmlReplace(options.replaceOptions))
        .pipe(gulp.dest(options.replaceDestPath));
};
//通过json文件更换js或者css的路径，带md5
deployTool.revFileFromRevJsonFile = function (gulp,options) {
    gulp.src(options.revSrc)   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())                                   //- 执行文件内css名的替换
        .pipe(gulp.dest(options.revDestPath));
};

deployTool.jsMinAndReplaceHtmlAndRevOptions = function (env,filenames){
    //console.log('11111filenames:' + filenames);
    var aa='name1,name2';
    //console.log(5555,aa.split('|'));


    //filenames = eval(filenames);
    filenames=filenames.split(',');
    //console.log(444,filenames);

    var _fileNames = ['./public/javascripts/webcom.js'];
    for(var i=0; i<filenames.length; i++){
        _fileNames[i+1] = './public/javascripts/' + filenames[i] + '.js';
        //console.log('_fileNames'+(i+1) + ':' + filenames[i]);
    }
    var filename = filenames[filenames.length-1];
    var repfilename=filename.substring(filename.indexOf('/')+1);
    //console.log('filename:' + filenames[filenames.length-1]);
    var refilename=filename.substring(0,filename.indexOf('/'))
    //console.log(33333,_fileNames,filename,refilename,refilename&&'/'+refilename);
    return {
        //src:['./public/javascripts/webcom.js','./public/javascripts/'+filename+'.js'],
        src:_fileNames,
        destName : filename+'.js',
        tempDest :  './public/js',
        distPath : './dist/'+env+'/public/js',
        revFilePath : './revfiles/'+env+'/js/'+filename,
        replaceSrc : './dist/'+env+'/views/jslib/'+filename+'js.jade',
        replaceOptions : {'js': '/js/'+filename+'.js'},
        replaceDestPath : './dist/'+env+'/views/jslib'+(refilename&&'/'+refilename),
        revSrc : ['./revfiles/'+env+'/js/'+filename+'/*.json', './dist/'+env+'/views/jslib/'+filename+'js.jade'],
        revDestPath : './dist/'+env+'/views/jslib/'+(refilename&&'/'+refilename)
    }
};


module.exports = deployTool;