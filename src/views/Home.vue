<template>
  <div class="home">
    <v-header @click:logo="collapse = !collapse" class="header"></v-header>
    <div class="body">
      <v-aside :class="[{'aside-collapse':collapse},{'position-absolute':small_width},{'aside-shadow':small_width}]"
               class="aside-bar overflow-hidden"
               style="z-index: 999"/>
      <main class="main">
        <v-tabs class="hidden-xs-only"/>
        <section class="content">
          <router-view/>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
  import vHeader from "@/components/layout/v-header.vue";
  import vAside from "@/components/layout/v-aside.vue";
  import VTabs from "../components/layout/v-tabs";
  import {mapActions} from "vuex";

  export default {
    name: "Home",
    components: {
      VTabs,
      vHeader,
      vAside
    },
    data() {
      return {
        collapse: false,
        small_width: false
      }
    },
    methods: {
      ...mapActions(["getUserInfo"])
    },
    mounted() {
      window.onload = window.onresize = () => {
        this.collapse = this.small_width = document.body.clientWidth < 1025;
      };
      this.getUserInfo();
    }
  };
</script>

<style lang="scss" scoped>
  .home {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .body {
    flex: 1;
    display: flex;
    position: relative;
  }

  .aside-bar {
    width: 250px;
    flex: 0 0 auto;
    transition: all 0.2s;
  }

  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    transition: all 0.2s;
    width: 0;
  }

  .content {
    flex: 1 0 0;
    height: 0;
    overflow: auto;
  }

  .aside-collapse {
    width: 0;
  }

  .aside-shadow {
    box-shadow: 3px 7px 15px rgba(74, 83, 97, 0.8);
  }
</style>
