<template>
  <div class="page-container" style="max-width: 500px">
    <div class="flex align-center margin-bottom-30">
      <p class=" title-part">填写设备报修单</p>
      <p @click="isShowSubmitted = true"
         class="margin-left-auto cursor-pointer color-main underline font-size-14"
      >已提交的报修单</p>
    </div>
    <el-form :model="form" label-width="100px" ref="form">
      <el-form-item label="学生姓名">
        <el-input :value="userInfo.name" disabled/>
      </el-form-item>
      <el-form-item :rules="[{required:true,message:'请输入宿舍号',trigger:'blur'}]" label="宿舍号" prop="dorm_num">
        <el-input placeholder="例如：8#604" v-model="form.dorm_num"/>
      </el-form-item>
      <el-form-item :rules="[{required:true,message:'请输入联系方式',trigger:'blur'}]" label="联系方式" prop="contact">
        <el-input placeholder="请输入联系方式" v-model="form.contact"/>
      </el-form-item>
      <el-form-item :rules="[{required:true,message:'请输入描述',trigger:'blur'}]" label="描述" prop="repair_desc">
        <el-input :rows="3" placeholder="请详细描述" type="textarea" v-model="form.repair_desc"/>
      </el-form-item>
      <el-form-item label="图片描述">
        <upload-file :limit="5"
                     @change="form.repair_files = $event"
                     accept="image/*"
                     list-type="picture-card"
                     ref="upload">
          <i class="el-icon-plus" style="vertical-align: middle;"></i>
        </upload-file>
      </el-form-item>
      <el-form-item class="text-center">
        <el-button @click="submit" type="primary">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="isShowSubmitted" @open="getSubmittedData" title="已提交的退寝申请单" width="80%">
      <el-table :data="submittedList" border height="500px" stripe>
        <el-table-column align="center" label="提交日期" width="140px">
          <template #default="scope">{{scope.row.edit_date | convertToDate}}</template>
        </el-table-column>
        <el-table-column align="center" label="宿舍号" prop="dorm_id.dorm_num" width="120px"/>
        <el-table-column align="center" label="描述" prop="repair_desc"/>
        <el-table-column align="center" label="联系方式" prop="contact" width="140px"/>
        <el-table-column align="center" label="图片" width="100px">
          <template #default="scope">
            <span @click="showRepairImages(scope.row.repair_files)"
                  class="cursor-pointer color-main underline"
                  v-if="scope.row.repair_files.length">点击查看</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="维修人" prop="repairmen_id" width="120px">
          <template #default="scope">{{scope.row.repairmen_id&&scope.row.repairmen_id.repairmen_name | setEmpty}}</template>
        </el-table-column>
        <el-table-column align="center" label="维修状态" prop="repair_status" width="120px">
          <template #default="scope">
            <div>
              <p class="color-info" v-if="scope.row.repair_status === -1">待处理</p>
              <p class="color-blue" v-if="scope.row.repair_status === 1">正在处理</p>
              <p class="color-success" v-if="scope.row.repair_status === 2">已处理</p>
              <p class="color-warning" v-if="scope.row.repair_status === 3">另约时间</p>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <image-viewer :images="currentImages" :visible.sync="isImageViewer"/>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import UploadFile from "@/components/common/upload-file";
  import ImageViewer from "@/components/common/image-viewer";

  const initForm = () => {
    return {
      dorm_num: "",
      repair_desc: "",
      contact: "",
      repair_files: []
    }
  };
  export default {
    name: "equ-submit",
    components: {ImageViewer, UploadFile},
    data() {
      return {
        isShowSubmitted: false,
        form: initForm(),
        submittedList: [],
        isImageViewer: false,
        currentImages: []
      }
    },
    methods: {
      async submit() {
        try {
          await this.$refs.form.validate();
          const data = {...this.form};
          data.repair_files = data.repair_files.map(item => item.url);
          console.log(data);
          this.request.post('/api/repair/editRepairForm', data).then(res => {
            if (!res.data.errcode) {
              this.$alert("提交成功，请等待维修员处理。", "提示", {type: "success"});
              this.form = initForm();
            } else {
              this.$alert(res.data.msg, "错误", {type: "error"});
            }
          })
        } catch (e) {
          return false;
        }
      },
      async reset() {
        this.$refs.upload.clearFilesList();
        for (const item of this.form.repair_files) {
          this.request.post('/api/common/delStaticFile', {url: item.url});
        }
        this.form = initForm();
        this.$refs.upload.clearFilesList();
      },
      getSubmittedData() {
        this.request.post('/api/repair/studentSubmittedRepairForm').then(res => {
          if (!res.data.errcode) {
            this.submittedList = res.data.data;
          } else {
            this.$alert(res.data.msg, "错误", {type: "error"});
          }
        })
      },
      showRepairImages(files) {
        this.currentImages = files;
        this.isImageViewer = true;
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
  }
</script>

<style lang="scss" scoped>
  /deep/ {
    .el-upload-list--picture-card .el-upload-list__item {
      width: 120px;
      height: 120px;
    }

    .el-upload--picture-card {
      width: 120px;
      height: 120px;
      line-height: 120px;
    }
  }
</style>
