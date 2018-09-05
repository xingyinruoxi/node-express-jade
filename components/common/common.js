'use strict';
/**
 * 整体设置token to session的公共方法
 * @param req
 * @param result
 * @returns {boolean}
 */
exports.setSession = function(req,result){
    var data=result.data,ses=req.session;
    if(result && result.success === true){//sign up success
        if(data.tokenVO.token&&data.userInfoVO.mobile){
            ses.tokenExpTime = data.tokenVO.expTime;
            ses.token = data.tokenVO.token;
            ses.ticket = data.tokenVO.ticket;
            ses.reloadToken = 'no';
            ses.message=data.userInfoVO.unReadCount;
            ses.username=data.userInfoVO.realName || data.userInfoVO.mobile;
            ses.signinCount&&(ses.signinCount = 0);
            return true;
        }
    }
    return false;
};

exports.checkCSRF= function (req) {
    console.log('#####',req.body.signToken,req.body.signTicket,req.session.signToken,req.session.signTicket);
    if(this.isEmpty(req.body.signToken) || req.session.signToken !== req.body.signToken
        ||this.isEmpty(req.body.signTicket)|| req.session.signTicket !== req.body.signTicket){
        return false;
    }
    return true;
};
/**
 * 随机产生相关位数的随机数
 * @param randomFlag
 * @param min
 * @param max
 * @returns {string}
 */
exports.getRandomString = function randomWord(randomFlag, min, max){
    var str = '',
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        var pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
};

/**
 * 判断是否为空
 * @param data
 * @returns {boolean}
 */
exports.isEmpty = function(data){
    return (data === '' || data === undefined || data === null) ? true : false;
};

exports.ishas=function(value){
    return (value === '' || value === undefined || value === null) ? '暂无数据' : value;
};

/**
 * 手机号中间5位进行字符替换
 * @param str
 * @returns {string|void|XML|*}
 */
exports.cellphoneNumToStar = function (str) {

  return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};
/**
 * 验证图片验证码和session保存的验证码是否一致
 * @param vcode
 * @param sessCode
 * @returns {boolean}
 */
exports.validateVCode = function(vcode,sessCode){
    if (!this.isEmpty(vcode)
        && !this.isEmpty(sessCode)
        && vcode.toLowerCase() === sessCode.toLowerCase()){
        return true;
    }
    return false;
};


/**转换金额
 * s:金额（单位：默认为分）
 * power:10的几次冥次方（默认为-2）
 * n:保留几位小数（默认为2）
 * type:s的类型（默认为金额）'':为金额，'z'为非金额
 */
exports.nfmoney = function (s, power,n,type) {
    var fuzhi=false;
    if(s===''||s===undefined||s===null){return '暂无数据';}
    if(s<0){
        fuzhi=true;
        s=Math.abs(s);
    }
    power=(type!=='z')?(power||-2):power;
    s = (parseFloat(s) * Math.pow(10,power));
    n = n >= 0 && n <= 20 ? n : 2;
    s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
    var l = s.split('.')[0].split('').reverse(),
        r = (type==='z'&&n===0)?'':(n===0?'':s.split('.')[1]);
    var t = '';
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) != l.length ? ',' : '');
    }
    return (fuzhi?'-':'')+t.split('').reverse().join('') + (r!==''?('.' + r):'');
};


//格式化时间
exports.formatDateTime=function(inputTime,type) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    //return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
    return type==='hms'?(y + '-' + m + '-' + d+' '+h+':'+minute+':'+second):(y + '-' + m + '-' + d);
};