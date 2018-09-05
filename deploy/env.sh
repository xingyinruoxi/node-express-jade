#! /bin/bash
#打包命令：sh [path]/deploy/env.sh [test | pre | prod | local]
#配置环境
env=$1
echo "building ${env} starting..."

#定义需要处理的js文件名,最后的名字必须写在最后

names=(



index
other


aboutus\/companylist
aboutus\/hzhb
aboutus\/mediadetail
aboutus\/medialist
aboutus\/noticedetail
aboutus\/noticelist
aboutus\/reportlist




account\/accountoverview
account\/bankaccountinfo
account\/dealhistory
account\/friendhistory
account\/getcash

account\/getcashsuccess
account\/invitedfriends
account\/message
account\/myfriends
account\/myrepayment

account\/ratecoupon
account\/recharge
account\/rechargesuccess
account\/redpacket
account\/repaymentdetail

account\/securitysetup



activity\/activity
activity\/activityMarkjs



help\/help
help\/rmwt
help\/tzzjydetail
help\/tzzjy



product\/currentonsale
product\/factoring
product\/listbullionbill
product\/productconfirm
userSign\/signin,product\/productdetail
product\/productsuccess



userSign\/forgetpwdfinish
userSign\/forgetpwdmiddle
userSign\/forgetpwdstart
userSign\/signin
userSign\/signup
userSign\/signupSuccess



)







gulp cleanTest
gulp buildEnv
gulp css-min -p ${env}
gulp copy -p ${env}
gulp copy-fonts -p ${env}
gulp copy-config -p ${env}
gulp copy-pm2Config -p ${env}
gulp copy-favicon -p ${env}
gulp image-min -p ${env}
#打印数组长度
echo "files length : ${#names[@]}"



#for 循环遍历
#for var in ${names[@]};
echo '所有:'${names[*]}
for((i=0;i<${#names[@]};i++))
do
   echo "第$((${i}+1))/${#names[@]}个"  "还剩$((${#names[@]}-$i-1))个" 'she is：'${names[i]}
   gulp js-min -p ${env} -m ${names[i]}
   gulp htmlReplace -p ${env} -m ${names[i]}
   gulp rev -p ${env} -m ${names[i]}
done
