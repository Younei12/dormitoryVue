<template>
  <div>
    <el-dialog :close-on-click-modal="false"
               :visible="visible"
               @close="onClose"
               @update:visible="$emit('update:visible',$event)"
               class="text-center"
               destroy-on-close
               title="批量导入学生"
               width="500px">
      <p class="tip-small margin-bottom-20">
        提示：首次使用请先<span @click="downXlsx" class="cursor-pointer color-main underline">下载xlsx数据模板</span>，
        再进行编辑。
      </p>

      <upload-file ref="upload" drag @change="fileList = $event" accept=".xlsx" tips="请上传xlsx文件，请勿更改数据模板原有格式"/>

      <template #footer>
        <div class="text-center">
          <el-button @click="startResolve" type="primary">解析文件</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :visible.sync="isShowErrList" title="添加失败，请核对">
      <el-table :data="errList" border height="500" stripe>
        <el-table-column align="center" label="学号" prop="student_num" sortable/>
        <el-table-column align="center" label="姓名" prop="student_name" sortable/>
        <el-table-column align="center" label="性别" prop="student_sex" sortable/>
        <el-table-column align="center" label="地址" prop="student_address" sortable/>
        <el-table-column align="center" label="专业" prop="student_major" sortable/>
        <el-table-column align="center" label="错误" label-class-name="color-danger">
          <template #default="scope">
            <p class="color-danger" :key="index" v-for="(error,index) in scope.row.error">{{error}}</p>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import UploadFile from "@/components/common/upload-file";

  export default {
    name: "bulk-import-students",
    components: {UploadFile},
    props: {
      visible: Boolean
    },
    data() {
      return {
        fileList: [],
        isShowErrList: false,
        errList: []
      }
    },
    methods: {
      onClose() {
        this.clearFile();
      },
      closeDialog() {
        this.$emit('update:visible', false);
      },
      downXlsx() {
        const url = this.config.baseUrl + '/public/assets/student-template.xlsx';
        window.open(url, "_blank")
      },
      startResolve() {
        if (!this.fileList.length) {
          this.$alert("请先上传文件！", "提示", {type: "warning"});
          return false;
        }
        const data = {fileUrl: this.fileList[0].url};
        this.request.post('/api/student/insertByXlsx', data).then(res => {
          if (!res.data.errcode) {
            this.$alert('添加成功！', '提示', {type: "success"});
            this.closeDialog();
            this.$emit('update');
          } else if (res.data.errcode === 1) {
            this.errList = res.data.data;
            this.isShowErrList = true;
          }else{
            this.$alert(res.data.msg, '错误', {type: "error"});
          }
          this.$refs.upload.clearFilesList();
        })
      },
      clearFile() {
        const url = this.fileList[0] && this.fileList[0].url;
        url && this.request.post('/api/common/delStaticFile', {url});
      },
      sexConvert(row, column, v) {
        return v == 1 ? "男" : v == 2 ? "女" : ""
      }
    },
    beforeDestroy() {
      this.clearFile();
    }
  }
</script>

<style lang="scss" scoped>

</style>
