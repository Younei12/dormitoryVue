<template>
  <div>
    <!-- 添加宿舍 -->
    <el-dialog :before-close="beforeClose" :close-on-click-modal="false"
               :visible="visible"
               @update:visible="$emit('update:visible',$event)"
               title="新增宿舍" width="850px"
    >
      <el-form :model="form" inline ref="form">
        <div class="dialog-container">
          <section :key="dorm.uid" class="dorm-item" v-for="(dorm, index) in form.dorms">
            <el-form-item :prop="'dorms.' + index + '.building_num'"
                          :rules="[{ required: true, message: '请选择楼栋号',trigger:'change'}]"
                          label="楼栋号"
                          label-width="90px">
              <el-select placeholder="请选择楼栋" size="medium" style="width:130px;" v-model="dorm.building_num">
                <el-option :key="item._id"
                           :label="item.building_num+'号楼'"
                           :value="item.building_num"
                           v-for="item in options.buildings"/>
              </el-select>
            </el-form-item>
            <el-form-item :prop="'dorms.' + index + '.house_num'"
                          :rules="[{ required: true, message: '请输入门牌号'},{validator:checkUniqueNum}]"
                          label="门牌号">
              <el-input placeholder="例如：604" size="medium" style="width: 120px;" v-model="dorm.house_num"/>
            </el-form-item>
            <el-form-item :prop="'dorms.' + index + '.contain_count'" label="容纳人数">
              <el-input-number :min="0"
                               controls-position="right"
                               size="medium"
                               style="width: 100px;"
                               v-model.number="dorm.contain_count"/>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="form.dorms.length === 1"
                         @click="delDorm(index)"
                         circle
                         icon="el-icon-minus"
                         plain
                         size="mini"
                         type="danger"/>
              <el-button @click="addDorm(index)"
                         circle
                         icon="el-icon-plus"
                         plain
                         size="mini"
                         type="primary"
              />
            </el-form-item>

            <el-form-item v-if="getDormNum(dorm.building_num,dorm.house_num)">
              <p class="tip-small">宿舍号：{{getDormNum(dorm.building_num,dorm.house_num)}}</p>
            </el-form-item>
          </section>
        </div>
      </el-form>
      <template #footer>
        <!-- 一键设置 -->
        <el-form :model="quickForm" class="text-left" inline>
          <el-form-item label="快速设置：" label-width="90px"/>
          <el-form-item prop="building_num_active">
            <el-checkbox v-model="quickForm.building_num_active">楼栋号</el-checkbox>
          </el-form-item>
          <el-form-item prop="building_num">
            <el-select placeholder="请选择楼栋" size="small" style="width:130px;" v-model="quickForm.building_num">
              <el-option :key="item._id"
                         :label="item.building_num+'号楼'"
                         :value="item.building_num"
                         v-for="item in options.buildings"/>
            </el-select>
          </el-form-item>
          <el-form-item prop="building_num_active">
            <el-checkbox v-model="quickForm.contain_count_active">容纳人数</el-checkbox>
          </el-form-item>
          <el-form-item prop="contain_count">
            <el-input-number :min="0"
                             controls-position="right"
                             size="small"
                             style="width: 100px;"
                             v-model.number="quickForm.contain_count"/>
          </el-form-item>
          <el-form-item>
            <el-button @click="quickSet" size="small" type="primary">一键设置</el-button>
          </el-form-item>
        </el-form>
        <!-- 一键设置结束 -->

        <section class="flex-center">
          <el-button @click="submit" type="primary">确认添加</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </section>
      </template>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :visible.sync="isShowErrDialog" title="错误信息" width="700px">
      <div class="dialog-container">
        <el-table :data="errList" border stripe>
          <el-table-column align="center" label="楼栋号" prop="building_num"/>
          <el-table-column align="center" label="门牌号" prop="house_num"/>
          <el-table-column align="center" label="宿舍号">
            <template #default="scope">
              {{getDormNum(scope.row.building_num,scope.row.house_num)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="容纳人数" prop="contain_count"/>
          <el-table-column align="center" class-name="color-danger" label="错误原因" prop="errors"/>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getAllBuildings} from "@/api/building";

  class DormItem {
    constructor() {
      this.building_num = "";
      this.house_num = "";
      this.contain_count = 6;
      this.uid = Math.random() * Date.now();
    }
  }

  export default {
    name: "add-dorm",
    props: {
      visible: Boolean
    },
    data() {
      return {
        form: {
          dorms: [new DormItem()]
        },
        options: {
          buildings: []
        },
        isShowErrDialog: false,
        errList: [],
        quickForm: {
          building_num_active: true,
          building_num: "",
          contain_count_active: true,
          contain_count: 6
        }
      }
    },
    methods: {
      addDorm(index) {
        this.form.dorms.splice(index + 1, 0, new DormItem())
        // this.form.dorms.push(new DormItem())
      },
      delDorm(index) {
        this.form.dorms.splice(index, 1)
      },
      closeDialog() {
        this.$emit('update:visible', false);
        this.beforeClose();
      },
      beforeClose(done) {
        this.form.dorms = [new DormItem()];
        done && done();
      },
      getDormNum(building_num, house_num) {
        if (!building_num || !house_num) {
          return null
        }
        return building_num + "#" + house_num;
      },
      checkUniqueNum(rule, value, callback) {
        const curIndex = rule.field.split('.')[1] * 1;
        const curDorm = this.form.dorms[curIndex];
        const curHouseNum = curDorm.house_num;
        const curBuildingNum = curDorm.building_num;

        const findRes = this.form.dorms.findIndex((item, index) => {
          if (!item.building_num || !item.house_num || curIndex === index) {
            return false
          }
          return curHouseNum === item.house_num && curBuildingNum === item.building_num
        });
        if (findRes !== -1) {
          callback('宿舍号重复');
        } else {
          callback();
        }
      },
      async submit() {
        try {
          await this.$refs.form.validate();
          this.request.post('/api/dorm/insertMany', this.form).then(res => {
            if (!res.data.errcode) {
              this.$alert('添加成功！', '提示', {type: "success"});
              this.closeDialog();
              this.$emit('update');
            } else {
              this.$message.error('添加失败，请查看！');
              this.isShowErrDialog = true;
              this.errList = res.data.errorDorms.map(item => {
                return {
                  errors: item.errors.map(item => item.msg).join(';'),
                  ...item.dorm
                }
              })
            }
          })
        } catch (e) {
          return false
        }
      },
      quickSet() {
        this.form.dorms.forEach(item => {
          if (this.quickForm.building_num_active) {
            item.building_num = this.quickForm.building_num;
          }
          if (this.quickForm.contain_count_active) {
            item.contain_count = this.quickForm.contain_count;
          }
        })
      }
    },
    async mounted() {
      this.options.buildings = (await getAllBuildings()).data.data;
    }
  }
</script>

<style lang="scss" scoped>
</style>
