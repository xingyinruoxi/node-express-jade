/**
 * Created by a110 on 17/4/17.
 */
'use strict';
var express = require('express');
var router = express.Router();
var co = require('co');
var APIClient = require('../../components/APIClient/APIClient');
var APIPath = require('../../components/APIClient/APIPath');
var errorCodes = require('../../components/common/errorCode');

/* GET users listing. */
router.get('/xxpl/tzgg/', function(req, res) {
    var pageData = {
        seo : {
            title : '金投手活动信息_金投手媒体报道_金投手资讯信息-金投手官网',
            keywords : '金投手活动信息,金投手媒体报道,金投手资讯信息,金投手官网',
            discription : '金投手公司动态栏为用户展示更多关于社会媒体的关注和报道的新闻信息。'
        },
        curTab:'通知公告',
        curUrlTitle:'信息披露'
    };
    res.render('aboutus/noticelist',pageData);
});
//获取新闻列表数据
router.post('/get_noticeList.json', function (req, res) {
    var body = {
        needCount:req.body.needCount,
        pageNo:req.body.pageNo,
        pageSize:req.body.pageSize
    };
    //调用获取红包总览接口
    var result = {success: false};
    var data = {};
    co(function* () {
        try {
            data = yield APIClient.post(APIPath.ALICLOUD_NOTICE_LIST, {}, {}, body);
        } catch (e) {
            data = {};
            console.log('获取新闻列表异常：',e);
        } finally {
            if(data.success===true){
                result.success = true;
                result.data=data.list;
                result.totalCount=data.totalCount
            }else{
                result.success = false;
                result.msg = errorCodes.errorCode()[errorCodes.apiErrorCode()[data.errorCode]];
            }
        }
        res.json(result);
    });
});
module.exports = router;


