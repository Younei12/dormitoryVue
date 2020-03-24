<template>
  <div class="page-container">
    <section class="flex offset-fotm-item">
      <div>
        <el-form @submit.native.prevent="search" inline>
          <el-form-item label="搜索">
            <el-input clearable
                      placeholder="学号、姓名、地址、专业..."
                      prefix-icon="el-icon-search"
                      size="medium"
                      v-model="searchForm.keyword"/>
          </el-form-item>
          <el-form-item label="性别">
            <el-select placeholder="全部" size="medium" style="width:100px;" v-model="searchForm.sex">
              <el-option :value="0" label="全部"></el-option>
              <el-option :value="1" label="男"></el-option>
              <el-option :value="2" label="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="居住状态">
            <el-select placeholder="全部" size="medium" style="width:100px;" v-model="searchForm.reside_status">
              <el-option :value="0" label="全部"></el-option>
              <el-option :value="1" label="在住"></el-option>
              <el-option :value="-1" label="未入寝"></el-option>
              <el-option :value="2" label="已退寝"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button native-type="submit" size="medium" type="primary">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="margin-left-auto">
        <el-button @click="isShowAddDialog = true" size="medium" type="info">新增学生</el-button>
        <el-button @click="deleteManyStudent" size="medium" type="danger">批量删除学生</el-button>
        <el-button @click="isShowBulkImport = true" size="medium" type="primary">批量导入学生</el-button>
      </div>
    </section>

    <!-- 学生表格 -->
    <student-table :cur-page="paging.current"
                   :list="studentData"
                   :total="paging.total"
                   @current-change="curPageChange"
                   @select:students="onSelectStudents"
                   @update="getData"
                   edit
                   del
                   class="margin-top-20 width-full"/>

    <!-- 错误表格 -->
    <el-dialog :visible.sync="isShowdeleteFailed" title="删除失败，请查看">
      <div class="dialog-container">
        <el-table :data="deleteFailedStudents" border stripe>
          <el-table-column align="center" label="学号" prop="student_num"/>
          <el-table-column align="center" label="姓名" prop="student_name"/>
          <el-table-column align="center" label="宿舍" prop="dorm_num"/>
          <el-table-column align="center" label="原因">
            <template #default="scope">
              <p :key="index" class="color-danger" v-for="(item,index) in scope.row.reason">{{item.msg}}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <div class="text-center">
          <el-button @click="isShowdeleteFailed = false" type="primary">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 新增学生 -->
    <add-student :visible.sync="isShowAddDialog" @update="getData"/>

    <!-- 批量导入学生 -->
    <bulk-import-students :visible.sync="isShowBulkImport" @update="getData"/>
  </div>

</template>

<script>
  import request from "@/api";
  import StudentTable from "@/components/student/student-table";
  import AddStudent from "@/components/student/add-student";
  import BulkImportStudents from "@/components/student/bulk-import-students";

  export default {
    name: "student-manage",
    components: {BulkImportStudents, AddStudent, StudentTable},
    data() {
      return {
        paging: {
          current: 1,
          total: 1,
          pageCount: 1
        },
        searchForm: {
          keyword: "",
          sex: 0,
          reside_status: 0
        },
        studentData: [],
        selectedStudents: [],
        deleteFailedStudents: [],
        isShowdeleteFailed: false,
        isShowAddDialog: false,
        isShowBulkImport: false
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
        request.post('/api/student/search', form).then(res => {
          this.studentData = res.data.data.list;
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
      onSelectStudents(students) {
        this.selectedStudents = students;
      },
      deleteManyStudent() {
        if (this.selectedStudents.length <= 0) {
          this.$alert("请先选择学生", "提示", {type: "warning"});
          return false;
        }
        this.$confirm('此操作将永久删除所选中的学生且无法恢复，是否继续？', '提示', {
          type: "warning"
        }).then(() => {
          const data = this.selectedStudents.map(item => item._id);
          this.request.post('/api/student/removeMany', {students: data}).then(res => {
            if (!res.data.errcode) {
              this.$alert('删除成功！', '提示', {type: "success"});
              this.getData();
            } else {
              this.$message.error('删除失败，请查看！');
              this.deleteFailedStudents = res.data.errorStudents.map(item => {
                return {
                  reason: item.errors,
                  ...item.student
                }
              });
              this.isShowdeleteFailed = true;
            }
          })
        }).catch(() => {
          return false;
        })
      }
    },
    mounted() {
      this.getData();
    }
  }
</script>

<style lang="scss" scoped>

</style>
