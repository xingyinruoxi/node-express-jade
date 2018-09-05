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
         81-100分 激进型 5
         61-80分 积极型 4
         36—60分 平衡型 3
         16-35分 稳健型 2
         -9-15分 保守型 1*/
        console.log('score',score);
        if(score>=-9&&score<=15){
            return '1';
        }else if(score>=16&&score<=35){
            return '2';
        }else if(score>=36&&score<=60){
            return '3';
        }else if(score>=61&&score<=80){
            return '4';
        }else if(score>=81&&score<=100){
            return '5';
        }else{
            return false;
        }
    }

    var test=0;//得分

    // 测评结果显示为字符
    function getAssTypeChinese (){
        var n = getAssType(test);
        switch(n)
        {
            case '1':
                return '保守型';
            case '2' :
                return '稳健型';
            case '3' :
                return '平衡型';
            case '4' :
                return '积极型';
            case '5' :
                return '激进型';
            default:
                return '';
        }
    }

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
            skin: 'layui-layer-rim layui-layer-result',
            title:'测评结果',
            btn:'确定',
            area:['1015px','520px'],
            content: '<div class="content border-bottom" style="padding:57px 50px 50px 50px;font-size:18px;line-height:34px;"><span style="font-size:28px;">感谢您的配合</span><div class="pad-top-20"><img src="../images/account/flag.png"> </div>\<br\>评估意见：您的风险认知与风险承受力评级为<span class="color-red">'+getAssTypeChinese ()+'</span></div><p style="padding:20px 50px 72px 50px;font-size:20px;line-height:36px;text-align: justify;" class="text-left">出借人签署：依据诚实守信的原则，本人如实填写了本问卷。本人已知晓自己的风险承受能力评估结果，并在做出出借决策前将认真阅读相关风险揭示内容，了解出借标的的风险级别。</p>',
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
            skin: 'layui-layer-rim layui-layer-none',
            title:'温馨提示',
            content: '<div style="padding-top: 50px;font-size: 15px;line-height: 32px;">今年剩余'+num+'次测评机会，您在1个自然年内,\<br\>最多可以测评3次，以最近一次测评结果为准。</div>',
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
                var count=res.data.count;
                console.log('count345678',count);
                if(count==='3'){
                    $('#assessment').show().prev().hide();
                    bindAssessmentOpt();//测评题目选项的点击事件
                }else if(count>0){
                    layerAssNum(count);
                }
            });
    }
    //提交测评结果
    function submitAssRes(){
        //测评结果弹出框
        //layerAssRes();
        var paras = {
            mdname: '/productdetail_submitAssRes.json',
            data:{
                level: getAssType(test),
                score: test,
                signToken: $('#signToken').val(),
                signTicket: $('#signTicket').val(),
            }
        };
        ajax(paras,function(){
            //测评结果弹出框
            layerAssRes();
        });
    }

    //测评结果弹出框
    function layerUserNotice(){
        var paras={
            id:'layer_result',
            skin: 'layui-layer-rim',
            title:'客户风险认知与风险承受能力评估调查问卷',
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
        if(window.location.search){
            $('#assessment').show().prev().hide();
            bindAssessmentOpt();//测评题目选项的点击事件
        }


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
            $('#alertresult').show();
        });
    }

    return {start:start}
})().start();