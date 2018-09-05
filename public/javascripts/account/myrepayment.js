'use strict';
window.myrepayment = (function () {
    var end=window.end||{};
    var laydate=window.laydate||{};
    var ajax = window.Rui.Ajax,
        tool = window.Rui.Tool,
        date = window.Rui.Date,
        pageSize = 10,
        starttime,
        endtime,
        thisURL = document.URL,
        getPage = window.Rui.getPage;
    if(thisURL.indexOf('?')!=-1){
        var getVal =thisURL.split('?')[1],
            showVal= getVal.split('=')[1]
    }
    // 绑定跳转
    function bindClick() {
        $('a.returnM').on('click', function () {
            var pid=$(this).closest('td').attr('pid');
            sessionStorage.setItem('ProjectId', pid);
            console.log(pid);
        });
    }
    function bindClick2() {
        $('a.raising').on('click', function () {
            var pid=$(this).closest('td').attr('pid');
            sessionStorage.setItem('ProductId', pid);
            console.log(pid);
        });
    }
    // 判断产品类型
    function getProductType(n) {
        switch(n)
        {
            case 'default':
                return '/baoli/';
            case 'exportRebate':
                return '/tuishuidai/';
            case 'bankPaper':
                return '/piaojudai/';
            default :
                return '/baoli/';
        }
    }
    // 渲染列表 已投项目 募集中
    function getListHtml1(datalist) {
        var html = '',
            max;
        if(datalist.length){
            max = datalist.length;
            for (var i = 0; i < max; i++) {
                var repayStartDate = date.formatDateTime(datalist[i].repayStartDate);
                var transAmount = tool.nfmoney(datalist[i].transAmount);
                var detailId = datalist[i].idFlag;
                html += '<tr>';
                html += '<td >'+datalist[i].name+'</td>';
                html += '<td>'+transAmount +'</td>';
                html += '<td>'+'<span>'+tool.nfmoney(datalist[i].yearRate,'0',2)+'%'+'</span>'+'+'+'<span>'+tool.nfmoney(datalist[i].couponRate,'0',2)+'%'+'<span>'+'</td>';
                html += '<td>'+datalist[i].timeLimit+(!datalist[i].timeLimitUnit||datalist[i].timeLimitUnit==='day'?'天':'月')+'</td>';
                /*if(datalist[i].repayType==='equalInterestMonthlyByDay'){
                 html += '<td>'+'先息后本'+'</td>';
                 }else{
                 html += '<td>'+'一次性还本付息'+'</td>';
                 }*/
                html += '<td>'+'一次性还本付息'+'</td>';
                html += '<td>'+repayStartDate+'</td>';
                html += '<td pid="'+datalist[i].idFlag+'">';
                html += '<a class="raising" href="'+ getProductType(datalist[i].productType)+ detailId+'.html">查看出借记录</a>';
                html += '</td></tr>';
            }
        }else{
            html = '<tr><td colspan="5" class="font16"><p class="pad-top-30 pad-bottom-30">暂无募集中记录</p></td></tr>';
        }
        $('tbody.trlist').empty().append(html);
        bindClick2();
    }
    // 渲染列表 已投项目 还款中
    function getListHtml3(datalist) {
        var html = '',
            max = datalist.length;
        if(max){
            for (var i = 0; i < max; i++) {
                var detailId = datalist[i].idFlag;
                html += '<tr>';
                html += '<td >'+datalist[i].name+'</td>';
                html += '<td>'+tool.nfmoney(datalist[i].transAmount) +'</td>';
                html += '<td>'+tool.nfmoney(datalist[i].payAmount)+'</td>';
                html += '<td>'+tool.nfmoney(datalist[i].noPayAmount)+'</td>';
                /* if(datalist[i].repayType==='equalInterestMonthlyByDay'){
                 html += '<td>'+'先息后本'+'</td>';
                 }else{
                 html += '<td>'+'一次性还本付息'+'</td>';
                 }*/
                html += '<td>'+'一次性还本付息'+'</td>';
                html += '<td>'+date.formatDateTime(datalist[i].repayEndDate)+'</td>';
                html += '<td pid="'+datalist[i].idFlag+'"><a class="returnM" href="/user/repaymentdetail/'+detailId+'.html">'+'查看回款'+'</a><br><a  href="">'+'查看合同'+'</a>'+'</td>';
                html += '</tr>';
            }
        }else{
            html = '<tr><td colspan="5" class="font16"><p class="pad-top-30 pad-bottom-30">暂无还款中记录</p></td></tr>';
        }
        $('tbody.trlist').empty().append(html);
        bindClick();

    }
    // 渲染列表 已投项目 已结清
    function getListHtml4(datalist) {
        var html = '',
            max = datalist.length;
        if(max){
            for (var i = 0; i < max; i++) {
                //var detailId = datalist[i].idFlag.slice(-6,-1);
                var detailId = datalist[i].idFlag.substring(datalist[i].idFlag.length-6);
                html += '<tr>';
                html += '<td >'+datalist[i].name+'</td>';
                html += '<td>'+tool.nfmoney(datalist[i].transAmount) +'</td>';
                html += '<td>'+tool.nfmoney(datalist[i].payAmount) +'</td>';
                html += '<td>'+date.formatDateTime(datalist[i].repayEndDate) +'</td>';
                /*if(datalist[i].repayType==='equalInterestMonthlyByDay'){
                 html += '<td>'+'到期结清'+'</td>';
                 }else{
                 html += '<td>'+'未到期结清'+'</td>';
                 }*/
                html += '<td>'+'到期结清'+'</td>';
                html += '<td pid="'+datalist[i].idFlag+'">'+'<a class="returnM" href="'+'/user/repaymentdetail/'+detailId+'">'+'查看回款'+'</a>'+'<br>'+'<a  href="">'+'查看合同'+'</a>'+'</td>';
                html += '</tr>';
            }
        }else{
            html = '<tr><td colspan="5" class="font16"><p class="pad-top-30 pad-bottom-30">暂无已结清记录</p></td></tr>';
        }
        $('tbody.trlist').empty().append(html);
    }
    // 渲染列表 还款计划
    function getListHtml2(datalist) {
        var html = '';
        if(datalist.length) {
            var max = datalist.length;
            for (var i = 0; i < max; i++) {
                var payAmount = tool.nfmoney(datalist[i].payAmount);
                var payDate = date.formatDateTime(datalist[i].payDate);
                html += '<tr><td >' + payDate + '</td>';
                html += '<td>' + datalist[i].name + '</td>';
                html += '<td>' + payAmount + '</td>';
                html += '<td>' + (datalist[i].repayStatus=='repay'? '已还款':'待还款') + '</td>';
                html += '</tr>';
            }
        }else{
            html = '<tr><td colspan="5" class="font16"><p class="pad-top-30 pad-bottom-30">暂无还款记录</p></td></tr>';
        }
        $('tbody.trlist').empty().append(html);
    }
    // 请求余额信息
    function gettotal() {
        var paras = {
            mdname: '/get_total.json',
            data: {}
        };
        ajax(paras, function(res){
            $('#sumAmount').html(tool.nfmoney(res.data.sumAmount));
            $('#sumCoupon').html(tool.nfmoney(res.data.sumCoupon));
        });
    }
    //请求已投列表
    function gettrade(type,pageNo,index,starttime,endtime,fn) {
        var trader = {
            mdname: '/get_tradelist.json',
            data: {
                needCount: true,
                pageSize:pageSize,
                pageNo:pageNo,
                type:type,
                queryDateStart:starttime,
                queryDateEnd:endtime
            }
        };
        ajax(trader, function (res) {
            fn(res)

        })
    }
    function gettradelist(type,pageNo,index,starttime,endtime){
        gettrade(type,pageNo,index,starttime,endtime,function(res){
            var totalCount = res.totalCount;
            if(index===1) {
                getListHtml1(res.list);
                getPage.start(Math.ceil(totalCount/pageSize), function (pNo) {
                    //console.log('第一个', pNo);
                    gettrade(type, pNo, index,starttime,endtime,function (res) {
                        getListHtml1(res.list);
                    });

                });
            }else if(index===2) {
                getListHtml3(res.list);
                getPage.start(Math.ceil(totalCount/pageSize), function (pNo) {
                    //console.log('点击了一次，触发回调,当前是页数为：', pNo);
                    gettrade(type, pNo, index, starttime,endtime,function (res) {
                        getListHtml3(res.list);
                    });

                });
            }else if(index===3) {
                getListHtml4(res.list);
                getPage.start(Math.ceil(totalCount/pageSize), function (pNo) {
                    //console.log('点击了一次，触发回调,当前是页数为：', pNo);
                    gettrade(type,pNo,index,starttime,endtime,function (res) {
                        getListHtml4(res.list);
                    });

                });
            }
        })
    }
    //请求还款列表
    function repaylist(type,pageNo,starttime,endtime,fn) {
        var repaylist = {
            mdname: '/get_repaylist.json',
            data: {
                needCount:true,
                pageSize:pageSize,
                pageNo:pageNo,
                type:type,
                queryDateStart:starttime,
                queryDateEnd:endtime,
            }
        };
        ajax(repaylist,function (res) {
            fn(res)

        })
    }
    function getrepaylist(type,pNo,starttime,endtime){
        repaylist(type,pNo,starttime,endtime,function(res){
            var totalCount = res.totalCount;
            getListHtml2(res.list);
            getPage.start(Math.ceil(totalCount/pageSize), function (pNo) {
                repaylist(type,pNo, starttime,endtime,function (res) {
                    getListHtml2(res.list);
                });

            });
        });
    }
    // 日期筛选已投项目
    function dateTrade(){
        var Tradetype = '';
        if($('.payment1').find('li.active').find('a').text()=='已投项目'){
            $('.payment2 li.active a').each(function () {
                if( $(this).text().match(/募集中/) ){
                    Tradetype = 1;
                }
                else if( $(this).text().match(/还款中/) ){
                    Tradetype = 2;
                }else if ( $(this).text().match(/已结清/) ){
                    Tradetype = 3;
                }
            });
            //console.log('类型',Tradetype);
            gettradelist(Tradetype,1,Tradetype,starttime,endtime);
        }
    }
    // 日期筛选还款计划
    function dateRepay() {
        var Tradetype = '';
        if($('.payment1').find('li.active').find('a').text()=='还款计划'){
            $('.payment2 li.active a').each(function () {
                if( $(this).text().match(/全部/) ){
                    Tradetype = 1;
                }
                else if( $(this).text().match(/已还款/) ){
                    Tradetype = 2;
                }else if ( $(this).text().match(/待还款/) ){
                    Tradetype = 3;
                }
            });
            console.log('我是还款计划的类型',Tradetype);
            getrepaylist(Tradetype,1,starttime,endtime);
        }
    }
    var start1 = {
        elem: '#start',
        format: 'YYYY-MM-DD',
        // min: laydate.now(), //设定最小日期为当前日期
        max: '2099-06-16', //最大日期
        istime: true,
        istoday: false,
        choose: function(datas){
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas; //将结束日的初始值设定为开始日
            // starttime = new Date(datas);
            starttime = (new Date(datas)).getTime();
            dateTrade();//日期已投
            dateRepay();//日期还款
        }
    };
    end = {
        elem: '#end',
        format: 'YYYY-MM-DD',
        min: laydate.now(),
        max: '2099-06-16',
        istime: true,
        istoday: false,
        choose: function(datas){
            start1.max = datas; //结束日选好后，重置开始日的最大日期
            // endtime = new Date(datas);
            endtime = (new Date(datas)).getTime();
            dateTrade();//日期已投
            dateRepay();//日期还款
        }
    };
    laydate(start1);
    laydate(end);


    // 创建状态
    var states1={};
    function Dostates(m,n){
        var state1={
            'para1':m,
            'para2':n
        };
        return state1
    }
    // 判断显示
    function judge(){
        var bbb= new Dostates($('ul.payment1 li.active').index(),$('ul.payment2 li.active').index());
        if(bbb.para1===0){

            $('#para1').show();
            $('#para2').hide();
            // $('#thread4').hide();
            $('.table>thead:eq('+bbb.para2+')').siblings().hide().end().show();

        }else{
            $('#para2').show();
            $('#para1').hide();
            $('.table>thead:eq(3)').siblings().hide().end().show();
        }
    }

    // 默认显示
    // $('.payment2:eq(0)').siblings().hide().end().show();
    // 点击变色事件
    // 一级点击
    function stairClick() {
        $('.payment1 li').click(function() {
            $(this).addClass('active').siblings().removeClass('active');
            // 边界处理
            if($(this).index()===0){
                gettradelist($('ul#para1 li.active').index()+1,1,$('ul#para1 li.active').index()+1,starttime,endtime);
            }else{
                getrepaylist($('#para2 li.active').index()+1,1,starttime,endtime)
            }
            judge();
        });
    }
    // 二级点击
    function secondClick() {
        // 二级点击1
        $('ul#para1 li').click(function(){
            $(this).addClass('active').siblings().removeClass('active');
            var bbb= new Dostates($('ul.payment1 li.active').index(),$('ul.payment2 li.active').index());
            console.log('fasong',$(this).index()+1,bbb.para2+1);
            gettradelist($(this).index()+1,1,bbb.para2+1,starttime,endtime);
            judge();
        });
        // 二级点击2
        $('#para2 li').click(function() {
            $(this).addClass('active').siblings().removeClass('active');
            getrepaylist($(this).index()+1,1,starttime,endtime);
            judge();
        });
        $('ul#para1').show();
        $('div#para2').hide();
        $('.thread:eq(0)').siblings().hide().end().show();
    }



    function start() {
        if(showVal){
            //console.log(showVal);
            $('.payment1 li').eq(1).addClass('active').siblings().removeClass('active');
            $('#para2 li:first-child').addClass('active').siblings().removeClass('active');
            judge();

            getrepaylist(1,1)
        }else{

            gettradelist(1,1,1);

        }

        gettotal();
        stairClick();//一级点击
        secondClick();//二级点击

    }

    return {start: start}
}()).start();

