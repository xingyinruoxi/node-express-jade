'use strict';
window.currentonsale=(function () {
    var ajax = window.Rui.Ajax,
        tool = window.Rui.Tool,
        pageSize = 12,
        totalCount = 0,
        type='',
        date = window.Rui.Date,
        getPage = window.Rui.getPage;
    // 滚动到产品列表jo
    function scrollTo() {
        $('.banner>.btn').click(function(){
            $('html,body').animate({
                scrollTop: '890px'
            }, 500);
        });
    }
    // 滚动效果
    (function($){
        $.fn.FontScroll = function(){
            var d = {time: 2000,s: 'fontColor',num: 1};
            this.children('ul').addClass('line');
            var _con = $('.line').eq(0),
                _conH = _con.height(), //滚动总高度
                _conChildH = _con.children().eq(0).outerHeight(),//一次滚动高度
                _temp = _conChildH,  //临时变量
                _time = d.time,  //滚动间隔
                _s = d.s;  //滚动样式

            _con.clone().insertAfter(_con);//初始化克隆

            //样式控制
            var num = d.num;
            var _p = this.find('li');
            //var allNum = _p.length;

            _p.eq(num).addClass(_s);

            function over(){
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

                if(_conH <= _conChildH){
                    _con.animate({marginTop: '-'+_conChildH},'normal',over);
                } else {
                    _conChildH += _temp;
                }
            }

            var timeID = setInterval(Up,_time);
            this.hover(function(){clearInterval(timeID)},function(){timeID = setInterval(Up,_time);});


        }
    })(jQuery);


    // 渲染排行榜
    function randerRank(datalist) {
        var html = '',
            max=datalist.length;
        if(max){
            for(var i=0;i<max;i++){
                html +='<li class="row"><span class="col-20"><i class="ico ico-cup'+(i+1)+'"></i></span>';
                html += '<span class="col-50">'+datalist[i].name+'</span>';
                html += '<span class="col-30">'+tool.nfmoney(datalist[i].amount)+'</span></li>';
            }
        }else{
            html = '<div class="defa"> 暂无数据</div>';
        }
        $('ul.ranker').empty().append(html);

    }
    // 渲染投资记录
    function randerHistory(datalist) {
        var html = '',
            max = datalist.length;
        if(max){
            for(var i=0;i<max;i++){
                html += '<li class="row">';
                html += '<span class="col-20"><a href="javascript:;" class="';
                html += ( (datalist[i].source == 'android')?'bg-android':'' )||( (datalist[i].source == 'pc')?'bg-pc':'' )||( (datalist[i].source == 'ios')?'bg-apple':'' )||( (datalist[i].source == 'h5')?'bg-weixin':'' )||'bg-pc';
                html += '"></a></span>';
                html += '<span class="col-50">'+datalist[i].name+'</span>';
                html += '<span class="col-30">'+tool.nfmoney(datalist[i].amount)+'</span>';
                html += '</li>';
            }
            $('#FontScroll ul').empty().append(html);
            $('#FontScroll').FontScroll({time: 3000,num: 1});
        }
        else{
            html = '<div class="defa"> 暂无数据</div>';
            $('#FontScroll ul').empty().append(html);
        }



    }
    // 获取排行榜投资记录数据
    function getCurrent() {
        var paras = {
            mdname: '/get_rank.json',
            data: {}
        };
        ajax(paras, function (res) {
            //console.log(res.data);
            randerRank(res.data.financingTopVOS);
            randerHistory(res.data.investRecordVOS);
        });
    }
    // 绑定点击事件
    function bindClick() {
        $('.product_item a.btn').bind('click', function () {
            var pid=$(this).closest('li').attr('pid'),
                proType=$(this).closest('li').find('span').text(),
                urlType=proType=='保'?'/baoli/':''||proType=='税'?'/tuishuidai/':''||proType=='票'?'/piaojudai/':'';
            sessionStorage.setItem('ProductId', pid);
            //console.log(pid,pid.substring(pid.length-6));
            //return false;
            location.href=(urlType+pid+'.html');

            //if(location.href.indexOf('baoli')>0){
            //    location.href +=('/'+pid.substring(0,5)+'.html');
            //}else{
            //    location.href +=('/'+pid.substring(0,5)+'.html');
            //}

        });
    }
    // 渲染票据列表
    function getListHtml(datalist) {
        var html = '',
            max = datalist.length;
        if(max){
            for (var i = 0; i < max; i++) {
                html += '<li ' + (i % 4 === 0 ? ('style=margin-left:0') : '') + ' class="product_item" pid=' + datalist[i].id + '>';
                html += '<span class="hot">'+((datalist[i].type=='default'?'保':'')||(datalist[i].type=='bankPaper'?'票':'')||(datalist[i].type=='exportRebate'?'税':''))+'</span>';
                html += '<dl>';
                html += '<dt>'+ datalist[i].name+'</dt>';
                html += '<dd>';
                html += '<div class="percent">'+ tool.nfmoney(datalist[i].annualRate,'0',2)+'%</div>';
                html += '<p class="color-gray">';
                html += '出借期限:' + datalist[i].timeLimit + '天&emsp;';
                html += '借款金额:'+ tool.nfmoney(datalist[i].amount,-6,2) + '万';
                html += '</p>';
                html += '<div class="progress">';
                html += '<div class="progress_bar" style="width:';
                html += ((datalist[i].tenderStatus!=='tendering')||Math.round(datalist[i].tenderAmount/datalist[i].amount*100)>100)?100:Math.round(datalist[i].tenderAmount/datalist[i].amount*100);
                html += '%"></div>';
                html += '</div>';
                html += '<a href="javascript:;" class="btn ' + ((datalist[i].tenderStatus == 'tendering') ? 'default' : 'disabled') + '">';
                html += ( (datalist[i].tenderStatus == 'tendering') ? '立即投资' : '') || ( (datalist[i].tenderStatus == 'full') ? '已满标' : '') || ( (datalist[i].tenderStatus == 'repaying') ? '还款中' : '') || ( (datalist[i].tenderStatus == 'repay') ? '已还款' : '')||'已满标';
                html += '</a></dd>';
                html += '</dl>';
                html += '</li>';
                console.log('publishTime',datalist[i].publishTime,date.formatDateTime(datalist[i].publishTime,'hms'));

            }
        }
        else{
            html ='<div class="def">暂无项目</div>';
        }
        $('ul.product_list').empty().append(html);
        bindClick();

    }


    //获取商品列表数据 jo
    function getDetailList(pageNo, callback) {
        var paras = {
            mdname: '/get_currentsale.json',
            data: {
                needCount: true,
                pageNo: pageNo,
                status: 10,
                pageSize: pageSize,
                type:type
            }
        };
        ajax(paras, callback);
    }

    function start(){
        scrollTo();
        // 边界处理
        getCurrent();
    
        // 边界处理
        getDetailList(1, function (res) {

            totalCount = res.totalCount;
            getListHtml(res.list);
            getPage.start(Math.ceil(totalCount/pageSize), function (pNo) {
                console.log('点击了一次，触发回调,当前是页数为：', 1);
                getDetailList(pNo, function (res) {
                    getListHtml(res.list);
                });

            });
        });
        
        

    }
    return {start:start};
}()).start();
