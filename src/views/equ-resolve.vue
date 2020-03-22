<template>
  <div class="page-container">
    <el-form @submit.native.prevent="search" inline>
      <el-form-item label="搜索">
        <el-input clearable
                  placeholder="搜索描述内容"
                  prefix-icon="el-icon-search"
                  size="medium"
                  v-model="searchForm.keyword"/>
      </el-form-item>
      <el-form-item label="维修单状态">
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
      <el-table-column align="center" label="提交日期" width="140px">
        <template #default="scope">{{scope.row.edit_date | convertToDate}}</template>
      </el-table-column>
      <el-table-column align="center" label="学生姓名" prop="initiator_id.student_name" width="180px"/>
      <el-table-column align="center" label="宿舍号" prop="dorm_id.dorm_num" width="120px"/>
      <el-table-column align="center" label="描述" prop="repair_desc"/>
      <el-table-column align="center" label="联系方式" prop="contact" width="140px"/>
      <el-table-column align="center" label="图片" width="120px">
        <template #default="scope">
            <span @click="showRepairImages(scope.row.repair_files)"
                  class="cursor-pointer color-main underline"
                  v-if="scope.row.repair_files.length">点击查看</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="维修人" prop="repairmen_id.repairmen_name" width="120px">
        <template #default="scope">{{scope.row.repairmen_id&&scope.row.repairmen_id.repairmen_name | setEmpty}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="维修状态" prop="repair_status" width="120px">
        <template #default="scope">
          <div>
            <p class="color-info" v-if="scope.row.repair_status === -1">待处理</p>
            <p class="color-blue" v-if="scope.row.repair_status === 1">正在处理</p>
            <p class="color-success" v-if="scope.row.repair_status === 2">已处理</p>
            <p class="color-warning" v-if="scope.row.repair_status === 3">另约时间</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="操作"
                       width="180px">
        <template #default="scope">
          <div v-if="userInfo.identity === 3">
            <el-tooltip content="开始处理" v-if="scope.row.repair_status === -1 || scope.row.repair_status === 3">
              <el-button @click="startHandle(scope.row)"
                         circle
                         icon="el-icon-document-checked font-size-16"
                         plain
                         size="mini"
                         type="primary"/>
            </el-tooltip>
            <el-tooltip content="已完成" v-if="scope.row.repair_status === 1">
              <el-button @click="setDone(scope.row)"
                         circle
                         icon="el-icon-check font-size-16"
                         plain
                         size="mini"
                         type="success"/>
            </el-tooltip>
            <el-tooltip content="另约时间" v-if="scope.row.repair_status === 1">
              <el-button @click="setAnotherTime(scope.row)"
                         circle
                         icon="el-icon-refresh-right font-size-16"
                         plain
                         size="mini"
                         type="warning"/>
            </el-tooltip>
          </div>

          <el-tooltip content="删除" v-if="scope.row.repair_status === 2">
            <el-button @click="delForm(scope.row)"
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

    <image-viewer :images="currentImages" :visible.sync="isImageViewer"/>
  </div>
</template>

<script>
  import ImageViewer from "@/components/common/image-viewer";
  import {mapState} from "vuex";

  export default {
    name: "equ-resolve",
    components: {ImageViewer},
    data() {
      return {
        searchForm: {
          status: 0
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
            {text: "待处理", value: -1},
            {text: "正在处理", value: 1},
            {text: "已处理", value: 2},
            {text: "另约时间", value: 3},
          ]
        },
        submittedList: [],
        isImageViewer: false,
        currentImages: []
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    methods: {
      search() {
        this.paging.current = 1;
        this.getData();
      },
      getData() {
        const form = {...this.searchForm};
        form.page = this.paging.current;
        this.request.post('/api/repair/searchRepairForm', form).then(res => {
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
      showRepairImages(files) {
        this.currentImages = files;
        this.isImageViewer = true;
      },
      // 开始接手任务
      startHandle(row) {
        const data = {id: row._id};
        this.$confirm('确定要开始处理改报修单吗？', '提示', {type: "warning"}).then(() => {
          this.request.post('/api/repair/startHandlerRepairForm', data).then(res => {
            if (!res.data.errcode) {
              this.$alert('操作成功！', '提示', {type: "success"});
              this.getData();
            } else {
              this.$alert(res.data.msg, '错误', {type: "error"});
            }
          })
        }).catch(()=>{});
      },
      setDone(row) {
        const data = {id: row._id};
        this.$confirm('确定已完成该报修单吗？', '提示', {type: "warning"}).then(() => {
          this.request.post('/api/repair/repairFormDone', data).then(res => {
            if (!res.data.errcode) {
              this.$alert('操作成功！', '提示', {type: "success"});
              this.getData();
            } else {
              this.$alert(res.data.msg, '错误', {type: "error"});
            }
          })
        }).catch(()=>{});
      },
      setAnotherTime(row) {
        const data = {id: row._id};
        this.$confirm('确定另约时间吗？', '提示', {type: "warning"}).then(() => {
          this.request.post('/api/repair/makeRepairFormAnotherTime', data).then(res => {
            if (!res.data.errcode) {
              this.$alert('操作成功！', '提示', {type: "success"});
              this.getData();
            } else {
              this.$alert(res.data.msg, '错误', {type: "error"});
            }
          })
        }).catch(()=>{});
      },
      delForm(row) {
        const data = {id: row._id};
        this.$confirm('确定删除该报修单吗？', '提示', {type: "warning"}).then(() => {
          this.request.post('/api/repair/delRepairForm', data).then(res => {
            if (!res.data.errcode) {
              this.$alert('删除成功！', '提示', {type: "success"});
              this.getData();
            } else {
              this.$alert(res.data.msg, '错误', {type: "error"});
            }
          })
        }).catch(()=>{});
      }
    },
    mounted() {
      this.getData();
    }
  }
</script>

<style lang="scss" scoped>

</style>
