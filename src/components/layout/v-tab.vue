<template>
  <div class="tag-bar">
    <ul class="tag-list">
      <router-link
        class="tag-item"
        :class="{'active': isActive(item.path)}"
        v-for="(item,index) in tagsList"
        :key="item.path"
        :to="item.path"
      >
        <span class="tag-name">{{item.title}}</span>
        <i class="el-icon-close close-btn"></i>
      </router-link>
    </ul>
  </div>
</template>

<script>
  import bus from "../common/bus";

  export default {
    name: "v-tab",
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
        console.log(route)
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
        // 出发设置标签事件
        bus.$emit('set:tag', this.tagsList);
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
          this.$router.push("/");
        }

      }
    },
    watch: {
      $route: {
        handler(newRoute) {
          this.setTags(newRoute);
        },
        immediate: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tag-bar {
    background-color: #2c3a4e;
    font-size: 0.66rem;
    transition: all 0.2s;
  }

  .tag-list {
    display: flex;
  }

  .tag-item {
    height: 1.8rem;
    display: flex;
    align-items: center;
    padding: 0 0 0 0.8rem;
    cursor: pointer;
    box-sizing: border-box;
    transition: all 0.2s;
    color: #7b8f99;

    &:hover {
      background-color: #39495f;
    }

    &:hover .tag-name{
      color: #d6e1e7
    }

    &.active {
      background-color: #3d4d64;
    }

    &.active .tag-name {
      color: #f6fcff;
    }

    /*&:last-of-type{*/
    /*  margin-right: 0;*/
    /*}*/
  }

  .tag-name {
    margin-right: 10px;
    transition: all 0.2s;
  }

  .close-btn{
    padding: 0.5rem 0.5rem 0.5rem 0.8rem;
  }

  .close-btn:hover {
    color: #e7eef1;
  }
</style>
