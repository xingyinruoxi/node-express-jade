'use strict';
window.activity = (function () {
    var ajax = window.Rui.Ajax,
        date = window.Rui.Date,
        pageSize=9,
        totalCount = 0,
        getPage = window.Rui.getPage;

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
            max = data.length,
            activityurl={newuser:'/activity/activityguide.html'},
            url='';
        if(max){
            for (var i = 0; i < max; i++) {
                if(data[i].type=='Hot'){
                    url=activityurl[data[i].code]||'';
                    console.log('url',url);
                    html += '<div class="activity_list_item">';
                    html += '<a href="javascript:;">';
                    html += '<img src="'+data[i].picUrlPc+'">';
                    html += '</a>';
                    html += '<div><h4>' + data[i].name  + '</h4><time>' + date.formatDateTime(data[i].onlineTime)+' — '+date.formatDateTime(data[i].offlineTime) +'</time></div>';
                    html += '<div class="descrip"><p>' + data[i].summaryPc + '</p></div>';
                    //html += '<a class="btn '+(data[i].activityStatus=='end'?'btn-gray':'btn-default')+'" href="'+(url||'javascript:;')+'">';
                    html += '<a class="btn '+(data[i].activityStatus=='end'?'btn-gray':'btn-default')+(url?('" href="'+url):'')+'">';
                    //html += data[i].activityStatus=='start'?'敬请期待':''||data[i].activityStatus=='doing'?'参加活动':''||data[i].activityStatus=='end'?'活动已结束':'活动未开始';
                    html += (url?'我要参加':'敬请期待');
                    html += '</a>';
                    html += '</div>';
                }
            }
        }else{
            html = '<div class="def">暂无活动</div>'
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

    //获取活动列表数据
    function getDetailList(pageNo, callback) {
        var paras = {
            mdname: '/get_activity.json',
            data: {
                pageNo: pageNo,
                pageSize: pageSize
            }
        };
        ajax(paras, callback);
    }

    function start() {
        getDetailList(1,function(res){
            totalCount = res.totalCount;
            randerActive(res.list);
            getPage.start(Math.ceil(totalCount/pageSize), function (pNo) {
                getDetailList(pNo, function (res) {
                    randerActive(res.list);
                });
            });
        });
    }

    return {
        start: start
    }
}()).start();
