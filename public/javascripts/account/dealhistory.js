'use strict';
window.dealhistory = (function () {
    var end=window.end||{};
    var laydate=window.laydate||{};
    var ajax = window.Rui.Ajax,
        tool = window.Rui.Tool,
        pageSize = 10,
        starttime,
        endtime,
        thisURL = document.URL,
        getVal =thisURL.split('?')[1],
        showVal= getVal.split('=')[1],
        getPage = window.Rui.getPage;
    var start1 = {
        elem: '#start',
        format: 'YYYY/MM/DD  hh:mm:ss',
        // min: laydate.now(), //设定最小日期为当前日期
        max: '2099-06-16', //最大日期
        istime: true,
        istoday: false,
        choose: function(datas){
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas; //将结束日的初始值设定为开始日
            // starttime = new Date(datas);
            starttime = (new Date(datas)).getTime();

        }
    };
    end = {
        elem: '#end',
        format: 'YYYY/MM/DD hh:mm:ss',
        min: laydate.now(),
        max: '2099-06-16',
        istime: true,
        istoday: false,
        choose: function(datas){
            start1.max = datas; //结束日选好后，重置开始日的最大日期
            // endtime = new Date(datas);
            endtime = (new Date(datas)).getTime();

        }
    };
    laydate(start1);
    laydate(end);

    // 渲染列表
     var a=1;
    function getListHtml(datalist,type) {
        var html = '';
        if(datalist.length){
            // $('tbody.trlist').removeChild()(tr);
            var max = datalist.length;
            for (var i = 0; i < max; i++) {
                var time = new Date(datalist[i].time).toLocaleString(),
                    amount = tool.nfmoney(datalist[i].amount);
                // console.log('id', i, dataList[i], Object.prototype.toString(dataList[i]));
                html += '<tr>';
                html += '<td >' + time + '</td>';
                html += '<td>' + datalist[i].type + '</td>';
                html += '<td>' + datalist[i].info + '</td>';
                html += '<td>' + (amount.match(/\-/)?'':'+') + amount + '</td>';
                /*switch (datalist[i].status) {
                    case 'init':
                        html += '<td>' + '处理中' + '</td>';
                        break;
                    case 'expire':
                        html += '<td>' + '投资失败' + '</td>';
                        break;
                    case 'success':
                        html += '<td>' + '交易成功' + '</td>';
                        break;
                    case 'flow':
                        html += '<td>' + '投资流标' + '</td>';
                        break;
                    default:
                        html += '<td>' + '成功' + '</td>';
                }*/
                html += '</tr>';
            }
        }else{
            html = '<tr><td colspan="5" class="font16"><p class="pad-top-30 pad-bottom-30">';
            switch(type) {
                case '0' :
                    html += '暂无交易明细';
                    break;
                case '1' :
                    html += '暂无充值明细';
                    break;
                case '2' :
                    html += '暂无提现明细';
                    break;
                case '3' :
                    html += '暂无出借明细';
                    break;
                case '4' :
                    html += '暂无回款明细';
                    break;
                case '5' :
                    html += '暂无还本明细';
                    break;
                default:
                    html += '暂无明细';
            }
            html +='</p></td></tr>';
        }
        $('tbody.trlist').empty().append(html);
    }
    // 请求接口
    function gethistorylist(type,pageno,starttime,endtime,fn) {
        var historylist = {
            mdname: '/get_dealhistory.json',
            data: {
                needCount: true,
                pageno: pageno,
                pageSize: pageSize,
                type: type,
                queryDateStart:starttime,
                queryDateEnd:endtime
            }
        };
        ajax(historylist, function (res) {
            fn(res);

        });
    }
    // 不同交易类型请求数据
    function commongetdata(type,pNo,starttime,endtime){
        gethistorylist(type,pNo,starttime,endtime,function(res){
           // console.log(11111,res);
            var totalCount = res.totalCount;
            getListHtml(res.list,type);
            getPage.start(Math.ceil(totalCount/pageSize), function (pNo) {
                gethistorylist(type,pNo, starttime,endtime,function (res) {
                    //console.log(res);
                    getListHtml(res.list,type);
                });
            });
        });
    }
    // 点击请求数据变化及颜色变化
    function clickajax () {
        $('ul.nav_pills li a').click(function(){
            $(this).parent().addClass('active').siblings().removeClass('active');
            commongetdata($(this).attr('value'),1,starttime,endtime)
        });
    }
    function start() {
          // 边界处理
        if(showVal){
            console.log(showVal);
            //$('ul.nav_pills li').eq(showVal).addClass('active').siblings().removeClass('active');
            commongetdata(showVal,1);
        }else{
           commongetdata(1,1);
        }
        clickajax();
    }

    return {start: start}
}()).start();
