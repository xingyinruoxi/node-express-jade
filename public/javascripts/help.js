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
        $('.row.problem a.help_icon').bind('click', function () {
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
        for(var i=0;i<Math.ceil(max/5);i++){
            html +='<div class="col-33"><ul class="hotList">';
            for(var j=5*i;(j<(5*(i+1)>max?max:5*(i+1)));j++){
                html +='<li ><a qid="'+j+'" > Q：'+data[j].TOPIC+'</a></li>';
            }
            html +='</ul></div>';
        }
        $('.hot_problem').empty().append(html);
        bindHotList();
    }
    // 渲染问题种类页面
    function randerList(datalist) {
        var html='';
        html +='<div class="col-10">&nbsp</div>';
        html +='<div class="col-10" tid='+datalist[0].id+'>';
        html +='<a class="help_icon icon_1" href="/help/rmwt"  ></a>';
        html +='<span>'+datalist[0].name+'</span>';
        html += '</div>';
        html +='<div class="col-10" tid='+datalist[3].id+' >';
        html +='<a class="help_icon icon_2" href="/help/rmwt" ></a>';
        html +='<span>'+datalist[3].name+'</span>';
        html += '</div>';
        html +='<div class="col-10" tid='+datalist[6].id+' >';
        html +='<a class="help_icon icon_3" href="/help/rmwt" ></a>';
        html +='<span>'+datalist[6].name+'</span>';
        html += '</div>';
        html +='<div class="col-10" tid='+datalist[8].id+' >';
        html +='<a class="help_icon icon_4" href="/help/rmwt" ></a>';
        html +='<span>'+datalist[8].name+'</span>';
        html += '</div>';
        html +='<div class="col-10" tid='+datalist[2].id+'>';
        html +='<a class="help_icon icon_5" href="/help/rmwt" ></a>';
        html +='<span>'+datalist[2].name+'</span>';
        html += '</div>';
        html +='<div class="col-10" tid='+datalist[7].id+'>';
        html +='<a class="help_icon icon_6" href="/help/rmwt" ></a>';
        html +='<span>'+datalist[7].name+'</span>';
        html += '</div>';
        html +='<div class="col-10" tid='+datalist[5].id+'>';
        html +='<a class="help_icon icon_7" href="/help/rmwt" ></a>';
        html +='<span>'+datalist[5].name+'</span>';
        html += '</div>';
        html +='<div class="col-10" tid='+datalist[4].id+'>';
        html +='<a class="help_icon icon_8" href="/help/rmwt" ></a>';
        html +='<span>'+datalist[4].name+'</span>';
        html += '</div>';
        $('.row.problem').empty().append(html);
        bindClick();
    }
    // 获取问题种类
    function getProblemType() {
        var paras = {
            mdname: '/problem_type.json'
        };
        ajax(paras,function (res) {
            console.log('常见种类',res);
            randerList(res.data.data);
        });
    }

    // 获取热门问题
    function getHotProblem() {
        var paras = {
            mdname: '/problem_hot.json'
        };
        ajax(paras,function (res) {
            console.log('热门问题',res);
            randerHotProblem(res.data.data);

        });
    }
    function start() {
        //getHotProblem();
        //getProblemType();
        clearSestionProblemId();
        scrollTo(location.search.substr(6,1));
    }
    return {
        start: start
    }
}()).start();
