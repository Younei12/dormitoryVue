<template>
    <div class="home">
        <v-header class="header"></v-header>
        <div class="content">
            <v-aside class="aside-bar"></v-aside>
            <main class="main">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script>
    import vHeader from "@/components/v-header.vue";
    import vAside from "@/components/v-aside.vue";
    export default {
        name: "Home",
        components: {
            vHeader,
            vAside
        }
    };
</script>

<style lang="scss" scoped>
    .home {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .content {
        flex: 1;
        display: flex;
    }

    .aside-bar {
        width: 11rem;
    }
    .main{
        flex:1;
        overflow-y:auto; 
    }
</style>