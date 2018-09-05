

'use strict';
window.getcash = (function () {
    var check = window.Rui.Check,
        tool = window.Rui.Tool,
        ajax = window.Rui.Ajax,
        pageSize = 5,
        totalCount = 0,
        getPage = window.Rui.getPage,
        alert = window.Rui.Alert,
        date = window.Rui.Date,
        thisURL = document.URL,
        getVal1 =thisURL.split('&')[0].split('?')[1],
        getVal2 =thisURL.split('&')[1],
        showVal1= getVal1.split('=')[1],
        showVal2=  decodeURI(getVal2.split('=')[1]);

    console.log(showVal1,showVal2);
    $('#friendname').html(showVal2);
    function getListHtml(datalist) {
        var html = '',
            max = datalist.length;
        if(max){
            for (var i = 0; i < max; i++) {
                var payDate = date.formatDateTime(datalist[i].time);
                html += '<tr>';
                html += '<td>'+payDate +'</td>';
                html += '<td >'+datalist[i].name+'</td>';
                html += '<td>'+tool.nfmoney(datalist[i].amount) +'</td>';
                html += '</tr>';
            }
        }else{
            html += '<tr><td></td><td >暂无出借记录</td><td></td></tr>';
        }

        $('#newfriendslist').empty().append(html);
    }

    //发起请求
    function get(pageNo,fn) {
        var repaylist = {
            mdname: '/get_friendshistory.json',
            data: {
                needCount:true,
                pageSize:pageSize,
                pageNo:pageNo,
                userId:showVal1
            }
        };
        ajax(repaylist,function (res) {
            fn(res)
        })
    }
    function getHistory(pNo){
        get(pNo,function(res){
            var totalCount = res.totalCount;
            getListHtml(res.list);
            getPage.start(totalCount/pageSize, function (pNo) {
                console.log('点击了一次，触发回调,当前是页数为：', pNo);
                get(pNo, function (res) {
                    getListHtml(res.list);
                });
            })
        })
    }
    function start() {
        getHistory(1);
    }
    return {start: start}
}()).start();

// $('#btn_getcash').click(function(){
//     alert(1)
// })
// $('#getcashAmount').blur(function () {
//     alert(1)
// })


