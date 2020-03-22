<template>
  <!-- 编辑学生信息 -->
  <el-dialog :before-close="beforeClose" :close-on-click-modal="false"
             :title="'修改'+curStudentDetail.student_name + '的学生信息'" :visible="visible"
             @update:visible="$emit('update:visible',$event)"
             width="500px"
  >
    <el-form :model="info" label-width="100px" ref="form">
      <el-form-item label="学号" prop="student_num">
        <el-input :value="info.student_num" disabled style="width: 200px;"/>
      </el-form-item>
      <el-form-item label="密码" prop="newPassword">
        <el-input autocomplete="off"
                  placeholder="不修改密码则不填"
                  style="width: 200px;"
                  v-model="info.newPassword"/>
      </el-form-item>

      <el-form-item :rules="[{required:true,message:'姓名不能为空'}]" label="姓名" prop="student_name">
        <el-input style="width: 200px;" v-model="info.student_name"/>
      </el-form-item>

      <el-form-item label="性别" prop="student_sex">
        <el-select placeholder="全部" size="medium" style="width:100px;" v-model="info.student_sex">
          <el-option :value="1" label="男"></el-option>
          <el-option :value="2" label="女"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="地址" prop="student_address">
        <el-input style="width: 200px;" v-model="info.student_address"/>
      </el-form-item>

      <el-form-item :rules="[{required:true,message:'专业不能为空'}]" label="专业" prop="student_major">
        <el-input style="width: 200px;" v-model="info.student_major"/>
      </el-form-item>

      <el-form-item :rules="[{required:true,message:'班级不能为空'}]" label="班级" prop="student_class">
        <el-input style="width: 200px;" v-model="info.student_class"/>
      </el-form-item>

      <el-form-item label="学业状态" prop="study_status">
        <el-select placeholder="全部" size="medium" style="width:100px;" v-model="info.study_status">
          <el-option :value="-1" label="未报到"></el-option>
          <el-option :value="1" label="在读"></el-option>
          <el-option :value="2" label="毕业"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="入学日期" prop="enroll_date">
        <el-date-picker placeholder="选择日期"
                        type="date"
                        v-model="info.enroll_date"
                        value-format="yyyy-MM-dd"/>
      </el-form-item>
      <section class="flex-center">
        <el-button @click="saveStudent" type="primary">保存</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </section>
    </el-form>
  </el-dialog>
</template>

<script>
  import _ from "lodash/lang";

  export default {
    name: "edit-student",
    props: {
      curStudentDetail: {
        type: Object,
        default: () => {
        }
      },
      visible: Boolean
    },
    data() {
      return {
        info: {},
      }
    },
    methods: {
      beforeClose(done) {
        done && done();
      },
      closeDialog() {
        this.$emit('update:visible', false);
        this.beforeClose();
      },
      async saveStudent() {
        try {
          await this.$refs.form.validate();
          const info = this.info;
          const form = {
            _id: info._id,
            student_name: info.student_name,
            student_password: info.newPassword,
            student_sex: info.student_sex,
            student_address: info.student_address,
            student_major: info.student_major,
            enroll_date: info.enroll_date,
            study_status: info.study_status,
            student_class:info.student_class
          };

          this.request.post('/api/student/updateOneById', form).then(res => {
            if (!res.data.errcode) {
              this.$alert('修改成功！', '提示', {type: "success"});
              this.closeDialog();
              this.$emit('update');
            } else {
              this.$alert(res.data.msg, '错误', {type: "error"});
            }
          })
        } catch (e) {
          return false
        }

      }
    },
    watch: {
      curStudentDetail: {
        handler(value) {
          this.info = _.cloneDeep(value);
        },
        immediate: true,
        deep: true
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
