'use strict';
window.myrepayment = (function () {
    var end = window.end || {};
    var laydate = window.laydate || {};
    var ajax = window.Rui.Ajax,
        tool = window.Rui.Tool,
        date = window.Rui.Date,
        pageSize = 10,
        starttime='',
        endtime='',
        tradeStatus='',
        getPage = window.Rui.getPage,
        type = location.search.substr(-1,1),
        tradeStatusChinese ={
            success:'成功',
            init:'初始状态',
            processing:'处理中',
            fail:'失败'
        };
    
    // 渲染列表
    function getListHtml(datalist) {
        var html = '',
            max = datalist.length;
        if(max){
            for (var i = 0; i < max; i++) {
                html += '<tr>';
                html += '<td >'+date.formatDateTime(datalist[i].time,'hms')+'</td>';
                html += '<td>'+tool.nfmoney(datalist[i].amount)  +'</td>';
                html += '<td>'+tradeStatusChinese[datalist[i].status] +'</td>';
                html += '</tr>';
            }
        }else{
            html = '<tr><td colspan="5" class="font16">暂无'+(tradeStatusChinese[tradeStatus]||'')+'记录</td></tr>';
        }
        $('.trlist').empty().append(html);

    }
    //请求还款列表
    function tradingRecord(type, pageNo, tradeStatus, starttime, endtime,fn) {
        var param = {
            mdname: '/get_tradingRecord.json',
            data: {
                needCount: true,
                pageSize: pageSize,
                pageNo: pageNo,
                type: type,
                queryDateStart: starttime,
                queryDateEnd: endtime,
                tradeStatus: tradeStatus,
            }
        };
        ajax(param, fn)
    }
    // 分页请求
    function getPageTrading() {
        tradingRecord(type, 1, tradeStatus,starttime,endtime,function (res) {
            var totalCount = res.totalCount;
            getListHtml(res.list);
            getPage.start(Math.ceil(totalCount/pageSize), function (pNo) {
                tradingRecord(type,pNo,tradeStatus,starttime,endtime,function (res) {
                    getListHtml(res.list);
                });
            });
        });
    }

    var start1 = {
        elem: '#start',
        format: 'YYYY-MM-DD',
        // min: laydate.now(), //设定最小日期为当前日期
        max: '2099-06-16', //最大日期
        istime: true,
        istoday: false,
        choose: function (datas) {
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas; //将结束日的初始值设定为开始日
            // starttime = new Date(datas);
            starttime = (new Date(datas)).getTime();
            getPageTrading();
        }
    };
    end = {
        elem: '#end',
        format: 'YYYY-MM-DD',
        min: laydate.now(),
        max: '2099-06-16',
        istime: true,
        istoday: false,
        choose: function (datas) {
            start1.max = datas; //结束日选好后，重置开始日的最大日期
            // endtime = new Date(datas);
            endtime = (new Date(datas)).getTime();
            getPageTrading();
        }
    };
    laydate(start1);
    laydate(end);

    // 充值或提现
    function rechargeGetcash() {
        var html= (type==1)?'充值状态':'提现状态';
        $('.typeStatus').empty().append(html);
    }
    // 点击不同状态发请求
    function getStatus() {
        $('.nav_pills').find('li a').on('click',function () {
            $(this).closest('li').addClass('active').siblings().removeClass('active');
            tradeStatus = $(this).attr('value');
            getPageTrading();
        })
    }
    
    function start() {
        rechargeGetcash();//充值或提现状态
        getPageTrading();//初始值
        getStatus();//不同状态数据
    }

    return {start: start}
}()).start();


