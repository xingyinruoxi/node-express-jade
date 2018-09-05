/**
 * Created by a110 on 17/5/9.
 */
'use strict';
window.ratecoupon = (function () {
    var ajax = window.Rui.Ajax,
        pageSize = 10,
        totalCount = 0,
        date=window.Rui.Date,
        tool = window.Rui.Tool,
        getPage = window.Rui.getPage,
        activityRules=JSON.parse($('#activityRules').val()),
        currenttype=0;

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
        if (datalist.length) {
            html = '', max = datalist.length, dataList = datalist;
            for (var i = 0; i < max; i++) {
                html += '<tr class=' + (dataList[i].status === '1' ? 'color-red' : '')
                    + '><td>' + tool.nfmoney(dataList[i].rate,'0',2) + '</td><td>' + activityRules[dataList[i].source]
                    + '</td><td><p>出借≥'+dataList[i].minInvestLimit+'天，出借'+tool.nfmoney(dataList[i].minInvestAmount)+'元可用;</p>适用于：'
                    + dataList[i].productType + '</td>'
                    + '<td>'+tool.nfmoney(dataList[i].maxRateAmount)+'/'+dataList[i].maxRateLimit+'</td>'
                    + '<td>' + date.formatDateTime(dataList[i].startTime)
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
            mdname: '/get_couponamout.json',
            data: {}
        };
        ajax(paras, function (res) {
            if(res.success===true){
                $('#earnAmount').text(tool.nfmoney(res.data.earnAmount));
                $('#loseAmount').text(res.data.loseAmount);
                $('#totalAmount').text(res.data.totalAmount);
                $('#useAmount').text(res.data.useAmount);
            }else{
                $('#earnAmount,#loseAmount,#totalAmount,#useAmount').text('暂无数据');
            }
        });
    }
    function move() {
        
    }
    //获取红包
    function getUserRedpacket(num,pageNo, callback) {
        var paras = {
            mdname: '/get_ratecoupon.json',
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
            console.log(3333,$(this).closest('li').index());
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