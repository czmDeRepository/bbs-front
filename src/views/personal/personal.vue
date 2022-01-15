<template>


  <div class="person">
    <!-- <canvas id="canvas">
  </canvas> -->
      <el-button style="float: right;" type="info" plain @click="$router.go(-1)">返回</el-button>
    <div class="personal">
        <el-row>
        <el-tabs type="border-card" :stretch="true" style="overflow:auto" v-model="activeName">
            <el-tab-pane label="我的论坛" name="article" :lazy="true">
              <Forum :userId="userId"></Forum>
            </el-tab-pane>
            <el-tab-pane label="个人信息管理" name="info" :lazy="true">
                <Information/>
            </el-tab-pane>
            <el-tab-pane label="关注的列表" name="follow" :lazy="true">
              <Forum :userId="userId" :followingFlag="true"></Forum>
            </el-tab-pane>
            <el-tab-pane label="我的评论" name="comment" :lazy="true">
              <CommentList></CommentList>
            </el-tab-pane>
        </el-tabs>
        </el-row>
    </div>    
  </div>

</template>

<script>
import Information from './information.vue'
import CommentList from './commentList.vue'
import Forum from '@/views/components/forum.vue'
import store from '@/services/store.js'
import tools from '@/services/tools.js'
export default {
    name: 'personal',
    components: {
      Information,
      Forum,
      CommentList,
    },
    props: {

    },
    data() {
      return {
        activeName: 'article',
        userId: store.getUserId(),
      }
    },
    methods: {
      
      backP() {

          window.requestAnimationFrame = (function(){
              return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    function( callback ){
                          window.setTimeout( callback, 1000/2 );
                    };
          })();
          var myCanvas = document.getElementById("canvas");
          var ctx = myCanvas.getContext("2d");//getContext 设置画笔
          var num;
          var w,h;
          var duixiang = [];
          var move = {};
          function widthheight(){
              w = myCanvas.width = window.innerWidth;
              h = myCanvas.height = window.innerHeight;
          num= Math.floor(w*h*0.00028);//点的数量。根据屏幕大小确定
              for(var i = 0;i < num;i++){
                  duixiang[i] = {
                      x:Math.random()*w,
                      y:Math.random()*h,
                      cX:Math.random()*0.6-0.3,
                      cY:Math.random()*0.6-0.3,
              R:Math.floor(Math.random()*5)+2,
              //CC:Math.floor(Math.random()*3)+2,
                r: Math.floor(Math.random() * 254),   
                      g: Math.floor(Math.random() * 254),  
                      b:Math.floor(Math.random() * 254)   
                  } 
                // console.log(duixiang[i])
                  Cricle(duixiang[i].x,duixiang[i].y,duixiang[i].R,duixiang[i].r,duixiang[i].g,duixiang[i].b);
            //Cricle(duixiang[i].x,duixiang[i].y,duixiang[i].R,duixiang[i].CC);
              }
          };widthheight();//获取浏览器的等宽度等高

          function Cricle(x,y,R,r,g,b){
              ctx.save();//保存路径
            if(Math.random()>0.991) {ctx.globalAlpha= 0.9;}//ctx.fillStyle = "#CCC";}//填充的背景颜色
            else { ctx.globalAlpha=0.47;}
          
          ctx.fillStyle = "rgb("+ r +","+ g +","+ b +")";
              ctx.beginPath();//开始绘画
          ctx.arc(x,y,R,Math.PI*2,0);//绘画圆 x y 半径（大小） 角度  一个PI 是180 * 2 = 360    真假 0/1 true/false
              ctx.closePath();//结束绘画
              ctx.fill();//填充背景颜色
              ctx.restore();//回复路径
          };Cricle();


          !function draw(){
              ctx.clearRect(0,0,w,h)//先清除画布上的点
              for(var i = 0;i < num;i++){
                  duixiang[i].x += duixiang[i].cX;
                  duixiang[i].y += duixiang[i].cY;
                  if(duixiang[i].x>w || duixiang[i].x<0){
                      duixiang[i].cX = -duixiang[i].cX;
                  }
                  if(duixiang[i].y>h || duixiang[i].y<0){
                      duixiang[i].cY = -duixiang[i].cY;
                  }
                  Cricle(duixiang[i].x,duixiang[i].y,duixiang[i].R,duixiang[i].r,duixiang[i].g,duixiang[i].b);
                  //勾股定理判断两点是否连线
                  for(var j = i + 1;j < num;j++){
                      if( (duixiang[i].x-duixiang[j].x)*(duixiang[i].x-duixiang[j].x)+(duixiang[i].y-duixiang[j].y)*(duixiang[i].y-duixiang[j].y) <= 55*55 ){
                          line(duixiang[i].x,duixiang[i].y,duixiang[j].x,duixiang[j].y,0,i,j)
                      }
                      if(move.x){
                          if( (duixiang[i].x-move.x)*(duixiang[i].x-move.x)+(duixiang[i].y-move.y)*(duixiang[i].y-move.y) <= 100*100 ){
                              line(duixiang[i].x,duixiang[i].y,move.x,move.y,1,i,1)
                          }
                      }
                  }
              }
              window.requestAnimationFrame(draw)
          }();

          //绘制线条
          function line(x1,y1,x2,y2,flag,i,j){
              
          if (flag){var color = ctx.createLinearGradient(x1,y1,x2,y2);
                ctx.globalAlpha=0.5;
                color.addColorStop(0,"rgb("+ duixiang[i].r +","+ duixiang[i].g +","+ duixiang[i].b +")");
                color.addColorStop(0.8,"#019ee5");
                  }
              else
              {
              
              var color = ctx.createLinearGradient(x1,y1,x2,y2);
                ctx.globalAlpha=0.9;
                color.addColorStop(0,"rgb("+ duixiang[i].r +","+ duixiang[i].g +","+ duixiang[i].b +")");
                color.addColorStop(1,"rgb("+ duixiang[j].r +","+ duixiang[j].g +","+ duixiang[j].b +")");
              }
              ctx.save();
              ctx.strokeStyle = color;
          ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(x1,y1);
              ctx.lineTo(x2,y2);
              ctx.stroke();
              //ctx.restore();
          }


          //document.onmousemove = function(e){
          //   move.x = e.clientX;
            //  move.y = e.clientY;
          //}
          //console.log(move)//去掉注释 ，可以与背景互动

          window.onresize = function(){
              location.reload();
          }
      }

    },
    mounted() {
      if(tools.isNotLogin(this)) {
          return
        }
      if(this.$route.query.tabNum != undefined) {
          this.activeName = this.$route.query.tabNum
          if(this.$route.query.tabNum === 'follow') {
              this.$router.go(-1)
          }
      } else {
          this.activeName = 'article'
      }
      // this.backP()
    }
  }
</script>
<style scoped>
.personal {
    padding: 50px;
    width: 80%;
    margin: 0 auto;
}
#canvas{
  position: fixed;
  background: #ccc;
  overflow: auto;
  z-index: -1;
}
.person {
  min-height: 100vh;
  /* background-image: url('https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp02%2F1Z916234U33118-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1637906620&t=09411302e4520fe7f6344298d204fccd'); */
  /* background-image: url('https://pic.netbian.com/uploads/allimg/210719/225953-1626706793ff85.jpg'); */
  background-color: #d7e2ea;
  background-repeat:no-repeat;
  background-size: cover;
}
</style>
