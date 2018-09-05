'use strict';
window.listbullionbill = (function () {
    var ajax = window.Rui.Ajax,
        pageSize = 5,
        tool = window.Rui.Tool,
        totalCount = 0,
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
            sessionStorage.setItem('ProductId', $(this).closest('li').attr('pid'));
            location.href = 'productdetail.html';
        });
    }

    // 渲染票据列表
    function getListHtml(datalist) {
        var html = '',
            max = datalist.length,
            dataList = datalist;
        for (var i = 0; i < max; i++) {
            // console.log('id', i, dataList[i], Object.prototype.toString(dataList[i]));
            html += '<li ' + (i % 4 === 0 ? ('style=margin-left:0') : '') + ' class="product_item" pid=' + dataList[i].id + '>';
            html += '<dl>';
            html += '<dt>金保理第' + dataList[i].name + '期</dt>';
            html += '<dd>';
            html += '<div class="percent">' + dataList[i].annualRate + '%</div>';
            html += '<p class="color-gray">';
            html += '<span>出借期限:' + datalist[i].timeLimit + '天</span>&emsp;';
            html += '<span>借款金额:'+ tool.nfmoney(datalist[i].amount,-6,2) + '万</span>';
            html += '</p>';
            html += '<div class="progress">';
            html += '<div style="width:';
            // html += (dataList[i].tenderStatus!=='tendering')?100:dataList[i].tenderAmount/dataList[i].amount*100<1?0.1:dataList[i].tenderAmount/dataList[i].amount*100;
            html += (dataList[i].tenderStatus !== 'tendering') ? 100 : dataList[i].tenderAmount / dataList[i].amount * 100;
            html += '%" class="progress_bar"></div>';
            html += '</div>';
            html += '<a href="javascript:;" class="btn ' + ((dataList[i].tenderStatus == 'tendering') ? 'default' : 'disabled') + '">';
            html += ( (dataList[i].tenderStatus == 'tendering') ? '立即投资' : '') || ( (dataList[i].tenderStatus == 'full') ? '已满标' : '') || ( (dataList[i].tenderStatus == 'repaying') ? '还款中' : '') || ( (dataList[i].tenderStatus == 'repay') ? '已还款' : '');
            html += '</a></dd>';
            html += '</dl>';
            html += '</li>';
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
                pageSize: pageSize
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
