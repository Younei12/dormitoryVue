<template>
  <header class="v-header">

    <div class="head-left" @click="$emit('click:logo')">
      <i class="logo__icon el-icon-s-claim"></i>
      <span class="logo__title">学生宿舍管理系统</span>
    </div>

    <div class="head-right">
      <img class="user-avatar"/>
      <span class="user-name"></span>
    </div>

  </header>
</template>

<script>
  export default {
    name: "v-header"
  }
</script>

<style lang="scss" scoped>
  .v-header {
    width: 100%;
    height: 60px;
    background-color: $color-blue-dark;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .head-left {
    margin-left: 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }

  .logo__icon {
    color: #fff;
    font-size: 27px;
  }

  .logo__title {
    font-size: 20px;
    color: #fff;
    margin-left: 10px;
    margin-top: 4px;
  }
</style>
