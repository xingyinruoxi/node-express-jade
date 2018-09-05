'use strict';
window.rmwtHelp = (function () {
    var ajax = window.Rui.Ajax,
        pid = sessionStorage.getItem('ProblemId'),
        check = window.Rui.Check;

    // 显示隐藏按钮
    function showHideBtn() {
        $('.question-item dt').on('click', function () {
            var $index = $(this).index('.question-item dt');
            //console.log($index);
            $('.fa-angle-right').eq($index).toggleClass('hidden');
            $('.fa-angle-down').eq($index).toggleClass('hidden');
            $('.color-gray-999').eq($index).toggleClass('hidden');
        });
        // 收起
        $('.pull-right').on('click', function () {
            var $index=$(this).index('.pull-right');
            $('.color-gray-999').eq($index).addClass('hidden');
            $('.fa-angle-down').eq($index).addClass('hidden');
            $('.fa-angle-right').eq($index).removeClass('hidden');
        });
        // 解决未解决选项
        $('.help-solve').on('click', function () {
            var $index = $(this).index('.help-solve');
            $('.solve').eq($index).show();
            $('.help-solve').eq($index).addClass('help-solved');
            $('.help-solve-no').eq($index).addClass('help-solved-no');
            $('.help-solve-state-no').eq($index).hide();
            $('.help-solve').eq($index).off('click');
            $('.help-solve-no').eq($index).off('click');

            //console.log($('.soluSub').eq($index).attr('id'));
        });
        $('.help-solve-no').on('click', function () {
            var $index = $(this).index('.help-solve-no');
            $('.help-solve-state-no').eq($index).show();
            $('.help-solve-no').eq($index).addClass('help-solved');
            $('.help-solve').eq($index).addClass('help-solved-no');
            $('.help-solve-state').eq($index).hide();
            $('.help-solve').eq($index).off('click');
            $('.help-solve-no').eq($index).off('click');
        });
    }
    // 提交是否解决请求
    function solvedsub(id,status) {
        var paras = {
            mdname: '/problem_solved.json',
            data: {
                id: id,
                resource:status
            }
        };
        ajax(paras,function (res) {
            console.log('解决问题提交');
        });
    }
    // 点击提交是否解决
    function statistics() {
        $('.help-solve').on('click', function () {
            var $index = $(this).index('.help-solve'),
                id=$('.soluSub').eq($index).attr('id');
            solvedsub(id,'resolved');
        });
        $('.help-solve-no').on('click', function () {
            var $index = $(this).index('.help-solve-no'),
                id=$('.soluSub').eq($index).attr('id');
            solvedsub(id,'unResolved');
        });
    }
    // 渲染右侧问题列表
    function rankProList(dataList) {
        var max=dataList.length,
            html = '';
        if(max<1){
            html +='<dl class="question-item">';
            html +='<span>暂无数据</span>';
            html +='</dl>';
        }
        else{
            for(var i=0;i<max;i++){
                html +='<dl class="question-item">';
                html +='<dt>';
                html +='<i class="fa fa-angle-right"></i>';
                html +='<i class="fa fa-angle-down hidden"></i>';
                html +='<span class="soluSub" id="'+dataList[i].id+'"> Q：'+dataList[i].topic+'</span>';
                html +='</dt>';
                html +='<dd class="color-gray-999 clearfix hidden">';
                html +='<p></p>'+dataList[i].answer+'<p></p>';
                html +='<a class="pull-right pad-bottom-10" href="javascript:;">收起</a>';
                html +='<p class="pad-bottom-10"></p>';
                html +='<div class="pull-left">该回答是否解决了您的问题？</div>';
                html +='<a class="help-solve">解决</a>';
                html +='<a class="help-solve-no">没有，需人工帮助解答</a>';
                html +='<p></p>';
                html +='<div class="help-solve-state solve" style="display: none">';
                html +='<i></i>';
                html +='<span>已提交，感谢您的反馈！</span>';
                html +='</div>';
                html +='<div class="help-solve-state help-solve-state-no" style="display: none">';
                html +='<i></i>';
                html +='<span>已提交，感谢您的反馈！</span>';
                html +='<p class="color-black">客服电话：400-101-7660</p>';
                html +='<p class="pad-bottom-10">（工作日 9:00-21:00；非工作日 9:00-18:00）</p>';
                html +='<a class="help-service" href="http://www.sobot.com/chat/pc/index.html?sysNum=700b7ec5c8884e6fbc16baedf679ceca" target="_blank">点此咨询在线客服</a>';
                html +='<br>';
                html +='</div>';
                html +='</dd>';
                html +='</dl>';
            }
        }
        $('.list-notice').empty().append(html);
        showHideBtn();
        statistics();
    }
    // 渲染右侧热门问题
    function randerHotProblemList(dataList){
        $('.top-title').text('热门问题');
        $('.hot_problem').addClass('active');
        $('li.other').removeClass('active');
        rankProList(dataList);
    }

    // 请求右侧问题详情
    function getListDetial(pid) {
        var paras = {
            mdname: '/problem_detial.json',
            data: {
                categoryId: pid
            }
        };
        ajax(paras, function (res) {
            rankProList(res.data);
            sessionStorage.removeItem('ProblemId');
        });
    }

    // 点击问题分类样式内容变化
    function changeStyle() {
        $('.left_nav li.other').on('click', function () {
            $(this).addClass('active').siblings().removeClass('active');
            $('.top-title').text($(this).text());
            pid=$(this).attr('tid');
            getListDetial(pid);
            sessionStorage.removeItem('ProblemId');
        });
        $('.hot_problem a').bind('click', function () {
            $('.top-title').text('热门问题');
            var paras = {
                mdname: '/problem_hot.json'
            };
            ajax(paras,function (res) {
                randerHotProblemList(res.data);
            });
        });
    }

    // 请求渲染热门问题或其他问题
    function getProblem() {
        if(!check.isvalid(sessionStorage.getItem('ProblemId'))){
            var paras = {
                mdname: '/problem_hot.json'
            };
            ajax(paras,function (res) {
                randerHotProblemList(res.data);
                if(location.search.substr(1,5)=='index'){
                    $('.question-item dt').eq(location.search.substr(7,1)).click();
                }
            });
        }else{
            changeStyle();
            $('.left_nav li').each(function () {
                if( $(this).attr('tid')==pid ){
                    $(this).click();
                }
            });
        }
    }
    function start() {
        getProblem();
        changeStyle();
    }

    return {
        start: start
    }
}()).start();