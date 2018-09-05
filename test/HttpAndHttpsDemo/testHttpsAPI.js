var https = require("https");
var iconv = require("iconv-lite");
var appid = '123123123';
var secret = '123123123';
var code = 'asdfasdfasdf';
var url="https://api.weixin.qq.com/sns/oauth2/access_token?appid="+appid+"&secret="+secret+"&code="+code+"&grant_type=authorization_code";
https.get(url, function (res) {
    var datas = [];
    var size = 0;
    res.on('data', function (data) {
        datas.push(data);
        size += data.length;

        //process.stdout.write(data);
    });
    res.on("end", function () {
        var buff = Buffer.concat(datas, size);
        var result = iconv.decode(buff, "utf8");//转码//var result = buff.toString();//不需要转编码,直接tostring
        console.log(result);
    });
}).on("error", function (err) {
    Logger.error(err.stack)
    callback.apply(null);
});

