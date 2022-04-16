<template>
  <div class="statistics_content">
    <el-row>
      <el-col align="right">
        <el-tooltip content="默认两小时统计一次" placement="left" effect="dark">
          <el-button size="mini" type="danger" plain @click="forceRefresh"
            >强制刷新</el-button
          >
        </el-tooltip>
      </el-col>
    </el-row>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="user">
        <template slot="title">
          <b><em>用户大盘</em></b>
        </template>
        <el-row>
          <el-col :span="8">
            <el-card
              shadow="hover"
              :body-style="{ padding: '20px 20px 0px 20px' }"
            >
              <el-radio-group v-model="userType" @change="handleChangeUserType">
                <el-radio v-model="userType" label="1">年代</el-radio>
                <el-radio v-model="userType" label="2">性别</el-radio>
              </el-radio-group>
              <div
                id="userYears"
                v-show="userType == '1'"
                style="with: 307.6px; height: 327.6px;"
              ></div>
              <div
                id="userGender"
                v-show="userType == '2'"
                style="with: 307.6px; height: 327.6px;"
              ></div>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card
              shadow="hover"
              :body-style="{ padding: '20px 20px 0px 20px' }"
            >
              <el-tooltip content="统计天数" placement="left" effect="dark">
                <el-select
                  v-model="userDays"
                  placeholder="请选择统计天数"
                  size="mini"
                  @change="daysChange('user')"
                  style="float:right;width:90px;z-index:1;"
                >
                  <el-option
                    v-for="item in days"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-tooltip>
              <div id="activeUser" style="height: 350px;"></div>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item name="article">
        <template slot="title">
          <b><em>论贴大盘</em></b>
        </template>
        <el-card shadow="hover" :body-style="{ padding: '20px 20px 0px 20px' }">
          <el-tooltip content="统计天数" placement="left" effect="dark">
            <el-select
              v-model="articleDays"
              placeholder="请选择统计天数"
              size="mini"
              @change="daysChange('article')"
              style="float:right;width:90px;z-index:1;"
            >
              <el-option
                v-for="item in days"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-tooltip>
          <div
            id="articleStatistic"
            ref="articleStatistic"
            style="height: 400px;"
          ></div>
        </el-card>
      </el-collapse-item>
      <el-collapse-item name="chat">
        <template slot="title">
          <b><em>群聊大盘</em></b>
        </template>
        <el-card shadow="hover" :body-style="{ padding: '20px 20px 0px 20px' }">
          <el-tooltip content="统计天数" placement="left" effect="dark">
            <el-select
              v-model="chatDays"
              placeholder="请选择统计天数"
              size="mini"
              @change="daysChange('chat')"
              style="float:right;width:90px;z-index:1;"
            >
              <el-option
                v-for="item in days"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-tooltip>
          <div
            id="chatStatistic"
            ref="chatStatistic"
            style="height: 400px;"
          ></div>
        </el-card>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import store from "@/services/store.js";
