<template>
  <div class="v-aside">
    <!-- 一级菜单 -->
    <el-menu
      class="menu-bar"
      background-color="#354358"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      :router="true"
      :default-active="Router"
    >
      <template v-for="menu in menuList">
        <!-- 二级菜单 -->
        <el-submenu v-if="menu.subMenu" :key="menu.index" :index="menu.index">
          <template v-slot:title>
            <i class="el-icon-s-opportunity"></i>
            <span>{{menu.title}}</span>
          </template>

          <!-- 二级选项 -->
          <template v-for="subMenu in menu.subMenu">
            <el-menu-item :index="subMenu.index" :key="subMenu.index">
              <i class="el-icon-s-promotion"></i>
              <span>{{subMenu.title}}</span>
            </el-menu-item>
          </template>
        </el-submenu>

        <!-- 一级选项 -->
        <el-menu-item v-else :index="menu.index" :key="menu.index">
          <template v-slot:title>
            <i class="el-icon-star-on"></i>
            <span>{{menu.title}}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "v-aside",
  data() {
    return {
      menuList: [
        {
          title: "系统首页",
          index: "system-index"
        },
        {
          title: "入住管理",
          index: "comein-manage"
        },
        {
          title: "退寝管理",
          index: "leave-manage",
          subMenu: [
            {
              title: "退寝申请",
              index: "leave-apply"
            },
            {
              title: "退寝审批",
              index: "leave-approve"
            },
            {
              title: "手动退寝",
              index: "leave-set"
            }
          ]
        },
        {
          title: "宿舍管理",
          index: "dorm-manage"
        },
        {
          title: "学生管理",
          index: "student-manage"
        },
        {
          title: "设备报修",
          index: "equ-service",
          subMenu: [
            {
              title: "提交设备报修",
              index: "equ-submit"
            },
            {
              title: "处理设备报修",
              index: "equ-resolve"
            }
          ]
        },
        {
          title: "离校登记",
          index: "school-leave",
          subMenu: [
            {
              title: "填写离校登记",
              index: "school-leave-reg"
            },
            {
              title: "离校登记查询",
              index: "school-leave-search"
            }
          ]
        }
      ]
    };
  },
  computed: {
    Router() {
      return this.$route.path.replace("/", "");
    }
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
