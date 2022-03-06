<template>
  <div id="app" class="goTop">
    <el-backtop target=".goTop" style="z-index:5000"></el-backtop>
    <router-view/>
  </div>
</template>

<script>
// css 抖动效果
import '@/static/css/keyframes_a.css'
export default {
  name: 'App',
  components: {
    
  }
}
</script>

<style>
@import url('//at.alicdn.com/t/font_2900716_u7qk5szz1p.css');
body { 
  margin:0px;
}

.icon-woman {
    color: #fc0000;
}
.information {
    
    font-size: 12px;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar{
  width: 7px;
  height: 7px;
  background-color: #F5F5F5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #F5F5F5;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb{
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
  background-color: #c8c8c8;
}
</style>
<style scoped>

.goTop{
    height: 100vh;
    overflow: auto;
}

</style>
