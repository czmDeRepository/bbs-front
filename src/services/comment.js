export default{
    //表情包和表情路径
    OwOMap: {
       '[微笑]':'weixiao.gif',
       '[嘻嘻]':'xixi.gif',
       '[哈哈]':'haha.gif',
       '[可爱]':'keai.gif',
       '[可怜]':'kelian.gif',
       '[挖鼻]':'wabi.gif',
       '[吃惊]':'chijing.gif',
       '[害羞]':'haixiu.gif',
       '[挤眼]':'jiyan.gif',
       '[闭嘴]':'bizui.gif',
       '[鄙视]':'bishi.gif',
       '[爱你]':'aini.gif',
       '[泪]':'lei.gif',
       '[偷笑]':'touxiao.gif',
       '[亲亲]':'qinqin.gif',
       '[生病]':'shengbing.gif',
       '[太开心]':'taikaixin.gif',
       '[白眼]':'baiyan.gif',
       '[右哼哼]':'youhengheng.gif',
       '[左哼哼]':'zuohengheng.gif',
       '[嘘]':'xu.gif',
       '[衰]':'shuai.gif',
       '[吐]':'tu.gif',
       '[哈欠]':'haqian.gif',
       '[抱抱]':'baobao.gif',
       '[怒]':'nu.gif',
       '[疑问]':'yiwen.gif',
       '[馋嘴]':'chanzui.gif',
       '[拜拜]':'baibai.gif',
       '[思考]':'sikao.gif',
       '[汗]':'han.gif',
       '[困]':'kun.gif',
       '[睡]':'shui.gif',
       '[钱]':'qian.gif',
       '[失望]':'shiwang.gif',
       '[酷]':'ku.gif',
       '[色]':'se.gif',
       '[哼]':'heng.gif',
       '[鼓掌]':'guzhang.gif',
       '[晕]':'yun.gif',
       '[悲伤]':'beishang.gif',
       '[抓狂]':'zhuakuang.gif',
       '[黑线]':'heixian.gif',
       '[阴险]':'yinxian.gif',
       '[怒骂]':'numa.gif',
       '[互粉]':'hufen.gif',
       '[书呆子]':'shudaizi.gif',
       '[愤怒]':'fennu.gif',
       '[感冒]':'ganmao.gif',
       '[心]':'xin.gif',
       '[伤心]':'shangxin.gif',
       '[猪]':'zhu.gif',
       '[熊猫]':'xiongmao.gif',
       '[兔子]':'tuzi.gif',
       '[喔克]':'ok.gif',
       '[耶]':'ye.gif',
       '[棒棒]':'good.gif',
       '[不]':'no.gif',
       '[赞]':'zan.gif',
       '[来]':'lai.gif',
       '[弱]':'ruo.gif',
       '[草泥马]':'caonima.gif',
       '[神马]':'shenma.gif',
       '[囧]':'jiong.gif',
       '[浮云]':'fuyun.gif',
       '[给力]':'geili.gif',
       '[围观]':'weiguan.gif',
       '[威武]':'weiwu.gif',
       '[话筒]':'huatong.gif',
       '[蜡烛]':'lazhu.gif',
       '[蛋糕]':'dangao.gif',
       '[发红包]':'fahongbao.gif',
    },
    //编译表情替换成图片展示出来
    analyzeEmoji(cont){
        var pattern1 = /\[[\u4e00-\u9fa5]+\]/g;
          var pattern2 = /\[[\u4e00-\u9fa5]+\]/;
          var content = cont.match(pattern1);
          var str = cont;
          if(content){
              for(var i=0;i<content.length;i++){
                  var s = require("@/static/img/face/"+this.OwOMap[content[i]])
                  var imoj = "<img src='"+s+"'/>"
                  str = str.replace(pattern2, imoj);
              }
          }
          return str;
    }

}