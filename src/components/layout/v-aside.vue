<template>
  <div class="v-aside">
    <!-- 一级菜单 -->
    <el-menu
      :default-active="Router"
      :router="true"
      active-text-color="#20a0ff"
      background-color="#354358"
      class="menu-bar"
      text-color="#bfcbd9"
    >
      <template v-for="menu in menuList">
        <!-- 二级菜单 -->
        <el-submenu :index="menu.index" :key="menu.index" v-if="menu.subMenu && menu.show">
          <template v-slot:title>
            <i :class="menu.icon"></i>
            <span>{{menu.title}}</span>
          </template>

          <!-- 二级选项 -->
          <template v-for="subMenu in menu.subMenu">
            <div v-if="subMenu.show" :key="subMenu.index">
              <el-menu-item :index="subMenu.index">
                <i :class="subMenu.icon"></i>
                <span>{{subMenu.title}}</span>
              </el-menu-item>
            </div>
          </template>
        </el-submenu>

        <!-- 一级选项 -->
        <el-menu-item :index="menu.index" :key="menu.index" v-if="!menu.subMenu&&menu.show">
          <i :class="menu.icon"></i>
          <template v-slot:title>
            <span>{{menu.title}}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "v-aside",
    data() {
      return {
        identity: 0,
        collapse: false,
      };
    },
    computed: {
      Router() {
        return this.$route.path.split('/')[2];
      },
      menuList() {
        const identity = this.userInfo.identity;
        return [
          {
            title: "系统首页",
            index: "system-index",
            icon: "el-icon-house",
            show: true
          },
          {
            title: "学生管理",
            index: "student-manage",
            icon: "el-icon-user",
            show: identity === 1
          },
          {
            title: "宿舍管理",
            index: "dorm-manage",
            icon: "el-icon-notebook-2",
            show: identity === 1
          },
          {
            title: "楼栋管理",
            index: "building-manage",
            icon: "el-icon-office-building",
            show: identity === 1
          },
          {
            title: "入住管理",
            index: "reside-manage",
            icon: "el-icon-coin",
            show: identity === 1,
            subMenu: [
              {
                title: "分配宿舍",
                index: "comein-manage",
                icon: "el-icon-finished",
                show: identity === 1
              },
              {
                title: "调整宿舍审批",
                index: "adjust-dorm-approve",
                icon: "el-icon-circle-check",
                show: identity === 1
              }
            ]
          },
          {
            title: "退寝管理",
            index: "leave-manage",
            icon: "el-icon-files",
            show: identity === 1,
            subMenu: [
              {
                title: "办理退寝",
                index: "leave-set",
                icon: "el-icon-document-remove",
                show: identity === 1
              },
              {
                title: "退寝审批",
                index: "leave-approve",
                icon: "el-icon-document-checked",
                show: identity === 1
              }
            ]
          },
          {
            title: "设备报修单",
            index: "equ-resolve",
            icon: "el-icon-set-up",
            show: identity === 1 || identity === 3
          },
          {
            title: "离校登记查询",
            index: "school-leave-search",
            icon: "el-icon-map-location",
            show: identity === 1
          },
          {
            title: "维修员管理",
            index: "repairmen-manage",
            icon: "el-icon-attract",
            show: identity === 1
          },
          {
            title: "管理员管理",
            index: "admin-manage",
            icon: "el-icon-key",
            show: identity === 1
          },
          {
            title: "填写设备报修单",
            index: "equ-submit",
            icon: "el-icon-document-add",
            show: identity === 2
          },
          {
            title: "填写离校登记",
            index: "school-leave-reg",
            icon: "el-icon-delete-location",
            show: identity === 2
          },
          {
            title: "调整宿舍申请",
            index: "adjust-dorm-apply",
            icon: "el-icon-sort",
            show: identity === 2
          },
          {
            title: "退寝申请",
            index: "leave-apply",
            icon: "el-icon-document",
            show: identity === 2
          }
        ]
      },
      ...mapState(['userInfo'])

    },
    mounted() {
      window.onload = window.onresize = () => {
        this.collapse = document.body.clientWidth < 992;
      };
    }
  };
</script>

<style lang="scss" scoped>
  .v-aside {
    height: 100%;
    overflow-y: auto;
  }

  .menu-bar {
    height: 100%;
    border: none;
  }
</style>
