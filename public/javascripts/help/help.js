'use strict';
window.help = (function() {
    var ajax = window.Rui.Ajax;
    // 滚动到指定位置
    function scrollTo(flag) {
        $(function(){
            var pre=0;
            function flagScroll(height){
                var iTarget=$('#header').height()+$('.help-banner').height()-170+height;
                $('html,body').animate({scrollTop:iTarget},400);
            }
            switch(flag){
                case '2':
                    pre = $('#one-to-one').height()+30;
                    flagScroll(pre);
                    break;
                case '3':
                    pre = $('#one-to-one').height()+60+$('#hot-quest').height();
                    flagScroll(pre);
                    break;
                case '4':
                    pre = $('#one-to-one').height()+90+$('#hot-quest').height()+$('#product-inc').height();
                    flagScroll(pre);
                    break;
                /*default :
                 flagScroll(0);
                 break;*/
            }
        });

    }
    // 绑定跳转到详情
    function bindClick() {
        $('.problem a.help_icon').bind('click', function () {
            sessionStorage.setItem('ProblemId', $(this).closest('div').attr('tid'));
        });
    }
    //清除Sestion
    function clearSestionProblemId() {
        $('#hotQuestion').on('click',function () {
            sessionStorage.removeItem('ProblemId');
        });
        $('.help_link').on('click',function () {
            sessionStorage.removeItem('ProblemId');
        })
    }

    // 点击跳转热门问题详情
    function bindHotList() {
        $('.hotList a').on('click',function () {
            clearSestionProblemId();
            location.href='/help/rmwt?index='+$(this).attr('qid');
        })
    }
    // 渲染热门问题
    function randerHotProblem(data) {
        var html='',
            max=data.length;
        if(max){
            for(var i=0;i<Math.ceil(max/5);i++){
                html +='<div class="col-33"><ul class="hotList">';
                for(var j=5*i;(j<(5*(i+1)>max?max:5*(i+1)));j++){
                    html +='<li ><a qid="'+j+'" > Q：'+data[j].topic+'</a></li>';
                }
                html +='</ul></div>';
            }
        }
        else{
            html='<div class="def">暂无热门问题</div>'
        }
        $('.hot_problem').empty().append(html);
        bindHotList();
    }

    // 获取热门问题
    function getHotProblem() {
        var paras = {
            mdname: '/problem_hot.json'
        };
        ajax(paras,function (res) {
            console.log('热门问题',res);
            randerHotProblem(res.data);

        });
    }

    // hover图标变化
    function changeImg(data) {
        $('.help_type img').hover(function () {
            var index= $(this).closest($('.help_type')).index();
            $(this).attr('src',data[index-1].picMouseUrl);
        },function () {
            var index= $(this).closest($('.help_type')).index();
            $(this).attr('src',data[index-1].picUrl);
        })
    }
    // 问题分类
    function getProblemType() {
        var paras = {
            mdname: '/problem_type.json'
        };
        ajax(paras,function (res) {
            changeImg(res.data);
        });
    }
    function start() {
        getHotProblem();
        clearSestionProblemId();
        scrollTo(location.search.substr(6,1));
        bindClick();
        getProblemType();
    }
    return {
        start: start
    }
}()).start();