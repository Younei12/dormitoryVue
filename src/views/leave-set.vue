<template>
  <div class="page-container">
    <p class="title-part margin-bottom-10">已分配宿舍的学生</p>
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
          <el-form-item label="入学年份">
            <el-date-picker placeholder="请选择"
                            size="medium"
                            clearable
                            style="width:150px;"
                            type="year"
                            :default-value="Date.now()"
                            format="yyyy年入学"
                            value-format="yyyy"
                            v-model="searchForm.enroll_year">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="search" size="medium" type="primary">筛选</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="margin-left-auto">
        <el-button @click="setLeaveManyStudent" size="medium" type="warning">批量办理退寝</el-button>
      </div>
    </section>

    <student-table :cur-page="paging.current"
                   :list="studentData"
                   :total="paging.total"
                   @current-change="curPageChange"
                   @select:students="onSelectStudents"
                   @update="getData"
                   class="margin-top-20 width-full"/>

    <!-- 错误表格 -->
    <el-dialog :visible.sync="isShowSetFailed" title="删除失败，请查看">
      <div class="dialog-container">
        <el-table :data="setFailedStudents" border stripe>
          <el-table-column align="center" label="学号" prop="student_num"/>
          <el-table-column align="center" label="姓名" prop="student_name"/>
          <el-table-column align="center" label="宿舍" prop="dorm_num">
            <template #default="scope">{{scope.row.dorm_num | setEmpty}}</template>
          </el-table-column>
          <el-table-column align="center" label="原因">
            <template #default="scope">
              <p :key="index" class="color-danger" v-for="(item,index) in scope.row.reason">{{item}}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <div class="text-center">
          <el-button @click="isShowSetFailed = false" type="primary">确定</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script>
  import request from "@/api";
  import StudentTable from "@/components/student/student-table";

  export default {
    name: "leave-set",
    components: {StudentTable},
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
          reside_status: 1,
          enroll_year: 0
        },
        studentData: [],
        selectedStudents: [],
        setFailedStudents: [],
        isShowSetFailed: false
      }
    },
    methods: {
      search() {
        this.paging.current = 1;
        this.getData();
      },
      curPageChange(page) {
        this.paging.current = page;
        this.getData();
      },
      onSelectStudents(students) {
        this.selectedStudents = students;
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
      setLeaveManyStudent() {
        if (this.selectedStudents.length <= 0) {
          this.$alert("请先选择学生", "提示", {type: "warning"});
          return false;
        }
        this.$confirm('此操作将批量办理学生退寝，是否继续？', '提示', {
          type: "warning"
        }).then(() => {
          const data = this.selectedStudents.map(item => item._id);
          this.request.post('/api/student/bulkSetLeave', {students: data}).then(res => {
            if (!res.data.errcode) {
              this.$alert('办理退寝成功！', '提示', {type: "success"});
              this.getData();
            } else {
              this.$message.error('操作失败，请查看！');
              this.setFailedStudents = res.data.errorStudents.map(item => {
                return {
                  reason: item.errors,
                  ...item.student
                }
              });
              this.isShowSetFailed = true;
            }
          })
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
