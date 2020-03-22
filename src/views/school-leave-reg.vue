<template>
  <div class="page-container" style="max-width: 450px">
    <div class="flex align-center margin-bottom-30">
      <p class=" title-part">填写离校登记表</p>
      <p @click="isShowSubmitted = true"
         class="margin-left-auto cursor-pointer color-main underline font-size-14"
      >已提交的离校登记表</p>
    </div>
    <el-form :model="form" label-width="130px" ref="form">
      <el-form-item label="学生姓名">
        <el-input :value="userInfo.name" disabled/>
      </el-form-item>
      <el-form-item :rules="[{required:true,message:'请输入联系方式',trigger:'blur'}]" label="联系方式" prop="contact">
        <el-input placeholder="请输入联系方式" v-model="form.contact"/>
      </el-form-item>
      <el-form-item :rules="[{required:true,message:'请输入离校去向',trigger:'blur'}]" label="离校去向" prop="destination">
        <el-input placeholder="请输入离校去向" v-model="form.destination"/>
      </el-form-item>
      <el-form-item :rules="[{required:true,message:'请选择离校日期',trigger:'blur'}]" label="离校日期" prop="leave_date">
        <el-date-picker placeholder="请选择离校日期" type="date" v-model="form.leave_date" value-format="timestamp"/>
      </el-form-item>
      <el-form-item :rules="[{required:true,message:'请选择返校日期',trigger:'blur'}]" label="返校日期" prop="goback_date">
        <el-date-picker placeholder="请选择返校日期" type="date" v-model="form.goback_date" value-format="timestamp"/>
      </el-form-item>
      <el-form-item :rules="[{required:true,message:'请输入紧急联系人电话',trigger:'blur'}]" label="紧急联系人电话" prop="emergency_concact">
        <el-input placeholder="请输入紧急联系人电话" v-model="form.emergency_concact"/>
      </el-form-item>
      <el-form-item class="text-center">
        <el-button @click="submit" type="primary">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="isShowSubmitted" @open="getSubmittedData" title="已提交的退寝申请单">
      <el-table :data="submittedList" border height="500px" stripe>
        <el-table-column align="center" label="提交日期">
          <template #default="scope">{{scope.row.edit_date | convertToDate}}</template>
        </el-table-column>
        <el-table-column align="center" label="联系方式" prop="contact"/>
        <el-table-column align="center" label="离校去向" prop="destination"/>
        <el-table-column align="center" label="离校日期">
          <template #default="scope">{{scope.row.leave_date | convertToDate}}</template>
        </el-table-column>
        <el-table-column align="center" label="返校日期">
          <template #default="scope">{{scope.row.goback_date | convertToDate}}</template>
        </el-table-column>
        <el-table-column align="center" label="紧急联系人电话" prop="emergency_concact"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState} from "vuex";

  const initForm = () => {
    return {
      contact: "",
      leave_date: "",
      goback_date: "",
      emergency_concact: ""
    }
  };

  export default {
    name: "school-leave-reg",
    data() {
      return {
        form: initForm(),
        isShowSubmitted: false,
        submittedList: []
      }
    },
    methods: {
      reset() {
        this.form = initForm();
      },
      getSubmittedData() {
        this.request.post('/api/student/findSelfLeaveSchoolForm').then(res => {
          if (!res.data.errcode) {
            this.submittedList = res.data.data;
          } else {
            this.$alert("错误", res.data.msg, {type: "error"});
          }
        })
      },
      async submit() {
        try {
          await this.$refs.form.validate();
          const data = {...this.form};
          if (data.leave_date>data.goback_date) {
            this.$alert("返校日期不能早于离校日期", "提示", {type: "error"});
            return false;
          }
          this.request.post('/api/student/editLeaveSchoolForm', data).then(res => {
            if (!res.data.errcode) {
              this.$alert("提交成功！", "提示", {type: "success"});
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
    }
  }
</script>

<style lang="scss" scoped>

</style>
