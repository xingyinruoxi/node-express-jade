'use strict';
window.activity = (function () {
    var ajax = window.Rui.Ajax,
        date = window.Rui.Date;

    function bindClick() {
        $('a.btn-default').bind('click', function () {
            //sessionStorage.setItem('ProductId', $(this).closest('li').attr('pid'));
            //location.href = 'productdetail.html';
        });
    }

    // 渲染票据列表
    function randerActive(data) {
        var html = '',
            htmlbus = '',
            max = data.length;
        for (var i = 0; i < max; i++) {
            if(data[i].type=='Hot'){
                html += '<div class="col-33">';
                html += '<div class="activity_list_item">';
                html += '<a href="javascript:;">';
                html += '<img style="width: 290px;height:291px" src="'+data[i].picUrlPc+'">';
                html += '</a>';
                html += '<div><h4>' + data[i].name  + '</h4><time>' + date.formatDateTime(data[i].onlineTime)+' — '+date.formatDateTime(data[i].offlineTime) +'</time></div>';
                html += '<div class="descrip"><p>' + data[i].summaryPc + '</p></div>';
                html += '<a class="btn '+(data[i].isOffLine=='false'?'btn-default':'btn-gray')+'">'+(data[i].isOffLine?'参与活动':'活动已结束')+'</a>';
                html += '</div>';
                html += '</div>';
            }
        }
        // 商家的活动
       /* for (var j = 0; j < max; j++) {
            if(data[j].type=='Businesses'){
                htmlbus += '<div class="col-33">';
                htmlbus += '<div class="activity_list_item">';
                htmlbus += '<a href="javascript:;">';
                htmlbus += '<img src="' + '../images/activity/activity-center1.png' + '">';
                htmlbus += '</a>';
                htmlbus += '<div><h4>' + data[j].name  + '</h4><time>' + date.formatDateTime(data[j].onlineTime)+' — '+date.formatDateTime(data[j].offlineTime) +'</time></div>';
                htmlbus += '<div class="descrip"><p>' + data[j].summaryPc + '</p></div>';
                // htmlbus += '<a class="btn btn-gray">' + '活动已结束' + '</a>';
                htmlbus += '<a class="btn '+(data[j].isOffLine=='false'?'btn-default':'btn-gray')+'">'+(data[j].isOffLine?'参与活动':'活动已结束')+'</a>';
                htmlbus += '</div>';
                htmlbus += '</div>';
           }
        }*/

        $('.hot_active').empty().append(html);
        //$('.busParter').empty().append(htmlbus);

        bindClick();
    }

    //获取商品列表数据 jo
    function getDetailList() {
        var paras = {
            mdname: '/get_activity.json',
            data: {}
        };
        ajax(paras, function (res) {
            console.log('活动列表',res.data.list);
            randerActive(res.data.list);

        });
    }

    function start() {
        // 边界处理
        getDetailList();
    }

    return {
        start: start
    }
}()).start();
