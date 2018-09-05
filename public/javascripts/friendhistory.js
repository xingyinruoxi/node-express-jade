

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
        showVal2=  decodeURI(getVal2.split('=')[1]),
        istruemsgVcode = false,//是否是正确的短信验证码
        isovertime=false,//验证码是否超时
        alertControl={rechargeAmount:false,rechargeVcode:false},//设置弹出框的开关
        waitingtime = 60,//设置等待时间
        countdown = waitingtime;//设置重置时间
    console.log(showVal1,showVal2);
    $('#friendname').html(showVal2);
    function getListHtml(datalist) {
        // $('tbody.trlist').removeChild()(tr);
        var html = '',
            max = datalist.length,
            dataList = datalist;
        for (var i = 0; i < max; i++) {
            // var payDate = new Date(datalist[i].payDate).toLocaleString();
            var payDate = date.formatDateTime(datalist[i].payDate);
            // console.log('id', i, dataList[i], Object.prototype.toString(dataList[i]));
            html += '<tr>';

            html += '<td>'+payDate +'</td>';
            html += '<td >'+datalist[i].name+'</td>';
            html += '<td>'+datalist[i].payAmount +'</td>';
            html += '</tr>';
        }

        $('#newfriendslist').empty().append(html);
    }

//发起请求
    function get(pageNo,fn) {
        var repaylist = {
            mdname: '/get_repaylist.json',
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
            var totalCount = res.data.totalCount;

            getListHtml(res.data.list);

            getPage.start(totalCount/pageSize, function (pNo) {
                console.log('点击了一次，触发回调,当前是页数为：', pNo);
                get(pNo, function (res) {
                    getListHtml(res.data.list);
                });
            })
        })

    }

    function  showValf(){
        console.log(showVal1);
        // $('#newfriendslist').html(showVal);
    }
    function start() {
        getHistory(1);
        showValf()
    }

    return {start: start}
}()).start();

// $('#btn_getcash').click(function(){
//     alert(1)
// })
// $('#getcashAmount').blur(function () {
//     alert(1)
// })


