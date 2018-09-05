/**
 * Created by yangrui on 17/6/3.
 */
'use strict';
window.signupSuccess2=(function () {
    var countDown = window.Rui.countDown;
    function start(){
        countDown.downUrl(3,'time','/user/bankaccountinfo.html');
    }

    return {start:start};
})().start();