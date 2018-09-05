/**
 * Created by ui on 17/5/23.
 */
'use strict';
window.reportList = (function () {
    var ajax = window.Rui.Ajax,
        date=window.Rui.Date;

    //获取HTML
    function getListHtml(datalist) {
        var html='',max,dataList;
        if (datalist) {
            html = '', max = datalist.length, dataList = datalist;
            for (var i = 0; i < max; i++) {
                html +='<li><a href="detail'+dataList[i].id+'.html">'+dataList[i].topic+'<span>'+date.formatDateTime(dataList[i].reportDate)+'</span></a></li>';
            }
        }else{
            html='<div class="text-center color-gray pad-top-40 pad-bottom-40 font24">暂无数据</div>'
        }
        $('#reportlist').empty().append(html);
    }
    //获取新闻详情数据
    function getReportlist(num) {
        var paras = {
            mdname: '/get_newsList.json',
            data: {
                needCount: false,
                types:'corporateReport'+num,
            }
        };
        ajax(paras, function (res) {
            getListHtml(res.list);
        });
    }

    //点击切换
    function clickGetReportList() {
        $('.report_list a').on('click',function () {
            getReportlist($(this).index()+1);
        });
    }
    function start() {
        //获取新闻详情数据
        getReportlist(1);
        //点击切换
        clickGetReportList();
    }
    return {
        start: start
    }
}()).start();