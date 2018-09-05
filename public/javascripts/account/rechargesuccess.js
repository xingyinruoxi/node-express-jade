/**
 * Created by a110 on 17/5/11.
 */
'use strict';
window.rechargeSuccess = (function () {
    var tool = window.Rui.Tool;
    function getRechargeAmount() {
        var rechargeAmount=JSON.parse(sessionStorage.getItem('rechargeAmount'));
        $('#rechargeAmount').text(tool.nfmoney(rechargeAmount));
    }
    function start() {
        getRechargeAmount();
    }

    return {start: start}
}()).start();
