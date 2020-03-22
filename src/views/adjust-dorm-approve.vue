<template>
  <div class="page-container">
    <el-form @submit.native.prevent="search" inline>
      <el-form-item label="审批状态">
        <el-select placeholder="全部" size="medium" style="width:130px;" v-model="searchForm.status">
          <el-option :key="item.value"
                     :label="item.text"
                     :value="item.value"
                     v-for="item in options.status"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button native-type="submit" size="medium" type="primary">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list"
              :default-sort="{prop: 'edit_date', order: 'ascending'}"
              border
              class="margin-top-20"
              stripe>
      <el-table-column align="center" label="提交时间">
        <template #default="scope">{{scope.row.edit_date | convertToDate("datetime")}}</template>
      </el-table-column>
      <el-table-column align="center" label="学生姓名" prop="student_id.student_name" />
      <el-table-column align="center" label="目标宿舍" prop="target_dorm"/>
      <el-table-column align="center" label="原因" prop="reason"/>
      <el-table-column align="center" label="审批时间">
        <template #default="scope">{{scope.row.approval_date | convertToDate("datetime") | setEmpty}}</template>
      </el-table-column>
      <el-table-column align="center" label="审批人">
        <template #default="scope">{{scope.row.approver&&scope.row.approver.admin_name | setEmpty}}</template>
      </el-table-column>
      <el-table-column align="center" label="审批状态">
        <template #default="scope">
          <div>
            <p class="color-blue" v-if="scope.row.approval_status === -1">待审批</p>
            <p class="color-success" v-if="scope.row.approval_status === 1">已通过</p>
            <p class="color-danger" v-if="scope.row.approval_status === 2">已驳回</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <div v-if="scope.row.approval_status === -1">
            <el-tooltip content="同意并调整宿舍">
              <el-button @click="agree(scope.row)"
                         circle
                         icon="el-icon-check font-size-16"
                         plain
                         size="mini"
                         type="success"/>
            </el-tooltip>
            <el-tooltip content="拒绝">
              <el-button @click="reject(scope.row)"
                         circle
                         icon="el-icon-close font-size-16"
                         plain
                         size="mini"
                         type="warning"/>
            </el-tooltip>
          </div>
          <el-tooltip content="删除" v-else>
            <el-button @click="remove(scope.row)"
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
  </div>
</template>

<script>
  import request from "@/api";

  export default {
    name: "adjust-dorm-approve",
    data() {
      return {
        searchForm: {
          status: -1
        },
        paging: {
          current: 1,
          total: 1,
          pageCount: 1
        },
        list: [],
        options: {
          status: [
            {text: "全部", value: 0},
            {text: "待审批", value: -1},
            {text: "已通过", value: 1},
            {text: "已驳回", value: 2},
          ]
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
        request.post('/api/student/searchAdjustForm', form).then(res => {
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
      agree(row) {
        const data = {id: row._id};
        this.$confirm('确定同意调整宿舍？', '提示', {type: "warning"}).then(() => {
          this.request.post('/api/student/agreeAdjust', data).then(res => {
            if (!res.data.errcode) {
              this.$alert('调整宿舍成功！', '提示', {type: "success"});
              this.getData();
            } else {
              this.$alert(res.data.msg, '错误', {type: "error"});
            }
          })
        });
      },
      reject(row) {
        const data = {id: row._id};
        this.$confirm('确定拒绝调整宿舍？', '提示', {type: "warning"}).then(() => {
          this.request.post('/api/student/rejectAdjust', data).then(res => {
            if (!res.data.errcode) {
              this.$alert('拒绝调整宿舍成功！', '提示', {type: "success"});
              this.getData();
            } else {
              this.$alert(res.data.msg, '错误', {type: "error"});
            }
          })
        });
      },
      remove(row) {
        const data = {id: row._id};
        this.$confirm('确定要删除该调整宿舍申请单？', '提示', {type: "warning"}).then(() => {
          this.request.post('/api/student/removeAdjust', data).then(res => {
            if (!res.data.errcode) {
              this.$alert('删除成功！', '提示', {type: "success"});
              this.getData();
            } else {
              this.$alert(res.data.msg, '错误', {type: "error"});
            }
          })
        });
      }
    },
    mounted() {
      this.getData();
    }
  }
</script>

<style lang="scss" scoped>

</style>
