'use strict';
var express = require('express');
var router = express.Router();

//首页
router.use('/',require('./r_index'));

//404
router.use('/',require('./r_404'));

//公共api
router.use('/',require('./commonAPI/r_commonapi'));

/**
 * aboutus 关于我们
 * */
router.use('/',require('./aboutus/r_gsjs'));//公司介绍
router.use('/',require('./aboutus/r_mediadetail'));//媒体报道详情
router.use('/',require('./aboutus/r_medialist'));//媒体报道
router.use('/',require('./aboutus/r_noticedetail'));//通知公告详情
router.use('/',require('./aboutus/r_noticelist'));//通知公告


/**
 * account 我的账户
 * */
router.use('/',require('./account/r_accountOverview'));//我的账户-账户总览
router.use('/',require('./account/r_bankAccountInfo'));//我的账户-银行存管账户信息
router.use('/',require('./account/r_dealhistory'));//我的账户-提现记录
router.use('/',require('./account/r_friendhistory'));//好友投资记录
router.use('/',require('./account/r_getcash'));//我的账户-提现

router.use('/',require('./account/r_getcashfail'));//我的账户-提现
router.use('/',require('./account/r_getcashsuccess'));//我的账户-提现
router.use('/',require('./account/r_invitedfriends'));//我的账户-邀请好友
router.use('/',require('./account/r_message'));//站内信
router.use('/',require('./account/r_myfriends'));// 我的好友

router.use('/',require('./account/r_myrepayment'));//我的账户-加息券
router.use('/',require('./account/r_rateCoupon'));//我的账户-我要充值
router.use('/',require('./account/r_recharge'));//我的账户-我要充值
router.use('/',require('./account/r_rechargehistory'));//我的账户-充值记录
router.use('/',require('./account/r_getcashhistory'));//我的账户-提现记录
router.use('/',require('./account/r_rechargeFail'));//我的账户-充值失败
router.use('/',require('./account/r_rechargeSuccess'));//我的账户-充值成功

router.use('/',require('./account/r_redPacket'));//我的账户-抵现红包
router.use('/',require('./account/r_securitysetup'));//我的账户-安全设置
router.use('/',require('./account/r_repaymentdetail'));//我的账户-我的项目二级

/**
 * activity 活动中心
 * */
router.use('/',require('./activity/r_activity'));
router.use('/',require('./activity/r_activityMark'));
router.use('/',require('./activity/r_activityguide'));


/**
 * help 帮助中心
 * */
router.use('/',require('./help/r_help'));//帮助中心
router.use('/',require('./help/r_rmwt'));//热门问题
router.use('/',require('./help/r_tzzjy'));//投资者教育
router.use('/',require('./help/r_tzzjydetail'));//投资者教育详情页
router.use('/',require('./help/r_wtfl'));//问题分类
router.use('/',require('./help/r_wzdt'));//网站地图

/**
 * product 产品
 * */
router.use('/',require('./product/r_currentonsale'));//当前在售列表
router.use('/',require('./product/r_factoring'));//保理列表
router.use('/',require('./product/r_listbullionbill'));//票据列表
router.use('/',require('./product/r_productConfirm'));//投资确认
router.use('/',require('./product/r_productdetail'));//投资详情

router.use('/',require('./product/r_productFail'));//投资失败
router.use('/',require('./product/r_productSuccess'));//投资成功


/**
 * security 安全保障
 * */
router.use('/',require('./security/r_flsm'));//法律声明
router.use('/',require('./security/r_ptbz'));//平台保障
router.use('/',require('./security/r_ywms'));//业务模式


/**
 * userSign 用户中心
 * */
router.use('/',require('./userSign/r_signin'));//登录
router.use('/',require('./userSign/r_signup'));//注册
router.use('/',require('./userSign/r_signupSuccess'));//注册成功
router.use('/',require('./userSign/r_authfail'));//登录、注册、忘记密码失败
router.use('/',require('./userSign/r_forgetpwdStart'));//找回密码码第一步

router.use('/',require('./userSign/r_forgetpwdMiddle'));//找回密码第二步
router.use('/',require('./userSign/r_forgetpwdFinish'));//找回密码成功
router.use('/',require('./userSign/r_logout'));//用户退出
router.use('/',require('./userSign/r_register'));//注册协议


module.exports = router;