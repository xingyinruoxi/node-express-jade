/**
 * Created by yangrui on 17/4/25.
 */
'use strict';
window.forgetpwdFinish=(function () {
    var countDown=window.Rui.countDown;

    function start(){
        countDown.downUrl(3,'time','/');
    }

    return {start:start};
}()).start();