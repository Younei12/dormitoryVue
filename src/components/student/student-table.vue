<template>
  <div>
    <el-table :data="list"
              :default-sort="{prop: 'student_num', order: 'ascending'}" @selection-change="selectStudent"
              border
              stripe
    >
      <el-table-column align="center" type="selection" width="55"/>
      <el-table-column align="center" label="学号" prop="student_num" sortable/>
      <el-table-column align="center" label="姓名" prop="student_name" sortable/>
      <el-table-column :formatter="sexConvert" align="center" label="性别" prop="student_sex" sortable/>
      <el-table-column :formatter="dormConvert" align="center" label="宿舍号" prop="dorm_id.dorm_num" sortable/>
      <el-table-column align="center" label="地址" prop="student_address" sortable/>
      <el-table-column align="center" label="专业" prop="student_major" sortable/>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-tooltip content="学生信息">
            <el-button @click="showStudentDetail(scope.row)" circle icon="el-icon-user font-size-16" plain size="mini"/>
          </el-tooltip>
          <el-tooltip content="学生宿舍管理">
            <el-button @click="showAssignDorm(scope.row)" circle icon="el-icon-office-building font-size-16" plain size="mini"/>
          </el-tooltip>
          <el-tooltip content="编辑信息" v-if="edit">
            <el-button @click="showModifyStudent(scope.row)" circle icon="el-icon-edit font-size-16" plain size="mini"/>
          </el-tooltip>
          <el-tooltip content="删除" v-if="del">
            <el-button @click="deleteStudent(scope.row)"
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
      :current-page="curPage"
      :total="total"
      @current-change="$emit('current-change',$event)"
      background
      class="margin-top-20"
      layout="total, prev, pager, next"
      style="text-align: right">
    </el-pagination>

    <!-- 学生信息 -->
    <student-detail :info="curStudentDetail" :visible.sync="isShowStudentDetail"/>

    <!-- 编辑学生信息 -->
    <edit-student :cur-student-detail.sync="curStudentDetail" :visible.sync="isShowModifyStudent" @update="$emit('update')"/>

    <!-- 学生宿舍管理 -->
    <assign-student-dorm :cur-student-detail.sync="curStudentDetail"
                  :visible.sync="isShowAssignDorm"
                  @update="$emit('update')"/>

  </div>
</template>

<script>
  import _ from "lodash"
  import EditStudent from "@/components/student/edit-student";
  import AssignStudentDorm from "@/components/student/assign-student-dorm";
  import StudentDetail from "@/components/student/student-detail";

  export default {
    name: "student-table",
    components: {StudentDetail, AssignStudentDorm, EditStudent},
    props: {
      list: {
        type: Array,
        defualt: () => []
      },
      total: Number,
      curPage: Number,
      edit:Boolean,
      del:Boolean
    },
    data() {
      return {
        isShowStudentDetail:false,
        isShowModifyStudent: false,
        curStudentDetail: {},
        isShowAssignDorm: false,
      }
    },
    methods: {
      showStudentDetail(row){
        this.curStudentDetail = row;
        this.isShowStudentDetail = true;
      },
      showModifyStudent(row) {
        this.curStudentDetail = row;
        this.isShowModifyStudent = true;
      },
      showAssignDorm(row){
        this.curStudentDetail = row;
        this.isShowAssignDorm = true;
      },
      deleteStudent(row) {
        this.$confirm('此操作将永久删除该学生且无法恢复，是否继续？', '提示', {
          type: "warning"
        }).then(()=>{
          this.request.post('/api/student/removeOneById',{_id:row._id}).then(res=>{
            if (!res.data.errcode) {
              this.$alert('删除成功！', '提示', {type: "success"});
              this.$emit('update');
            }else{
              this.$alert(res.data.msg, '错误', {type: "error"});
            }
          })
        })
      },
      sexConvert(row, column, v) {
        return v == 1 ? "男" : v == 2 ? "女" : ""
      },
      dormConvert(row, column, v) {
        if (row.reside_status === 1) {
          return v
        }
        if (row.reside_status === -1) {
          return "未入寝"
        }
        if (row.reside_status === 2) {
          return "已退寝"
        }
      },
      selectStudent(students) {
        this.$emit("select:students", students)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
