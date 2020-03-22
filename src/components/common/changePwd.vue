<template>
  <div>
    <el-dialog :close-on-click-modal="false"
               :visible="visible"
               @open="onOpen"
               @update:visible="$emit('update:visible',$event)"
               destroy-on-close
               title="修改密码"
               width="500px">
      <el-form :model="form" label-width="100px" ref="form">
        <el-form-item :rules="[{required:true,message:'请输入旧密码',trigger:'blur'}]" label="旧密码：" prop="oldPassword">
          <el-input placeholder="请输入旧密码" show-password style="width: 200px;" v-model="form.oldPassword"/>
        </el-form-item>
        <el-form-item :rules="[{required:true,message:'请输入新密码',trigger:'blur'}]" label="新密码：" prop="newPassword">
          <el-input placeholder="请输入新密码" show-password style="width: 200px;" v-model="form.newPassword"/>
        </el-form-item>
        <el-form-item :rules="[{required:true,message:'请再次输入新密码',trigger:'blur'}]" label="确认密码：" prop="newPasswordDup">
          <el-input placeholder="请再次输入新密码" show-password style="width: 200px;" v-model="form.newPasswordDup"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="text-center">
          <el-button @click="submit" type="primary">保存</el-button>
          <el-button @click="$emit('update:visible',false)">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import {logout} from "@/utils/service";

  const initForm = () => {
    return {
      oldPassword: "",
      newPassword: "",
      newPasswordDup: "",
    }
  };
  export default {
    name: "changePwd",
    props: {
      visible: Boolean
    },
    data() {
      return {
        form: initForm()
      }
    },
    methods: {
      onOpen() {
        this.form = initForm();
      },
      async submit() {
        try {
          await this.$refs.form.validate();
          const form = {...this.form};
          if (form.newPassword !== form.newPasswordDup) {
            this.$alert('新密码与旧密码不一致！', '错误', {type: "error"});
            return false;
          }
          this.request.post('/api/user/updatePassword', this.form).then(res => {
            if (!res.data.errcode) {
              this.$alert('修改成功！请重新登录', '提示', {type: "success"}).then(async res => {
                this.$emit('update:visible', false);
                await logout();
              });
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
