'use strict';
/**
 * 首页
 * */
exports.ALICLOUD_INDEX_API = '/gateway/index/info';//index api


/**
 * app.js
 * */
exports.ALICLOUD_INDEX_INIT = '/gateway/system/init';//初始化数据
exports.ALICLOUD_TOKEN_RELOAD = '/gateway/token/reload';//reload token


/**
 * 公共api
 * */
exports.ALICLOUD_ACCOUNT_CALCULATOR='/gateway/user/calculator';//收益计算//
exports.ALICLOUD_USER_INFO='/gateway/user/info';//登录成功返回数据


/**
 * aboutus 关于我们
 * */
exports.ALICLOUD_NEWS_DETAIL='/biz/news/byNewsId';//媒体报道详情
exports.ALICLOUD_NEWS_LIST='/biz/news/newsList';//媒体报道列表
exports.ALICLOUD_NOTICE_DETAIL='/biz/bulletin/byBulletinId';//通知公告详情
exports.ALICLOUD_NOTICE_LIST='/biz/bulletin/bulletinList';//通知公告列表


/**
 * account 我的账户
 * */
exports.ALICLOUD_ACCOUNT_ASSETDETAIL='/gateway/user/asset/detail';//获取用户资金明细
exports.ALICLOUD_ACCOUNT_REPAYMONTH='/gateway/repaymentMonth';// 本月还款计划
exports.ALICLOUD_BANK_LIST='/gateway/bank/list';//银行列表查询
exports.ALICLOUD_BANK_BRANCH_LIST='/gateway/bank/branch/name/search';//银行支行
exports.ALICLOUD_BANK_SMS='/gateway/bank/sms/req';//开户短信验证码

exports.ALICLOUD_BANK_ACCOUNT_OPEN='/gateway/bank/account/open';//银行开户账号信息
exports.ALICLOUD_ACCOUNT_DEALHISTORY='/gateway/traderRecord';// 交易记录
exports.ALICLOUD_ACCOUNT_FRIENDTRADELIST='/gateway/friendTradeList';// 好友投资列表
exports.ALICLOUD_ACCOUNT_TAKE='/gateway/user/account/withdraw';// 提现
exports.ALICLOUD_ACCOUNT_QRCREATE='/gateway/qr/create';//动态生成二维码 /gateway/auth/qr/create

exports.ALICLOUD_ACCOUNT_MESSAGE='/gateway/accountMessage';// 站内信
exports.ALICLOUD_ACCOUNT_READESTATE='/gateway/setStatusRead';// 改变为已读状态
exports.ALICLOUD_ACCOUNT_FRIENDLIST='/gateway/friendList';// 好友列表
exports.ALICLOUD_ACCOUNT_FRIENDSTATE='/gateway/isEmployee';// 是否为公司内部员工
exports.ALICLOUD_ACCOUNT_MYTRADETENDER='/gateway/myTradeTender';// 我的定期-已投

exports.ALICLOUD_ACCOUNT_MYTRADERREPAYMENT='/gateway/myTraderRepayment';// 我的定期-列表
exports.ALICLOUD_ACCOUNT_TRADERTOTAL='/gateway/myTraderRepaymentTotal';// 我的定期-统计
exports.ALICLOUD_ACCOUNT_COUPONAMOUT='/gateway/userCoupon/getUserPacketAmout';//账户获取加息券总览
exports.ALICLOUD_ACCOUNT_COUPON='/gateway/userCoupon/queryUserCoupon';//账户获取加息券详情
exports.ALICLOUD_ACCOUNT_RECHARGE='/gateway/user/account/recharge';//充值

exports.ALICLOUD_ACCOUNT_REDPACKETAMOUT='/gateway/userRedPacket/getUserPacketAmout';//账户获取红包总览
exports.ALICLOUD_ACCOUNT_REDPACKET='/gateway/userRedPacket/queryUserRedPacket';//账户获取红包详情
exports.ALICLOUD_ACCOUNT_RISKINFO='/gateway/riskInfo';//用户风险测评次数
exports.ALICLOUD_ACCOUNT_SUBMITRISK='/gateway/submitRisk';//用户风险测评提交
exports.ALICLOUD_ACCOUNT_TRADEACCOUNTFLOW='/gateway/tradeAccountFlow';//查询充值提现记录


/**
 * activity 活动中心
 * */
exports.ALICLOUD_ACTIVITY_PAGEQUERY='/gateway/activity/pageQuery';// 活动列表


/**
 * help 帮助中心
 * */
exports.ALICLOUD_HELP_PROBLEM_CATEGORIES='/gateway/problem/categories';//帮助中心 查询问题种类统计
exports.ALICLOUD_HELP_PROBLEM_HOTCATEGORIES='/gateway/problem/hotcategories';// 帮助中心，热门问题查询
exports.ALICLOUD_HELP_PROBLEM_QUERY='/gateway/problem/query';// 帮助中心 查询问题种类统计
exports.ALICLOUD_HELP_PROBLEM_RESOLVED='/gateway/problem/resolved';// 帮助中心 查询问题种类统计


/**
 * product 产品
 * */
exports.ALICLOUD_PRODUCT='/gateway/product';//商品查询
exports.ALICLOUD_STATISTICS_CURRENT='/gateway/statistics/current';// 投资排行榜
exports.ALICLOUD_PRODUCT_QUERY='/gateway/product/query';//商品列表查询
exports.ALICLOUD_ACCOUNT_TRADEPAY='/gateway/trade/pay';//确认投资/gateway/auth/trade/pay
exports.ALICLOUD_ACCOUNT_REDPACKETLIST='/gateway/userRedPacket/getUseRedPacketList';//购买获取用户可用红包
exports.ALICLOUD_PRODUCT_TRADE_QUERY='/gateway/trade/query';//商品投资成功查询

exports.ALICLOUD_ACCOUNT_COUPONLIST='/gateway/userCoupon/getUseCouponList';//购买获取用户可用加息券
exports.ALICLOUD_ACCOUNT_SMSREQ='/gateway/bank/sms/req';//获取投资里的银行短信验证码
exports.ALICLOUD_ACCOUNT_BORROWER='/gateway/product/borrower';//根据id获取产品借款人信息
///gateway/trade/queryTenderUser
exports.ALICLOUD_ACCOUNT_QUERYTENDERUSER='/gateway/trade/queryTenderUser';//根据产品id查询投资记录

/**
 * security 安全保障
 * */


/**
 * userSign 用户中心
 * */
exports.ALICLOUD_SMS_SEND = '/gateway/sms/send';//短信
exports.ALICLOUD_SMS_VALIDATE = '/gateway/sms/validate';//
exports.ALICLOUD_FORGETPWD_API = '/gateway/user/password/reset';//resetpwd api 忘记密码
exports.ALICLOUD_USER_VALIDATEMOBILE='/gateway/user/validateMobile';//验证手机号是否存在
exports.ALICLOUD_GET_VCODE = '/gateway/validate/getImgCode';//图片验证码，从后台获取

exports.ALICLOUD_GET_CHECKVCODE='/gateway/validate/checkImageCode';//图片验证码校验，从后台校验
exports.ALICLOUD_SIGNUP_API = '/gateway/user/new';//signup api
exports.ALICLOUD_SIGNIN_API = '/gateway/user/login';//signin api
exports.ALICLOUD_SIGNIN_API_M = '/gateway/user/sms/login';//手机动态登录







