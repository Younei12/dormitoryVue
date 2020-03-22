<template>
  <div>
    <el-dialog :before-close="beforeClose" :close-on-click-modal="false"
               :visible="visible"
               @update:visible="$emit('update:visible',$event)"
               title="新增楼栋" width="830px"
    >
      <el-form :model="form" inline ref="form">
        <div class="dialog-container">
          <section :key="building.uid" v-for="(building, index) in form.buildings">
            <el-form-item :prop="'buildings.' + index + '.building_num'"
                          :rules="[{ required: true, message: '请输入楼栋号'},{validator:checkUniqueNum}]"
                          label="楼栋号"
                          label-width="90px">
              <el-input placeholder="例：8" size="medium" style="width: 150px;" class="text-center" v-model="building.building_num">
                <template #append>号楼</template>
              </el-input>
            </el-form-item>
            <el-form-item :prop="'buildings.' + index + '.floor'" label="楼层数">
              <el-input-number :min="1"
                               controls-position="right"
                               size="medium"
                               style="width: 100px;"
                               v-model.number="building.floor"/>
            </el-form-item>
            <el-form-item :prop="'buildings.' + index + '.desc'" label="描述">
              <el-input placeholder="选填" size="medium" style="width: 230px;" v-model="building.desc"/>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="form.buildings.length === 1"
                         @click="delBuilding(index)"
                         circle
                         icon="el-icon-minus"
                         plain
                         size="mini"
                         type="danger"/>
              <el-button @click="addBuilding(index)"
                         circle
                         icon="el-icon-plus"
                         plain
                         size="mini"
                         type="primary"
              />
            </el-form-item>
          </section>
        </div>
      </el-form>
      <template #footer>
        <section class="flex-center">
          <el-button @click="submit" type="primary">确认添加</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </section>
      </template>
    </el-dialog>

    <el-dialog title="错误信息" :close-on-click-modal="false"  :visible.sync="isShowErrDialog" width="600px">
      <div class="dialog-container">
        <el-table :data="errList" border stripe>
          <el-table-column align="center" label="楼栋号" prop="building_num" />
          <el-table-column align="center" label="错误原因" prop="errors" class-name="color-danger" />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  class BuildingItem {
    constructor() {
      this.building_num = "";
      this.floor = 6;
      this.desc = "";
      this.uid = Math.random() * Date.now();
    }
  }

  export default {
    name: "add-buidling",
    props: {
      visible: Boolean
    },
    data() {
      return {
        form: {
          buildings: [new BuildingItem()]
        },
        isShowErrDialog:false,
        errList:[]
      }
    },
    methods: {
      beforeClose(done) {
        this.form.buildings = [new BuildingItem()];
        done && done();
      },
      addBuilding(index) {
        this.form.buildings.splice(index + 1, 0, new BuildingItem())
      },
      delBuilding(index) {
        this.form.buildings.splice(index, 1)
      },
      closeDialog() {
        this.$emit('update:visible', false);
        this.beforeClose();
      },
      checkUniqueNum(rule, value, callback) {
        const curIndex = rule.field.split('.')[1] * 1;
        const findRes = this.form.buildings.findIndex((item, index) => {
          return item.building_num && item.building_num === value && curIndex !== index
        });
        if (findRes !== -1) {
          callback('楼栋号重复');
        } else {
          callback();
        }
      },
      async submit() {
        try {
          await this.$refs.form.validate();
          this.request.post('/api/building/insertMany', this.form).then(res => {
            if (!res.data.errcode) {
              this.$alert('添加成功！', '提示', {type: "success"});
              this.closeDialog();
              this.$emit('update');
            } else {
              this.$message.error('添加失败，请查看！');
              this.isShowErrDialog = true;
              this.errList = res.data.errorBuildings.map(item=>{
                return {
                  errors:item.errors.map(item=>item.msg).join(';'),
                  ...item.builidng
                }
              })
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
