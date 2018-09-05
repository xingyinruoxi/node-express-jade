'use strict';
//点击单元格事件
function clickTD(num,obj){
    for(var i = 1; i <= 25; i++){
        if(num != i){
            $('#div' + i).hide();
        }
    }
    $('td[class="active"]').removeClass('active');
    $('#div' + num).show();//点击的此单元格显示及加上背景色
    $(obj).addClass('active');
}
(function(){
    var $oTabs=$('#tabs');
    var lx = '1';
    var $index;
    $oTabs.find('h4 a').click(function(){
        $index=$(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $oTabs.find('table').eq($index).removeClass('hidden').siblings('table').addClass('hidden');
        if($(this).attr('id') == 'left-title'){
            clickTD(1,$('#td_'+1));
        }else if($(this).attr('id') == 'right-title'){
            clickTD(13,$('#td_'+13));
        }
    });

    if( lx !== undefined && lx !== null && !isNaN(lx) && lx !== ''){

        var tabId = $('#td_'+lx).parent().parent().parent().attr('id');
        if(tabId == 'one'){
            $('#left-title').click();
        }else if(tabId == 'two'){
            $('#right-title').click();
        }
        clickTD(lx,$('#td_'+lx));
    }
})();
if(location.search){
    var id=location.search.replace(/[^0-9]/ig,'');
    if(id>=13){
        $('#left-title').removeClass('active');
        $('#right-title').addClass('active');
        $('#one').addClass('hidden');
        $('#two').removeClass('hidden');
    }
    clickTD(id,$('#td_'+id));
}




