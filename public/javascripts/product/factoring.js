'use strict';
window.factoring = (function () {
    var ajax = window.Rui.Ajax,
        tool = window.Rui.Tool,
        pageSize = 12,
        totalCount = 0,
        ptypelist={
            baoli:'default',
            chukoutuishui:'exportRebate',
            piaojudai:'bankPaper'
        },
        ChineseType={
            baoli:'保理',
            chukoutuishui:'退税贷',
            piaojudai:'票据贷'
        },
        type=ptypelist[$('#ptype').val()],
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
            //console.log(pid,pid.substring(pid.length-6));
            //return false;
            //location.href +=('/'+pid.substring(pid.length-6)+'.html');
            location.href +=(pid+'.html');
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
            max = datalist.length;
        if(max){
            for (var i = 0; i < max; i++) {
                html += '<li ' + (i % 4 === 0 ? ('style=margin-left:0') : '') + ' class="product_item" pid=' + datalist[i].id + '>';
                html += '<dl>';
                html += '<dt>' + datalist[i].name + '</dt>';
                html += '<dd>';
                html += '<div class="percent">' + tool.nfmoney(datalist[i].annualRate,'0',2)+'%</div>';

                html += '<p class="color-gray">';
                html += '出借期限:' + datalist[i].timeLimit + '天&emsp;';
                html += '借款金额:'+ tool.nfmoney(datalist[i].amount,-6,2) + '万';
                html += '</p>';
                html += '<div class="progress">';
                html += '<div class="progress_bar" style="width:';
                html += ((datalist[i].tenderStatus!=='tendering')||Math.round(datalist[i].tenderAmount/datalist[i].amount*100)>100)?100:Math.round(datalist[i].tenderAmount/datalist[i].amount*100);
                html += '%"></div>';
                html += '</div>';
                html += '<a href="javascript:;" class="btn ' + ((datalist[i].tenderStatus == 'tendering') ? 'default' : 'disabled') + '">';
                html += ( (datalist[i].tenderStatus == 'tendering') ? '立即投资' : '') || ( (datalist[i].tenderStatus == 'full') ? '已满标' : '') || ( (datalist[i].tenderStatus == 'repaying') ? '还款中' : '') || ( (datalist[i].tenderStatus == 'repay') ? '已还款' : '')||'已满标';
                html += '</a></dd>';
                html += '</dl>';
                html += '</li>';
                console.log(4444444,datalist[i].amount,tool.nfmoney(datalist[i].amount,-6,2));
            }
        }
        else{
            html ='<div class="def">暂无'+ChineseType[$('#ptype').val()]+'</div>';
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
            totalCount = res.totalCount;
            getListHtml(res.list);
            getPage.start(Math.ceil(totalCount/pageSize), function (pNo) {
                console.log('点击了一次，触发回调,当前是页数为：', 1);
                getDetailList(pNo, function (res) {
                    getListHtml(res.list);
                });

            });
        });
    }
    return {
        start: start
    }
}()).start();
