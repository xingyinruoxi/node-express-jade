'use strict';
window.signin = (function () {
    var ajax = window.Rui.Ajax,
        layer=window.Rui.layer;
    var clipboard2;
    function getdata(){
        var paras = {
            mdname: '/getBarcode.json',
        };
        ajax(paras, function (res) {
            $('#vcode').attr('src',res);
            console.log(222222,res);
        },'','GET');


        //var paras = {
        //    mdname: '/getBarcode.json',
        //    data: {
        //        url:'https://www.jintoushou.com/user/toRegisterPage'
        //        // id: 'string',
        //        // mobile: 15911017679
        //    }
        //};
        //
        //ajax(paras, function (res) {
        //    console.log(99999,res);
        //    //$('.col-55 img').attr('src',res.href);
        //});
    }

    //是否同意弹出框
    function layerCopy(){
        var paras={
            skin: 'layui-layer-rim layui-layer-none',
            title:'温馨提示',
            content: '<div style="padding-top: 50px;font-size: 15px;line-height: 32px;">复制成功!</div>',
            btn:'确定'
        };
        layer(paras,function(){});
    }

    function copy() {
        $(document).ready(function(){
            /* jshint ignore:start */
            clipboard2 = new Clipboard('.invitedfriends_btn');
            /* jshint ignore:end */
            clipboard2.on('success', function(e) {
                console.log(e);
                layerCopy();
            });
            clipboard2.on('error', function(e) {
                console.log(e);
            });
        })
    }


    function start(){
        getdata();
        copy();
    }
    return{start:start}
})().start();