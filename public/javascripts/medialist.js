/**
 * Created by ui on 17/5/23.
 */
'use strict';
window.newsList = (function () {
    var ajax = window.Rui.Ajax,
        pageSize = 5,
        totalCount = 0,
        getPage = window.Rui.getPage,
        date=window.Rui.Date;
    //获取HTML
    function getListHtml(datalist) {
        var html='',max,dataList;
        if (datalist) {
            html = '', max = datalist.length, dataList = datalist;
            for (var i = 0; i < max; i++) {
                html += '<li class="list">'
                    + ' <div class="list_body">'
                    + ' <h4><a href="detail'+dataList[i].id+'.html">'+dataList[i].title+'</a></h4>'
                    + '  <p>'+dataList[i].descriptions+'</p>'
                    + '  <time class="color-gray">'+date.formatDateTime(dataList[i].reportDate)+'</time><span class="color-gray">文章来源： '+dataList[i].source+'</span>'
                    + ' </div>'
                    + ' <div class="list_link">'
                    + ' <a href="detail'+dataList[i].id+'.html"><img src="'+dataList[i].coverImgAlt+'" width="194" height="132"></a>'
                    + ' </div>'
                    + '</li>';
            }
        }else{
            html='<div class="text-center color-gray pad-top-40 pad-bottom-40 font24">暂无数据</div>'
        }

        $('#newsList').empty().append(html);
    }
    //获取新闻列表数据
    function getNewsList(pageNo, callback) {
        var paras = {
            mdname: '/get_newsList.json',
            data: {
                needCount: true,
                pageNo: pageNo,
                pageSize: pageSize,
                types:'mediaReport',
            }
        };
        ajax(paras, callback);
    }
    function start() {
        //获取新闻列表数据
        getNewsList(1, function (res) {
            totalCount = res.totalCount;
            getListHtml(res.list);
            getPage.start(Math.ceil(totalCount/pageSize), function (pNo) {
                getNewsList(pNo, function (res) {
                    getListHtml(res.list);
                });
            });
        });
    }
    return {
        start: start
    }
}()).start();