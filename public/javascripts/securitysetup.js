/**
 * Created by yangrui on 17/5/20.
 */
'use strict';
window.securitysetup=(function(){
    var ajax = window.Rui.Ajax,
        layer=window.Rui.layer;


    //获取测评结果类型
    function getAssType(score){
        /* 分值区间 客户风险类型
         81-100分 激进型
         61-80分 积极型
         36—60分 平衡型
         16-35分 稳健型
         -9-15分 保守型*/
        console.log('score',score);
        if(score>=-9&&score<=15){
            return '保守型';
        }else if(score>=16&&score<=35){
            return '稳健型';
        }else if(score>=36&&score<=60){
            return '平衡型';
        }else if(score>=61&&score<=80){
            return '积极型';
        }else if(score>=81&&score<=100){
            return '激进型';
        }else{
            return false;
        }
    }



    var test=0;//得分
    var assDic=[
        [-2,0,-2,-3,-10],
        [0,2,6,8,0],
        [2,4,8,10],
        [0,2,6,10],
        [0,2,6,8,10],

        [0,4,8,10],
        [0,4,6,10],
        [4,6,8,10],
        [2,6,10],
        [-5,0,5,10,15],

        [-2,0,2,4,5]
    ];
    function countRes(){
        console.log('3333');
        var assessmentRes=[],
            notDo=[],
            indexNo=1;
        $('.answer').each(function(){
            var value=$(this).attr('option');
            console.log(value);
            if(value){
                assessmentRes[parseInt(value.split('|')[0].substring(3))-1]=value.split('|')[1];
            }else{
                notDo.push(indexNo);
            }
            indexNo++;
        });
        if(notDo.length>3){
            $('#tip').text('请完成全部问题即可提交').parent().show();
            return true;
        }else if(notDo.length<=3&&notDo.length>0){
            $('#tip').text('第'+notDo.join('、')+'问题未勾选，请完成全部问题即可提交').parent().show();
            return true;
        }
        for(var i in assDic){
            if(assessmentRes[i]){
                console.log(11111111,i,assessmentRes[i],assDic[i][parseInt(assessmentRes[i])-1]);
                test+=(assDic[i][parseInt(assessmentRes[i])-1]);
            }
        }
        console.log('assessmentRes',assessmentRes,'test',test,'notDo',notDo);
        return false;
    }

    //测评结果弹出框
    function layerAssRes(){
        var paras={
            skin: 'layui-layer-rim',
            title:'测评结果',
            btn:'确定',
            area:['1015px'],
            content: '<div class="content border-bottom" style="padding:67px 50px 60px 50px;font-size: 20px;line-height:36px;"><span style="font-size:30px;">感谢您的配合</span>\<br\>评估意见：您的风险认知与风险承受力评级为<span class="color-red">'+getAssType(test)+'</span></div><p style="padding:20px 50px 72px 50px;font-size: 20px;line-height:36px;" class="text-left">出借人签署：原采购企业为某装饰工程有限公司，始创于1986年，是某世界500强企业旗下最具国际竞争力的建筑装饰企业，总部位于中国北京，资信等级AAA级，连续多年被评为全国建筑装饰行业百强企业，位列中国建筑装饰行业第一阵营。</p>',
        };
        layer(paras,function(){
            $('#security').show().next().hide();
        });
    }
    //测评题目选项的点击事件
    function bindAssessmentOpt(){
        $('.answer>label').bind('click',function(){
            $(this).css('color','#10002A').find('input').attr('checked','checked').
                end().siblings().css('color','').find('input').removeAttr('checked');
            console.log(11111,$(this).index()+1,$(this).find('input').attr('name'));
            $(this).parent().attr('option',$(this).find('input').attr('name')+'|'+($(this).index()+1));
            return false;
        });
    }
    //是否同意弹出框
    function layerAssNum(num){
        var paras={
            skin: 'layui-layer-rim',
            title:'温馨提示',
            content: '今年剩余'+num+'次测评机会，您在1个自然年内,\<br\>最多可以测评3次，以最近一次测评结果为准。',
            btn:num?'重新评估':'确定'
        };
        layer(paras,function(){
            if(num>0){
                $('#assessment').show().prev().hide();
                bindAssessmentOpt();//测评题目选项的点击事件

            }
        });
    }

    function getAssNum(){
            var paras = {
                mdname: '/getAssNum.json',
            };
            ajax(paras,function(res){
                //return false;
                var count=res.data.count;
                console.log('count',count);
                if(count>0){
                    layerAssNum(count);
                }
            });
    }
    //提交测评结果
    function submitAssRes(){
        //测评结果弹出框
        layerAssRes();
        /*var paras = {
            mdname: '/submitAssRes_se.json',
            data:{
                level: getAssType(test),
                score: test
            }
        };
        ajax(paras,function(){
            //测评结果弹出框
            layerAssRes();
        });*/
    }

    //测评结果弹出框
    function layerUserNotice(){
        var paras={
            id:'layer_result',
            skin: 'layui-layer-rim',
            title:'客户风认知和分享承受能力评估调查问卷',
            //btn:'确定1111',
            area:['1015px'],
            content: $('#alertresult'),
        };
        layer(paras,function(){
            $('#alertresult').hide();
            //$('#security').show().next().hide();
        });
    }

    function start(){


        //layerUserNotice();

        //layerAssRes();

        $('#assess').bind('click',function(){
            getAssNum();
        });
        $('#backSet').bind('click',function(){
            $('#security').show().next().hide();
        });
        $('.btn').bind('click',function(){
            if(countRes()){
                return true;
            }
            submitAssRes();
        });

        $('.pull-right').bind('click',function () {
            layerUserNotice();
            $('##alertresult').show();
        });
    }

    return {start:start}
})().start();