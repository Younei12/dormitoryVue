<template>
  <div class="page-container">
    <section class="flex offset-fotm-item">
      <div>
        <el-form @submit.native.prevent="search" inline>
          <el-form-item label="搜索">
            <el-input clearable
                      placeholder="维修员姓名"
                      prefix-icon="el-icon-search"
                      size="medium"
                      v-model="searchForm.keyword"/>
          </el-form-item>
          <el-form-item>
            <el-button native-type="submit" size="medium" type="primary">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="margin-left-auto">
        <el-button @click="showAddRepairmen" size="medium" type="primary">新增维修员</el-button>
      </div>
    </section>

    <el-table :data="list"
              :default-sort="{prop: 'repairmen_account', order: 'ascending'}"
              border
              class="margin-top-20"
              stripe>
      <el-table-column align="center" label="账号" prop="repairmen_account" sortable/>
      <el-table-column align="center" label="姓名" prop="repairmen_name" sortable/>
      <el-table-column align="center" label="添加时间" prop="add_time" sortable>
        <template #default="scope">
          {{scope.row.add_time | convertToDate}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-tooltip content="编辑信息">
            <el-button @click="editRepairmen(scope.row)" circle icon="el-icon-edit font-size-16" plain size="mini"/>
          </el-tooltip>
          <el-tooltip content="删除">
            <el-button @click="deleteRepairmen(scope.row)"
                       circle
                       icon="el-icon-delete font-size-16"
                       plain
                       size="mini"
                       type="danger"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="paging.current"
      :total="paging.total"
      @current-change="curPageChange"
      background
      class="margin-top-20"
      layout="total, prev, pager, next"
      style="text-align: right">
    </el-pagination>

    <!-- 添加维修员 -->
    <el-dialog :close-on-click-modal="false"
               :visible.sync="isShowAddRepairmen"
               destroy-on-close
               title="添加维修员"
               width="500px">
      <el-form :model="addForm" :rules="addFormRules" label-width="100px" ref="addForm">
        <el-form-item label="账号：" prop="account">
          <el-input placeholder="请输入账号" style="width: 200px;" v-model="addForm.account"/>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input placeholder="请输入姓名" style="width: 200px;" v-model="addForm.name"/>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input placeholder="请输入密码" style="width: 200px;" v-model="addForm.password"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="text-center">
          <el-button @click="submitAddForm" type="primary">提交</el-button>
          <el-button @click="isShowAddRepairmen = false">取消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 修改维修员 -->
    <el-dialog :close-on-click-modal="false"
               :visible.sync="isShowEdit"
               destroy-on-close
               title="修改维修员信息"
               width="500px">
      <el-form :model="curUser" label-width="100px" ref="editForm">
        <el-form-item label="账号：" prop="account">
          <el-input :value="curUser.account" disabled placeholder="请输入账号" style="width: 200px;"/>
        </el-form-item>
        <el-form-item :rules="[{required:true,message:'请输入姓名',trigger:'blur'}]" label="姓名：" prop="name">
          <el-input placeholder="请输入姓名" style="width: 200px;" v-model="curUser.name"/>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input placeholder="不修改密码则不填" style="width: 200px;" v-model="curUser.password"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="text-center">
          <el-button @click="saveRepairmen" type="primary">保存</el-button>
          <el-button @click="isShowEdit=false">取消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script>
  import request from "@/api";

  export default {
    name: "repairmen-manage",
    data() {
      return {
        searchForm: {
          keyword: ""
        },
        paging: {
          current: 1,
          total: 1,
          pageCount: 1
        },
        isShowAddRepairmen: false,
        list: [],

        addForm: {
          account: "",
          name: "",
          password: ""
        },
        addFormRules: {
          account: [{required: true, message: '账号不能为空', trigger: "blur"}],
          name: [{required: true, message: '姓名不能为空', trigger: "blur"}],
          password: [{required: true, message: '密码不能为空', trigger: "blur"}],
        },

        isShowEdit: false,
        curUser: {
          _id: null,
          account: "",
          name: "",
          password: ""
        }
      }
    },
    methods: {
      search() {
        this.paging.current = 1;
        this.getData();
      },
      getData() {
        const form = {...this.searchForm};
        form.page = this.paging.current;
        request.post('/api/repairmen/searchRepairmen', form).then(res => {
          this.list = res.data.data.list;
          this.paging = Object.assign(this.paging, res.data.data.paging);
          if (this.paging.current > this.paging.pageCount) {
            this.paging.current = this.paging.pageCount;
            this.getData();
          }
        })
      },
      curPageChange(page) {
        this.paging.current = page;
        this.getData();
      },
      showAddRepairmen() {
        this.isShowAddRepairmen = true;
      },
      editRepairmen(row) {
        this.curUser = {
          _id: row._id,
          account: row.repairmen_account,
          name: row.repairmen_name,
          password: ""
        };
        this.isShowEdit = true;
      },
      deleteRepairmen(row) {
        this.$confirm('此操作将永久删除该维修员且无法恢复，是否继续？', '提示', {
          type: "warning"
        }).then(()=>{
          this.request.post('/api/repairmen/delRepairmen',{id:row._id}).then(res=>{
            if (!res.data.errcode) {
              this.$alert('删除成功！', '提示', {type: "success"});
              this.getData();
            }else{
              this.$alert(res.data.msg, '错误', {type: "error"});
            }
          })
        })
      },
      async submitAddForm() {
        try {
          await this.$refs.addForm.validate();
          this.request.post('/api/repairmen/insertOne', this.addForm).then(res => {
            if (!res.data.errcode) {
              this.$alert('添加成功！', '提示', {type: "success"});
              this.isShowAddRepairmen = false;
              this.getData();
            } else {
              this.$alert(res.data.msg, '错误', {type: "error"});
            }
          })
        } catch (e) {
          return false
        }
      },
      async saveRepairmen() {
        try {
          await this.$refs.editForm.validate();
          const data = {
            _id: this.curUser._id,
            name: this.curUser.name,
            password: this.curUser.password
          };
          this.request.post('/api/repairmen/updateRepairmen', data).then(res => {
            if (!res.data.errcode) {
              this.$alert('修改成功！', '提示', {type: "success"});
              this.isShowEdit = false;
              this.getData();
            } else {
              this.$alert(res.data.msg, '错误', {type: "error"});
            }
          })
        } catch (e) {
          return false
        }
      }
    },
    mounted() {
      this.getData();
    }
  }
</script>

<style lang="scss" scoped>

</style>
