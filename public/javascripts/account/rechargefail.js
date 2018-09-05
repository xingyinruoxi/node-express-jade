/**
 * Created by a110 on 17/7/11.
 */
/**
 * Created by a110 on 17/5/11.
 */
'use strict';
window.rechargeFail = (function () {
    console.log(123,sessionStorage.getItem('resultMsg'));
    function getResultMsg() {
        $('.resultMsg').text(sessionStorage.getItem('resultMsg'));
    }
    function start() {
        getResultMsg();
    }

    return {start: start}
}()).start();
