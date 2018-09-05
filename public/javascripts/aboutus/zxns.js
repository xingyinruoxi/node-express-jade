'use strict';

(function(a){
    a.fn.LightBox = function(options){
        var defaults = {
            controls : true          //上一张、下一张是否显示，默认是显示true
        }
        var opts = a.extend(defaults, options);
        var imgObj = new Image();
        var margintop = 0 - (imgObj.height)/2;
        var obj = a(this);
        var numpic = obj.find('li').length;
        var num = 0;

        //controls
        if(opts.controls){
        }

        function imgobj(obj1, obj2){
            //imgObj.height是通过img对象获取的图片的实际高度

            imgObj.src = obj1.attr('src');
            obj2.css('margin-top',margintop);

        }

        this.each(function(){

            //点击赋值并显示
            obj.find('img').click(function(){
                //var src1 = a(this).attr('src');
                a('.lg_img').attr('src',a(this).attr('src'));
                imgobj(a('.lg_img'), a('.lightbox'));

                a('.lb_wrap').fadeIn();
                a('.lg_img').fadeIn();
                a('.prev').fadeIn().siblings('.next').fadeIn();
                num = a(this).parent().index();   //获取当前图片的父元素的索引并赋给num为后边点击上一张、下一张服务
            });

            //上一张
            a('.prev').click(function(){
                if(num === 0){
                    num = numpic;
                }
                console.log(num);
                a('.lg_img').attr('src',obj.find('li').eq(num-1).find('img').attr('src'));
                imgobj(a('.lg_img'), a('.lightbox'));

                num--;
            });

            //下一张
            a('.next').click(function(){
                if(num === numpic-1){
                    num = -1;
                }
                a('.lg_img').attr('src',obj.find('li').eq(num+1).find('img').attr('src'));
                imgobj(a('.lg_img'), a('.lightbox'));

                num++;
            });

            //点击除了上一张、下一张之外的其他地方隐藏
            a('.lb_wrap').click(function(e){
                //var e = e || window.event;
                var elem = e.target || e.srcElement;
                while(elem){
                    if (elem.className && elem.className.indexOf('prev')>-1) {
                        return;
                    }
                    if(elem.className && elem.className.indexOf('next')>-1){
                        return;
                    }
                    elem = elem.parentNode;
                }
                a(this).find('img').attr('src','/images/aboutus/loading.gif').hide();      //隐藏后，再将默认的图片赋给lightbox中图片的src
                a(this).find('.prev').hide().siblings('.next').hide();
                a(this).fadeOut();
            });
        })
    }
})(jQuery);
$(function () {
    var $tab=$('.dl_tab1'),
        $tabDt=$tab.find('dt'),
        $dd=$tab.find('dd');
    $tabDt.find('a').on('click',function () {
        $(this).addClass('active').siblings().removeClass('active');
        $dd.eq($(this).index()).addClass('active').siblings().removeClass('active');
    });
});

$('.dl_tab dd').eq(0).LightBox({});
$('.dl_tab dt a').on('click',function () {

    $('.dl_tab dd').eq($(this).index()).LightBox({});

});
