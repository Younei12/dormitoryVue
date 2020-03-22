<template>
  <div>
    <el-dialog :close-on-click-modal="false"
               :visible="visible"
               @close="onClose"
               @open="onOpen"
               @update:visible="$emit('update:visible',$event)"
               destroy-on-close
               title="批量分配宿舍"
               width="400px">
      <el-form :model="form" label-width="90px" ref="form">
        <el-form-item :error="checkError" label="宿舍号：" prop="dorm_num">
          <el-input @blur="checkDorm" placeholder="例如：8#604" v-model="form.dorm_num"/>
          <p class="tip-small" v-if="curDormInfo.contain_count">
            已住人数：{{curDormInfo.reside_count}}，
            容纳人数：{{curDormInfo.contain_count}}
          </p>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="text-center">
          <el-button @click="submit" type="primary">保存</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "bulk-assign-dorm",
    props: {
      visible: Boolean,
      selectedStudents: Array,
    },
    data() {
      return {
        form: {
          dorm_num: ""
        },
        checkError: "",
        curDormInfo: {},
      }
    },
    methods: {
      closeDialog() {
        this.$emit('update:visible', false);
      },
      onClose() {
        this.form.dorm_num = "";
      },
      onOpen() {

      },
      checkDorm(e) {
        const value = e.target.value;
        if (this.checkDelay) {
          clearTimeout(this.checkDelay)
        }
        this.checkDelay = setTimeout(() => {
          if (value) {
            if ((/^.+#.+$/).test(value)) {
              this.getCurDormInfo();
            } else {
              this.checkError = "宿舍号格式错误。例：8#604";
            }
          } else {
            this.checkError = "请输入宿舍号";
          }

        }, 300)
      },
      getCurDormInfo() {
        this.request.post('/api/dorm/checkStudentCount', {dorm_num: this.form.dorm_num}).then(res => {
          if (!res.data.errcode) {
            this.curDormInfo = res.data.data;
            this.checkError = "";
          } else {
            this.curDormInfo = {};
            this.checkError = res.data.msg;
          }
        })
      },
      submit() {
        try {
          this.$refs.form.validate();
          const data = {
            dorm_num: this.form.dorm_num,
            students: this.selectedStudents.map(item => item._id)
          };
          this.request.post('/api/student/bulkAssignDorm', data).then(res => {
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
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
