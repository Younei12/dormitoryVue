<template>
  <el-dialog :close-on-click-modal="false"
             :visible="visible"
             @close="onClose"
             @open="onOpen"
             @update:visible="$emit('update:visible',$event)"
             destroy-on-close
             title="修改宿舍信息"
             width="400px">
    <el-form :model="form" label-width="120px" ref="form">
      <el-form-item :rules="[{ required: true, message: '请选择楼栋号',trigger:'change'}]"
                    label="楼栋号"
                    prop="building_num">
        <el-select placeholder="请选择楼栋" size="medium" style="width:150px;" v-model="form.building_num">
          <el-option :key="item._id"
                     :label="item.building_num+'号楼'"
                     :value="item.building_num"
                     v-for="item in options.buildings"/>
        </el-select>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '请输入门牌号'}]"
                    label="门牌号"
                    prop="house_num">
        <el-input placeholder="例如：604" size="medium" style="width: 150px;" v-model="form.house_num"/>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '请输入容纳人数',trigger:'change'}]" label="容纳人数" prop="contain_count">
        <el-input-number :min="0"
                         controls-position="right"
                         size="medium"
                         style="width: 150px;"
                         v-model.number="form.contain_count"/>
      </el-form-item>
      <el-form-item label="宿舍号" v-if="getDormNum(form.building_num,form.house_num)">
        <p class="tip-small">{{getDormNum(form.building_num,form.house_num)}}</p>
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
  import {getAllBuildings} from "@/api/building";

  export default {
    name: "edit-dorm",
    props: {
      visible: Boolean,
      curDorm: Object,
    },
    data() {
      return {
        form: {},
        options: {
          buildings: []
        },
      }
    },
    methods: {
      closeDialog() {
        this.$emit('update:visible', false);
      },
      onOpen() {
        const curDorm = this.curDorm;
        const building_num = curDorm.dorm_num.split('#')[0] * 1;
        const house_num = curDorm.dorm_num.split('#')[1];
        this.form = {
          building_num,
          house_num,
          contain_count: curDorm.contain_count
        };
      },
      onClose() {

      },
      getDormNum(building_num, house_num) {
        if (!building_num || !house_num) {
          return null
        }
        return building_num + "#" + house_num;
      },
      async submit() {
        try {
          await this.$refs.form.validate();
          const data = {...this.form};
          data.id = this.curDorm._id;
          this.request.post('/api/dorm/updateDorm', data).then(res => {
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
    },
    async mounted() {
      this.options.buildings = (await getAllBuildings()).data.data;
    }
  }
</script>

<style lang="scss" scoped>

</style>
