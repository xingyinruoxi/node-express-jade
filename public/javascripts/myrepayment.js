'use strict';
window.myrepayment = (function () {
    var end=window.end||{};
    var laydate=window.laydate||{};
    var ajax = window.Rui.Ajax,
        tool = window.Rui.Tool,
        date = window.Rui.Date,
        toDecimal = window.Rui.toDecimal,
        pageSize = 5,
        totalCount = 0,
        starttime,
        endtime,
        thisURL = document.URL,
        getPage = window.Rui.getPage;
    if(thisURL.indexOf('?')!=-1){
        var getVal =thisURL.split('?')[1],
            showVal= getVal.split('=')[1]
    }
    var start1 = {
        elem: '#start',
        format: 'YYYY-MM-DD hh:ss',
        // min: laydate.now(), //设定最小日期为当前日期
        max: '2099-06-16', //最大日期
        istime: true,
        istoday: false,
        choose: function(datas){
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas; //将结束日的初始值设定为开始日
            // starttime = new Date(datas);
            starttime = (new Date(datas)).getTime();
            console.log(starttime)
        }
    };
    end = {
        elem: '#end',
        format: 'YYYY-MM-DD hh:ss',
        min: laydate.now(),
        max: '2099-06-16',
        istime: true,
        istoday: false,
        choose: function(datas){
            start1.max = datas; //结束日选好后，重置开始日的最大日期
            // endtime = new Date(datas);
            endtime = (new Date(datas)).getTime();
            console.log(endtime)
        }
    };
    laydate(start1);
    laydate(end);
    // 渲染列表 已投项目 募集中
    function getListHtml1(datalist) {
        console.log(0);
        // $('tbody.trlist').removeChild()(tr);
        var html = '',
            max,
            dataList;
        if(datalist.length){
            max = datalist.length;
            dataList = datalist;
            for (var i = 0; i < max; i++) {
                var timeLimit = date.formatDateTime(datalist[i].timeLimit);
                var repayStartDate = date.formatDateTime(datalist[i].repayStartDate);
                var transAmount = tool.nfmoney(datalist[i].transAmount);
                var detailId = datalist[i].idFlag.slice(-6,-1);
                // alert(detailId);
                // console.log('id', i, dataList[i], Object.prototype.toString(dataList[i]));
                html += '<tr>';
                html += '<td >'+datalist[i].name+'</td>';
                html += '<td>'+transAmount +'</td>';
                html += '<td>'+'<span>'+tool.nfmoney(datalist[i].yearRate,'0',2)+'%'+'</span>'+'+'+'<span>'+tool.nfmoney(datalist[i].couponRate,'0',2)+'%'+'<span>'+'</td>';
                html += '<td>'+timeLimit+'</td>';
                if(datalist[i].repayType==='equalityInterestMonthlyByDay'){
                    html += '<td>'+'一次性还本付息'+'</td>';
                }else{
                    html += '<td>'+'先息后本'+'</td>';
                }
                html += '<td>'+repayStartDate+'</td>';
                html += '<td>'+'<a href='+'/baoli/'+detailId+'>'+'查看投资记录'+'</a>'+'</td>';
                html += '</tr>';
            }
        }else{
            html = '<tr><td colspan="5" class="font16"><p class="pad-top-30 pad-bottom-30">暂无记录</p></td></tr>';
        }
        $('tbody.trlist').empty().append(html);
    }
    // 渲染列表 还款计划
    function getListHtml2(datalist) {
        // $('tbody.trlist').removeChild()(tr);
        var html = '';
        if(datalist.length) {
            var max = datalist.length;
            for (var i = 0; i < max; i++) {
                var payAmount = tool.nfmoney(datalist[i].payAmount);
                // console.log('id', i, dataList[i], Object.prototype.toString(dataList[i]));
                var payDate = date.formatDateTime(datalist[i].payDate);
                html += '<tr>';
                html += '<td >' + payDate + '</td>';
                html += '<td>' + datalist[i].name + '</td>';
                html += '<td>' + payAmount + '</td>';
                switch (datalist[i].repayStatus) {
                    case 'init':
                        html += '<td>' + '初始状态' + '</td>';
                        break;
                    case 'repay':
                        html += '<td>' + '已还款' + '</td>';
                        break;
                    case 'unrepay':
                        html += '<td>' + '未还款' + '</td>';
                        break;
                }
                html += '</tr>';
            }
        }else{
            html = '<tr><td colspan="5" class="font16"><p class="pad-top-30 pad-bottom-30">暂无记录</p></td></tr>';

        }

        $('tbody.trlist').empty().append(html);
    }
     // 渲染列表 已投项目 还款中
    function getListHtml3(datalist) {
        console.log('html_2');
        // $('tbody.trlist').removeChild()(tr);
        var html = '',
            max = datalist.length;
        if(max){
            for (var i = 0; i < max; i++) {
                // console.log('id', i, dataList[i], Object.prototype.toString(dataList[i]));
                var detailId = datalist[i].idFlag.slice(-6,-1);
                html += '<tr>';
                html += '<td >'+datalist[i].name+'</td>';
                html += '<td>'+tool.nfmoney(datalist[i].transAmount) +'</td>';
                html += '<td>'+tool.nfmoney(datalist[i].payAmount)+'</td>';
                html += '<td>'+tool.nfmoney(datalist[i].noPayAmount)+'</td>';
                if(datalist[i].repayType==='equalityCorpus'){
                    html += '<td>'+'先息后本'+'</td>';
                }else{
                    html += '<td>'+'一次性还本付息'+'</td>';
                }
                html += '<td>'+date.formatDateTime(datalist[i].repayEndDate)+'</td>';
                html += '<td>'+'<a href='+'/baoli/'+detailId+'>'+'查看投资记录'+'</a>'+'</td>';
                html += '</tr>';
            }
        }else{
            html = '<tr><td colspan="5" class="font16"><p class="pad-top-30 pad-bottom-30">暂无记录</p></td></tr>';
        }

        $('tbody.trlist').empty().append(html);
    }
    // 渲染列表 已投项目 已结清
    function getListHtml4(datalist) {
        console.log('html_2');
        // $('tbody.trlist').removeChild()(tr);
        var html = '',
            max = datalist.length;
        if(max){
            for (var i = 0; i < max; i++) {
                // console.log('id', i, dataList[i], Object.prototype.toString(dataList[i]));
                var detailId = datalist[i].idFlag.slice(-6,-1);
                html += '<tr>';
                html += '<td >'+datalist[i].name+'</td>';
                html += '<td>'+tool.nfmoney(datalist[i].transAmount) +'</td>';
                html += '<td>'+tool.nfmoney(datalist[i].payAmount) +'</td>';
                html += '<td>'+date.formatDateTime(datalist[i].repayEndDate) +'</td>';
                if(datalist[i].repayType==='equalityCorpus'){
                    html += '<td>'+'到期结清'+'</td>';
                }else{
                    html += '<td>'+'未到期结清'+'</td>';
                }
                html += '<td>'+'<a href='+'/baoli/'+detailId+'>'+'查看回款'+'</a>'+'<br>'+'<a  href="">'+'查看合同'+'</a>'+'</td>';
                html += '</tr>';
            }
        }else{
            html = '<tr><td colspan="5" class="font16"><p class="pad-top-30 pad-bottom-30">暂无记录</p></td></tr>';
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
            $('#sumAmount').html(tool.nfmoney(res.data.data.sumAmount));
            $('#sumCoupon').html(tool.nfmoney(res.data.data.sumCoupon));
        });
    }
    //请求已投列表
    function gettrade(type,pageNo,index,starttime,endtime,fn) {
        console.log('yitou');
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
            var totalCount = res.data.totalCount;
            if(index===1) {
                getListHtml1(res.data.list);
                getPage.start(Math.ceil(totalCount/pageSize), function (pNo) {
                    console.log('第一个', pNo);
                    gettrade(type, pNo, index,starttime,endtime,function (res) {
                        getListHtml1(res.data.list);
                    });

                });
            }else if(index===2) {
                getListHtml3(res.data.list);
                getPage.start(Math.ceil(totalCount/pageSize), function (pNo) {
                    console.log('点击了一次，触发回调,当前是页数为：', pNo);
                    gettrade(type, pNo, index, starttime,endtime,function (res) {
                        getListHtml3(res.data.list);
                    });

                });
            }else if(index===3) {
                getListHtml4(res.data.list);
                getPage.start(Math.ceil(totalCount/pageSize), function (pNo) {
                    console.log('点击了一次，触发回调,当前是页数为：', pNo);
                    gettrade(type,pNo,index,starttime,endtime,function (res) {
                        getListHtml4(res.data.list);
                    });

                });
            }
        })
    }
    //请求还款列表
    function repaylist(type,pageNo,starttime,endtime,fn) {
        console.log(123);
        var repaylist = {
            mdname: '/get_repaylist.json',
            data: {
                needCount:true,
                pageSize:pageSize,
                pageNo:pageNo,
                type:type,
                queryDateStart:starttime,
                queryDateEnd:endtime
            }
        };
        ajax(repaylist,function (res) {
            fn(res)

        })
    }
    function getrepaylist(type,pNo,starttime,endtime){
        repaylist(type,pNo,starttime,endtime,function(res){
            console.log(11111,res);
            var totalCount = res.data.totalCount;
            getListHtml2(res.data.list);
            getPage.start(Math.ceil(totalCount/pageSize), function (pNo) {
                repaylist(type,pNo, starttime,endtime,function (res) {
                    console.log(res);
                    getListHtml2(res.data.list);
                });

            });
        });
    }
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
            console.log(bbb);
            $('.table>thead:eq('+bbb.para2+')').siblings().hide().end().show();

        }else{
            $('#para2').show();
            $('#para1').hide();
            console.log($('.table.thread'));
            $('.table>thead:eq(3)').siblings().hide().end().show();
        }
    }

    // 默认显示
    // $('.payment2:eq(0)').siblings().hide().end().show();
    // 点击变色事件
    // 一级点击
    $('.payment1 li').click(function() {
        $(this).addClass('active').siblings().removeClass('active');
        // 边界处理
        if($(this).index()===0){
            gettradelist($('ul#para1 li.active').index()+1,1,$('ul#para1 li.active').index()+1,starttime,endtime);
        }else{
            getrepaylist($('ul#para1 li.active').index()+1,1,starttime,endtime)
        }
        judge();
    });
    // 二级点击1
    $('ul#para1 li').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
        var bbb= new Dostates($('ul.payment1 li.active').index(),$('ul.payment2 li.active').index());
        console.log($(this).index());
        // 边界处理
        gettradelist($(this).index()+1,1,bbb.para2+1,starttime,endtime);
        judge();
    });
    // 二级点击2
    $('#para2 li').click(function() {
        $(this).addClass('active').siblings().removeClass('active');
        console.log($(this).index());
        // 边界处理
        getrepaylist($(this).index()+1,1,starttime,endtime);
        judge();
    });
    // $('ul#para1').siblings().hide().end().show();
    $('ul#para1').show();
    $('div#para2').hide();
    $('.thread:eq(0)').siblings().hide().end().show();


    function start() {
        if(showVal){
            console.log(showVal);
            $('.payment1 li').eq(1).addClass('active').siblings().removeClass('active');
            $('#para2 li:first-child').addClass('active').siblings().removeClass('active');
            judge();
            // 边界处理
            getrepaylist(1,1)
        }else{
            // 边界处理
            gettradelist(1,1,1);

        }
        // 边界处理
        gettotal();

    }

    return {start: start}
}()).start();


