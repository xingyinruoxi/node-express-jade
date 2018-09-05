/**
 * Created by a110 on 17/5/9.
 */
'use strict';
window.redpacket = (function () {
    var ajax = window.Rui.Ajax,
        pageSize = 10,
        totalCount = 0,
        tool = window.Rui.Tool,
        date = window.Rui.Date,
        getPage = window.Rui.getPage,
        activityRules = JSON.parse($('#activityRules').val()),
        currenttype = 0;

    function gethtmlRule(data) {
        var html = '';
        for (var i in data) {
            html += '<div>出借≥' + data[i].limit + '天，出借' + tool.nfmoney(data[i].minAmount/100,'0','2') + '元可用;</div>';
        }
        return html;
    }
    function status(data) {
        var status='';
        switch (data){
            case '1':
                status= '可使用';
                break;
            case '2':
                status= '已过期';
                break;
            default:
                status= '已使用';
        }
        return status;
    }
    function getListHtml(datalist) {
        var html='',max,dataList;
        console.log(333333,datalist);
        if (datalist.length) {
            html = '', max = datalist.length, dataList = datalist;
            for (var i = 0; i < max; i++) {
                html += '<tr class=' + (dataList[i].status === '1' ? 'color-red' : '')
                    + '><td>' + tool.nfmoney(dataList[i].amount) + '</td><td>' +activityRules[dataList[i].source]
                    + '</td><td>' + gethtmlRule(JSON.parse(datalist[i].rule)) + '适用于：'
                    + dataList[i].productType + '</td><td>' + date.formatDateTime(dataList[i].startTime)
                    + '<div>至</div>' + date.formatDateTime(dataList[i].endTime)
                    + '</td><td>' + status(dataList[i].status) + '</td></tr>';
            }
        }else{
            html = '<tr><td colspan="5" class="font16"><p class="pad-top-30 pad-bottom-30">暂无数据</p></td></tr>';
        }
        $('#userRedPacket').empty().append(html);
    }

    //账户获取红包总览
    function getRedpacketamout() {
        var paras = {
            mdname: '/get_redpacketamout.json',
            data: {}
        };
        ajax(paras, function (res) {
            if(res.success===true){
                $('#totalAmount').text(tool.nfmoney(res.data.totalAmount));
                $('#loseAmount').text(tool.nfmoney(res.data.loseAmount));
                $('#unUseAmount').text(tool.nfmoney(res.data.unUseAmount));
                $('#useAmount').text(tool.nfmoney(res.data.useAmount));
            }else{
                $('#totalAmount,#loseAmount,#unUseAmount,#useAmount').text('暂无数据');
            }

        });
    }
    //获取红包
    function getUserRedpacket(num,pageNo, callback) {
        var paras = {
            mdname: '/get_redpacket.json',
            data: {
                needCount:true,
                pageNo:pageNo,
                pageSize:pageSize,
                type:num
            }
        };

        ajax(paras, callback);
    }

    //初始化并绑定分页
    function bindInit(){
        getUserRedpacket(currenttype,1, function (res) {
            totalCount = res.totalCount;
            console.log(res.totalCount);
            getListHtml(res.data);
            getPage.start(Math.ceil(totalCount/pageSize), function (pNo) {
                console.log(111,'点击了一次，触发回调,当前是页数为：', currenttype,pNo);
                getUserRedpacket(currenttype,pNo, function (res) {
                    getListHtml(res.data);
                });

            });
        });
    }

    //点击获取红包类型
    function clickGetUserRedpacket() {
        $('#redpacketType').find('a').on('click',function () {
            $(this).closest('li').addClass('active').siblings().removeClass('active');
            currenttype=$(this).closest('li').index();
            bindInit();
        });
    }

    function start() {
        //账户获取红包总览
        getRedpacketamout();
        //默认获取红包类型
        bindInit();
        //点击获取红包类型
        clickGetUserRedpacket();
    }

    return {start: start}
}()).start();