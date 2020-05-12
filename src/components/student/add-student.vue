<template>
  <!-- 添加学生 -->
  <el-dialog :visible="visible"
             @close="onClose"
             @update:visible="$emit('update:visible',$event)"
             destroy-on-close
             :close-on-click-modal="false"
             title="添加学生"
             width="500px">
    <el-form :model="form" :rules="rules" label-width="100px" ref="form">
      <el-form-item label="学号：" prop="student_num">
        <el-input placeholder="请输入学号" style="width: 200px;" v-model="form.student_num"/>
      </el-form-item>
      <el-form-item label="初始密码：" prop="student_password">
        <el-input placeholder="请输入初始密码" style="width: 200px;" v-model="form.student_password"/>
      </el-form-item>
      <el-form-item label="姓名：" prop="student_password">
        <el-input placeholder="请输入姓名" style="width: 200px;" v-model="form.student_name"/>
      </el-form-item>
      <el-form-item label="性别：" prop="student_sex">
        <el-select placeholder="全部" size="medium" style="width:100px;" v-model="form.student_sex">
          <el-option :value="1" label="男"></el-option>
          <el-option :value="2" label="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业：" prop="student_major">
        <el-input placeholder="请输入专业" style="width: 200px;" v-model="form.student_major"/>
      </el-form-item>
      <el-form-item label="班级：" prop="student_class">
        <el-input-number placeholder="请输入班级" style="width: 200px;" controls-position="right" v-model="form.student_class"/>
      </el-form-item>
      <el-form-item label="地址：" prop="student_address">
        <el-input placeholder="请输入地址" style="width: 200px;" v-model="form.student_address"/>
      </el-form-item>
      <el-form-item label="学业状态" prop="study_status">
        <el-select placeholder="全部" size="medium" style="width:100px;" v-model="form.study_status">
          <el-option :value="-1" label="未报到"></el-option>
          <el-option :value="1" label="在读"></el-option>
          <el-option :value="2" label="毕业"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入学日期：" prop="enroll_date">
        <el-date-picker placeholder="选择日期"
                        type="date"
                        v-model="form.enroll_date"
                        value-format="yyyy-MM-dd"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="text-center">
        <el-button @click="submit" type="primary">提交</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
  const initForm = function () {
    return {
      student_num: "",
      student_password: "",
      student_name: "",
      student_sex: 1,
      student_class: "",
      student_address: "",
      student_major: "",
      enroll_date: "",
      study_status: 1,
    };
  };
  export default {
    name: "add-student",
    props: {
      visible: Boolean
    },
    data() {
      return {
        form: initForm(),
        rules: {
          student_num: [{required: true, message: '学号不能为空'}],
          student_password: [{required: true, message: '初始密码不能为空'}],
          student_name: [{required: true, message: '姓名不能为空'}],
          student_class: [{required: true, message: '班级不能为空'}],
          student_major: [{required: true, message: '专业不能为空'}],
        }
      }
    },
    methods: {
      closeDialog() {
        this.$emit('update:visible', false);
      },
      onClose() {
        this.form = initForm();
      },
      async submit() {
        try {
          await this.$refs.form.validate();
          this.request.post('/api/student/insert', this.form).then(res => {
            if (!res.data.errcode) {
              this.$alert('添加成功！', '提示', {type: "success"});
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
    }
  }
</script>

<style lang="scss" scoped>

</style>
