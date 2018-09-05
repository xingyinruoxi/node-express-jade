/**
 * Created by ui on 17/5/23.
 */
'use strict';
window.noticeList = (function () {
    var ajax = window.Rui.Ajax,
        pageSize = 5,
        totalCount = 0,
        getPage = window.Rui.getPage,
        date=window.Rui.Date;
    //获取HTML
    function getListHtml(datalist) {
        var html = '', max, dataList;
        if (datalist) {
            html = '', max = datalist.length, dataList = datalist;
            for (var i = 0; i < max; i++) {
                html+='<li><a href="detail'+dataList[i].id+'.html">'+dataList[i].topic+'<span>'+date.formatDateTime(dataList[i].createTime)+'</span></a></li>';
            }
        }else{
            html='<div class="text-center color-gray pad-top-40 pad-bottom-40 font24">暂无数据</div>'
        }
        $('#noticeList').empty().append(html);
    }
    //获取新闻列表数据
    function getNewsList(pageNo, callback) {
        var paras = {
            mdname: '/get_noticeList.json',
            data: {
                needCount: true,
                pageNo: pageNo,
                pageSize: pageSize,
            }
        };
        ajax(paras, callback);
    }
    function start() {

        console.log(123);
        //获取新闻列表数据
        getNewsList(1, function (res) {
            totalCount = res.totalCount;
            getListHtml(res.data);
            getPage.start(Math.ceil(totalCount/pageSize), function (pNo) {
                console.log('点击了一次，触发回调,当前是页数为：', 1);
                getNewsList(pNo, function (res) {
                    getListHtml(res.data);
                });

            });
        });
    }
    return {
        start: start
    }
}()).start();