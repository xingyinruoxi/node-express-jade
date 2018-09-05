'use strict';
window.accountoverview = (function () {
    var ajax = window.Rui.Ajax,
        tool = window.Rui.Tool,
        date = window.Rui.Date,
        starttime,
        endtime,
        pageSize = 3,
        totalCount = 0,
        getPage = window.Rui.getPage;

    //账户总览提示
    function tip() {
        $('.icos .ico').each(function () {
            var $tip = $(this).find('.text');
            $tip.css('left', -$tip.outerWidth() / 2);
        });
    }
    //渲染列表交易记录
    function getListHtml(datalist) {
        console.log(datalist);
        var html = '', max;
        if (datalist.length) {
            max = datalist.length;
            for (var i = 0; i < max; i++) {
                var time = new Date(datalist[i].time).toLocaleString();
                var amount = datalist[i].amount.toFixed(2);
                html += '<tr>';
                html += '<td >' + time + '</td>';
                html += '<td>' + datalist[i].type + '</td>';
                html += '<td>' + datalist[i].info + '</td>';
                html += '<td>' + tool.nfmoney(amount) + '</td>';
                switch (datalist[i].status) {
                    case 'init':
                        html += '<td>' + '处理中' + '</td>';
                        break;
                    case 'expire':
                        html += '<td>' + '投资失败' + '</td>';
                        break;
                    case 'success':
                        html += '<td>' + '交易成功' + '</td>';
                        break;
                    case 'flow':
                        html += '<td>' + '投资流标' + '</td>';
                        break;
                    default:
                        html += '<td>' + '成功' + '</td>';
                }
                html += '</tr>';
            }
        } else {
            html = '<tr><td colspan="5" class="font16"><p class="pad-top-30 pad-bottom-30">暂无交易记录</p></td></tr>';
        }

        $('tbody.trlist1').empty().append(html);
    }

    function getListHtml2(datalist) {
        console.log(datalist);
        var html = '', max;
        if (datalist.length) {
            max = datalist.length;
            for (var i = 0; i < max; i++) {
                var payAmount = datalist[i].payAmount.toFixed(2);
                var payDate = date.formatDateTime(datalist[i].payDate);
                html += '<tr>';
                html += '<td >' + payDate + '</td>';
                html += '<td>' + datalist[i].name + '</td>';
                html += '<td>' + tool.nfmoney(payAmount) + '</td>';
                switch (datalist[i].repayStatus) {
                    case 'init':
                        html += '<td>' + '初始状态' + '</td>';
                        break;
                    case 'repay':
                        html += '<td>' + '已还款' + '</td>';
                        break;
                    case 'unrepay':
                        html += '<td>' + '未还款' + '</td>';
                        break;
                }
                html += '</tr>';
            }
        } else {
            html = '<tr><td colspan="5" class="font16"><p class="pad-top-30 pad-bottom-30">暂无还款计划</p></td></tr>';
        }
        $('tbody.paylist').empty().append(html);
    }

    //请求还款列表
    function getrepaylistdata(pageNo, fn) {
        var repaylist = {
            mdname: '/get_repaymonth.json',
            data: {
                needCount: true,
                pageNo: pageNo,
                pageSize: pageSize
            }
        };
        ajax(repaylist, function (res) {
            fn(res)
        })
    }

    //请求本月还款计划
    function getrepaylist(pageNo) {
        getrepaylistdata(pageNo, function (res) {
            var data=res.data.data;
                totalCount = data.repayments.totalCount;
            $('#datemonth').html(data.time);
            $('#hasPay').html(tool.nfmoney(data.hasPay));
            $('#shouldPay').html(tool.nfmoney(data.shouldPay));
            getListHtml2(data.repayments.list);
            console.log(res);
            getPage.start(Math.ceil(totalCount / pageSize), function (pNo) {
                console.log('点击了一次，触发回调,当前是页数为：', pNo);
                getrepaylistdata(pNo, function (res) {
                    getListHtml2(data.repayments.list);
                })
            })
        })

    }

    //请求交易记录
    function gethistorylist(type, pageno, starttime, endtime) {
        var historylist = {
            mdname: '/get_dealhistory.json',
            data: {
                needCount: true,
                pageNo: pageno,
                pageSize: pageSize,
                type: type,
                starttime: starttime,
                endtime: endtime
            }
        };
        ajax(historylist, function (res) {
            var totalCount = res.data.totalCount;
            getListHtml(res.data.list);
            console.log(res.data.list);
        });
    }

    //点击变色事件
    $('ul.nav_pills li a').click(function () {
        $(this).parent().addClass('active').siblings().removeClass('active');
        console.log($(this).attr('value'));
        gethistorylist($(this).attr('value'), 1, starttime, endtime);
    });

    function start() {
        //账户总览提示
        tip();

        //请求交易记录
        gethistorylist(1, 1);

        //请求本月还款计划
        getrepaylist(1)
    }

    return {start: start}
}()).start();

