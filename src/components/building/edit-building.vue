<template>
  <el-dialog :close-on-click-modal="false"
             :visible="visible"
             @close="onClose"
             @open="onOpen"
             @update:visible="$emit('update:visible',$event)"
             destroy-on-close
             title="修改楼栋信息"
             width="400px">
    <el-form :model="form" label-width="100px" ref="form">
      <el-form-item :rules="[{ required: true, message: '请输入楼栋号',trigger:'change'}]"
                    label="楼栋号"
                    prop="building_num">
        <el-input class="text-center" placeholder="例：8" size="medium" style="width: 150px;" v-model="form.building_num">
          <template #append>号楼</template>
        </el-input>
      </el-form-item>
      <el-form-item label="楼层数" prop="floor" :rules="[{ required: true, message: '请输入楼层数',trigger:'change'}]">
        <el-input-number :min="1"
                         controls-position="right"
                         size="medium"
                         style="width: 150px;"
                         v-model.number="form.floor"/>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input placeholder="选填" size="medium" :rows="3" type="textarea" style="width: 150px;" v-model="form.desc"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="text-center">
        <el-button @click="submit" type="primary">保存</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
  export default {
    name: "edit-building",
    props: {
      visible: Boolean,
      curBuilding: Object,
    },
    data() {
      return {
        form: {},
      }
    },
    methods: {
      closeDialog() {
        this.$emit('update:visible', false);
      },
      onOpen() {
        const curBuilding = this.curBuilding;
        this.form = {
          building_num: curBuilding.building_num,
          floor: curBuilding.floor,
          desc: curBuilding.desc
        }
      },
      onClose() {

      },
      async submit() {
        try {
          await this.$refs.form.validate();
          const data = {...this.form};
          data.id = this.curBuilding._id;

          this.request.post('/api/building/updateBuilding', data).then(res => {
            if (!res.data.errcode) {
              this.$alert('保存成功！', '提示', {type: "success"});
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
