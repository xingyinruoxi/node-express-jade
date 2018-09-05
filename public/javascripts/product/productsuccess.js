
'use strict';
window.productsuccess=(function () {
    var pid = sessionStorage.getItem('ProductId'),
        ajax = window.Rui.Ajax,
        tool = window.Rui.Tool;
    //获取出借成功信息
    function getProductSuccess() {
        var paras = {
            mdname: '/productdetail_success.json',
            data: {
                id: pid
            }
        };
        ajax(paras, function (res) {
            if(!res.success){
                return false;
            }
            var data = res.data;
            $('.rechargeResult tbody tr').html('<td>'+data.productName+'</td><td>'+tool.nfmoney(data.transAmount)+'</td><td>'+tool.nfmoney(data.annualRate,0,2,'z')+'%</td><td>'+data.timeLimit+'天</td><td>成功</td>');
        });
    }
    function start() {
        //获取出借成功信息
         getProductSuccess();
    }
    return {
        start:start,
    }
}()).start();