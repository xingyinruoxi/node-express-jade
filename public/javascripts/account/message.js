
'use strict';
window.message = (function () {
    var end=window.end||{},
        ajax = window.Rui.Ajax,
        check = window.Rui.Check,
        pageSize = 5,
        totalCount = 0,
        state,
        getPage = window.Rui.getPage;

    // $('.btn1').click(function(){
    //     $('p.listnew').slideToggle();
    //     console.log(11)
    // });
    // 改变未读状态到已读
    function changestate(readid) {
        var ids = {
            mdname: '/change_state.json',
            data: {
                id:readid
            }
        };
        ajax(ids, function (res) {
            console.log(res)
        });
    }

    // 查看详情与收起方法
    $.fn.moreText = function(options){
        var defaults = {
            maxLength:1,
            mainCell:'.branddesc',
            openBtn:'查看详情',
            closeBtn:'收起'
        };
        return this.each(function() {
            var _this = $(this);
            var opts = $.extend({},defaults,options);
            var maxLength = opts.maxLength;
            var TextBox = $(opts.mainCell,_this);
            var openBtn = opts.openBtn;
            var closeBtn = opts.closeBtn;

            var countText = TextBox.html();
            var newHtml = '';

            if(_this.hasClass('unread')){
                console.log(0);
                newHtml = countText.substring(0,maxLength)+'...<a class="more color-red" href="javascript:void(0)" style="float:right">'+openBtn+'</a>';
            }else{
                newHtml = countText.substring(0,maxLength)+'...<a class="more" href="javascript:void(0)" style="float:right">'+openBtn+'</a>';
            }
            TextBox.html(newHtml);
            TextBox.on('click','.more',function(){
                $(this).parent().parent().addClass('unread_title');
                var headerInfo=$('#header .info');
                var unreadNum=headerInfo.find('sup').text();
                if(unreadNum==='1'){
                    headerInfo.remove('sup');

                }else{
                    headerInfo.find('sup').text(unreadNum-1);
                }
                if($(this).text()==openBtn){
                    // if(state!='false'){
                    if($(this).hasClass('color-red')){
                        console.log($(this));
                        changestate($(this).parent().attr('value'));
                        // $(this).parent().removeClass('color-red');
                    }
                    TextBox.html(countText+' <a href="javascript:void(0)">'+closeBtn+'</a>');
                }else{
                    TextBox.html(newHtml);
                }
            })
        })
    };
    // 查看详情调用
    function gettext(){
        $('.desc ul li').moreText({
            maxLength: 36, //默认最大显示字数，超过...
            mainCell: '.branddesc' //文字容器
        });
    }


    // 渲染列表
    function getListHtml(datalist) {
        console.log(datalist);
        var html = '',max,dataList;
        if(datalist.length){
            max = datalist.length;
            dataList = datalist;
            for (var i = 0; i < max; i++) {
                var createTime = new Date(datalist[i].createTime).toLocaleString();
                html += '<ul class="message-div">';
                if(datalist[i].isRead==='false'){
                    html += '<li class="unread"><h4 class="blue-title color-bluetitle">'+datalist[i].topic+'<span class="pull-right color-black">'+createTime+'</span></h4><div class="branddesc" value="'+datalist[i].id+'">'+datalist[i].content+'</div></li>';
                }else{
                    html += '<li><h4 class="blue-title">'+datalist[i].topic+'<span class="pull-right color-black">'+createTime+'</span></h4><div class="branddesc" value="'+datalist[i].id+'">'+datalist[i].content+'</div></li>';
                }
                html += '</ul>';
            }
        }else{
            html = '<div class="font16"><p class="pad-top-30 pad-bottom-30" style="text-align:center">暂无记录</p></div>';
        }
        $('.desc').empty().append(html);
        gettext();
    }
    //请求消息参数定义
    function getmessage(pageNo,fn) {
        var paras = {
            mdname: '/get_message.json',
            data: {
                isRead:state,
                pageSize:pageSize,
                pageNo:pageNo
            }
        };
        console.log('paras',paras);
        ajax(paras, function (res) {
            fn(res);
        });
    }
    // 请求消息
    function commongetdata(){
        getmessage(1,function(res){
            console.log(9999999,res);
            totalCount = res.totalCount;
            var totalCountUnread = check.ishas(res.totalCountUnRead);
            $('#notice').html('('+totalCountUnread+')');
            getListHtml(res.list);
            getPage.start(Math.ceil(totalCount/5),function(pNo){
                getmessage(pNo,function(res){
                    getListHtml(res.list);
                });
            });
        });
    }
    // 点击变色事件
    $('ul.nav_pills li a').click(function(){
        $(this).parent().addClass('active').siblings().removeClass('active');
        state = $(this).attr('value');
        console.log($(this).attr('value'));
        commongetdata();
    });

    function start() {
        commongetdata();
    }

    return {start: start}
}()).start();
