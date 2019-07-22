<template>
    <header class="v-header">

        <div class="head-left">
            <i class="logo__icon el-icon-s-claim"></i>
            <span class="logo__title">学生宿舍管理系统</span>
        </div>

        <div class="head-right">
            <img class="user-avatar" />
            <span class="user-name"></span>
        </div>

    </header>
</template>

<script>
    export default {
        name:"v-header"
    }
</script>

<style lang="scss" scoped>
    .v-header{
        width: 100%;
        height: 3rem;
        background-color: $color-blue-dark;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .head-left{
        margin-left: 1rem;
        display: flex;
    }
    .logo__icon{
        color: #fff;
        font-size: 1.2rem;
    }
    .logo__title{
        font-size: 0.96rem;
        color: #fff;
        line-height: normal;
        margin-left: 0.6rem;
    }
</style>