<template>
  <div class="page-container" style="max-width: 450px">
    <el-alert class="margin-bottom-20"
              description="您还未被分配宿舍，无法提交调整宿舍申请单。"
              show-icon
              title="提示"
              type="error"
              v-if="userInfo.reside_status === -1"/>
    <el-alert class="margin-bottom-20"
              description="您已办理退寝，无法提交调整宿舍申请单。"
              show-icon
              title="提示"
              type="error"
              v-if="userInfo.reside_status === 2"/>
    <div class="flex align-center margin-bottom-30">
      <p class=" title-part">填写调整宿舍申请单</p>
      <p @click="isShowSubmitted = true"
         class="margin-left-auto cursor-pointer color-main underline font-size-14"
      >已提交的申请单</p>
    </div>
    <el-form :model="form" label-width="100px" ref="form">
      <el-form-item label="学生姓名">
        <el-input :value="userInfo.name" disabled/>
      </el-form-item>
      <el-form-item label="原宿舍号">
        <el-input :value="userInfo.dorm_num" disabled/>
      </el-form-item>
      <el-form-item :rules="[{required:true,message:'请输入目标宿舍',trigger:'blur'}]" label="目标宿舍" prop="target_dorm">
        <div class="flex">
          <el-input placeholder="例如：8#604" v-model="form.target_dorm"/>
          <el-button type="primary" class="margin-left-10" @click="checkDorm(form.target_dorm)">检查是否可用</el-button>
        </div>

      </el-form-item>
      <el-form-item :rules="[{required:true,message:'请输入原因',trigger:'blur'}]" label="原因" prop="reason">
        <el-input :rows="3" placeholder="请输入原因（可选）" type="textarea" v-model="form.reason"/>
      </el-form-item>
      <el-form-item class="text-center">
        <el-button @click="submit" type="primary">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="isShowSubmitted" @open="getSubmittedData" title="已提交的调整宿舍申请单">
      <el-table :data="submittedList" border height="500px" stripe>
        <el-table-column align="center" label="提交时间">
          <template #default="scope">{{scope.row.edit_date | convertToDate("datetime")}}</template>
        </el-table-column>
        <el-table-column align="center" label="目标宿舍" prop="target_dorm"/>
        <el-table-column align="center" label="原因" prop="reason"/>
        <el-table-column align="center" label="审批时间">
          <template #default="scope">{{scope.row.approval_date | convertToDate("datetime") | setEmpty}}</template>
        </el-table-column>
        <el-table-column align="center" label="审批人">
          <template #default="scope">{{scope.row.approver&&scope.row.approver.admin_name | setEmpty}}</template>
        </el-table-column>
        <el-table-column align="center" label="审批状态">
          <template #default="scope">
            <div>
              <p class="color-blue" v-if="scope.row.approval_status === -1">待审批</p>
              <p class="color-success" v-if="scope.row.approval_status === 1">已通过</p>
              <p class="color-danger" v-if="scope.row.approval_status === 2">已驳回</p>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "adjust-dorm-apply",
    data() {
      return {
        isShowSubmitted: false,
        form: {
          target_dorm: "",
          reason: ""
        },
        submittedList: []
      }
    },
    methods: {
      reset() {
        this.form = {
          contact: "",
          reason: ""
        }
      },
      getSubmittedData() {
        this.request.post('/api/student/studentSubmittedAdjustForm').then(res => {
          if (!res.data.errcode) {
            this.submittedList = res.data.data;
          } else {
            this.$alert("错误", res.data.msg, {type: "error"});
          }
        })
      },
      checkDorm(dorm_num) {
        this.request.post('/api/dorm/checkStudentCount', {dorm_num}).then(res => {
          if (!res.data.errcode) {
            this.$alert("该宿舍可用！", "提示", {type: "success"});
          } else {
            this.$alert(res.data.msg, "提示", {type: "error"});
          }
        })
      },
      async submit() {
        try {
          if (this.userInfo.reside_status !== 1) {
            this.$alert("您无法申请调整宿舍", "提示", {type: "error"});
            return false;
          }
          await this.$refs.form.validate();
          const data = {...this.form};
          this.request.post('/api/student/postAdjustForm', data).then(res => {
            if (!res.data.errcode) {
              this.$alert("提交成功，请等待宿舍管理员审核", "提示", {type: "success"});
              this.reset();
            } else {
              this.$alert("错误", res.data.msg, {type: "error"});
            }
          })
        } catch (e) {
          return false;
        }
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    mounted() {

    }
  }
</script>

<style lang="scss" scoped>

</style>
