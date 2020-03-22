<template>
  <el-dialog :title="info.student_name + '的学生信息'" :visible="visible"
             @update:visible="$emit('update:visible',$event)"
             width="500px">
    <el-form :model="info" class="form-item-data" label-width="100px">
      <el-form-item label="学生学号" prop="">{{info.student_num}}</el-form-item>
      <el-form-item label="学生姓名" prop="">{{info.student_name}}</el-form-item>
      <el-form-item label="学生性别" prop="">{{info.student_sex === 1?'男':info.student_sex === 2?'女':''}}</el-form-item>
      <el-form-item label="宿舍号" prop="">{{info.dorm_id&&info.dorm_id.dorm_num | setEmpty}}</el-form-item>
      <el-form-item label="地址" prop="">{{info.student_address}}</el-form-item>
      <el-form-item label="专业" prop="">{{info.student_major}}</el-form-item>
      <el-form-item label="居住状态" prop="">{{info.reside_status | resideConvert}}</el-form-item>
      <el-form-item label="入住时间" prop="">{{info.checkin_time | convertToDate | setEmpty}}</el-form-item>
      <el-form-item label="学业状态" prop="">{{info.study_status | studyConvert}}</el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>
  import {resideStatusMap, studyStatusMap} from "@/utils/staticData";

  export default {
    name: "student-detail",
    props: {
      info: Object,
      visible: Boolean
    },
    data() {
      return {}
    },
    filters:{
      resideConvert(v){
        return resideStatusMap.get(v)
      },
      studyConvert(v){
        return studyStatusMap.get(v)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
