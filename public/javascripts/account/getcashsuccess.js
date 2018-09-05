/**
 * Created by a110 on 17/5/11.
 */
'use strict';
window.getcashsuccess = (function () {
    var tool = window.Rui.Tool;
    // 获取本次提现金额
    function getcashval() {
        var cashAmount=JSON.parse(sessionStorage.getItem('getcash_amount')),
        //para1=cashAmount.getcashAmount,
            para2=tool.nfmoney(cashAmount.getcashIncomeamount);
        if(cashAmount){
            //$('#incomeAmout').html(para1);
            $('#this_cash').html(para2);
        }
    }
    function start() {
        getcashval();
    }

    return {start: start}
}()).start();