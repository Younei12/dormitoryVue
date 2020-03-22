<template>
  <el-upload :accept="accept"
             :action="action"
             :drag="drag"
             :headers="headers"
             :limit="limit"
             :multiple="multiple"
             :on-change="onChange"
             :on-exceed="onExceed"
             :on-remove="onRemove"
             :on-success="onSuccess"
             :list-type="listType"
             ref="upload"
  >
    <slot>
      <el-button size="small" type="primary" v-if="!drag">点击上传</el-button>
      <section v-if="drag">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </section>
    </slot>
    <div class="el-upload__tip" slot="tip" v-if="tips">{{tips}}</div>
  </el-upload>
</template>

<script>
  export default {
    name: "upload-file",
    props: {
      tips: String,
      multiple: {
        type: Boolean,
        default: false
      },
      limit: {
        type: Number,
        default: 1
      },
      drag: Boolean,
      accept: String,
      listType: {
        type: String
      }
    },
    data() {
      return {
        fileList: []
      }
    },
    methods: {
      onSuccess(response, file, fileList) {
        this.fileList = fileList.map(file => {
          return {
            url: file.response.data,
            name: file.name,
            uid: file.uid
          }
        });

      },
      onRemove(file, fileList) {
        const url = file.response && file.response.data;
        if (url) {
          this.request.post('/api/common/delStaticFile', {url}).then(res => {
            if (!res.data.errcode) {
              this.$message.success("删除文件成功");
            } else {
              this.$message.error(res.data.msg);
            }
          })
        }
      },
      onChange() {
        this.$emit('change', this.fileList);
      },
      onExceed() {
        this.$alert('一次最多只能上传' + this.limit + "个文件。", "提示", {type: "warning"});
      },
      clearFilesList() {
        this.$refs.upload.clearFiles();
      }
    },
    computed: {
      action() {
        return this.config.baseUrl + "/api/common/uploadFile"
      },
      headers() {
        return {
          token: localStorage.getItem("ds_token")
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-upload-dragger {
    width: 320px;
    height: 150px;
  }
</style>
