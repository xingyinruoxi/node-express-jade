'use strict';
window.indexjs= (function () {
    (function($){
        $.fn.FontScroll = function(options){
            var d = {time: 3000,s: 'fontColor',num: 1}
            var o = $.extend(d,options);


            this.children('ul').addClass('line');
            var _con = $('.line').eq(0);
            var _conH = _con.height(); //滚动总高度
            var _conChildH = _con.children().eq(0).outerHeight();//一次滚动高度
            var _temp = _conChildH;  //临时变量
            var _time = d.time;  //滚动间隔
            var _s = d.s;  //滚动间隔


            _con.clone().insertAfter(_con);//初始化克隆
            //样式控制
            var num = d.num;
            var _p = this.find('li');
            var allNum = _p.length;

            function over(){
                //alert(0);
                _con.attr('style','margin-top:0');
                _conChildH = _temp;
                num = 1;
                _p.removeClass(_s);
                _p.eq(num).addClass(_s);
            }
            function Up(){
                _con.animate({marginTop: '-'+_conChildH});
                //样式控制
                _p.removeClass(_s);
                num += 1;
                _p.eq(num).addClass(_s);

                if(_conH == _conChildH){
                    _con.animate({marginTop: '-'+_conChildH},'normal',over);
                } else {
                    _conChildH += _temp;
                }
            }
            _p.eq(num).addClass(_s);


            var timeID = setInterval(Up,_time);
            this.hover(function(){clearInterval(timeID)},function(){timeID = setInterval(Up,_time);});


        }
    })(jQuery);
    //风险提示
    function riskWrning() {
        var welcome = sessionStorage.getItem('welcome');
        var layer=window.layer||{};
        if(!welcome){
            layer.open({
                type: 1//Page层类型
                ,area: ['568px','360px']
                ,skin:'layer_index'
                ,shade: 0.1//遮罩透明度
                ,id: 'layer_security_tips'
                ,title: '金投手温馨提示：投资有风险，出借需谨慎'
                ,btn:'我知道了'
                ,btnAlign: 'c'
                ,move: false
                ,closeBtn:0
                ,anim: 0 //0-6的动画形式，-1不开启
                ,content:$('.layer_security_tips')
            });
        }
        $('.layui-layer-btn0').on('click',function () {
            sessionStorage.setItem('welcome', '1');
        });
    }
    //轮播图
    function carousel(obj){
        /*=== 轮播图 ===*/
        var $pagination=obj.find('.carousel_pagination span'),
            iNow=0,
            $Next=obj.find('.next'),
            $Prev=obj.find('.prev'),
            timer=null;
        var lengh=$pagination.length;
        function move(fadeInTime,fadeOutTime) {
            if(iNow>lengh-1)
            {
                iNow=0;
            }
            else if(iNow<0)
            {
                iNow=lengh-1;
            }
            $pagination.eq(iNow).addClass('active').siblings().removeClass('active');
            obj.find('ul li').eq(iNow).fadeIn(fadeInTime).siblings().fadeOut(fadeOutTime);
            if(obj.find('.dec').html()){
                obj.find('.dec').text(obj.find('ul').find('li').eq(iNow).find('img').attr('alt'))
            }
        }
        function autoMove() {
            iNow++;
            move(2000,1500);
        }

        timer=setInterval(autoMove,4000);
        obj.hover(function(){
            clearInterval(timer);
        },function(){
            timer=setInterval(autoMove,4000);
        });
        $pagination.on('mouseover',function () {
            iNow=$(this).index();
            move(2000,1500);
        });
        $Next.click(function(){
            iNow--;
            move(500,1500);
        });
        $Prev.click(function(){
            iNow++;
            move(2000,1500);
        });
    }
    //轮播图使用
    function useCarousel() {
        var $carousel01=$('#carousel01');
        carousel($carousel01);
        var $carousel02=$('#carousel02');
        carousel($carousel02);
    }
    //board下落
    function board() {
        $('.board').animate({'top':80},1000);
    }
    //公告
    function notice() {
        $('#FontScroll').FontScroll({time: 3000,num: 1});
    }
    //合作伙伴
    function partner() {
        var onOff=true;
        $('.partner dt a').click(function(){
            if(onOff){
                $(this).removeClass('color-gray').addClass('color-red').text('收起');
            }else{
                $(this).removeClass('color-red').addClass('color-gray').text('更多');
            }
            $('.partner').find('dd').eq(1).toggleClass('hidden');
            onOff=!onOff;
        });
    }

    // 绑定点击事件
    function bindClick() {
        $('.product_regular a.btn_default').bind('click', function () {
            sessionStorage.setItem('ProductId', $(this).attr('id'));

        });
    }
    function start() {

        //风险提示
        riskWrning();
        //轮播图使用
        useCarousel();
        //board下落
        board();
        //公告
        notice();
        //合作伙伴
        partner();
        // 绑定点击事件
        bindClick();
    }
    return {
        start: start
    }
}()).start();
