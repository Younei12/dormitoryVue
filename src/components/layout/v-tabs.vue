<template>
  <div class="tag-bar">
    <ul class="tag-list">
      <li class="tag-item" :class="{'active': isActive(item.path)}" v-for="(item,index) in tagsList"
          :key="item.path">
        <router-link :to="item.path" class="tag-name">
          {{item.title}}
        </router-link>
        <i class="el-icon-close close-btn" @click.stop="closeTag(index)"></i>
      </li>
    </ul>
  </div>
</template>

<script>
  import bus from "../../utils/bus";
  import localforage from "localforage"

  export default {
    name: "v-tabs",
    props: {},
    data() {
      return {
        tagsList: []
      }
    },
    methods: {
      isActive(path) {
        return path === this.$route.fullPath;
      },
      setTags(route) {
        let isExist = this.tagsList.some(item => {
          return item.path === route.fullPath;
        });

        if (!isExist) {
          // 最多显示8个标签
          if (this.tagsList.length >= 8) {
            this.tagsList.shift();
          }

          this.tagsList.push({
            name: route.matched[1].components.default.name,
            path: route.fullPath,
            title: route.meta.title
          });
        }
        // 触发设置标签事件
        bus.$emit('change:tags', this.tagsList);
        localforage.setItem('tags',this.tagsList);
      },
      closeTag(index) {
        // 关闭页面，如果关闭的是当前页，跳到下一个标签页，如果当前页是最后一页，这跳到前一个标签页

        // 当前关闭的标签
        var delItem = this.tagsList.splice(index, 1)[0];
        // 如果关闭的标签是当前页面，关闭后显示的页面
        var showItem = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];

        if (showItem) {
          // 如果关闭后仍有页面可以显示
          delItem.path === this.$route.fullPath && this.$router.push(showItem.path);
        } else {
          // 关闭后没有页面可以显示，跳到首页
          this.$router.push("/main");
        }

        bus.$emit('change:tags', this.tagsList);
        localforage.setItem('tags',this.tagsList);
      }
    },
    watch: {
      $route: {
        handler(newRoute) {
          this.setTags(newRoute);
        },
        immediate: true
      }
    },
    async created() {
      let tags = await localforage.getItem('tags');
      if (tags){
        this.tagsList = tags;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tag-bar {
    background-color: #2c3a4e;
    font-size: 15px;
    transition: all 0.2s;
  }

  .tag-list {
    display: flex;
    /*min-width: 1300px;*/
    background-color: #2c3a4e;
  }

  .tag-item {
    color: #8b9aa1;
    position: relative;
    cursor: pointer;

    .tag-name {
      transition: all 0.2s;
      padding: 0 42px 0 18px;
      height: 42px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      transition: all 0.2s;
      white-space: nowrap;
    }

    &:hover {
      background-color: #39495f;
    }

    &:hover .tag-name {
      color: #d6e1e7
    }

    &.active {
      background-color: #3d4d64;
    }

    &.active .tag-name {
      color: #f6fcff;
    }

  }

  .close-btn {
    padding: 0.5rem;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .close-btn:hover {
    color: #e7eef1;
  }
</style>
