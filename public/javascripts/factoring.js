'use strict';
window.factoring = (function () {
    var ajax = window.Rui.Ajax,
        tool = window.Rui.Tool,
        pageSize = 12,
        totalCount = 0,
        type='default',
        getPage = window.Rui.getPage;
    // 滚动到产品列表jo
    function scrollTo() {
        $('.banner>.btn').click(function () {
            $('html,body').animate({
                scrollTop: '580px'
            }, 500);
        });
    }
    function bindClick() {
        $('.product_item a.btn').bind('click', function () {
            var pid=$(this).closest('li').attr('pid');
            sessionStorage.setItem('ProductId', pid);
            console.log(pid,pid.substring(pid.length-6));
            //return false;
            location.href +=('/'+pid.substring(pid.length-6)+'.html');
            //if(location.href.indexOf('baoli')>0){
            //    location.href +=('/'+pid.substring(0,5)+'.html');
            //}else{
            //    location.href +=('/'+pid.substring(0,5)+'.html');
            //}

        });
    }
    // 渲染票据列表
    function getListHtml(datalist) {
        var html = '',
            max = datalist.length,
            dataList = datalist;
        for (var i = 0; i < max; i++) {
            html += '<li ' + (i % 4 === 0 ? ('style=margin-left:0') : '') + ' class="product_item" pid=' + dataList[i].id + '>';
            html += '<dl>';
            html += '<dt>金保理第' + dataList[i].name + '期</dt>';
            html += '<dd>';
            html += '<div class="percent">' + tool.nfmoney(dataList[i].annualRate,'0',2)+'%</div>';
            html += '<div class="row color-gray">';
            html += '<div class="col-50">';
            html += '<p>出借期限' + dataList[i].timeLimit + '天</p>';
            html += '</div>';
            html += '<div class="col-50">';
            html += '<p>借款金额' + tool.nfmoney(dataList[i].amount,-6,2) + '万</p>';
            html += '</div>';
            html += '</div>';
            html += '<div class="progress">';
            html += '<div class="progress_bar" style="width:';
            html += ((dataList[i].tenderStatus!=='tendering')||Math.round(dataList[i].tenderAmount/dataList[i].amount*100)>100)?100:Math.round(dataList[i].tenderAmount/dataList[i].amount*100);
            html += '%"></div>';
            html += '</div>';
            html += '<a href="javascript:;" class="btn ' + ((dataList[i].tenderStatus == 'tendering') ? 'default' : 'disabled') + '">';
            html += ( (dataList[i].tenderStatus == 'tendering') ? '我要出借' : '') || ( (dataList[i].tenderStatus == 'full') ? '已满标' : '') || ( (dataList[i].tenderStatus == 'repaying') ? '还款中' : '') || ( (dataList[i].tenderStatus == 'repay') ? '已还款' : '')||'已满标';
            html += '</a></dd>';
            html += '</dl>';
            html += '</li>';
            console.log(4444444,dataList[i].amount,tool.nfmoney(dataList[i].amount,-6,2));
        }
        $('ul.product_list').empty().append(html);
        bindClick();
    }

    //获取商品列表数据 jo
    function getDetailList(pageNo, callback) {
        var paras = {
            mdname: '/get_productlist.json',
            data: {
                needCount: true,
                pageNo: pageNo,
                pageSize: pageSize,
                type:type
            }
        };
        ajax(paras, callback);
    }

    function start() {
        scrollTo();
        getDetailList(1, function (res) {
            totalCount = res.data.totalCount;
            getListHtml(res.data.list);
            getPage.start(Math.ceil(totalCount/pageSize), function (pNo) {
                console.log('点击了一次，触发回调,当前是页数为：', 1);
                getDetailList(pNo, function (res) {
                    getListHtml(res.data.list);
                });

            });
        });
    }
    return {
        start: start
    }
}()).start();
