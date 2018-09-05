'use strict';
window.wzdt = (function() {
    // 点击跳转热门问题详情
    function bindHotList() {
        $('.wzdt_help a.other').on('click',function () {
            sessionStorage.setItem('ProblemId', $(this).attr('tid'));
        });
        $('.wzdt_help a.hot').on('click',function () {
            sessionStorage.removeItem('ProblemId', $(this).attr('tid'));
        })
    }
    function start() {
        bindHotList();
    }
    return {
        start: start
    }
}()).start();