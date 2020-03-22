<template>
  <!-- 分配宿舍 -->
  <el-dialog :before-close="beforeClose"
             :close-on-click-modal="false"
             :visible="visible"
             @open="onOpen"
             @update:visible="$emit('update:visible',$event)"
             destroy-on-close
             title="学生宿舍管理"
             width="420px">
    <el-form :model="assignForm" label-width="90px" ref="assignForm">
      <el-form-item label="学生姓名：">
        {{curStudentDetail.student_name}}
      </el-form-item>
      <el-form-item :error="checkError" label="宿舍号：" prop="dorm_num">
        <el-input placeholder="例如：8#604" style="width: 160px;" v-model="assignForm.dorm_num"/>
        <el-button @click="checkDorm" class="margin-left-10" type="primary">检查宿舍</el-button>
        <p class="tip-small" v-if="curDormInfo.contain_count">
          已住人数：{{curDormInfo.reside_count}}，
          容纳人数：{{curDormInfo.contain_count}}
        </p>
      </el-form-item>
      <el-form-item label="居住状态：">
        <p class="tip-small" v-if="curStudentDetail.reside_status === -1">当前学生还未分配宿舍</p>
        <p class="tip-small" v-if="curStudentDetail.reside_status === 1">当前学生已分配宿舍</p>
        <p class="tip-small" v-if="curStudentDetail.reside_status === 2">当前学生已办理退寝</p>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="text-center">
        <el-button @click="submit" type="primary">保存</el-button>
        <el-button @click="setLeave" type="warning" v-if="curStudentDetail.reside_status === 1">办理退寝</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
  export default {
    name: "assign-student-dorm",
    props: {
      curStudentDetail: Object,
      visible: Boolean
    },
    data() {
      return {
        curDormInfo: {
          "assign": true
        },
        checkError: "",
        assignForm: {
          dorm_num: ""
        },
        isReside: false,
        checkDelay: null
      }
    },
    methods: {
      beforeClose(done) {
        this.assignForm.dorm_num = "";
        this.checkError = "";
        this.curDormInfo = {};
        done && done();
      },
      closeDialog() {
        this.$emit('update:visible', false);
        this.beforeClose();
      },
      getCurDormInfo() {
        this.request.post('/api/dorm/checkStudentCount', {dorm_num: this.assignForm.dorm_num}).then(res => {
          if (!res.data.errcode) {
            this.curDormInfo = res.data.data;
            this.checkError = "";
          } else {
            this.curDormInfo = {};
            this.checkError = res.data.msg;
          }
        })
      },
      onOpen() {
        this.isReside = !!(this.curStudentDetail.dorm_id && this.curStudentDetail.dorm_id.dorm_num);
        this.assignForm.dorm_num = this.curStudentDetail.dorm_id && this.curStudentDetail.dorm_id.dorm_num;
      },
      async submit() {
        try {
          this.$refs.assignForm.validate();
          const form = {
            student_id: this.curStudentDetail._id,
            dorm_num: this.assignForm.dorm_num
          };
          this.request.post('/api/student/assignDorm', form).then(res => {
            if (!res.data.errcode) {
              this.$alert('分配宿舍成功！', '提示', {type: "success"});
              this.closeDialog();
              this.$emit('update');
            } else {
              this.$alert(res.data.msg, '错误', {type: "error"});
            }
          })
        } catch (e) {
          return false
        }
      },
      checkDorm(e) {
        const value = this.assignForm.dorm_num;

        if (value) {
          if ((/^.+#.+$/).test(value)) {
            this.getCurDormInfo();
          } else {
            this.checkError = "宿舍号格式错误。例：8#604";
          }
        } else {
          this.checkError = "请输入宿舍号";
        }
      },
      setLeave() {
        this.$confirm('是否确定为该学生办理退寝？', '提示', {
          type: "warning"
        }).then(() => {
          const data = {id: this.curStudentDetail._id};
          this.request.post('/api/student/setLeave', data).then(res => {
            if (!res.data.errcode) {
              this.$alert('退寝成功！', '提示', {type: "success"});
              this.$emit('update');
              this.closeDialog();
            } else {
              this.$alert(res.data.msg, '错误', {type: "error"});
            }
          })
        });

      }
    },
    // watch: {
    //   "assignForm.dorm_num": {
    //     handler(value) {
    //
    //     }
    //   }
    // }
  }
</script>

<style lang="scss" scoped>

</style>
