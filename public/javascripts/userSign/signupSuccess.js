/**
 * Created by yangrui on 17/6/3.
 */
'use strict';
window.signupSuccess2=(function () {
    var countDown = window.Rui.countDown,
        ajax = window.Rui.Ajax;

    function getnoreadmessage(){
        var paras = {
            mdname: '/get_unread.json',
        };
        ajax(paras, function (res) {
            console.log('res',res);
        });
    }
    //注册成功收益
    function userActivity() {
        var registerAmount=JSON.parse(sessionStorage.getItem('registerAmount')),
            openAccountAmount=JSON.parse(sessionStorage.getItem('openAccountAmount'));
        if(registerAmount){
            $('#registerAmount').removeClass('hidden').find('span').text(registerAmount);
        }
        if(openAccountAmount){
            $('#openAccountAmount').removeClass('hidden').find('span').text(openAccountAmount);
        }
    }
    function start(){
        //注册成功收益
        userActivity();
        countDown.downUrl(10,'time','/user/bankaccountinfo.html');
        getnoreadmessage();
    }

    return {start:start};
})().start();