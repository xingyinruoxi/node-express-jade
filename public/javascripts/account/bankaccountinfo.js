/**
 * Created by yangrui on 17/4/21.
 */
'use strict';
window.bankaccountinfo = (function () {
    var check = window.Rui.Check,
        ajax = window.Rui.Ajax,
        tool=window.Rui.Tool,
        onOff=true,
        isagree=false,
        listcheck = {
            userName: false,
            userNamechecked: false,
            certNo: false,
            certNochecked: false,
            otherAccNo: false,
            otherAccNochecked: false,
            branchNo: false,
            branchNochecked: false,
            mobile: false,
            mobilechecked: false,
            mobileCode: false,
            mobileCodechecked: false,
        };

    var layer=window.layer||{};


    //开通结果弹层
    function layerBankOpen(btnText,content,onOff,href) {
        layer.open({
            type: 1//Page层类型
            ,skin: 'layui-layer-rim layui-layer-none'//加上边框
            ,area: ['464px','318px']
            ,shade: 0.4//遮罩透明度
            ,id: 'lay_open_result'
            ,title: '开通结果'
            ,btn:btnText
            ,btnAlign: 'c'
            ,anim: 0 //0-6的动画形式，-1不开启
            ,content: '<p style="padding-top: 30px"><i class="ico ico_success"></i></p><br><span class="text-center color-gray">'+content+'</span>'
            ,btn1:function () {
                if(onOff){
                    location.href=href;
                }else{
                    layer.closeAll();
                }
            }
        });
    }
    // 校验用户名
    function checkUserName(obj) {
        listcheck.userNamechecked=true;
        if (!check.isinput(obj.val())) {
            tool.alerttip(obj,'请填写您的真实姓名');
            listcheck.userName=false;
            return false;
        }
        if (!check.isUserName(obj.val())) {
            tool.alerttip(obj,'请填写您的真实姓名');
            listcheck.userName=false;
            return false;
        }
        tool.alerttip(obj,'','h');
        listcheck.userName=true;
        return true;
    }
    //校验身份证号
    function checkCertNo(obj) {
        listcheck.certNochecked=true;
        if (!check.isinput(obj.val())) {
            tool.alerttip(obj,'请填写身份证号码');
            listcheck.certNo=false;
            return false;
        }
        if (!check.isCertNo(obj.val())) {
            tool.alerttip(obj,'身份证号码填写错误，请重新填写');
            listcheck.certNo=false;
            return false;
        }
        tool.alerttip(obj,'','h');
        listcheck.certNo=true;
        return true;
    }
    //校验银行卡号
    function checkOtherAccNo(obj) {
        listcheck.otherAccNochecked=true;
        if (!check.isinput(obj.val())) {
            tool.alerttip(obj,'请填写银行卡号');
            listcheck.otherAccNo=false;
            return false;
        }
        if (!check.isOtherAccNo(obj.val())) {
            tool.alerttip(obj,'银行卡号填写错误，请重新填写');
            listcheck.otherAccNo=false;
            return false;
        }
        tool.alerttip(obj,'','h');
        listcheck.otherAccNo=true;
        return true;
    }
    //校验银行支行
    function checkBranchNo(obj) {
        listcheck.branchNochecked=true;
        if(!$('.bankType').attr('code')){
            $('.bankType').closest('li').find('.form-error').show().text('请选择开户银行');
            return false;
        }
        if (!check.isinput(obj.val())) {
            tool.alerttip(obj,'请填写银行支行信息');
            listcheck.branchNo=false;
            return false;
        }
        tool.alerttip(obj,'','h');
        listcheck.branchNo=true;
        return true;
    }
    //校验银行预留手机号
    function checkMobile(obj) {
        listcheck.mobilechecked=true;
        if (!check.isinput(obj.val())) {
            tool.alerttip(obj,'请填写银行预留手机号码');
            listcheck.mobile=false;
            return false;
        }
        if (!check.isSimpleTel(obj.val())) {
            tool.alerttip(obj,'银行预留手机号填写错误，请重新填写');
            listcheck.mobile=false;
            return false;
        }
        tool.alerttip(obj,'','h');
        listcheck.mobile=true;
        return true;
    }
    //校验银行手机号验证码
    function checkMobileCode(obj) {
        listcheck.mobileCodechecked=true;
        if (!check.isinput(obj.val())) {
            tool.alerttip(obj,'请填写手机验证码');
            listcheck.mobileCode=false;
            return false;
        }
        if (obj.val().length !== 6) {
            tool.alerttip(obj,'手机验证码填写错误,请重新填写');
            listcheck.mobileCode=false;
            return false;
        }
        tool.alerttip(obj,'','h');
        listcheck.mobileCode=true;
        return true;
    }
    //协议
    function checkRead() {
        if($('#checkRead').attr('checked') === 'checked'){
            isagree=true;
            $('#agree').hide();
            return true;
        }else{
            isagree=false;
            $('#agree').show();
            return false;
        }

    }

    //银行列表Html
    function bankListHtml(dataList) {
        var html='',max=dataList.length;
        for(var i=0;i<max;i++){
           // html+='<li><img src="/images/banks/YH'+dataList[i].code+'.png" code="'+dataList[i].code+'" name="'+dataList[i].name+'" quotaSingle="'+tool.nfmoney(dataList[i].quotaSingle)+'" quotaDaily="'+tool.nfmoney(dataList[i].quotaDaily)+'" ></li>';
            html+='<li code="'+dataList[i].code+'" quotaSingle="'+tool.nfmoney(dataList[i].quotaSingle)+'" quotaDaily="'+tool.nfmoney(dataList[i].quotaDaily)+'">'+dataList[i].name+'</li>';
        }
        $('#bankList').empty().append(html);
    }
    //银行支行列表Html
    function branchNoListHtml(dataList) {
        console.log(11111,dataList);
        var html='',max=dataList?dataList.length:0;
        if(max>0){
            for(var i=0;i<max;i++){
                html+='<li renhanghao="'+dataList[i].renhanghao+'">'+dataList[i].branchBankName+'</li>';
            }
            $('#branchNoList').empty().append(html).parent().show();
        }
    }

    //获取银行列表
    function getBankList(){
        var paras = {
            mdname: '/get_banklist.json',
            data: {
            }
        };
        ajax(paras, function (res) {
            bankListHtml(res.data);
        });
    }

    //开户银行支行查询
    function searchBranchNo() {
        $('#branchNo').on('keyup blur',function () {
            if(!$('.bankType').attr('code')){
                $('.bankType').closest('li').find('.form-error').show().text('请选择开户银行');
                return false;
            }
            var paras = {
                mdname: '/get_branchno.json',
                data: {
                    bankCode:$('.bankType').attr('code'),
                    branchBankName:$('#branchNo').val()
                }
            };
            ajax(paras, function (res) {
                if(res.success===true){
                    $('#branchNo').next().show();
                    branchNoListHtml(res.data);
                }else{
                    $('#branchNo').next().hide();
                }
            });
        });
    }
    //发送短信
    function sendMobilCode() {
        if (!checkMobile($('#mobile'))) {
            return false;
        }
        //倒计时
        window.Rui.countDown.Down('.btn_send_code',sendMobilCode);
        var paras= {
            mdname: '/sendmsg_bank.json',
            data: {
                mobile: $('#mobile').val(),
                type:1
            }
        };
        ajax(paras, function (res) {
            //console.log('银行短信数据：',res);
        });
    }
    //获取银行手机验证码
    function getBankSendVcode() {
        $('.btn_send_code').bind('click', function () {
            //发送短信
            sendMobilCode();
        });
    }



    //用户名失去焦点，校验用户名
    function checkUserNameAll() {
        $('#userName').on('blur', function () {
            checkUserName($(this));
        });
    }
    //身份证号失去焦点，校验身份证号
    function checkCertNoAll() {
        $('#certNo').on('blur', function () {
            checkCertNo($(this));
        });
    }
    //银行卡号失去焦点，校验银行卡号
    function checkOtherAccNoAll() {
        $('#otherAccNo').on('blur', function () {
            checkOtherAccNo($(this));
        });
    }
    //银行支行失去焦点，校验银行支行
    function checkBranchNoAll() {
        $('#branchNo').on('blur', function () {
            checkBranchNo($(this));
        });
    }
    //银行预留手机号失去焦点，校验手机号
    function checkMobileAll() {
        $('#mobile').on('blur', function () {
            checkMobile($(this));
        });
    }
    //手机验证码失去焦点，校验手机验证码
    function checkMobileCodeAll() {
        $('#mobileCode').on('blur', function () {
            if (!checkMobile($('#mobile'))) {
                return false;
            }
            checkMobileCode($(this));
        });
    }

    //发起开开通请求
    function bankOpen() {
        var paras = {
            mdname: '/bankOpen.json',
            data: {
                accountName: $('#userName').val(),
                branchNo: $('#branchNo').attr('renhanghao'),
                certNo:$('#certNo').val(),
                certType:'1',
                id: '2',
                bankCode:$('.bankType').attr('code'),
                mobile:$('#mobile').val(),
                mobileCode: $('#mobileCode').val(),
                otherAccno:$('#otherAccNo').val(),
                signToken: $('#signToken').val(),
                signTicket: $('#signTicket').val(),
            }
        };
        ajax(paras, function (res) {
            if(res.success === true){
                if(res.data.tipsMsgDto.flag==='1'){
                    var $bankAcountInfo=$('.dl_bankAcountInfo');
                    var $content1=$bankAcountInfo.find('.content').eq(0);
                    var $content2=$bankAcountInfo.find('.content').eq(1);
                    $content1.addClass('hidden');
                    $content2.removeClass('hidden').end()
                        .end().find('.username').text($('#userName').val())
                        .end().find('.certNo').text($('#certNo').val())
                        .end().find('.num').find('span').text(($('#otherAccNo').val()).substr($('#otherAccNo').val().length-4))
                        .end().end().find('.ico_bank').find('img').attr('src',$('.bankType').find('img').attr('src'))
                        .end().end().find('.bank_mobile').text($('#mobile').val())
                        .end().end().find('.bank_mobile').text($('#mobile').val());
                    if(res.data.cardType){
                        layerBankOpen('去充值','您已成功开通银行存管账户',true,'/user/recharge.html');
                    }else{
                        layerBankOpen('去投资','您已成功开通银行存管账户',true,'#');
                    }
                }else{
                    //layerBankOpen('重试',res.data.tipsMsgDto.errorMessage,false,'/');
                    layerBankOpen('重试',res.resultMsg,false,'/');
                }
            }else{
                layerBankOpen('重试',res.resultMsg,false,'/');
            }
        },'','',true);
    }
    //绑定点击是否同意事件
    function bindAgree() {
        $('#checkRead').bind('click', function () {
            checkRead();
        });
    }
    //点击开通
    function clickBankOpen(){
        $('#btn_submit').bind('click',function () {
            console.log('listcheck',listcheck);
            console.log('报数开始');
            var checkcount=0;
            console.log('检查 userName start 1');
            if(!listcheck.userNamechecked){
                console.log(1);
                checkUserName($('#userName'));
                if(listcheck.userName){
                    console.log(2);
                    checkcount++;
                }
            }else{
                console.log(3);
                if(listcheck.userName){
                    console.log(4);
                    checkcount++;
                }
                console.log(22222,onOff);
            }
            console.log('检查 userName end 1');

            console.log('检查 certNo start 2');
            if(!listcheck.certNochecked){
                console.log(1);
                checkCertNo($('#certNo'));
                if(listcheck.certNo){
                    console.log(2);
                    checkcount++;
                }
            }else{
                console.log(3);
                if(listcheck.certNo){
                    console.log(4);
                    checkcount++;
                }
            }
            console.log('检查 certNo end 2');

            console.log('检查 otherAccNo start 3');
            if(!listcheck.otherAccNochecked){
                console.log(1);
                checkOtherAccNo($('#otherAccNo'));
                if(listcheck.otherAccNo){
                    console.log(2);
                    checkcount++;
                }
            }else{
                console.log(3);
                if(listcheck.otherAccNo){
                    console.log(4);
                    checkcount++;
                }
            }
            console.log('检查 otherAccNo end 3');

            console.log('检查 branchNo start 4');
            if(!listcheck.branchNochecked){
                console.log(1);
                checkBranchNo($('#branchNo'));
                if(listcheck.branchNo){
                    console.log(2);
                    checkcount++;
                }
            }else{
                console.log(3);
                if(listcheck.branchNo){
                    console.log(4);
                    checkcount++;
                }
            }
            console.log('检查 branchNo end 4');

            console.log('检查 mobile start 5');
            if(!listcheck.mobilechecked){
                console.log(1);
                checkMobile($('#mobile'));
                if(listcheck.mobile){
                    console.log(2);
                    checkcount++;
                }
            }else{
                console.log(3);
                if(listcheck.mobile){
                    console.log(4);
                    checkcount++;
                }
            }
            console.log('检查 mobile end 5');

            console.log('检查 mobileCode start 6');
            if(!listcheck.mobileCodechecked){
                console.log(1);
                checkMobileCode($('#mobileCode'));
                if(listcheck.mobileCode){
                    console.log(2);
                    checkcount++;
                }
            }else{
                console.log(3);
                if(listcheck.mobileCode){
                    console.log(4);
                    checkcount++;
                }
            }
            console.log('检查 mobileCode end 6');

            console.log('检查 isagree start 7');
            if (isagree) {
                console.log(1);
                checkcount++;
            }
            console.log('检查 isagree end 7');

            /*var arrCheck=[
             checkUserName($('#userName')),
             checkCertNo($('#certNo')),
             checkOtherAccNo($('#otherAccNo')),
             checkBranchNo($('#branchNo')),
             checkMobile($('#mobile')),
             checkMobileCode($('#mobileCode')),
             checkRead()
             ];*/

            console.log('listcheck',listcheck);

            console.log('checkcount',checkcount);
            if(checkcount!==7){
                console.log('不通过');
                return false;
            }
            console.log('通过');
            //发起开开通请求
            bankOpen();
        });
    }
    function start() {

        //获取银行列表
        getBankList();
        //开户银行支行查询
        searchBranchNo();
        //用户名失去焦点，校验用户名
        checkUserNameAll();
        //身份证号失去焦点，校验身份证号
        checkCertNoAll();
        //银行卡号失去焦点，校验银行卡号
        checkOtherAccNoAll();
        //银行支行失去焦点，校验银行支行
        checkBranchNoAll();
        //银行预留手机号失去焦点，校验手机号
        checkMobileAll();
        //获取银行手机验证码
        getBankSendVcode();
        //手机验证码失去焦点，校验机验证码
        checkMobileCodeAll();
        //绑定点击是否同意事件
        bindAgree();
        //点击开通
        clickBankOpen();
    }
    return {start: start}
}()).start();
//选择银行支行
$(function () {
    $('#branchNoList').on('click','li',function () {
        $('#branchNo').val($(this).text());
        $('#branchNo').attr('renhanghao',$(this).attr('renhanghao'));
    });
});