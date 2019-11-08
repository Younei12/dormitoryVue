<template>
  <div>
    <!-- 头部 -->
    <el-row type="flex" class="header margin-top-40 flex-wrap">
      <!-- 左侧用户卡片 -->
      <el-col :xs="22" :sm="8" :lg="7" :offset="1">
        <el-card class="user-card">
          <section class="flex flex-column justify-between">
            <div class="flex">
              <img class="user_avatar"
                   alt="avatar"
                   src="https://ossweb-img.qq.com/images/lol/web201310/skin/big22000.jpg"/>
              <div class="margin-left-20 flex flex-column justify-center">
                <p class="margin-bottom-10 font-size-22">Admin</p>
                <p class="font-size-12 color-grey">超级管理员</p>
              </div>
            </div>

            <div>
              <p class="font-size-14 margin-bottom-10 margin-top-20">上次登录时间：2019/05/06</p>
              <p class="font-size-14">上次登录IP：222.25.63.8</p>
            </div>
          </section>
        </el-card>
      </el-col>

      <el-col :xs="22" :sm="13" :lg="12" class="flex" :offset="1">
        <!-- 右侧状态 -->
        <el-row type="flex" class="flex-wrap align-content-between" :gutter="20">
          <el-col class="status-item" v-for="(item,index) in status_list" :xs="24" :sm="12" :key="index">
            <el-card :body-style="{ padding: '0px'}">
              <div class="status-card">
                <div class="status-icon flex flex-center" :style="{'background-color':item.color}">
                  <i :class="[item.icon]"></i>
                </div>
                <div class="flex-1 flex-center flex text-center">
                  <div>
                    <p class="font-bold font-size-22 margin-bottom-5">{{item.value}}</p>
                    <p class="font-size-14">{{item.title}}</p>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>


    </el-row>
    <!-- 头部结束 -->

    <!-- 图表 -->
    <el-row type="flex" class="flex-wrap margin-top-60">
      <el-col :xs="22" :sm="10" :lg="9" :offset="1" class="margin-bottom-20">
        <div id="equ-chart" class="home-charts" ref="equChart"></div>
      </el-col>

      <el-col :xs="22" :sm="10" :lg="9" :offset="1" class="margin-bottom-20">
        <div id="visit-chart" class="home-charts" ref="visitChart"></div>
      </el-col>
    </el-row>
    <!-- 图表结束 -->
  </div>
</template>

<script>
  import echarts from "echarts";
  import e_theme from "@/assets/theme/echarts/macarons"

  export default {
    name: "system-index",
    data() {
      return {
        status_list: [{
          color: "#409EFF",
          icon: "el-icon-s-custom",
          value: "3596 / 5000",
          title: "在住人数 / 总床位"
        }, {
          color: "#F56C6C",
          icon: "el-icon-s-flag",
          value: "200",
          title: "离校登记人数"
        }, {
          color: "#67C23A",
          icon: "el-icon-s-help",
          value: "200",
          title: "设备报修单"
        }, {
          color: "#E6A23C",
          icon: "el-icon-s-grid",
          value: "3596 / 5000",
          title: "空床位"
        }]
      }
    },
    methods:{
      setChart(){
        console.log("resize")
        echarts.registerTheme('macarons', e_theme);
        let equChart = echarts.init(this.$refs.equChart, 'macarons');
        equChart.setOption({
          title:{
            text:"近7天设备报修量",
            bottom:"5px",
            left:"center"
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '10px',
            right: '20px',
            bottom: '40px',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '直接访问',
              type: 'bar',
              barWidth: '60%',
              data: [10, 52, 200, 334, 390, 330, 220]
            }
          ]
        });

        let visitChart = echarts.init(this.$refs.visitChart, 'macarons');
        visitChart.setOption({
          title:{
            text:"近7天访问量",
            bottom:"5px",
            left:"center"
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
          },
          grid: {
            left: '10px',
            right: '20px',
            bottom: '40px',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一','周二','周三','周四','周五','周六','周日']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name:'邮件营销',
              type:'line',
              stack: '总量',
              data:[120, 132, 101, 134, 90, 230, 210]
            },
            {
              name:'联盟广告',
              type:'line',
              stack: '总量',
              data:[220, 182, 191, 234, 290, 330, 310]
            },
            {
              name:'视频广告',
              type:'line',
              stack: '总量',
              data:[150, 232, 201, 154, 190, 330, 410]
            },
            {
              name:'直接访问',
              type:'line',
              stack: '总量',
              data:[320, 332, 301, 334, 390, 330, 320]
            },
            {
              name:'搜索引擎',
              type:'line',
              stack: '总量',
              data:[820, 932, 901, 934, 1290, 1330, 1320]
            }
          ]
        });
      }
    },
    mounted() {
      setTimeout(()=>{
        this.setChart();
      },500);

    }
  }
</script>

<style lang="scss" scoped>
  .header {
    display: flex;
    color: #333;
  }

  .user-card {

  }

  .user_avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background-color: #e6e6e6;
    object-fit: cover;
  }

  .status-card {
    display: flex;
  }

  @media (max-width: 767px) {
    .status-item {
      margin-top: 20px;
    }
  }

  .status-icon {
    width: 82px;
    height: 85px;
    color: #fff;
    font-size: 30px;
  }

  .home-charts {
    height: 330px;
    width: 100%;
    background-color: #f2f2f2;
  }
</style>
