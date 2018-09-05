'use strict';
window.newsDetail = (function () {
    var ajax = window.Rui.Ajax,
        date=window.Rui.Date;
    //上一页，下一页
    function pagenew(prev, next) {
        var html = '';
            html += '<div class="pagenew">';
            if(prev){
                html += '<a href="detail' + prev.id + '.html">上一篇：' + prev.topic + '</a>';
            }
            if(next){
                html += '<a href="detail' + next.id + '.html">下一篇：' + next.topic + '</a>';
            }
            html += '</div>';

        return html;
    }
    //获取HTML
    function getDetailHtml(data) {
        var html='';
        html+='<h2 class="one">'+data.topic+'</h2>'
            +'<p class="two">来源：<span>'+data.source +'</span><i>时间：'+date.formatDateTime(data.reportDate) + '</i></p>'
            +'<div class="pad-top-30">'+data.content+'</div>'
            +pagenew(data.newsLastVO, data.newsNextVO);
        $('#tzzjyDetail').empty().append(html);
    }
    //获取新闻详情数据
    function getNewsDetail() {
        var paras = {
            mdname: '/get_newsDetail.json',
            data: {
                id:location.pathname.replace(/[^0-9]+/g, '')
            }
        };
        ajax(paras, function (res) {
            getDetailHtml(res.data);
        });
    }

    function start() {
        //获取新闻详情数据
        getNewsDetail();
    }
    return {start: start}
}()).start();