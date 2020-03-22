<template>
  <div class="page-container">
    <p class="title-part margin-bottom-10">未分配宿舍的学生</p>
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
          <el-form-item>
            <el-button @click="search" size="medium" type="primary">筛选</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="margin-left-auto">
        <el-button @click="showBulkAssian" size="medium" type="primary">批量分配宿舍</el-button>
        <!--<el-button size="medium" type="primary">一键分配</el-button>-->
      </div>
    </section>

    <student-table :cur-page="paging.current"
                   :list="studentData"
                   :total="paging.total"
                   @current-change="curPageChange"
                   @select:students="onSelectStudents"
                   @update="getData"
                   class="margin-top-20 width-full"/>

    <!-- 批量分配宿舍  -->
    <bulk-assign-dorm :selected-students="selectedStudents" :visible.sync="isShowBulkAssian" @update="getData"/>
  </div>
</template>

<script>
  import StudentTable from "@/components/student/student-table";
  import request from "@/api";
  import BulkAssignDorm from "@/components/student/bulk-assign-dorm";

  export default {
    name: "comein-manage",
    components: {BulkAssignDorm, StudentTable},
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
          reside_status: -1
        },
        studentData: [],
        selectedStudents: [],
        isShowBulkAssian: false
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
      showBulkAssian() {
        if (this.selectedStudents.length <= 0) {
          this.$alert("请先选择学生", "提示", {type: "warning"});
          return false;
        }
        this.isShowBulkAssian = true;
      }
    },
    mounted() {
      this.getData();
    }
  }
</script>

<style lang="scss" scoped>

</style>
