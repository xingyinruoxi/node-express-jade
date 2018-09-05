/**
 * Created by a110 on 17/5/9.
 */
'use strict';
window.myfriends = (function () {
    var ajax = window.Rui.Ajax,
        tool = window.Rui.Tool,
        check = window.Rui.Check,
        pageSize = 5,
        date = window.Rui.Date,
        getPage = window.Rui.getPage;

    // 渲染普通账户好友列表
    function renderComFriend(datalist) {
        $('#whetherpay').html('是否出借');
        var html = '',
            max;
        if (datalist&&datalist.length) {
            max = datalist.length;
            for (var i = 0; i < max; i++) {
                console.log(i);
                var friendsTime = date.formatDateTime(datalist[i].time);
                html += '<tr>';
                html += '<td >'+datalist[i].name+'</td>';
                html += '<td>'+friendsTime +'</td>';
                html += '<td value="'+datalist[i].name+'"><a  href="javascript:void(0)" value="'+datalist[i].userId+'">'+datalist[i].isTrade +'</a></td>';
                html += '</tr>';
            }
        }else{
            html = '<tr><td colspan="5" class="font16"><p class="pad-top-30 pad-bottom-30">暂无好友</p></td></tr>';
        }
        $('#myFriendsBodyF').empty().append(html);
    }
    // 渲染递推用户好友列表
    function renderEmpFriend(datalist) {
        $('#whetherpay').html('累计出借');
        var html = '',
            max;
        if (datalist&&datalist.length) {
            max = datalist.length;
            for (var i = 0; i < max; i++) {
                console.log(i);
                var friendsTime = date.formatDateTime(datalist[i].time);
                html += '<tr>';
                html += '<td >'+datalist[i].name+'</td>';
                html += '<td>'+friendsTime +'</td>';
                html += '<td value="'+datalist[i].name+'"><a  href="javascript:void(0)" value="'+datalist[i].userId+'">'+tool.nfmoney(datalist[i].amount)+'</a></td>';
                html += '</tr>';
            }
        }else{
            html = '<tr><td colspan="5" class="font16"><p class="pad-top-30 pad-bottom-30">暂无好友</p></td></tr>';
        }
        $('#myFriendsBody').empty().append(html);
        $('#myFriendsBody a').click(function(){
            var  userId =$(this).attr('value');
            var  name =$(this).parent().attr('value');
            console.log(userId,encodeURI(name));
            window.location.href='/user/friendhistory.html?userId='+userId+'&name='+encodeURI(name);
        });
    }

    // 渲染好友投资列表
    function getListHtml(datalist) {

        if($('#myFriendsBody').attr('id')){
            renderEmpFriend(datalist);//递推账户
        }
        else {
            renderComFriend(datalist);// 普通用户
        }
    }

    //请求我的好友列表ajax
    function getMyfriendslist(pageNo,fn) {
        var friendslist = {
            mdname: '/get_myFriendsList.json',
            data: {
                needCount: true,
                pageNo: pageNo,
                pageSize: pageSize
            }
        };
        ajax(friendslist,function (res) {
            fn(res)
        })
    }
    // 请求好友最终
    function getMyfriends(pNo){
        getMyfriendslist(pNo,function(res){
            var totalCount = check.ishas(res.totalCount);
            $('#friendsNum').html(totalCount);
            getListHtml(res.list);
            getPage.start(totalCount/pageSize, function (pNo) {
                console.log('点击了一次，触发回调,当前是页数为：', pNo);
                getMyfriendslist(pNo, function (res) {
                    getListHtml(res.list);
                });
            });
        })
    }
    function start() {
        //获取我的好友列表
        getMyfriends(1);
    }
    return {start: start}
}()).start();