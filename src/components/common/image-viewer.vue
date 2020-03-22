<template>
  <div>
    <el-dialog :close-on-click-modal="false"
               :visible="visible"
               @update:visible="$emit('update:visible',$event)"
               class="text-center"
               top="5vh"
               width="500px"
               destroy-on-close
               title="查看图片（点击查看大图）"
               >
      <div class="image-container">
        <el-image :key="index"
                  :preview-src-list="imagesList"
                  :src="image"
                  class="image-item"
                  v-for="(image,index) in imagesList"/>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  import {convertUrl} from "@/utils/utils";

  export default {
    name: "image-viewer",
    props: {
      visible: Boolean,
      convert: {
        type: Boolean,
        default: true
      },
      images: {
        type: Array
      }
    },
    data() {
      return {
        imagesList: []
      }
    },
    methods: {},
    watch: {
      images: {
        handler(images) {
          if (this.convert) {
            this.imagesList = images.map(convertUrl);
          } else {
            this.imagesList = images;
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .image-container{
    height: 75vh;
    overflow-y: auto;
  }
  .image-item{
    width: 90%;
    height: auto;
    display: block;
    margin: 20px auto;
  }
</style>
