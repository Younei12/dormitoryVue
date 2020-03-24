<template>
  <div>
    <!-- 头部 -->
    <el-row class="header margin-top-40 flex-wrap" style="height: 192px" type="flex">
      <!-- 左侧用户卡片 -->
      <el-col :lg="7" :offset="1" :sm="8" :xs="22">
        <el-card class="user-card">
          <section class="flex flex-column justify-between">
            <div class="flex">
              <img :src="userInfo.avatar"
                   alt="avatar"
                   class="user_avatar"/>
              <div class="margin-left-20 flex flex-column justify-center">
                <p class="margin-bottom-10 font-size-22">{{userInfo.name}}</p>
                <p class="font-size-12 color-grey">{{userInfo.identity_name}}</p>
              </div>
            </div>

            <div class="info-section tip-small">
              <section v-if="userInfo.identity === 1">
                <p class="info-para">当前学生总数：{{userInfo.student_count}} 人</p>
                <p class="info-para">当前宿舍总数：{{userInfo.dorm_count}} 间</p>
              </section>
              <section v-if="userInfo.identity === 2">
                <p class="info-para">我的宿舍：{{userInfo.dorm_num || '您还未被分配宿舍'}}</p>
              </section>
              <section v-if="userInfo.identity === 3">
                <p class="info-para">已接手的报修单：{{userInfo.ongoing_task}}</p>
              </section>

            </div>
          </section>
        </el-card>
      </el-col>

      <el-col :lg="12" :offset="1" :sm="13" :xs="22" class="flex">
        <!-- 右侧状态 -->
        <el-row :gutter="20" class="flex-wrap align-content-between" type="flex">
          <el-col :key="index" :sm="12" :xs="24" class="status-item" v-for="(item,index) in status_list">
            <el-card :body-style="{ padding: '0px'}">
              <div class="status-card">
                <div :style="{'background-color':item.color}" class="status-icon flex flex-center">
                  <i :class="[item.icon]"></i>
                </div>
                <div class="flex-1 flex-center flex text-center">
                  <div>
                    <p class="font-bold font-size-22 margin-bottom-5">{{homeInfo[item.prop]}}</p>
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
    <el-row class="flex-wrap margin-top-60" type="flex">
      <el-col :lg="9" :offset="1" :sm="10" :xs="22" class="margin-bottom-20">
        <div class="home-charts" id="equ-chart" ref="equChart"></div>
      </el-col>

      <el-col :lg="9" :offset="1" :sm="10" :xs="22" class="margin-bottom-20">
        <div class="home-charts" id="visit-chart" ref="visitChart"></div>
      </el-col>
    </el-row>
    <!-- 图表结束 -->
  </div>
</template>

<script>
  import echarts from "echarts";
  import e_theme from "@/assets/theme/echarts/macarons";
  import {mapState} from "vuex";
  import request from "@/api";

  export default {
    name: "system-index",
    data() {
      return {
        status_list: [{
          color: "#409EFF",
          icon: "el-icon-s-custom",
          title: "在住人数 / 总容纳人数",
          prop: 'resideCount'
        }, {
          color: "#F56C6C",
          icon: "el-icon-s-flag",
          title: "离校登记人数",
          prop: 'leaveSchoolCount'
        }, {
          color: "#67C23A",
          icon: "el-icon-s-help",
          title: "待处理的设备报修单",
          prop: 'repairCount'
        }, {
          color: "#E6A23C",
          icon: "el-icon-s-grid",
          title: "空床位",
          prop: 'emptyCount'
        }],
        homeInfo: {
          last7Days: [],
          last7DaysRepair: [],
          resideStatus: []
        }
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    methods: {
      getHomeInfo() {
        request.post('/api/common/getHomeInfo').then(res => {
          const data = res.data.data;
          data.resideCount = data.resideNum + ' / ' + data.containerCount;
          this.homeInfo = data;
          this.setChart();
        })
      },
      setChart() {
        echarts.registerTheme('macarons', e_theme);
        let equChart = echarts.init(this.$refs.equChart, 'macarons');
        equChart.setOption({
          title: {
            text: "近7天设备报修量",
            bottom: "5px",
            left: "center"
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {    // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'  // 默认为直线，可选为：'line' | 'shadow'
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
              data: this.homeInfo.last7Days,
              axisTick: {
                alignWithLabel: true
              },
              axisLabel: {
                interval: 0
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
              name: '报修数量',
              type: 'bar',
              barWidth: '50%',
              data: this.homeInfo.last7DaysRepair
            }
          ]
        });

        let visitChart = echarts.init(this.$refs.visitChart, 'macarons');
        visitChart.setOption({
          title: {
            text: "学生居住状态",
            bottom: "5px",
            left: "center"
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          // legend: {
          //   data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
          //   top: '10px'
          // },
          // grid: {
          //   left: '10px',
          //   right: '20px',
          //   bottom: '40px',
          //   containLabel: true
          // },
          // xAxis: {
          //   type: 'category',
          //   boundaryGap: false,
          //   data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          // },
          // yAxis: {
          //   type: 'value'
          // },
          series: [
            {
              name: '居住状态',
              type: 'pie',
              radius: '60%',
              center: ['50%', '50%'],
              data: this.homeInfo.resideStatus.sort(function (a, b) {
                return a.value - b.value;
              }),
              // roseType: 'radius',
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200;
              }
            }
          ]
        });
      }
    },
    mounted() {
      // this.$nextTick(() => {
      //   this.setChart();
      // });
      this.getHomeInfo()
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    display: flex;
    color: #333;
  }

  .user-card {
    height: 100%;
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

  .info-section {
    margin-top: 20px;
  }

  .info-para {
    font-size: 14px;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
