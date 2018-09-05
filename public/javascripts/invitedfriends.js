///**
// * Created by yangrui on 17/5/22.
// */
'use strict';

window.signin = (function () {
    var ajax = window.Rui.Ajax;
    const apiDomain = 'https://test-api.jintoushou.com';
    //$('.col-55 img').attr('src',apiDomain+'/gateway/qr/create?mobile='+15911111119);
    function getdata(){
        var paras = {
            mdname: '/getBarcode.json',
            data: {
                id: 'string',
                mobile: 15911017679
            }
        };
        console.log('通过');
        ajax(paras, function (res) {
            $('.col-55 img').attr('src',res.href);
        });
    }
    function start(){
        getdata();
        console.log(1111);
    }
    return{start:start}
})().start();