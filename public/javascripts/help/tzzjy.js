// /**
//  * Created by uisheji on 17/5/18.
//  */
// 'use strict';
// window.tzzjy=(function(){
//     var ajax=window.Rui.Ajax;
//
//     //绑定详情
//     function bindSid() {
//         $('#id1 a').bind('click',function () {
//             $('#id1').hide();
//             $('.jydetail').show();
//         });
//     }
//
//     //获取数据
//     function getdata(index) {
//         var typelist=['相关法律','行政法规','规范性文件','司法解释','知识百科','专栏文章'],
//             paras = {
//             mdname: '/getTzzjyData.json',
//             data: {
//                type:typelist[index],
//             }
//         };
//         console.log(1111,typelist[index]);
//         // return false;
//         ajax(paras, function (res) {
//             //console.log('res',res);
//             var html='',
//                 data=res.data;
//             // console.log(44444,res.success,res.success===true);
//             if(res.success===true){
//                 html+='<h3>'+data.title+'</h3>';
//                 html+='<ul>';
//                 for(var i=0,max=data.list.length;i<max;i++){
//                     html+='<li><a eid='+data.list[i].id+' href="javascript:;">'+data.list[i].name+'<span>'+data.list[i].date+'</span></a></li>';
//                 }
//                 html+='</ul>';
//             }
//             console.log('html',html);
//             $('#id1').empty().show().append(html);
//
//             bindSid(); //绑定详情
//         });
//     }
//
//     //绑定返回按钮
//     function bindBack() {
//         $('.backtrack>a').bind('click',function () {
//             $('#id1').show();
//             $('.jydetail').hide();
//         });
//     }
//
//     //绑定菜单栏点击事件
//     function bindClick(){
//         console.log(123);
//         $('.left_nav>ul>li').bind('click',function () {
//             $(this).addClass('active').siblings().removeClass('active');
//             $('.right_tzzjy').hide().eq($(this).index()).show();
//             console.log($(this).index(),$(this).find('a').text());
//             //获取数据
//             getdata($(this).index());
//         });
//     }
//
//     function start() {
//         //绑定菜单栏点击事件
//         //bindClick();
//
//         //绑定返回按钮
//         bindBack();
//     }
//
//     return{start:start}
//
// })().start();


/**
 * Created by ui on 17/5/23.
 */
'use strict';
window.newsList = (function () {
    var ajax = window.Rui.Ajax,
        date=window.Rui.Date,
        arrType=['relevantLaws','administrativeRegulations','normativeDocument','judicialInterpretation','encyclopedias','column'],
        $index;
    //获取HTML

    function getListHtml(datalist) {
        var html = '', max, dataList;
        if (datalist) {
            html = '', max = datalist.length, dataList = datalist;
            for (var i = 0; i < max; i++) {
                html+='<li><a href="detail'+dataList[i].id+'.html">'+dataList[i].topic+'<span>'+date.formatDateTime(dataList[i].reportDate)+'</span></a></li>';
            }
        }else{
            html='<div class="text-center color-gray pad-top-40 pad-bottom-40 font24">暂无数据</div>'
        }
        $('#List').empty().append(html);
    }
    //获取新闻列表数据
    function getNewsList(type) {
        var paras = {
            mdname: '/get_newsList.json',
            data: {
                needCount: false,
                types:type
            }
        };
        ajax(paras, function (res) {
            getListHtml(res.list);
        });
    }

    function clickGetNewsList(){

        var $nav=$('.left_nav li');

        for(var i=0;i<$nav.length;i++){
            if($nav.eq(i).hasClass('active')){
                $index=i;
            }
        }

        getNewsList(arrType[$index]);

    }
    function start() {
        clickGetNewsList();
    }
    return {
        start: start
    }
}()).start();