export default {
  name: "Statistics",
  data() {
    return {
      activeNames: ["user"],
      userType: "1",
      monitor: {
        activeVisitorNum: [
          {
            name: "2022-3-28",
            value: 11,
          },
          {
            name: "2022-3-29",
            value: 0,
          },
          {
            name: "2022-3-30",
            value: 234,
          },
          {
            name: "2022-3-31",
            value: 12,
          },
          {
            name: "2022-4-1",
            value: 12,
          },
          {
            name: "2022-4-2",
            value: 11,
          },
          {
            name: "2022-4-3",
            value: 14,
          },
        ],
        articleIncreaseNum: [
          {
            name: "2022-3-29",
            value: 0,
          },
          {
            name: "2022-3-30",
            value: 0,
          },
          {
            name: "2022-3-31",
            value: 0,
          },
          {
            name: "2022-4-1",
            value: 0,
          },
          {
            name: "2022-4-2",
            value: 0,
          },
          {
            name: "2022-4-3",
            value: 0,
          },
          {
            name: "2022-4-4",
            value: 0,
          },
        ],
        commentIncreaseNum: [
          {
            name: "2022-3-29",
            value: 0,
          },
          {
            name: "2022-3-30",
            value: 0,
          },
          {
            name: "2022-3-31",
            value: 0,
          },
          {
            name: "2022-4-1",
            value: 0,
          },
          {
            name: "2022-4-2",
            value: 0,
          },
          {
            name: "2022-4-3",
            value: 0,
          },
          {
            name: "2022-4-4",
            value: 0,
          },
        ],
        userGender: {
          boy: 2,
          girl: 2,
        },
        userIncreaseNum: [
          {
            name: "2022-3-29",
            value: 0,
          },
          {
            name: "2022-3-30",
            value: 0,
          },
          {
            name: "2022-3-31",
            value: 0,
          },
          {
            name: "2022-4-1",
            value: 0,
          },
          {
            name: "2022-4-2",
            value: 0,
          },
          {
            name: "2022-4-3",
            value: 0,
          },
          {
            name: "2022-4-4",
            value: 0,
          },
        ],
        userYears: [
          {
            name: "20年代",
            value: 1,
          },
          {
            name: "10年代",
            value: 0,
          },
          {
            name: "00年代",
            value: 0,
          },
          {
            name: "90年代",
            value: 1,
          },
          {
            name: "80年代",
            value: 0,
          },
        ],
        chatMaxOnlineNum: [
            {
            name: "2022-3-28",
            value: 11,
          },
          {
            name: "2022-3-29",
            value: 0,
          },
          {
            name: "2022-3-30",
            value: 234,
          },
          {
            name: "2022-3-31",
            value: 12,
          },
          {
            name: "2022-4-1",
            value: 12,
          },
          {
            name: "2022-4-2",
            value: 11,
          },
          {
            name: "2022-4-3",
            value: 14,
          },
        ],
        chatMessageNum: [
            {
            name: "2022-3-28",
            value: 11,
          },
          {
            name: "2022-3-29",
            value: 0,
          },
          {
            name: "2022-3-30",
            value: 12312324,
          },
          {
            name: "2022-3-31",
            value: 2134,
          },
          {
            name: "2022-4-1",
            value: 234,
          },
          {
            name: "2022-4-2",
            value: 123445,
          },
          {
            name: "2022-4-3",
            value: 3554,
          },
        ],
      },
      // 统计时间筛选
      days: [
        { label: "5天", value: 5 },
        { label: "7天", value: 7 },
        { label: "10天", value: 10 },
        { label: "14天", value: 14 },
        { label: "20天", value: 20 },
        { label: "30天", value: 30 },
      ],
      userDays: 7,
      articleDays: 7,
      chatDays: 7,
    };
  },
  methods: {
    handleChange(arr) {
        // 动画 效果还未结束，可能获取不到宽高  
        setTimeout(() => {
            for (let i = 0, len = arr.length; i < len; i++) {
                switch(arr[i]) {
                    case "user":
                        this.initUser();
                        break
                    case "article":
                        this.initArticle();
                        break
                    case "chat":
                        this.initChat();
                        break   
                }
            }
        }, 250)
    },
    handleChangeUserType(val) {
      if (val == "1") {
        this.initUserYears();
      } else {
        this.initUserGender();
      }
    },
    initUser() {
      this.handleChangeUserType(this.userType);
      this.initActiveUser();
    },
    initUserYears() {
      // var myChart = this.$echarts.init(document.getElementById('userYears'), 'dark', {
      //     width: 600,
      //     height: 400
      // });
      let html = document.getElementById("userYears");
      if (undefined != this.$echarts.getInstanceByDom(html)) {
        return;
      }
      let user = this.$echarts.init(html);
      // 指定图表的配置项和数据
      let option = {
        // title: {
        //     text: '用户占比',
        //     // subtext: '动态数据',
        //     x:'center',
        //     top: 'center'
        // },
        legend: {
          // orient: 'vertical',
          // x: 'left',
          data: this.monitor.userYears,
        },
        series: [
          {
            type: "pie",
            // 零值不显示
            stillShowZeroSum: false,
            data: this.monitor.userYears,
            label: {
              // alignTo: 'edge',
              // minMargin: 5,
              // edgeDistance: 10,
              // lineHeight: 15,
              formatter: "{b}\n{people|{c}人}",
              rich: {
                people: {
                  fontSize: 10,
                  color: "#999",
                },
              },
            },
            radius: "50%",
            // radius: ['40%', '70%'],
            // label: {
            //     show: false,
            //     position: 'center',
            //     formatter: '{b}\n{c}人',
            //     emphasis: {
            //     show: true
            //     }
            // },
            // labelLine: {
            //     show: false
            // },
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      user.setOption(option);
    },
    initUserGender() {
      let html = document.getElementById("userGender");
      if (undefined != this.$echarts.getInstanceByDom(html)) {
        return;
      }
      let userGender = this.$echarts.init(html);
      // 指定图表的配置项和数据
      let userGenderOption = {
        // title: {
        //     text: '用户占比',
        //     // subtext: '动态数据',
        //     x:'center',
        //     top: 'center'
        // },
        legend: {
          // orient: 'vertical',
          // x: 'left',
          data: this.monitor.userGender,
        },
        series: [
          {
            type: "pie",
            data: this.monitor.userGender,
            stillShowZeroSum: false,
            label: {
              alignTo: "edge",
              formatter: "{name|{b}}\n{people|{c}人}",
              minMargin: 5,
              edgeDistance: 10,
              lineHeight: 15,
              rich: {
                time: {
                  fontSize: 10,
                  color: "#999",
                },
              },
            },
            radius: "50%",
            // radius: ['40%', '70%']
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      userGender.setOption(userGenderOption);
    },
    initActiveUser() {
      let html = document.getElementById("activeUser");
      if (undefined != this.$echarts.getInstanceByDom(html)) {
        return;
      }
      let date = new Array();
      let activeVisitorNumValue = new Array();
      let userIncreaseNumValue = new Array();
      for (
        let i = 0, len = this.monitor.activeVisitorNum.length;
        i < len;
        i++
      ) {
        date.push(this.monitor.activeVisitorNum[i].name);
        activeVisitorNumValue.push(this.monitor.activeVisitorNum[i].value);
        userIncreaseNumValue.push(this.monitor.userIncreaseNum[i].value);
      }
      // 活跃用户
      let activeUser = this.$echarts.init(html);
      let activeUserOption = {
        title: {
          text: "用户统计",
          x: "auto",
          top: "auto",
        },
        tooltip: {
          trigger: "axis",
          xAxis: Number,
          yAxis: Number,
        },
        legend: {},
        xAxis: {
          type: "category",
          axisTick: {
            alignWithLabel: true,
          },
          data: date,
        },
        yAxis: [
          {
            type: "value",
            // name: '日活量',
            position: "left",
            // 最小间隔大小，保证整数单位
            minInterval: 1,
            axisLabel: {
              formatter: "{value} 人",
            },
          },
          // {
          //     type: 'value',
          //     name: '新增用户量',
          //     position: 'right',
          //     axisLabel: {
          //         formatter: '{value} 人'
          //     }
          // }
        ],
        series: [
          {
            name: "日活量",
            type: "bar",
            yAxisIndex: 0,
            data: activeVisitorNumValue,
            barWidth: "30%",
          },
          {
            name: "新增用户",
            data: userIncreaseNumValue,
            type: "line",
            // 平滑曲线
            // smooth: true,
            // yAxisIndex: 1,
            label: {
              show: true,
              position: "left",
              // textStyle: {
              //     fontSize: 12
              // }
            },
            // markPoint : {
            //     data: [{type: "max",},{type: "min",}],
            //     symbol : 'pin',
            //     // 开启动画
            //     animation: true,
            // },
          },
        ],
        // 样式
        // itemStyle: {
        //     barBorderRadius: 5,
        //     borderWidth: 1,
        //     borderType: 'solid',
        //     borderColor: '#73c0de',
        //     shadowColor: '#5470c6',
        //     shadowBlur: 3
        // }
      };
      activeUser.setOption(activeUserOption);
    },
    initChat() {
      let html = document.getElementById("chatStatistic");
      if (undefined != this.$echarts.getInstanceByDom(html)) {
        return;
      }
      let date = new Array();
      let chatMaxOnlineNumValue = new Array();
      let chatMessageNumValue = new Array();
      for (
        let i = 0, len = this.monitor.chatMaxOnlineNum.length;
        i < len;
        i++
      ) {
        date.push(this.monitor.chatMaxOnlineNum[i].name);
        chatMaxOnlineNumValue.push(this.monitor.chatMaxOnlineNum[i].value);
        chatMessageNumValue.push(this.monitor.chatMessageNum[i].value);
      }

      let chat = this.$echarts.init(html);
      let chatOption = {
        title: {
          text: "群聊统计",
          x: "auto",
          top: "auto",
        },
        tooltip: {
          trigger: "axis",
          xAxis: Number,
          yAxis: Number,
        },
        legend: {},
        xAxis: {
          type: "category",
          axisTick: {
            alignWithLabel: true,
          },
          data: date,
        },
        yAxis: [
          {
            type: "value",
            position: "left",
            minInterval: 1,
            axisLabel: {
              formatter: "{value}",
            },
          }
        ],
        series: [
          {
            name: "群聊日活量",
            type: "bar",
            yAxisIndex: 0,
            data: chatMaxOnlineNumValue,
            barWidth: "20%",
          },
          {
            name: "群聊消息量",
            data: chatMessageNumValue,
            type: "bar",
            yAxisIndex: 0,
            barWidth: "20%",
          },
        ],
      };
      chat.setOption(chatOption);
    },
    initArticle() {
      let html = document.getElementById("articleStatistic");
      if(undefined != this.$echarts.getInstanceByDom(html)) {
          return
      }
      let article = this.$echarts.init(html);
      let date = new Array();
      let articleIncreaseNumValue = new Array();
      let commentIncreaseNumValue = new Array();
      for (
        let i = 0, len = this.monitor.articleIncreaseNum.length;
        i < len;
        i++
      ) {
        date.push(this.monitor.articleIncreaseNum[i].name);
        articleIncreaseNumValue.push(this.monitor.articleIncreaseNum[i].value);
        commentIncreaseNumValue.push(this.monitor.commentIncreaseNum[i].value);
      }
      let option = {
        title: {
          text: "论贴统计",
          x: "auto",
          top: "auto",
        },
        tooltip: {
          trigger: "axis",
          xAxis: Number,
          yAxis: Number,
        },
        legend: {},
        xAxis: {
          type: "category",
          axisTick: {
            alignWithLabel: true,
          },
          data: date,
        },
        yAxis: [
          {
            type: "value",
            // 最小间隔大小，保证整数单位
            minInterval: 1,
            // axisPointer: {
            //     show: true,
            // }
            // name: '日阅读量',
            // position: 'left',
            // axisLabel: {
            //     formatter: '{value} 次'
            // }
          },
          // {
          //     type: 'value',
          //     name: '新增论贴量',
          //     axisLabel: {
          //         formatter: '{value} 篇'
          //     }
          // },
          // {
          //     type: 'value',
          //     // name: '日评论量',
          //     // axisLabel: {
          //     //     formatter: '{value} 条'
          //     // }
          // }
        ],
        series: [
          // {
          //     name: '日阅读量',
          //     type: 'line',
          //     // yAxisIndex: 0,
          //     data: [6, 32, 70, 86, 100,120,90],
          //     label: {
          //         show: true,
          //         position: 'bottom',
          //         textStyle: {
          //             fontSize: 12
          //         }
          //     },
          //     markPoint : {
          //         data: [{type: "max",},{type: "min",}],
          //         symbol : 'pin',
          //         // 开启动画
          //         animation: true,
          //     },
          // },
          {
            name: "新增论贴量",
            data: articleIncreaseNumValue,
            type: "line",
            // yAxisIndex: 1,
            label: {
              show: true,
              position: "left",
              // textStyle: {
              //     fontSize: 12
              // }
            },
            // markPoint : {
            //     data: [{type: "max",},{type: "min",}],
            //     symbol : 'pin',
            //     // 开启动画
            //     animation: true,
            // },
          },
          {
            name: "日评论量",
            type: "line",
            // yAxisIndex: 2,
            data: commentIncreaseNumValue,
            label: {
              show: true,
              position: "left",
              // textStyle: {
              //     fontSize: 12
              // }
            },
            // markPoint : {
            //     data: [{type: "max",},{type: "min",}],
            //     symbol : 'pin',
            //     // 开启动画
            //     animation: true,
            // },
          },
        ],
      };
      article.setOption(option);
    },
    // 销毁图表
    dispose() {
      let charts = this.$echarts.getInstanceByDom(
        document.getElementById("userYears")
      );
      if (undefined != charts) {
        charts.dispose();
      }
      charts = this.$echarts.getInstanceByDom(
        document.getElementById("userGender")
      );
      if (undefined != charts) {
        charts.dispose();
      }
      charts = this.$echarts.getInstanceByDom(
        document.getElementById("activeUser")
      );
      if (undefined != charts) {
        charts.dispose();
      }
      charts = this.$echarts.getInstanceByDom(
        document.getElementById("articleStatistic")
      );
      if (undefined != charts) {
        charts.dispose();
      }
      charts = this.$echarts.getInstanceByDom(
        document.getElementById("chatStatistic")
      );
      if (undefined != charts) {
        charts.dispose();
      }
    },
    getMonitor() {
      this.$axios
        .get("/monitor", {
          params: {
            days: 7,
          },
          headers: {
            token: store.getToken(),
          },
        })
        .then((e) => {
          if (e.data.success) {
            this.monitor = e.data.Data;
            this.initUser();
          } else {
            this.$message.error("get monitor fail: " + e.data.message);
          }
        });
    },
    forceRefresh() {
      this.activeNames = ["user"];
      this.$axios
        .put("/monitor", null, { headers: { token: store.getToken() } })
        .then((e) => {
          if (e.data.success) {
            this.dispose();
            this.monitor = e.data.Data;
            this.userDays = this.articleDays = this.chatDays = 7
            this.initUser();
          } else {
            this.$message.error("get monitor fail: " + e.data.message);
          }
        });
    },
    daysChange(monitorType) {
      let days = 0, id = "";
      switch (monitorType) {
        case "article":
            days = this.articleDays;
            id = "articleStatistic";
            break
        case "user":
            days = this.userDays
            id = "activeUser"
            break
        case "chat":
            days = this.chatDays
            id = "chatStatistic" 
            break
        default:
            console.log(`error：${monitorType} not exist`)
            return
    }
      this.$axios
        .get(`/monitor/${monitorType}`, {
          params: {
            days: days,
          },
          headers: {
            token: store.getToken(),
          },
        })
        .then((e) => {
          if (e.data.success) {
            let charts = this.$echarts.getInstanceByDom(
              document.getElementById(id)
            );
            if (undefined != charts) {
              charts.dispose();
            }
            switch (monitorType) {
                case "article":
                    this.monitor.articleIncreaseNum = e.data.Data.articleIncreaseNum;
                    this.monitor.commentIncreaseNum = e.data.Data.commentIncreaseNum;
                    this.initArticle();
                    break
                case "user":
                    this.monitor.userIncreaseNum = e.data.Data.userIncreaseNum;
                    this.monitor.activeVisitorNum = e.data.Data.activeVisitorNum;
                    console.log(e.data.Data)
                    this.initActiveUser();
                    break
                case "chat":
                    this.monitor.chatMaxOnlineNum = e.data.Data.chatMaxOnlineNum;
                    this.monitor.chatMessageNum = e.data.Data.chatMessageNum;
                    this.initChat();
                    break
            }
          } else {
            this.$message.error("get monitor fail: " + e.data.message);
          }
        });
    },
  },
  mounted() {
    this.getMonitor();
  },
};
</script>
<style scoped>
.statistics_content {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  text-align: center;
}
</style>
