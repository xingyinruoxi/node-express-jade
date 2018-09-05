'use strict';
window.myrepayment = (function () {
    var ajax = window.Rui.Ajax,
        pid = sessionStorage.getItem('ProjectId'),
        tool = window.Rui.Tool,
        date = window.Rui.Date;
    function randerList(dataList) {
        var html = '',
            max = dataList.length;
        if(max){
            for(var i=0;i<max;i++){
                html = '<tr>';
                html += '<td>'+date.formatDateTime(dataList[i].payDate)+'</td>';
                html += '<td>'+tool.nfmoney(dataList[i].interestAmount) +'</td>';
                html += '<td>'+tool.nfmoney(dataList[i].principalAmount )+'</td>';
                html += '<td>'+ (dataList[i].repayStatus=='repay'? '已还款':'待还款') +'</td>';
                html +='</tr>';
            }
        }else{
            html ='<tr><td>暂无回款</td></tr>';
        }
        $('tbody').empty().append(html);
    }
    //获取项目详情
    function getProjectDetails() {
        var paras = {
            mdname: '/get_repaylist.json',
            data: {
                tradeId : pid,
                needCount:true,
                pageSize:5,
                pageNo:1
            }
        };
        ajax(paras, function (res) {
            if(!res.success){
                return false;
            }
            randerList(res.list);
            $('h3').text(res.list[0].name);
            $('.payAmount').text(tool.nfmoney(res.list[0].payAmount));
        });
    }
    function start() {
        getProjectDetails();
    }
    return {start: start}
}()).start();

