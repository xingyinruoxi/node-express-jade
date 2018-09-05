'use strict';
window.accountoverview = (function () {
    var ajax = window.Rui.Ajax,
        tool = window.Rui.Tool,
        date = window.Rui.Date,
        pageSize = 5,
        totalCount = 0,
        RepayStatus=JSON.parse($('#RepayStatus').val()),
        getPage = window.Rui.getPage;

    //账户总览提示
    function tip() {
        $('.icos .ico').each(function () {
            var $tip = $(this).find('.text');
            $tip.css('left', -$tip.outerWidth() / 2);
        });
    }
    //渲染列表交易记录
    function nodate(num) {
        var text='';
        switch (num) {
            case '0':
                text='暂无交易记录';
                break;
            case '1':
                text='暂无充值记录';
                break;
            case '2':
                text='暂无提现记录';
                break;
            case '3':
                text='暂无投资记录';
                break;
            case '4':
                text='暂无回款记录';
                break;
            case '5':
                text='暂无还本记录';
                break;
        }
        return text;
    }
    function getListHtml(type,datalist) {
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
                /*switch (datalist[i].status) {
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
                }*/
                html += '</tr>';
            }
        } else {
            html = '<tr><td colspan="5" class="font16"><p class="pad-top-30 pad-bottom-30">'+nodate(type)+'</p></td></tr>';
        }

        $('tbody.trlist1').empty().append(html);
    }
    // 渲染还款计划
    function getListHtml2(datalist) {
        var html = '', max;
        if (datalist.length) {
            max = datalist.length;
            for (var i = 0; i < max; i++) {
                html += '<tr>';
                html += '<td >' + date.formatDateTime(datalist[i].payDate) + '</td>';
                html += '<td>' + datalist[i].name + '</td>';
                html += '<td>' + tool.nfmoney(datalist[i].payAmount) + '</td>';
                html += '<td>' + RepayStatus[datalist[i].repayStatus] + '</td>';
                html += '</tr>';
            }
        } else {
            html = '<tr><td colspan="5" class="font16"><p class="pad-top-30 pad-bottom-30">暂无还款计划</p></td></tr>';
        }
        $('tbody.paylist').empty().append(html);
    }


    //请求本月还款计划
    function getrepaylist(pageNo, callback) {
        var paras = {
            mdname: '/get_repaymonth.json',
            data: {
                needCount: true,
                pageNo: pageNo,
                pageSize: pageSize
            }
        };
        ajax(paras, callback);
    }

    //请求交易记录
    function gethistorylist(type, pageno) {
        var historylist = {
            mdname: '/get_dealhistory.json',
            data: {
                needCount: true,
                pageNo: pageno,
                pageSize: 5,
                type: type
            }
        };
        ajax(historylist, function (res) {
            getListHtml(type,res.list);
        });
    }

    //点击变色事件
    $('ul.nav_pills li a').click(function () {
        $(this).parent().addClass('active').siblings().removeClass('active');
        gethistorylist($(this).attr('value'), 1);
    });

    function start() {
        //账户总览提示
        tip();
        //请求交易记录
        gethistorylist('0', 1);

        //请求本月还款计划
        getrepaylist(1, function (res) {
            totalCount = res.data.repayments.totalCount;
            $('#shouldPay').text(tool.nfmoney(res.data.shouldPay));
            $('#hasPay').text(tool.nfmoney(res.data.hasPay));
            getListHtml2(res.data.repayments.list);
            getPage.start(Math.ceil(totalCount/pageSize), function (pNo) {
                getrepaylist(pNo, function (res) {
                    getListHtml2(res.data.repayments.list);
                });

            });
        });
        
    }

    return {start: start}
}()).start();

